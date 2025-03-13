import { getI18N } from "@/i18n";

export type Inputs = {
    id: string;
    type: any;
    name: string;
    placeholder: string;
    required: boolean;
};


export function getInputs(currentLocale: any): Inputs[] {
    const i18n = getI18N({ currentLocale });

    return [
        {
            id: "send-email__name",
            type: "text",
            name: "name",
            placeholder: i18n.PLACEHOLDER_NAME,
            required: true,
        },
        {
            id: "send-email__recipient",
            type: "email",
            name: "recipient",
            placeholder: "Email@email.com*",
            required: true,
        },
        {
            id: "send-email__subject",
            type: "text",
            name: "subject",
            placeholder: i18n.PLACEHOLDER_SUBJECT,
            required: true,
        },
        {
            id: "send-email__message",
            type: "textarea",
            name: "message",
            placeholder: i18n.PLACEHOLDER_MESSAGE,
            required: true,
        },
    ]
};