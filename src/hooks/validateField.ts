import { getI18N } from "@/i18n";
import { DANGEROUS_PATTERNS, EMAIL_REGEX, NAME_REGEX } from "@/utils/validators";

export const validateField = (name: string, value: string, dataLocale: any): string => {
    const i18n = getI18N({ currentLocale: dataLocale });

    if (!value.trim()) {
        return `${i18n.ERROR_VALUE_EMPTY}`
    }

    switch (name) {
        case "name":
            if (!NAME_REGEX.test(value)) return `${i18n.ERROR_ADD_VALID_NAME}`
            if (value.length > 30) return `${i18n.ERROR_LONG_NAME}`;
            break;
        case "recipient":
            if (!EMAIL_REGEX.test(value)) return `${i18n.ERROR_ADD_VALID_EMAIL}`;
            break;
        case "subject":
            if (value.length > 30) return `${i18n.ERROR_LONG_SUBJECT}`;
            break;
        case "message":
            if (value.length > 500) return `${i18n.ERROR_LONG_MESSAGE}`;
            for (const pattern of DANGEROUS_PATTERNS) {
                if (pattern.test(value)) return `${i18n.ERROR_PATTERN_MESSAGE}`;
            }
            break;
    }

    return "";
};