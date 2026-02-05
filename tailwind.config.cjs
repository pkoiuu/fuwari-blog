/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}",
    "!./src/**/*.test.{js,ts}",
    "!./src/**/*.spec.{js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Roboto",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
          ...defaultTheme.fontFamily.sans
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  // 优化：禁用未使用的核心插件
  corePlugins: {
    container: false,
    float: false,
    clear: false,
    skew: false,
    scale: true,
    rotate: true,
    translate: true,
  },
  // 优化：自定义变体
  variants: {
    extend: {
      opacity: ['dark'],
      backgroundColor: ['dark', 'hover', 'active'],
      textColor: ['dark', 'hover', 'active'],
      borderColor: ['dark', 'hover', 'active'],
    },
  },
}
