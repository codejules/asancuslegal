import { useState, useEffect, useRef } from "preact/hooks";
import { INPUTS } from "@/types/form.js";
import { DANGEROUS_PATTERNS, EMAIL_REGEX, NAME_REGEX } from "@/utils/validators";

// Definir la interfaz para las propiedades de window.turnstile
declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
        };
    }
}

type ValidationErrors = {
    [key: string]: string;
};

export const useContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [honeypotValue, setHoneypotValue] = useState("");
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const MAX_SUBMIT_ATTEMPTS = 5;
    const formLoadTime = useRef(Date.now());
    const turnstileRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const siteKeyCloudflare = import.meta.env.PUBLIC_CLOUDFLARE_SITE_KEY;

    // Ocultar texto error cuando está checked el captcha
    useEffect(() => {
        if (turnstileToken) {
            setErrors(prev => ({ ...prev, turnstile: "" }));
        }
    }, [turnstileToken]);

    useEffect(() => {
        // Lógica de integración con Turnstile
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (turnstileRef.current && window.turnstile) {
                widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: siteKeyCloudflare,
                    callback: (token: string) => setTurnstileToken(token),
                    theme: 'light',
                    'refresh-expired': 'auto',
                    'expired-callback': () => setTurnstileToken(null),
                    'error-callback': () => setErrors(prev => ({ ...prev, turnstile: "Error al cargar el captcha. Por favor, intenta de nuevo." }))
                });
            }
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const validateField = (name: string, value: string): string => {
        if (!value.trim()) {
            return "Este campo es obligatorio";
        }

        switch (name) {
            case "name":
                if (!NAME_REGEX.test(value)) return "Introduce un nombre válido";
                if (value.length > 50) return "El nombre es demasiado largo (máximo 50 caracteres)";
                break;
            case "recipient":
                if (!EMAIL_REGEX.test(value)) return "Introduce un email válido";
                break;
            case "subject":
                if (value.length > 50) return "El asunto es demasiado largo (máximo 50 caracteres)";
                break;
            case "message":
                if (value.length > 500) return "El mensaje es demasiado largo (máximo 500 caracteres)";
                for (const pattern of DANGEROUS_PATTERNS) {
                    if (pattern.test(value)) return "El mensaje contiene caracteres no permitidos";
                }
                break;
        }

        return "";
    };

    const handleInputChange = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        setFormValues(prev => ({ ...prev, [name]: value }));

        if (submitAttempted) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        Object.entries(formValues).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        INPUTS.forEach(({ name, required }) => {
            if (required && !formValues[name]) {
                newErrors[name] = "Este campo es obligatorio";
                isValid = false;
            }
        });

        if (!privacyChecked) {
            newErrors.privacy = "Debes aceptar la política de privacidad";
            isValid = false;
        }

        if (!turnstileToken) {
            newErrors.turnstile = "Por favor, completa el captcha";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setSubmitAttempted(true);
        setSubmitAttempts(prev => prev + 1);

        const elapsedTime = Date.now() - formLoadTime.current;
        if (elapsedTime < 3000) {
            setGeneralError("Por favor, espera un momento antes de enviar el formulario");
            return;
        }

        if (honeypotValue) {
            setGeneralError("Posible bot detectado por honeypot");
            return;
        }

        if (submitAttempts >= MAX_SUBMIT_ATTEMPTS) {
            setGeneralError("Has excedido el número máximo de intentos. Por favor, inténtalo más tarde.");
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);

        const formData = new FormData(e.target as HTMLFormElement);
        if (turnstileToken) formData.append("cf-turnstile-response", turnstileToken);
        formData.append("form-timestamp", formLoadTime.current.toString());

        try {
            const response = await fetch("/actions/send-email", {
                method: "POST",
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (response.ok) {
                setIsSent(true);
                setFormValues({});
                setPrivacyChecked(false);
                if (formRef.current) formRef.current.reset();
                if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
                setTimeout(() => setIsSent(false), 4000);
            } else {
                const data = await response.json().catch(() => null);
                setGeneralError(data?.message || "Error al enviar el mensaje.");
            }
        } catch (error) {
            setGeneralError("Error de conexión. Por favor, inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formRef,
        isSubmitting,
        isSent,
        handleSubmit,
        handleInputChange,
        formValues,
        errors,
        generalError,
        privacyChecked,
        setPrivacyChecked,
        setHoneypotValue,
        turnstileRef,
        setErrors
    };
};
