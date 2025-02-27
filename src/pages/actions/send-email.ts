import type { APIRoute } from "astro";
import { sendEmail } from "@/utils/email";

export const prerender = false;

// Función para verificar el token de Turnstile
async function verifyTurnstileToken(token: string) {
  const secretKeyCloudflare = import.meta.env.PUBLIC_CLOUDFLARE_SECRET_KEY;

  const formData = new FormData();
  formData.append('secret', secretKeyCloudflare);
  formData.append('response', token);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  
  try {
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const outcome = await result.json();
    return outcome.success;
  } catch (error) {
    console.error('Error al verificar el token de Turnstile:', error);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const to = formData.get("recipient") as string | null;
  const subject = formData.get("subject") as string | null;
  const message = formData.get("message") as string | null;
  const turnstileToken = formData.get("cf-turnstile-response") as string | null;

  if (!name || !to || !subject || !message) {
    return new Response("Missing required fields", { status: 400 });
  }

  if (!turnstileToken) {
    return new Response("Captcha verification required", { status: 400 });
  }

  // Verificar el token de Turnstile
  const isTokenValid = await verifyTurnstileToken(turnstileToken);
  
  if (!isTokenValid) {
    return new Response("Captcha verification failed", { status: 403 });
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