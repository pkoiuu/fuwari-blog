---
name: astro-blog-maintainer
description: 专门维护 Astro + Svelte 博客项目，包括优化、修复、功能开发。当用户要求优化博客、修复错误、添加功能或涉及评论系统/搜索/主题等博客相关操作时触发。
---

# Astro 博客维护专家

本 Skill 专门用于维护基于 Astro + Svelte + Tailwind CSS 的 Fuwari 博客项目。

## 触发条件

当用户出现以下需求时，必须激活本 Skill：

- 要求"优化博客"、"优化项目"
- 要求修复博客错误、功能异常
- 要求添加新功能、组件、页面
- 涉及评论系统 (Twikoo) 的操作
- 涉及搜索功能 (Pagefind) 的操作
- 涉及主题/暗黑模式的操作
- 涉及部署配置 (EdgeOne) 的操作
- 涉及性能优化的操作
- 涉及 UI/UX 改进的操作

## 项目认知

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 5.13.10 | 静态站点生成器 |
| Svelte | 5.39.8 | 交互式组件 |
| Tailwind CSS | 3.4.19 | 样式框架 |
| TypeScript | 5.9.3 | 类型安全 |
| pnpm | 9.14.4 | 包管理器 |

### 部署平台

**腾讯云 EdgeOne Pages**
- 构建命令: `pnpm run build`
- 输出目录: `./dist`
- Node.js: 24.5.0

### 关键文件位置

```
项目根目录: d:\github-git\fuwari-blog
├── PROJECT_STRUCTURE.md      # 项目结构文档 (操作前必读)
├── .trae/rules/project_rules.md  # AI 操作规则
├── edgeone.json              # 部署配置
├── astro.config.mjs          # Astro 配置
├── src/config.ts             # 站点配置
├── src/components/           # 组件目录
│   ├── Comment.astro         # 评论系统
│   ├── Search.svelte         # 搜索组件
│   ├── LightDarkSwitch.svelte # 主题切换 (已禁用)
│   ├── Navbar.astro          # 导航栏
│   └── Footer.astro          # 页脚
├── src/layouts/              # 布局
├── src/pages/                # 页面
├── src/utils/setting-utils.ts # 主题工具
└── src/content/posts/        # 博客文章
```

## 操作流程

### 阶段一：准备 (必须)

```
Step 1: 读取 PROJECT_STRUCTURE.md
        └─ 了解项目全貌、技术栈、关键配置

Step 2: 读取 .trae/rules/project_rules.md
        └─ 了解 AI 操作规则和约束

Step 3: 分析用户需求
        └─ 确定涉及哪些模块和文件

Step 4: 检查当前状态
        └─ 查看相关文件当前实现
```

### 阶段二：执行

```
Step 5: 制定方案
        └─ 规划具体修改内容

Step 6: 执行修改
        └─ 使用 SearchReplace / Write 工具

Step 7: 语法检查
        └─ 确保代码无语法错误
```

### 阶段三：验证 (必须)

```
Step 8: 本地构建测试
        └─ 运行: pnpm build
        └─ 运行: pnpm preview

Step 9: 功能验证
        └─ 确认修改功能正常
```

### 阶段四：文档维护 (必须)

```
Step 10: 更新 PROJECT_STRUCTURE.md
         └─ 如有结构/配置变更则更新

Step 11: 记录变更日志
         └─ 在文档"更新日志"部分添加记录
```

## 关键约束

### 已禁用功能 (禁止恢复)

| 功能 | 状态 | 说明 |
|------|------|------|
| 暗黑模式 | 已禁用 | 强制使用白色模式 |
| 主题切换按钮 | 已隐藏 | Navbar 中已注释 |

**相关文件**:
- `src/layouts/Layout.astro` - 强制移除 `dark` 类
- `src/components/Navbar.astro` - 隐藏切换按钮
- `src/utils/setting-utils.ts` - 强制返回亮色模式

### 禁止操作

| 禁止项 | 说明 |
|--------|------|
| 未经测试提交 | 必须 `pnpm build && pnpm preview` |
| 修改 edgeone.json 缓存 | 除非用户明确要求 |
| 恢复已禁用功能 | 如暗黑模式 |
| 忽略文档更新 | 有变更必须更新 PROJECT_STRUCTURE.md |

### 外部服务配置

| 服务 | 配置位置 | 当前状态 |
|------|----------|----------|
| Twikoo 评论 | `src/components/Comment.astro` | 使用 zstatic CDN |
| Pagefind 搜索 | 构建时自动生成 | 延迟加载 |
| WeAvatar 头像 | `src/config.ts` | 外部服务 |

## 常用操作指南

### 修改评论系统

```
1. 读取 src/components/Comment.astro
2. 检查当前 CDN 配置
3. 执行修改 (如更换 CDN)
4. 构建测试
5. 更新文档中的 CDN 信息
```

### 修改搜索功能

```
1. 读取 src/components/Search.svelte
2. 了解 Pagefind 集成方式
3. 执行修改
4. 构建测试 (会重新生成索引)
5. 验证搜索功能
```

### 修改导航/页脚

```
1. 读取 src/components/Navbar.astro 或 Footer.astro
2. 了解当前结构和链接配置
3. 执行修改
4. 构建测试
5. 更新文档中的组件说明
```

### 修改部署配置

```
1. 读取 edgeone.json
2. 了解当前缓存策略
3. 谨慎修改 (影响 CDN 性能)
4. 更新文档中的配置说明
```

### 添加新页面

```
1. 在 src/pages/ 创建 .astro 文件
2. 参考现有页面结构
3. 使用 MainGridLayout 布局
4. 如需添加到导航，修改 src/config.ts
5. 构建测试
6. 更新文档目录树
```

## 故障排查

### 构建失败

```
1. 检查 TypeScript 类型错误
2. 检查导入路径是否正确
3. 检查组件语法
4. 查看错误堆栈定位问题
```

### 评论加载失败

```
1. 检查 CDN 地址是否可访问
2. 检查 envId 配置是否正确
3. 检查网络连接
4. 考虑更换 CDN (npmmirror / zstatic / jsDelivr)
```

### 搜索功能异常

```
1. 确认已运行 pnpm build (生成索引)
2. 检查 pagefind.js 是否存在
3. 检查浏览器控制台错误
4. 验证 Pagefind 初始化
```

## 性能优化要点

1. **图片优化**: 使用 Sharp 处理，延迟加载
2. **代码分割**: 已配置 manualChunks
3. **资源内联**: 阈值 4KB
4. **延迟加载**: 评论、搜索、PhotoSwipe 使用 Intersection Observer
5. **字体优化**: 使用 font-display: swap

## 代码规范

```bash
pnpm format   # 格式化代码
pnpm lint     # 代码检查
```

## 参考链接

- [Astro 文档](https://docs.astro.build/)
- [Svelte 文档](https://svelte.dev/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Twikoo 文档](https://twikoo.js.org/)
- [Pagefind 文档](https://pagefind.app/)

---

*本 Skill 旨在确保 Astro 博客项目的维护质量和一致性。激活时必须严格遵守操作流程和约束条件。*