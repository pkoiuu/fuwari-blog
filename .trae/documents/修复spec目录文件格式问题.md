# 修复spec目录文件格式问题

## 问题分析

通过对比 `src/content/posts/520.md` 的正确格式，我发现 `src/content/spec/` 目录中的文件存在以下问题：

1. **`page-1770175976.592511.md`**：
   - `title` 和 `published` 之间有多余的空行
   - 使用了多行 `description` 语法 `>`，与参考格式不符

2. **`about.md`**：
   - 完全缺少frontmatter，只有内容

3. **其他文件**：
   - 大部分文件格式看起来正确，但需要统一验证

## 修复方案

参考 `src/content/posts/520.md` 的格式，对所有 `src/content/spec/` 目录中的文件进行以下修复：

### 1. 修复 `page-1770175976.592511.md`
- 移除 `title` 和 `published` 之间的多余空行
- 将多行 `description` 改为单行格式

### 2. 修复 `about.md`
- 添加完整的frontmatter，包含：
  - `title: "About"`
  - `published: 2024-01-01`（使用默认日期）
  - `description: "关于网站"`
  - `tags: - Uncategorized`
  - `category: "Uncategorized"`
  - `draft: false`

### 3. 验证其他文件
- 检查所有其他文件的frontmatter格式
- 确保与参考格式一致，无多余空行
- 确保所有必要字段都存在

## 修复标准

所有文件的frontmatter应遵循以下格式：

```yaml
---
title: "标题"
published: YYYY-MM-DD
description: "描述"
tags:
  - Uncategorized
category: "分类"
draft: false
---
```

- 无多余空行
- `description` 使用单行格式
- 所有必要字段完整
- 缩进和格式一致