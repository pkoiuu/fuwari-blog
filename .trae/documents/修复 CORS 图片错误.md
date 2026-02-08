## 问题分析
外部图片设置了 crossorigin="anonymous"，但 CDN 服务器未配置 CORS 头，导致加载失败。

## 解决方案
移除外部图片的 crossorigin 属性，因为博客图片只是展示，不需要跨域操作。

## 修改内容
修改 src/components/misc/ImageWrapper.astro：
- 移除第99行的 crossorigin="anonymous"
- 添加图片错误处理，显示占位符

## 验证
构建后预览，检查控制台是否还有 CORS 错误