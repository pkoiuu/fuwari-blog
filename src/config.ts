import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "haohao的个人博客",
	subtitle: "以自信为笔，勾勒梦的轮廓；将生活晕染成心的原色",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: 'https://cdnkp.hhj520.top/wp-content/uploads/2025/11/1763272798-20251116055958860838.webp',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '1057x1057',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		{
			name: "主页",
			url: "/",
			external: false
		},
		{
			name: "时间线",
			url: "/archive",
			external: false
		},
		{
			name: "关于",
			url: "/about",
			external: false
		},
		{
			name: "生活锁记",
			url: "/spec/page-1770175976.599339",
			external: false
		},
		{
			name: "朋友圈",
			url: "/spec/page-1770176032.226729",
			external: false
		},
                   {
			name: "友链",
			url: "/spec/friends",
			external: false
		},
		{
			name: "旧站",
			url: "https://cdnkp.hhj520.top", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://weavatar.com/avatar/182bef26eba7cad2765a159764a34f863e78e108e09311adf9a0cd79075f5aeb?s=96&d=wavatar&r=x", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Hao Hao",
	bio: "-爱好听音乐, 写文章, 看散文.",
	links: [
		{
			name: "haohao",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://x.com/mur35064",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/profiles/76561199553421192/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/pkoiuu",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
