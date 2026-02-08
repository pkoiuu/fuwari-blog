## 优化内容

### 1. 添加字体文件缓存
```json
{
  "source": "/fonts/*",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
}
```

### 2. 添加 favicon 缓存（7天）
```json
{
  "source": "/favicon/*",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, must-revalidate" }]
}
```

### 3. 延长 pagefind 缓存到 7天
```json
"public, max-age=604800, must-revalidate"
```

### 4. 添加 CORS 头
```json
{
  "source": "/assets/*",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
    { "key": "Access-Control-Allow-Origin", "value": "*" }
  ]
}
```

### 5. 添加 Vary 头
```json
{
  "source": "/*",
  "headers": [
    { "key": "Vary", "value": "Accept-Encoding" }
  ]
}
```

### 6. 延长文章页面缓存到 24小时
```json
"public, max-age=86400, must-revalidate"
```

## 修改文件
- edgeone.json