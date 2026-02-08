## 部署方案

### 方案一：Nginx 静态托管（推荐）

**适用场景**: 有独立服务器/VPS

**步骤**:
1. 服务器安装 Nginx
2. 构建项目生成 dist 目录
3. 配置 Nginx 站点
4. 上传 dist 目录到服务器
5. 配置 SSL 证书

**优点**: 简单、性能高、成本低

---

### 方案二：Docker 容器部署

**适用场景**: 使用 Docker 或 K8s

**步骤**:
1. 创建 Dockerfile
2. 使用 Nginx/Alpine 镜像
3. 构建并推送镜像
4. 在服务器运行容器

**优点**: 环境一致、易于迁移

---

### 方案三：Cloudflare Workers/Pages

**适用场景**: 想保持边缘部署但换平台

**步骤**:
1. 安装 Wrangler CLI
2. 配置 wrangler.toml
3. 使用 `wrangler pages deploy`

**优点**: 全球 CDN、免费额度高

---

### 方案四：Vercel/Netlify 迁移

**适用场景**: 不想维护服务器

**步骤**:
1. 导入 Git 仓库
2. 配置构建设置
3. 自动部署

**优点**: 零运维、自动 HTTPS

---

## 推荐方案：Nginx 静态托管

### 需要执行的操作：

1. **服务器准备**
   - 安装 Nginx
   - 配置防火墙 (80/443)
   - 准备域名解析

2. **项目配置修改**
   - 修改 `astro.config.mjs` 中的 `site` 为你的域名
   - 可选：添加 `adapter` 配置

3. **Nginx 配置**
   - 站点配置文件
   - SSL 证书配置
   - 缓存策略 (参考 edgeone.json)
   - Gzip 压缩
   - 安全响应头

4. **部署脚本**
   - 本地构建
   - 上传到服务器 (rsync/scp)
   - 可选：GitHub Actions 自动部署

5. **可选增强**
   - 配置 CDN (Cloudflare/阿里云 CDN)
   - 设置自动备份
   - 监控告警

---

## 请确认

1. 你使用哪种服务器？（VPS/云服务器/家用服务器）
2. 服务器操作系统？（Ubuntu/CentOS/Debian）
3. 是否有域名和 SSL 证书？
4. 是否需要自动部署（CI/CD）？

确认后我将为你提供详细的配置步骤和脚本。