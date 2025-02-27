
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

// Función de validación de campo
export const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
        return "Este campo es obligatorio";
    }

    switch (name) {
        case "name":
            if (!NAME_REGEX.test(value)) {
                return "Introduce un nombre válido";
            }
            if (value.length > 50) {
                return "El nombre es demasiado largo (máximo 50 caracteres)";
            }
            break;
        case "recipient":
            if (!EMAIL_REGEX.test(value)) {
                return "Introduce un email válido";
            }
            break;
        case "subject":
            if (value.length > 50) {
                return "El asunto es demasiado largo (máximo 50 caracteres)";
            }
            break;
        case "message":
            if (value.length > 500) {
                return "El mensaje es demasiado largo (máximo 500 caracteres)";
            }
            for (const pattern of DANGEROUS_PATTERNS) {
                if (pattern.test(value)) {
                    return "El mensaje contiene caracteres no permitidos";
                }
            }
            break;
    }

    return "";
};

// Función de validación general del formulario
export const validateForm = (formValues: { [key: string]: string }): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Validar todos los campos
    Object.entries(formValues).forEach(([name, value]) => {
        const error = validateField(name, value);
        if (error) {
            newErrors[name] = error;
            isValid = false;
        }
    });

    // Aquí puedes agregar más lógica si es necesario

    return isValid;
};