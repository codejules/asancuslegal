const CDN_DOMAIN = import.meta.env.CDN_DOMAIN

export const cdn = (path: string): string => {
  return `${CDN_DOMAIN}${path.startsWith('/') ? path : `/${path}`}`;
};
