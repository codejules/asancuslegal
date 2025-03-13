
// Exporta las funciones y variables necesarias
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
export const DANGEROUS_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /alert\(/i,
    /http:\/\/|https:\/\//i, // URLs en mensajes podrían ser indicadores de spam
    /SELECT.*FROM/i, // Posibles intentos de SQL injection
    /INSERT.*INTO/i,
    /DROP.*TABLE/i
];