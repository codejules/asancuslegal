import { useState, useEffect, useRef } from "preact/hooks";
import { INPUTS } from "@/types/form.js";
import Spinner from "./Spinner";
import { DANGEROUS_PATTERNS, EMAIL_REGEX, NAME_REGEX } from "@/utils/validators";
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import Checkbox from './Checkbox';

// Definir la interfaz para las propiedades de window.turnstile
declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
        };
    }
}

// Tipo para errores de validación
type ValidationErrors = {
    [key: string]: string;
};

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [honeypotValue, setHoneypotValue] = useState("");
    const turnstileRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const siteKeyCloudflare = import.meta.env.PUBLIC_CLOUDFLARE_SITE_KEY;

    // Limitar el número de intentos
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const MAX_SUBMIT_ATTEMPTS = 5;

    // Timestamp para prevenir envíos demasiado rápidos
    const formLoadTime = useRef(Date.now());


    // Ocultar texto error cuando está checked el captcha
    useEffect(() => {
        if (turnstileToken) {
            setErrors(prev => ({ ...prev, turnstile: "" }));
        }
    }, [turnstileToken]);

    useEffect(() => {
        // Cargar el script de Turnstile
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (turnstileRef.current && window.turnstile) {
                widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: siteKeyCloudflare,
                    callback: function (token: string) {
                        setTurnstileToken(token);
                    },
                    theme: 'light',
                    // Expiración del token tras un tiempo para mayor seguridad
                    'refresh-expired': 'auto',
                    'expired-callback': () => {
                        setTurnstileToken(null);
                    },
                    'error-callback': () => {
                        setErrors(prev => ({ ...prev, turnstile: "Error al cargar el captcha. Por favor, intenta de nuevo." }));
                    }
                });
            }
        };

        // Establecer tiempo aleatorio para detección de bots
        const randomDelay = Math.floor(Math.random() * 500) + 500;
        setTimeout(() => {
            // Los bots suelen completar formularios demasiado rápido
            formLoadTime.current = Date.now();
        }, randomDelay);

        return () => {
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const validateField = (name: string, value: string): string => {
        if (!value.trim()) {
            return "Este campo es obligatorio";
        }

        // Validación específica por tipo de campo
        switch (name) {
            case "name":
                if (!NAME_REGEX.test(value)) {
                    return "Introduce un nombre válido";
                }
                if (value.length > 50) {
                    return "El nombre es demasiado largo (máximo 50 caracteres)";
                }
                break;
            case "recipient":
                if (!EMAIL_REGEX.test(value)) {
                    return "Introduce un email válido";
                }
                break;
            case "subject":
                if (value.length > 50) {
                    return "El asunto es demasiado largo (máximo 50 caracteres)";
                }
                break;
            case "message":
                if (value.length > 500) {
                    return "El mensaje es demasiado largo (máximo 500 caracteres)";
                }
                // Comprobar patrones peligrosos
                for (const pattern of DANGEROUS_PATTERNS) {
                    if (pattern.test(value)) {
                        return "El mensaje contiene caracteres no permitidos";
                    }
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

        // Validar todos los campos
        Object.entries(formValues).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        // Comprobar campos requeridos faltantes
        INPUTS.forEach(({ name, required }) => {
            if (required && !formValues[name]) {
                newErrors[name] = "Este campo es obligatorio";
                isValid = false;
            }
        });

        // Validar checkbox de política de privacidad
        if (!privacyChecked) {
            newErrors.privacy = "Debes aceptar la política de privacidad";
            isValid = false;
        }

        // Validar Turnstile
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

        // Comprobación anti-bot: validar tiempo de carga del formulario
        const elapsedTime = Date.now() - formLoadTime.current;
        if (elapsedTime < 3000) {
            console.error("El formulario se ha enviado demasiado rápido");
            setErrors({ general: "Por favor, espera un momento antes de enviar el formulario" });
            return;
        }

        // Comprobación anti-bot: comprobar honeypot
        if (honeypotValue) {
            console.error("Posible bot detectado por honeypot");
            setErrors({ general: "Ha ocurrido un error al enviar el formulario" });
            return;
        }

        // Limitar número de intentos
        if (submitAttempts >= MAX_SUBMIT_ATTEMPTS) {
            setErrors({ general: "Has excedido el número máximo de intentos. Por favor, inténtalo más tarde." });
            return;
        }

        // Validar todos los campos
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // Añadir el token de Turnstile al FormData
        if (turnstileToken) {
            formData.append("cf-turnstile-response", turnstileToken);
        }

        // Añadir timestamp para verificar en el servidor
        formData.append("form-timestamp", formLoadTime.current.toString());

        try {
            const response = await fetch("/actions/send-email", {
                method: "POST",
                body: formData,
                headers: {
                    // Añadir cabecera CSRF si tienes implementación de tokens CSRF
                    'X-Requested-With': 'XMLHttpRequest', // Ayuda a prevenir CSRF simples
                }
            });

            if (response.ok) {
                setIsSent(true);
                setFormValues({});
                setPrivacyChecked(false)
                if (formRef.current) {
                    formRef.current.reset();
                }

                // Resetear el widget de Turnstile después de enviar
                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                }

                setTimeout(() => {
                    setIsSent(false) // volver estado inicial
                }, 4000);
            } else {
                const data = await response.json().catch(() => null);
                const errorMessage = data?.message || "Error al enviar el mensaje.";
                setErrors({ general: errorMessage });

                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                }
                setTurnstileToken(null);
            }
        } catch (error) {
            console.error("Error enviando el correo:", error);
            setErrors({ general: "Error de conexión. Por favor, inténtalo de nuevo." });

            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.reset(widgetIdRef.current);
            }
            setTurnstileToken(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form ref={formRef} className="flex flex-col gap-2 md:gap-3" onSubmit={handleSubmit} noValidate>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                <label htmlFor="bot-trap">Dejar este campo vacío:</label>
                <input
                    type="text"
                    id="bot-trap"
                    name="bot-trap"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypotValue}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement | null;
                        if (target) {
                            setHoneypotValue(target.value);
                        }
                    }}
                />
            </div>

            <ErrorMessage error={errors.general} />

            {INPUTS.map(({ id, type, name, placeholder, required }) => (
                <InputField
                    key={id}
                    id={id}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    value={formValues[name] || ""}
                    onChange={handleInputChange}
                    error={errors[name]}
                />
            ))}

            <Checkbox
                id="checkbox"
                checked={privacyChecked}
                onChange={(e: any) => {
                    const target = e.target as HTMLInputElement;
                    setPrivacyChecked(target.checked);
                    if (submitAttempted) {
                        setErrors(prev => ({
                            ...prev,
                            privacy: target.checked ? "" : "Debes aceptar la política de privacidad"
                        }));
                    }
                }}
                error={errors.privacy}
                />

            {/* Turnstile widget */}
            <div ref={turnstileRef} className="flex justify-start mt-8"></div>
            {errors.turnstile && <p className="text-red-500 text-xs text-left">{errors.turnstile}</p>}

            <button
                type="submit"
                className={`mt-6 w-fit flex mx-auto transition duration-300 ease-in text-white bg-primary border border-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ${isSubmitting || isSent ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer hover:border-primary hover:scale-95"}`}
                disabled={isSubmitting || isSent}
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <Spinner />
                        Enviando email...
                    </span>
                ) : isSent ? (
                    "Mensaje enviado correctamente ✅"
                ) : (
                    "Enviar mensaje"
                )}
            </button>
        </form>
    );
};

export default ContactForm;