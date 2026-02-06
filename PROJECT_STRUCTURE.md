# Fuwari 博客项目结构说明

> 本文档为 AI 助手提供项目全貌和部署信息参考  
> 创建日期：2026-02-05  
> 最后更新：2026-02-05

---

## 📋 项目概述

| 属性 | 说明 |
|------|------|
| **项目名称** | Fuwari |
| **项目类型** | 静态博客系统 |
| **核心框架** | Astro 5.13.10 |
| **组件框架** | Svelte 5.39.8 |
| **样式框架** | Tailwind CSS 3.4.19 |
| **语言** | TypeScript 5.9.3 |
| **包管理器** | pnpm 9.14.4 |
| **部署平台** | 腾讯云 EdgeOne Pages |
| **Node.js 版本** | >= 20 (部署使用 24.5.0) |

---

## 🗂️ 完整目录树

```
d:\github-git\fuwari-blog/
├── .github/                          # GitHub 配置
│   ├── ISSUE_TEMPLATE/               # Issue 提交模板
│   │   ├── 01-bug_report.yml
│   │   ├── 02-feature_request.yml
│   │   └── 03-custom_issue.yml
│   ├── workflows/                    # GitHub Actions
│   │   ├── biome.yml                 # 代码规范检查
│   │   └── build.yml                 # 构建工作流
│   ├── dependabot.yml
│   └── pull_request_template.md
│
├── .trae/                            # Trae IDE 配置
│   └── documents/                    # 项目文档和优化记录
│
├── .vscode/                          # VSCode 编辑器配置
│   ├── extensions.json
│   └── settings.json
│
├── docs/                             # 多语言项目文档
│   ├── README.es.md                  # 西班牙语
│   ├── README.id.md                  # 印尼语
│   ├── README.ja.md                  # 日语
│   ├── README.ko.md                  # 韩语
│   ├── README.th.md                  # 泰语
│   ├── README.vi.md                  # 越南语
│   └── README.zh-CN.md               # 简体中文
│
├── public/                           # 静态资源目录
│   └── favicon/                      # 网站图标
│       ├── favicon-dark-128.png
│       ├── favicon-dark-180.png
│       ├── favicon-dark-192.png
│       ├── favicon-dark-32.png
│       ├── favicon-light-128.png
│       ├── favavicon-light-180.png
│       ├── favicon-light-192.png
│       └── favicon-light-32.png
│
├── scripts/                          # 脚本工具
│   └── new-post.js                   # 创建新文章脚本
│
├── src/                              # 源代码目录
│   ├── assets/                       # 资源文件
│   │   └── images/                   # 图片资源
│   │       └── demo-banner.png
│   │
│   ├── components/                   # UI 组件
│   │   ├── control/                  # 控制组件
│   │   │   ├── ButtonLink.astro
│   │   │   ├── ButtonTag.astro
│   │   │   └── Pagination.astro
│   │   ├── misc/                     # 杂项组件
│   │   │   ├── ImageWrapper.astro
│   │   │   ├── License.astro         # 文章许可证
│   │   │   └── Markdown.astro
│   │   ├── widget/                   # 侧边栏小部件
│   │   │   ├── DisplaySettings.svelte
│   │   │   ├── NavMenuPanel.astro
│   │   │   ├── Profile.astro
│   │   │   ├── TOC.astro             # 目录
│   │   │   └── WidgetLayout.astro
│   │   ├── Comment.astro             # 评论系统(Twikoo)
│   │   ├── ConfigCarrier.astro
│   │   ├── Footer.astro              # 页脚
│   │   ├── LightDarkSwitch.svelte    # 主题切换(已禁用)
│   │   ├── Navbar.astro              # 导航栏
│   │   ├── PostCard.astro            # 文章卡片
│   │   ├── PostMeta.astro            # 文章元信息
│   │   └── Search.svelte             # 搜索组件
│   │
│   ├── constants/                    # 常量定义
│   │   ├── constants.ts              # 核心常量
│   │   └── icon.ts                   # 图标配置
│   │
│   ├── content/                      # 内容集合
│   │   ├── posts/                    # 博客文章目录
│   │   │   └── [文章文件].md
│   │   ├── spec/                     # 特殊页面
│   │   │   ├── friends.md            # 友链页面
│   │   │   └── [...其他特殊页面]
│   │   └── config.ts                 # 内容集合配置
│   │
│   ├── i18n/                         # 国际化
│   │   ├── i18nKey.ts                # 翻译键定义
│   │   ├── translation.ts            # 翻译工具
│   │   └── languages/                # 语言文件
│   │       ├── en.ts
│   │       ├── es.ts
│   │       ├── id.ts
│   │       ├── ja.ts
│   │       ├── ko.ts
│   │       ├── th.ts
│   │       ├── tr.ts
│   │       ├── vi.ts
│   │       ├── zh_CN.ts
│   │       └── zh_TW.ts
│   │
│   ├── layouts/                      # 布局组件
│   │   ├── Layout.astro              # 基础布局
│   │   └── MainGridLayout.astro      # 主网格布局
│   │
│   ├── pages/                        # 页面路由
│   │   ├── [...page].astro           # 首页/分页
│   │   ├── about.astro               # 关于页面
│   │   ├── archive.astro             # 归档页面
│   │   ├── posts/
│   │   │   └── [...slug].astro       # 文章详情页
│   │   ├── spec/
│   │   │   └── [...slug].astro       # 特殊页面
│   │   ├── robots.txt.ts             # 爬虫规则
│   │   └── rss.xml.ts                # RSS 订阅
│   │
│   ├── plugins/                      # 自定义插件
│   │   ├── expressive-code/          # 代码高亮插件
│   │   │   ├── custom-copy-button.js
│   │   │   └── language-badge.ts
│   │   ├── rehype-component-admonition.mjs
│   │   ├── rehype-component-github-card.mjs
│   │   ├── remark-directive-rehype.js
│   │   ├── remark-excerpt.js
│   │   └── remark-reading-time.mjs
│   │
│   ├── styles/                       # 样式文件
│   │   ├── global.css
│   │   ├── global.styl
│   │   ├── katex-fix.css
│   │   ├── photoswipe.css
│   │   └── scrollbar.css
│   │
│   ├── types/                        # TypeScript 类型
│   │   └── config.ts
│   │
│   └── utils/                        # 工具函数
│       ├── content-utils.ts
│       ├── path-utils.ts
│       ├── setting-utils.ts          # 主题设置工具
│       └── url-utils.ts
│
├── astro.config.mjs                  # Astro 核心配置
├── edgeone.json                      # EdgeOne 部署配置 ⭐重要
├── package.json                      # 包管理配置
├── tailwind.config.cjs               # Tailwind CSS 配置
├── tsconfig.json                     # TypeScript 配置
├── biome.json                        # Biome 代码规范
├── vercel.json                       # Vercel 部署配置(备用)
├── pagefind.yml                      # Pagefind 搜索配置
└── README.md                         # 项目说明
```

---

## 🔧 关键文件详解

### 1. edgeone.json (部署配置) ⭐

**位置**: `d:\github-git\fuwari-blog\edgeone.json`

**用途**: 腾讯云 EdgeOne Pages 部署配置文件

**关键配置**:
```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "outputDirectory": "./dist",
  "nodeVersion": "24.5.0",
  "headers": [...],      // HTTP 响应头配置
  "redirects": [...]     // URL 重定向规则
}
```

**缓存策略**:
| 资源类型 | 缓存时间 | 说明 |
|---------|---------|------|
| `/assets/*` | 1年 (31536000s) | 静态资源，不可变 |
| `/pagefind/*` | 1天 (86400s) | 搜索索引 |
| `/*.{css,js,图片,字体}` | 1年 | 静态文件 |
| `/*.html` | 8小时 (28800s) | HTML 页面 |
| `/posts/*` | 8小时 | 文章页面 |
| `/sitemap.xml` | 0 | 实时更新 |
| `/rss.xml` | 0 | 实时更新 |

**安全头配置**:
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-Content-Type-Options: nosniff` - 防止 MIME 嗅探
- `Referrer-Policy: strict-origin-when-cross-origin` -  referrer 策略
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` - HSTS
- `X-DNS-Prefetch-Control: on` - 启用 DNS 预解析

---

### 2. astro.config.mjs (Astro 配置)

**位置**: `d:\github-git\fuwari-blog\astro.config.mjs`

**关键配置**:
- **站点地址**: `https://hhj520.top/`
- **构建输出**: `static` (静态站点)
- **资源目录**: `assets`
- **代码分割**: 启用 CSS 代码分割

**集成列表**:
| 集成 | 用途 |
|------|------|
| `@astrojs/tailwind` | Tailwind CSS 支持 |
| `@astrojs/svelte` | Svelte 组件支持 |
| `@astrojs/sitemap` | 站点地图生成 |
| `@astrojs/rss` | RSS 订阅生成 |
| `@swup/astro` | 页面过渡动画 |
| `astro-expressive-code` | 代码高亮增强 |
| `astro-icon` | 图标支持 |

**Vite 优化配置**:
- 代码分割为多个 chunk (core-vendor, math, code-highlight, ui-lightbox, ui-scrollbar, swup-core, swup-plugins)
- 使用 Terser 压缩，移除 console 和 debugger
- 资源内联阈值: 4KB
- 模块预加载 polyfill

---

### 3. src/config.ts (站点配置)

**位置**: `d:\github-git\fuwari-blog\src\config.ts`

**配置项**:
- `siteConfig` - 站点基本信息（标题、副标题、语言、主题色）
- `navBarConfig` - 导航栏链接配置
- `profileConfig` - 个人资料（头像、名称、简介、社交链接）
- `licenseConfig` - 文章许可证配置
- `expressiveCodeConfig` - 代码高亮主题配置

**当前主题设置**:
- 主题色色相: 180 (青色)
- 主题色选择器: 已隐藏 (`fixed: false`)
- 代码高亮主题: `github-dark`
- **注意**: 暗黑模式切换已禁用，强制使用白色模式

---

### 4. package.json (依赖管理)

**位置**: `d:\github-git\fuwari-blog\package.json`

**关键脚本**:
```bash
pnpm dev          # 开发服务器
pnpm build        # 构建 + 生成搜索索引
pnpm preview      # 预览构建结果
pnpm new-post     # 创建新文章
pnpm format       # 格式化代码
pnpm lint         # 代码检查
```

**核心依赖**:
- `astro: 5.13.10` - 静态站点生成器
- `svelte: 5.39.8` - 组件框架
- `tailwindcss: 3.4.19` - CSS 框架
- `pagefind: 1.4.0` - 静态搜索
- `photoswipe: 5.4.4` - 图片灯箱
- `katex: 0.16.27` - 数学公式
- `overlayscrollbars: 2.12.0` - 自定义滚动条

---

## 🚀 部署信息

### 部署平台

**腾讯云 EdgeOne Pages**

- 部署方式: 连接 Git 仓库自动部署
- 构建命令: `pnpm run build`
- 输出目录: `./dist`
- Node.js 版本: `24.5.0`

### 部署流程

1. **本地开发测试**:
   ```bash
   pnpm dev          # 启动开发服务器
   ```

2. **构建测试** (必须在部署前执行):
   ```bash
   pnpm build        # 构建项目
   pnpm preview      # 预览构建结果
   ```

3. **提交到 Git**:
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```

4. **自动部署**:
   - 代码推送到仓库后，EdgeOne Pages 自动触发构建
   - 构建完成后自动部署到 CDN

### 环境要求

- **Node.js**: >= 20 (推荐 24.5.0)
- **包管理器**: pnpm 9.14.4
- **操作系统**: Windows / macOS / Linux

---

## 🛠️ 维护与更新机制

### 开发规范

1. **每次修改后必须执行**:
   ```bash
   pnpm build    # 确保构建成功
   pnpm preview  # 本地验证功能
   ```

2. **代码规范检查**:
   ```bash
   pnpm format   # 自动格式化
   pnpm lint     # 代码检查
   ```

3. **更新项目文档**:
   - 修改关键配置后更新本文档
   - 记录重要变更到 `.trae/documents/`

### 关键组件说明

| 组件 | 文件路径 | 功能说明 | 状态 |
|------|---------|---------|------|
| 评论系统 | `src/components/Comment.astro` | Twikoo 评论 | 使用 zstatic CDN |
| 搜索 | `src/components/Search.svelte` | Pagefind 搜索 | 延迟加载 |
| 主题切换 | `src/components/LightDarkSwitch.svelte` | 亮/暗模式切换 | **已禁用** |
| 导航栏 | `src/components/Navbar.astro` | 顶部导航 | 正常 |
| 页脚 | `src/components/Footer.astro` | 底部信息 | 正常 |
| 许可证 | `src/components/misc/License.astro` | 文章版权 | 正常 |

### 已禁用功能

- **暗黑模式**: 已强制禁用，仅使用白色模式
  - `Layout.astro`: 强制移除 `dark` 类
  - `Navbar.astro`: 隐藏切换按钮
  - `setting-utils.ts`: 强制返回亮色模式

---

## 📚 技术栈详情

### 核心框架
- **[Astro](https://astro.build/)** - 静态站点生成器，支持 Islands 架构
- **[Svelte](https://svelte.dev/)** - 编译时优化的组件框架
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化 CSS 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript

### 功能特性
- **[Pagefind](https://pagefind.app/)** - 静态搜索，构建时生成索引
- **[Swup](https://swup.js.org/)** - 页面过渡动画，无刷新导航
- **[Expressive Code](https://expressive-code.com/)** - 代码高亮增强
- **[PhotoSwipe](https://photoswipe.com/)** - 图片灯箱查看
- **[KaTeX](https://katex.org/)** - 数学公式渲染
- **[OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/)** - 自定义滚动条
- **[Twikoo](https://twikoo.js.org/)** - 评论系统 (CDN 加载)

### 开发工具
- **[Biome](https://biomejs.dev/)** - 代码格式化和 Lint
- **[pnpm](https://pnpm.io/)** - 高效的包管理器

---

## 📝 更新日志

| 日期 | 变更内容 | 变更文件 | 操作人 |
|------|---------|---------|--------|
| 2026-02-05 | 创建项目结构说明文档 | PROJECT_STRUCTURE.md | AI |
| 2026-02-05 | 强制禁用暗黑模式，仅使用白色模式 | Layout.astro, Navbar.astro, setting-utils.ts | AI |
| 2026-02-05 | 更新 Twikoo CDN 到 zstatic | Comment.astro | AI |
| 2026-02-05 | 优化 EdgeOne 部署配置 | edgeone.json | AI |
| 2026-02-06 | 修复评论区排版错乱，添加骨架屏 | Comment.astro | AI |
| 2026-02-06 | 修复 License 组件文章链接显示 | License.astro | AI |
| 2026-02-06 | 修改站点域名为 hhj520.top | astro.config.mjs | AI |

---

## ⚠️ 注意事项

1. **部署前必须本地构建测试**，确保无错误
2. **禁止修改 edgeone.json 中的缓存配置**（除非明确需求）
3. **主题切换已禁用**，不要尝试恢复相关功能
4. **评论系统使用外部 CDN**，如加载失败可更换 CDN 地址
5. **搜索功能依赖 Pagefind**，构建时会自动生成索引

---

## 🔗 相关链接

- **项目地址**: `d:\github-git\fuwari-blog`
- **部署平台**: 腾讯云 EdgeOne Pages
- **框架文档**: [Astro Docs](https://docs.astro.build/)
- **主题文档**: [Fuwari Template](https://github.com/saicaca/fuwari)

---

*本文档由 AI 助手维护，如有疑问请查阅项目源代码或联系开发者。*
