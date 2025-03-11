import { getI18N } from "@/i18n";

export type NavItems = {
    title: string;
    href: string;
}

export function getNavItems(currentLocale: string): NavItems[] {
    const i18n = getI18N({ currentLocale });
    
    return [
        { title: i18n.NAV_SERVICES, href: "/#areas" },
        { title: i18n.NAV_SOLUTIONS, href: "/#soluciones" },
        { title: i18n.NAV_TEAM, href: "/#equipo" },
        { title: i18n.NAV_CONTACT, href: "/#contacto" },
    ];
}

export const itemsHeader = 'hover:text-gray-500 transition ease-in duration-300 font-base block py-2 px-3 lg:p-0 lg:hover:bg-transparent';
export const itemsBurger =
    "hover:text-gray-500 transition ease-in duration-300 font-base block py-2 px-3 lg:p-0 text-slate-600";
export const burgerLine =
    "nav-burguer-line bg-black block transition ease-in duration-300 w-6 h-[2px]";
export const navList = `transition-top ease-in duration-500 z-50 fixed bg-white w-full shadow-md right-0 left-0 -top-full flex max-lg:gap-4 flex-col font-medium p-4 lg:p-0 rounded-lg lg:space-x-8 rtl:space-x-reverse
            lg:flex-row lg:mt-0 lg:border-0`;

