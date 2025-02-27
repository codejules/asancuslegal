import { useContactForm } from "@/hooks/useContactForm";
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import Checkbox from './Checkbox';
import Spinner from './Spinner';
import { INPUTS } from "@/types/form.js";

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
                <label htmlFor="bot-trap"></label>
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
