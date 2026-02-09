## 问题分析

`ERR_ABORTED` 错误持续出现，根本原因是：

### 1. 懒加载冲突
ImageWrapper 同时使用了：
- 浏览器原生懒加载 (`loading="lazy"`)
- Intersection Observer 懒加载

两者冲突导致图片请求被重复发起然后被取消。

### 2. Swup 页面切换
当用户导航到新页面时，Swup 会替换 DOM，可能导致正在加载的图片请求被中止。

## 修复方案

### 1. 简化 ImageWrapper 懒加载
- 移除 Intersection Observer，只使用浏览器原生 `loading="lazy"`
- 或者反过来，使用 Intersection Observer 控制 `src` 属性

### 2. 添加图片加载重试机制
- 当图片加载失败时，自动重试一次
- 避免因为瞬时网络问题导致图片显示失败

### 3. 修复 Swup 页面切换时的图片处理
- 在页面切换前完成图片加载，或延迟切换

## 具体修复步骤

1. **修改 ImageWrapper.astro** - 简化懒加载逻辑，移除 Intersection Observer
2. **本地构建测试**
3. **部署