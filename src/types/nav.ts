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
        id: 'contacto',
        title: "Contacto",
        url: "#contacto",
        target: "drawer-swipe",
        show: "drawer-swipe",
        controls: "drawer-swipe",
        placement: "bottom",
        edge: "true",
        offset: "bottom-[30px]"
    },
];