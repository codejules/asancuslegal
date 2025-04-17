import { CDN_IMAGES } from "@/utils/cdn";

export type Favicon = { url: string; media: string };
export const FAVICON: Favicon[] = [
	{
		url: "/favicon-dark.svg",
		media: "(prefers-color-scheme: light)",
	},
	{
		url: "/favicon.svg",
		media: "(prefers-color-scheme: dark)",
	},
];

export type Hero = { url: string; media: string };
export const HERO: Hero[] = [
	{
		url: `${CDN_IMAGES}/assets/img/asancuslegal-hero.webp`,
		media: "(min-width: 768px)",
	},
	{
		url: `${CDN_IMAGES}/assets/img/asancuslegal-hero-mobile.webp`,
		media: "(max-width: 767px)",
	},
];

export type TeamImg = { url: string };
export const TEAM_IMG: TeamImg[] = [
	{ url: `${CDN_IMAGES}/assets/img/sandra-serra-asancus-legal.webp` },
	{ url: `${CDN_IMAGES}/assets/img/alejandro-toledo-asancus-legal.webp` },
];