import type { APIRoute } from "astro";
import { sendEmail } from "@/utils/email";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const to = formData.get("recipient") as string | null;
  const subject = formData.get("subject") as string | null;
  const message = formData.get("message") as string | null;

  if (!name || !to || !subject || !message) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const html = `<div>
      <h3>Nuevo mensaje de contacto Asancus Legal</h3>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>De:</b> ${to}</p>
      <p><b>Asunto:</b> ${subject}</p>
      <p><b>Mensaje:</b> ${message}</p>
    </div>`;
    await sendEmail({ name, to, subject, html });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return new Response("Error al enviar el correo", { status: 500 });
  }

  // Retornar un estado 200 en lugar de redirigir
  return new Response("Email enviado correctamente", { status: 200 });
};
