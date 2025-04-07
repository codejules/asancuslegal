import { useState, useEffect, useRef } from "preact/hooks";
import { getInputs } from "@/types/form.js";
import { getI18N } from "@/i18n";

import { DANGEROUS_PATTERNS, EMAIL_REGEX, NAME_REGEX } from "@/utils/validators";

// Definir la interfaz para las propiedades de window.turnstile
/* declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
        };
    }
} */

type ValidationErrors = {
    [key: string]: string;
};

export const useContactForm = (dataLocale: any) => {

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
/*     const turnstileRef = useRef<HTMLDivElement>(null);
 */    const widgetIdRef = useRef<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
/*     const siteKeyCloudflare = import.meta.env.PUBLIC_CLOUDFLARE_SITE_KEY;
 */
    // Ocultar texto error cuando está checked el captcha
/*     useEffect(() => {
        if (turnstileToken) {
            setErrors(prev => ({ ...prev, turnstile: "" }));
        }
    }, [turnstileToken]);

    useEffect(() => {
        const i18n = getI18N({ currentLocale: dataLocale });
        const turnstileSelector = document.querySelector('script[src*="../../turnstile/v0/api.js"]');

        if (turnstileSelector) {
            if (turnstileRef.current && window.turnstile) {
                widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: siteKeyCloudflare,
                    callback: (token: string) => setTurnstileToken(token),
                    theme: 'light',
                    'refresh-expired': 'auto',
                    'expired-callback': () => setTurnstileToken(null),
                    'error-callback': () => setErrors(prev => ({
                        ...prev,
                        turnstile: `${i18n.ERROR_CAPTCHA_TURNSTILE}`
                    }))
                });
            }
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
            }
        };
    }, []); */

    const validateField = (name: string, value: string): string => {
        const i18n = getI18N({ currentLocale: dataLocale });
        if (!value.trim()) {
            return `${i18n.ERROR_VALUE_EMPTY}`
        }

        switch (name) {
            case "name":
                if (!NAME_REGEX.test(value)) return `${i18n.ERROR_ADD_VALID_NAME}`
                if (value.length > 30) return `${i18n.ERROR_LONG_NAME}`;
                break;
            case "recipient":
                if (!EMAIL_REGEX.test(value)) return `${i18n.ERROR_ADD_VALID_EMAIL}`;
                break;
            case "subject":
                if (value.length > 30) return `${i18n.ERROR_LONG_SUBJECT}`;
                break;
            case "message":
                if (value.length > 500) return `${i18n.ERROR_LONG_MESSAGE}`;
                for (const pattern of DANGEROUS_PATTERNS) {
                    if (pattern.test(value)) return `${i18n.ERROR_PATTERN_MESSAGE}`;
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

    const validateForm = (currentLocale: string): boolean => {
        const INPUTS = getInputs(currentLocale || "es");
        const i18n = getI18N({ currentLocale: dataLocale });

        const newErrors: ValidationErrors = {};
        let isValid = true;

        Object.entries(formValues).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        INPUTS.forEach(({ name, required }: { name: string; required: boolean }) => {

            if (required && !formValues[name]) {
                newErrors[name] = `${i18n.ERROR_VALUE_EMPTY}`
                isValid = false;
            }
        });

        if (!privacyChecked) {
            newErrors.privacy = `${i18n.ERROR_VALUE_PRIVACY}`;
            isValid = false;
        }

        if (!turnstileToken) {
            newErrors.turnstile = `${i18n.ERROR_VALUE_CAPTCHA}`
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: Event) => {
        const i18n = getI18N({ currentLocale: dataLocale });

        e.preventDefault();
        setSubmitAttempted(true);
        setSubmitAttempts(prev => prev + 1);

        const elapsedTime = Date.now() - formLoadTime.current;
        if (elapsedTime < 3000) {
            setGeneralError(`${i18n.ERROR_TIME_SUBMIT}`);
            return;
        }

        if (honeypotValue) {
            setGeneralError(`${i18n.ERROR_HONEYPOT_BOT}`);
            return;
        }

        if (submitAttempts >= MAX_SUBMIT_ATTEMPTS) {
            setGeneralError(`${i18n.ERROR_NUMBER_ATTEMPTS}`);
            return;
        }

        if (!validateForm("es")) return;

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
                setGeneralError(data?.message || `${i18n.ERROR_SEND_MESSAGE}`);
            }
        } catch (error) {
            setGeneralError(`${i18n.ERROR_CONNECTION}`);
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
/*         turnstileRef,
 */        setErrors
    };
};
