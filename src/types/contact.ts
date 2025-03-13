import { getI18N } from "@/i18n";

export type Find_us = {
    label: string;
    href: string;
    text: string;
    target?: string;
};

export function FIND_US(currentLocale: any): Find_us[] {
    const i18n = getI18N({ currentLocale });

    return [
        {
            label: i18n.CONTACT_EMAIL,
            href: "mailto:info@asancuslegal.com",
            text: "info@asancuslegal.com",
        },
        {
            label: i18n.CONTACT_PHONE,
            href: "tel:659377251",
            text: "+34 659 37 72 51",
        },
        {
            label: i18n.CONTACT_ADDRESS,
            href: "https://maps.app.goo.gl/w21qqoP5AZBDQqJ5A",
            text: `C/ Conde Salvatierra 21, ${i18n.CONTACT_FLOOR} 3, ${i18n.CONTACT_DOOR} 5. 46004 Valencia`,
            target: "_blank",
        },
    ]
};