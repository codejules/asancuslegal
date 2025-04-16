const CDN_DOMAIN = import.meta.env.CDN_DOMAIN

export const cdn = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_DOMAIN}${cleanPath}`;
};
