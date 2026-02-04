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
	lang: "zh_CN", // 语言代码，例如：'en', 'zh_CN', 'ja' 等
	themeColor: {
		hue: 250, // 主题颜色的默认色相，范围从 0 到 360。例如：红色: 0, 青色: 200, 蓝绿色: 250, 粉色: 345
		fixed: false, // 对访客隐藏主题颜色选择器
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // 相对于 /src 目录的路径。如果以 '/' 开头，则相对于 /public 目录
		position: "center", // 相当于 object-position，仅支持 'top', 'center', 'bottom'。默认为 'center'
		credit: {
			enable: false, // 显示横幅图片的 credits 文字
			text: "", // 要显示的 credits 文字
			url: "", // (可选) 指向原始作品或艺术家页面的 URL 链接
		},
	},
	toc: {
		enable: true, // 在帖子右侧显示目录
		depth: 2, // 目录中显示的最大标题深度，范围从 1 到 3
	},
	favicon: [
		// 留空此数组以使用默认图标
		// {
		//   src: 'https://cdnkp.hhj520.top/wp-content/uploads/2025/11/1763272798-20251116055958860838.webp',    // 图标的路径，相对于 /public 目录
		//   theme: 'light',              // (可选) 可以是 'light' 或 'dark'，仅当为明暗模式设置不同图标时使用
		//   sizes: '1057x1057',              // (可选) 图标的大小，仅当有不同大小的图标时使用
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.朋友圈,
		LinkPreset.时间线,
		LinkPreset.关于,
		{
			name: "旧站",
			url: "https://cdnkp.hhj520.top", // 内部链接不应包含基础路径，因为它会自动添加
			external: true, // 显示外部链接图标并在新标签页中打开
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://weavatar.com/avatar/182bef26eba7cad2765a159764a34f863e78e108e09311adf9a0cd79075f5aeb?s=96&d=wavatar&r=x", // 相对于 /src 目录的路径。如果以 '/' 开头，则相对于 /public 目录
	name: "Hao Hao",
	bio: "-爱好听音乐, 写文章, 看散文.",
	links: [
		{
			name: "haohao",
			icon: "fa6-brands:twitter", // 访问 https://icones.js.org/ 获取图标代码
			// 如果尚未包含相应的图标集，您需要安装它
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
	// 注意：一些样式（如背景颜色）正在被覆盖，请参见 astro.config.mjs 文件。
	// 请选择一个深色主题，因为此博客主题目前仅支持深色背景颜色
	theme: "github-dark",
};
