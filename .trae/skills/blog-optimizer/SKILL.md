---
name: "blog-optimizer"
description: "博客性能优化专家，针对Astro+Svelte博客进行性能调优。当用户要求优化博客性能、提升加载速度、优化图片、代码分割、缓存策略时触发。"
---

# 博客性能优化专家

本 Skill 专门用于优化基于 Astro + Svelte + Tailwind CSS 的博客性能。

## 触发条件

当用户出现以下需求时，必须激活本 Skill：

- 要求"优化博客性能"、"提升加载速度"
- 要求优化图片加载
- 涉及代码分割和懒加载
- 要求优化编译时间
- 涉及缓存策略优化
- 要求减少首屏加载时间
- 涉及 Core Web Vitals 优化

## 优化领域

### 1. 图片优化

#### 当前实现
- **组件**: `src/components/misc/ImageWrapper.astro`
- **技术**: Sharp 图片处理 + 懒加载
- **特性**: 骨架屏占位符、Intersection Observer、错误处理

#### 可优化项
```markdown
✅ WebP/AVIF 格式支持
✅ 响应式图片 (srcset)
✅ 图片预加载关键资源
✅ 延迟加载非关键图片
```

#### 关键配置
```typescript
// astro.config.mjs
assetsInlineLimit: 4096, // 4KB 内联阈值
```

### 2. 代码分割

#### 当前配置
```javascript
// astro.config.mjs - vite.build.rollupOptions.output.manualChunks
{
  "core-vendor": ["svelte", "@iconify/svelte"],
  "math": ["katex", "rehype-katex", "remark-math"],
  "code-highlight": ["@expressive-code/core", "astro-expressive-code"],
  "ui-lightbox": ["photoswipe"],
  "ui-scrollbar": ["overlayscrollbars"],
  "swup-core": ["@swup/astro"],
  "swup-plugins": ["@swup/scroll-plugin", "@swup/preload-plugin", ...],
}
```

#### 优化建议
- 根据实际使用情况调整 chunk 划分
- 监控 chunk 大小，避免过大或过小
- 使用动态导入延迟加载非关键组件

### 3. 编译优化

#### 当前配置
```javascript
// astro.config.mjs
build: {
  cache: true,        // 启用持久化缓存
  concurrency: 4,     // 并行构建
}

vite: {
  build: {
    minify: "terser",
    cssMinify: "esbuild",
    target: "es2020",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}
```

#### 优化建议
- 启用持久化缓存加速后续构建
- 使用 esbuild 加速 CSS 压缩
- 移除生产环境 console 语句

### 4. 懒加载策略

#### 已实现
- **评论系统**: `src/components/Comment.astro`
  - Intersection Observer (rootMargin: 200px)
  - 骨架屏占位符
  
- **搜索功能**: `src/components/Search.svelte`
  - requestIdleCallback 延迟初始化
  - 防抖处理 (150ms)

- **图片加载**: `src/components/misc/ImageWrapper.astro`
  - Intersection Observer (rootMargin: 50px)
  - CSS 过渡动画

#### 可添加
- PhotoSwipe 延迟加载
- 数学公式延迟加载
- 代码复制按钮延迟加载

### 5. 缓存策略

#### EdgeOne 配置 (edgeone.json)
```json
{
  "/assets/*": "public, max-age=31536000, immutable",
  "/pagefind/*": "public, max-age=604800, must-revalidate",
  "/*.html": "public, max-age=86400, must-revalidate",
  "/posts/*": "public, max-age=86400, must-revalidate"
}
```

#### 优化建议
- 根据内容更新频率调整缓存时间
- 为字体文件添加长期缓存
- 使用 stale-while-revalidate 策略

## 性能监控

### Core Web Vitals 目标

| 指标 | 目标值 | 当前状态 |
|------|--------|----------|
| LCP | < 2.5s | 待测量 |
| FID | < 100ms | 待测量 |
| CLS | < 0.1 | 待测量 |
| FCP | < 1.8s | 待测量 |
| TTFB | < 600ms | 待测量 |

### 测量工具
- Chrome DevTools Lighthouse
- WebPageTest
- PageSpeed Insights

## 优化检查清单

### 首屏优化
- [ ] 关键 CSS 内联
- [ ] 字体预加载
- [ ] 图片懒加载
- [ ] 骨架屏占位

### 运行时优化
- [ ] 事件委托
- [ ] 防抖节流
- [ ] 虚拟滚动（长列表）
- [ ] 缓存策略

### 构建优化
- [ ] 代码分割
- [ ] Tree Shaking
- [ ] 压缩优化
- [ ] 资源内联

## 常见优化操作

### 添加图片懒加载
```astro
<!-- ImageWrapper.astro -->
<Image 
  src={img} 
  alt={alt || ""} 
  loading="lazy"
  decoding="async"
/>
```

### 优化编译时间
```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    cache: true,
    concurrency: 4,
  },
});
```

### 添加缓存头
```json
// edgeone.json
{
  "source": "/assets/*",
  "headers": [{
    "key": "Cache-Control",
    "value": "public, max-age=31536000, immutable"
  }]
}
```

## 参考资源

- [Astro 性能优化](https://docs.astro.build/en/guides/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [Page Speed Insights](https://pagespeed.web.dev/)
