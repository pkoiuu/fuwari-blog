## 问题分析

License.astro 组件中文章链接显示不正常：

**问题代码**（第 29-31 行）：
```astro
<a href={`/posts/${slug}/`} class="link text-[var(--primary)] break-all">
    {typeof window !== 'undefined' ? window.location.origin : ''}/posts/{slug}/
</a>
```

**原因**：
- 服务端渲染时 `window` 对象不存在
- 导致链接文本显示为 `/posts/{slug}/` 而不是完整的 URL

## 修复方案

使用 Astro 的 `Astro.url` 在服务端获取当前域名，确保 SSR 和 CSR 都能正确显示：

```astro
---
// 构建完整的文章 URL
const siteUrl = Astro.site ? Astro.site.toString().replace(/\/$/, '') : '';
const postPath = `/posts/${slug}/`;
const fullPostUrl = siteUrl + postPath;
---

<a href={postPath} class="link text-[var(--primary)] break-all">
    {fullPostUrl}
</a>
```

## 修改文件

**src/components/misc/License.astro**

- 修改链接显示逻辑
- 使用 Astro.site 构建完整 URL
- 确保 SSR 时也能正确显示