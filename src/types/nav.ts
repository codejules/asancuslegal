export type Nav = {
    id?: string;
    title: string;
    url: string;
    target?: string;
    show?: string;
    controls?: string;
    placement?: string;
    edge?: string;
    offset?: string;
}

export const NAV: Nav[] = [
    {
        title: "Servicios",
        url: "#areas",
    },
    {
        title: "Soluciones",
        url: "#soluciones",
    },
    {
        title: "Equipo",
        url: "#equipo",
    },
    {
        id: 'contactoNav',
        title: "Contacto",
        url: "#contacto",
    },
];