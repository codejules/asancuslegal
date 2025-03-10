import { useContactForm } from "@/hooks/useContactForm";
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import Checkbox from './Checkbox';
import { INPUTS } from "@/types/form.js";
import SubmitButton from "./ButtonSubmit";

const ContactForm = () => {
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
    } = useContactForm();

    return (
        <form ref={formRef} className="flex flex-col gap-2 md:gap-3" onSubmit={handleSubmit} noValidate>
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
                        setErrors(prev => ({ ...prev, privacy: "Debes aceptar la política de privacidad" }));
                    }
                }}
                error={errors.privacy}
            />

            <div ref={turnstileRef} className="flex justify-start mt-8"></div>
            {errors.turnstile && <p className="text-red-500 text-xs text-left">{errors.turnstile}</p>}

            <SubmitButton isSubmitting={isSubmitting} isSent={isSent} />
        </form>
    );
};

export default ContactForm;
