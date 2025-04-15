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
		url: "/assets/img/asancuslegal-hero.webp",
		media: "(min-width: 768px)",
	},
	{
		url: "/assets/img/asancuslegal-hero-mobile.webp",
		media: "(max-width: 767px)",
	},
];

export type TeamImg = { url: string };
export const TEAM_IMG: TeamImg[] = [
	{ url: "/assets/img/sandra-serra-asancus-legal.webp" },
	{ url: "/assets/img/alejandro-toledo-asancus-legal.webp" },
];