import type { APIRoute } from "astro";
import { sendEmail } from "@/utils/email";

export const prerender = false;

// Expresiones regulares para validaciones en el servidor
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
const DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+=/i,
  /alert\(/i,
  /http:\/\/|https:\/\//i,
  /SELECT.*FROM/i,
  /INSERT.*INTO/i,
  /DROP.*TABLE/i
];

// Función para sanitizar texto
function sanitizeInput(text: string): string {
  if (!text) return '';
  
  // Eliminar HTML y caracteres potencialmente peligrosos
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
}

// Verificar si un texto contiene patrones peligrosos
function containsDangerousPatterns(text: string): boolean {
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(text));
}

// Rate limiting
const ipRequests = new Map<string, {count: number, timestamp: number}>();
const EMAIL_LIMIT_WINDOW = 3600000; // 1 hora en milisegundos
const MAX_EMAILS_PER_WINDOW = 5;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Rate limiting basado en IP
  const ip = clientAddress || "unknown";
  const now = Date.now();
  const ipData = ipRequests.get(ip) || { count: 0, timestamp: now };
  
  // Limpiar entradas antiguas
  if (now - ipData.timestamp > EMAIL_LIMIT_WINDOW) {
    ipData.count = 0;
    ipData.timestamp = now;
  }
  
  // Comprobar límite
  if (ipData.count >= MAX_EMAILS_PER_WINDOW) {
    return new Response(JSON.stringify({
      success: false,
      message: "Has excedido el límite de envíos. Por favor, inténtalo más tarde."
    }), { 
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.formData();
    
    // Comprobar honeypot
    const honeypot = formData.get("bot-trap") as string | null;
    if (honeypot) {
      // Bot detectado, simulamos éxito pero no enviamos el email
      console.warn("Posible bot detectado (honeypot): IP", ip);
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verificar que la solicitud provenga de un formulario real
    const timestamp = formData.get("form-timestamp") as string | null;
    const submissionTime = timestamp ? parseInt(timestamp) : 0;
    const elapsedTime = now - submissionTime;
    
    if (submissionTime > 0 && elapsedTime < 3000) {
      console.warn("Envío sospechosamente rápido: IP", ip, "Tiempo:", elapsedTime);
      return new Response(JSON.stringify({
        success: false,
        message: "Por favor, espera un momento antes de enviar el formulario"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Extraer y sanitizar datos
    const name = sanitizeInput(formData.get("name") as string | null || "");
    const to = sanitizeInput(formData.get("recipient") as string | null || "");
    const subject = sanitizeInput(formData.get("subject") as string | null || "");
    const message = sanitizeInput(formData.get("message") as string | null || "");

    // Validación de campos requeridos
    if (!name || !to || !subject || !message) {
      return new Response(JSON.stringify({
        success: false,
        message: "Faltan campos obligatorios"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar formato de campos
    if (!NAME_REGEX.test(name)) {
      return new Response(JSON.stringify({
        success: false,
        message: "El nombre contiene caracteres no válidos"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!EMAIL_REGEX.test(to)) {
      return new Response(JSON.stringify({
        success: false,
        message: "El formato del email no es válido"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Buscar patrones peligrosos
    if (containsDangerousPatterns(name) || 
        containsDangerousPatterns(subject) || 
        containsDangerousPatterns(message)) {
      console.warn("Contenido sospechoso detectado: IP", ip);
      return new Response(JSON.stringify({
        success: false,
        message: "El mensaje contiene contenido no permitido"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validar tamaño de los campos
    if (name.length > 50 || to.length > 100 || subject.length > 100 || message.length > 1000) {
      return new Response(JSON.stringify({
        success: false,
        message: "Uno o más campos exceden el tamaño permitido"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Enviar el email
    const html = `<div>
      <h3>Nuevo mensaje de contacto Asancus Legal</h3>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>De:</b> ${to}</p>
      <p><b>Asunto:</b> ${subject}</p>
      <p><b>Mensaje:</b> ${message}</p>
    </div>`;
    
    await sendEmail({ name, to, subject, html });
    
    // Actualizar contador de rate limiting
    ipData.count += 1;
    ipRequests.set(ip, ipData);

    // Retornar éxito
    return new Response(JSON.stringify({
      success: true,
      message: "Email enviado correctamente"
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error al procesar la solicitud"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};