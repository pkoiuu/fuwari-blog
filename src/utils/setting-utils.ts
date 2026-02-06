import { LIGHT_MODE } from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// 强制使用亮色模式，忽略传入的主题参数
	document.documentElement.classList.remove("dark");
	_theme;
	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	// 强制使用亮色模式，不保存主题设置
	localStorage.setItem("theme", LIGHT_MODE);
	applyThemeToDocument(LIG_themeDE);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	// 始终返回亮色模式
	return LIGHT_MODE;
}
