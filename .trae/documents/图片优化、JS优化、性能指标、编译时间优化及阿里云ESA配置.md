## 优化内容

### 1. 响应式图片懒加载占位符

**修改文件**: src/components/misc/ImageWrapper.astro

**优化点**:
- 添加响应式图片支持（srcset）
- 实现懒加载占位符（低质量模糊图或骨架屏）
- 使用 Intersection Observer 延迟加载
- 添加加载动画过渡效果

### 2. JavaScript 优化

**修改文件**:
- astro.config.mjs - 优化构建配置
- src/components/Search.svelte - 延迟初始化
- src/components/Comment.astro - 进一步优化加载

**优化点**:
- 减少第三方脚本阻塞
- 使用 defer/async 加载非关键 JS
- 优化组件初始化时机

### 3. 性能指标 (Core Web Vitals)

**修改文件**:
- src/layouts/Layout.astro - 添加性能监控

**优化点**:
- 添加 Web Vitals 监控脚本
- 记录 LCP、FID、CLS 指标
- 输出到控制台或发送到分析服务

### 4. 降低编译时间

**修改文件**: astro.config.mjs

**优化点**:
- 启用持久化缓存
- 优化 Vite 配置
- 减少不必要的插件处理
- 启用并行构建

## 实施步骤

1. 修改 ImageWrapper.astro - 响应式图片 + 懒加载
2. 修改 astro.config.mjs - 编译优化 + JS优化
3. 修改 Layout.astro - 性能指标监控
4. 优化 Search.svelte 和 Comment.astro
5. 构建测试验证编译时间