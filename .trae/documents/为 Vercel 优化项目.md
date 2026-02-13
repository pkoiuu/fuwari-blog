## 需求分析

用户需要同时支持：
1. **Vercel 部署** - 使用 Vercel 适配器
2. **本地部署** - 使用静态输出

## 解决方案

### 方案：条件配置
使用环境变量来切换不同的部署模式：

- `DEPLOY_TARGET=vercel` → 使用 Vercel 适配器
- `DEPLOY_TARGET=static` 或 未设置 → 使用静态输出（本地部署）

### 执行步骤

1. **安装 Vercel 适配器**（可选依赖）
   ```bash
   pnpm add -D @astrojs/vercel
   ```

2. **更新 astro.config.mjs**
   - 根据环境变量动态选择适配器
   - 保持静态输出为默认

3. **创建 vercel.json**（Vercel 特定配置）
   - 缓存头配置
   - 重定向规则

4. **更新 package.json 脚本**
   - `build` - 静态构建（本地部署）
   - `build:vercel` - Vercel 构建

5. **更新 .env 文件**（可选）
   - 提供环境变量示例

### 优点

- ✅ 一套代码，多种部署方式
- ✅ 本地部署保持简单（静态文件）
- ✅ Vercel 部署获得优化（图片、边缘函数等）
- ✅ 通过环境变量灵活切换