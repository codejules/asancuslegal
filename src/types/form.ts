export type Inputs = {
    id: string;
    type: any;
    name: string;
    placeholder: string;
    required: boolean;
};

export const INPUTS: Inputs[] = [
    {
        id: "send-email__name",
        type: "text",
        name: "name",
        placeholder: "tu nombre",
        required: true,
    },
    {
        id: "send-email__recipient",
        type: "email",
        name: "recipient",
        placeholder: "email@email.com",
        required: true,
    },
    {
        id: "send-email__subject",
        type: "text",
        name: "subject",
        placeholder: "asunto",
        required: true,
    },
    {
        id: "send-email__message",
        type: "textarea",
        name: "message",
        placeholder: "escribe tu mensaje",
        required: true,
    },
];