## 更换方案

将 Twikoo 脚本从 jsDelivr CDN 更换为 npmmirror（淘宝镜像），提升国内访问速度。

### 更改内容
- 原地址：`https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.min.js`
- 新地址：`https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.min.js`

### 优势
- npmmirror 国内访问速度更快
- 与 npm 官方同步
- 适合国内用户访问

### 文件修改
- `src/components/Comment.astro` 中的 `scriptUrl` 配置