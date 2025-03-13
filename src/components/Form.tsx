import { useContactForm } from "@/hooks/useContactForm";
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import Checkbox from './Checkbox';
import { getInputs } from "@/types/form.js";
import { getI18N } from "@/i18n";

import SubmitButton from "./ButtonSubmit";

const ContactForm = (currentLocale: any) => {
    const dataLocale = currentLocale.currentLocale;
    const INPUTS = getInputs(dataLocale || "es");
    const i18n = getI18N({ currentLocale: dataLocale });

    const {
        formRef,
        isSubmitting,
        isSent,
        handleSubmit,
        handleInputChange,
        formValues,
        errors,
        setErrors,
        generalError,
        privacyChecked,
        setPrivacyChecked,
        setHoneypotValue,
        turnstileRef,
    } = useContactForm(dataLocale);

    return (
        <form ref={formRef} className="flex flex-col gap-2 md:gap-3 lg:border-1 lg:border-gray-300 lg:rounded-xl lg:p-5" onSubmit={handleSubmit}
            noValidate>
            <div aria-hidden="true" class="hidden">
                <label for="bot-trap" htmlFor="bot-trap"></label>
                <input
                    type="text"
                    id="bot-trap"
                    name="bot-trap"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formValues["bot-trap"] || ""}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement | null;
                        if (target) {
                            setHoneypotValue(target.value);
                        }
                    }}
                />
            </div>

            <ErrorMessage error={generalError} />

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
                    if (target.checked) {
                        setErrors(prev => ({ ...prev, privacy: "" }));
                    } else {
                        setErrors(prev => ({ ...prev, privacy: `${i18n.ERROR_VALUE_PRIVACY}` }));
                    }
                }}
                dataLocale={dataLocale}
                error={errors.privacy}
            />

            <div ref={turnstileRef} className="flex justify-start mt-8"></div>
            {errors.turnstile && <p className="text-red-500 text-xs text-left">{errors.turnstile}</p>}

            <SubmitButton isSubmitting={isSubmitting} isSent={isSent} dataLocale={dataLocale} />
        </form>
    );
};

export default ContactForm;
