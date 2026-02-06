import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://hhj520.top/",
	base: "/",
	trailingSlash: "always",
	compressHTML: true,
	build: {
		assets: "assets",
		cssCodeSplit: true,
		jsx: "preserve",
	},
	output: "static",
	integrations: [
		tailwind({
			nesting: true,
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: ["main", "#toc"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
		}),
		icon({
			include: {
				"preprocess: vitePreprocess(),": ["*"],
				"fa6-brands": ["*"],
				"fa6-regular": ["*"],
				"fa6-solid": ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte(),
		sitemap(),
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkGithubAdmonitionsToDirectives,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
		],
		rehypePlugins: [
			rehypeKatex,
			rehypeSlug,
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [
							{
								type: "text",
								value: "#",
							},
						],
					},
				},
			],
		],
	},
	vite: {
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
				output: {
					manualChunks: {
						// 核心框架
						"core-vendor": ["svelte", "@iconify/svelte"],
						// 数学公式相关
						math: ["katex", "rehype-katex", "remark-math"],
						// 代码高亮
						"code-highlight": [
							"@expressive-code/core",
							"astro-expressive-code",
						],
						// UI 组件（延迟加载）
						"ui-lightbox": ["photoswipe"],
						"ui-scrollbar": ["overlayscrollbars"],
						// Swup 相关
						"swup-core": ["@swup/astro"],
						"swup-plugins": [
							"@swup/scroll-plugin",
							"@swup/preload-plugin",
							"@swup/head-plugin",
							"@swup/scripts-plugin",
							"@swup/a11y-plugin",
						],
					},
					// 代码分割配置
					inlineDynamicImports: false,
				},
			},
			minify: "terser",
			cssMinify: "esbuild",
			modulePreload: {
				polyfill: true,
			},
			target: "es2020",
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
					pure_funcs: ["console.log", "console.info", "console.debug"],
					dead_code: true,
					unused: true,
				},
				mangle: {
					safari10: true,
				},
				format: {
					comments: false,
				},
			},
			// 资源内联阈值
			assetsInlineLimit: 4096,
			// 代码分割大小限制
			chunkSizeWarningLimit: 1000,
		},
		optimizeDeps: {
			enforce: true,
			include: [
				"@iconify-json/fa6-brands",
				"@iconify-json/fa6-regular",
				"@iconify-json/fa6-solid",
				"@iconify-json/material-symbols",
			],
			// 排除延迟加载的模块
			exclude: ["photoswipe", "overlayscrollbars"],
		},
		resolve: {
			preferBuiltins: true,
		},
		// 开发服务器配置
		server: {
			fs: {
				strict: false,
			},
		},
	},
});
