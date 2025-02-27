import { useState, useEffect, useRef } from "preact/hooks";
import { INPUTS } from "@/types/form.js";
import Spinner from "./Spinner";

// Definir la interfaz para las propiedades de window.turnstile
declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
        };
    }
}

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKeyCloudflare = import.meta.env.CLOUDFLARE_SITE_KEY;

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
                });
            }
        };

        return () => {
            // Limpiar el script cuando el componente se desmonta
            document.head.removeChild(script);
        };
    }, []);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (!turnstileToken) {
            console.error("Por favor, completa el captcha");
            return;
        }

        setIsSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // Añadir el token de Turnstile al FormData
        formData.append("cf-turnstile-response", turnstileToken);

        try {
            const response = await fetch("/actions/send-email", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsSent(true); // Cambiar el estado a enviado
                // Resetear el widget de Turnstile después de enviar
                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                }
            } else {
                console.error("Error al enviar el mensaje.");
                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                }
                setTurnstileToken(null);
            }
        } catch (error) {
            console.error("Error enviando el correo:", error);
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.reset(widgetIdRef.current);
            }
            setTurnstileToken(null);
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

            <div ref={turnstileRef} data-theme="light" class="flex justify-start my-8"></div>

            <button
                type="submit"
                class={`mt-6 w-fit flex mx-auto transition duration-300 ease-in text-white bg-primary border border-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ${isSubmitting || isSent || !turnstileToken ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer hover:border-primary hover:scale-95"
                    }`}
                disabled={isSubmitting || isSent || !turnstileToken}
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