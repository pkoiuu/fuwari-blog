## 问题分析

错误原因：

1. `SyntaxError: Cannot use 'import.meta' outside a module` - pagefind.js 是 ES 模块，需要使用 `type="module"` 加载
2. `Pagefind script loaded but window.pagefind not found` - 由于语法错误，脚本没有正确执行

## 修复方案

修改 Navbar.astro 中的加载逻辑：

1. 使用 `type="module"` 的 script 标签加载
2. 或者使用动态 `import()` 并添加错误处理
3. 添加重试机制防止 ERR\_ABORTED

## 修改文件

**src/components/Navbar.astro**

使用动态 import 方式，但添加：

* AbortController 支持取消请求

* 重试机制

* 更好的错误处理

