import { useState } from "preact/hooks";
import { INPUTS } from "@/types/form.js";
import Spinner from "./Spinner";

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const response = await fetch("/actions/send-email", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsSent(true); // Cambiar el estado a enviado
            } else {
                console.error("Error al enviar el mensaje.");
            }
        } catch (error) {
            console.error("Error enviando el correo:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form class="flex flex-col gap-2 md:gap-3" onSubmit={handleSubmit}>

            {INPUTS.map(({ id, type, name, placeholder, required }) => {
                if (type === "textarea") {
                    return (
                        <div key={id}>
                            <label htmlFor={id} class="block mb-2 text-sm font-medium text-white" />
                            <textarea
                                placeholder={placeholder}
                                rows={4}
                                class="block p-2.5 w-full text-sm text-gray-300 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                                name={name}
                                id={id}
                                required={required}
                            />
                        </div>
                    );
                }

                return (
                    <div key={id}>
                        <label htmlFor={id} class="block mb-2 text-sm font-medium text-white" />
                        <input
                            placeholder={placeholder}
                            class="border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                            type={type}
                            name={name}
                            id={id}
                            required={required}
                        />
                    </div>
                );
            })}

            <div class="flex items-center">
                <input required id="checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500" />
                <label for="checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">He leído y acepto la Política de Privacidad</label>
            </div>

            <button
                type="submit"
                class={`mt-6 w-fit flex mx-auto transition duration-300 ease-in text-white bg-primary border border-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ${isSubmitting || isSent ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer hover:border-primary hover:scale-95"
                    }`}
                disabled={isSubmitting || isSent}
            >
                {isSubmitting ? (
                    <span class="flex items-center gap-2">
                        <Spinner />
                        Enviando...
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
