const CDN_DOMAIN = import.meta.env.CDN_DOMAIN;

export const cdn = () => {
    return `${CDN_DOMAIN}`;
};
