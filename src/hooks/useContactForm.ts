import { useState, useEffect, useRef } from "preact/hooks";
import { getInputs } from "@/types/form.js";
import { getI18N } from "@/i18n";
import { validateField } from "@/hooks/validateField";

type ValidationErrors = {
    [key: string]: string;
};

export const useContactForm = (dataLocale: any) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [honeypotValue, setHoneypotValue] = useState("");
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const MAX_SUBMIT_ATTEMPTS = 5;
    const formLoadTime = useRef(Date.now());
    const formRef = useRef<HTMLFormElement>(null);

    const handleInputChange = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        setFormValues(prev => ({ ...prev, [name]: value }));

        if (submitAttempted) {
            const error = validateField(name, value, dataLocale);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const validateForm = (currentLocale: string): boolean => {
        const INPUTS = getInputs(currentLocale || "es");
        const i18n = getI18N({ currentLocale: dataLocale });

        const newErrors: ValidationErrors = {};
        let isValid = true;

        Object.entries(formValues).forEach(([name, value]) => {
            const error = validateField(name, value, dataLocale);
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
        setErrors
    };
};
