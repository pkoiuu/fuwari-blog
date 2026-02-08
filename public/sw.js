/**
 * Service Worker - 本地资源缓存
 * 策略：首次网络优先，后续缓存优先，后台静默更新
 * 缓存有效期：3600秒（1小时）
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `fuwari-cache-${CACHE_VERSION}`;

// 缓存有效期（毫秒）
const CACHE_MAX_AGE = 3600 * 1000; // 1小时

// 需要缓存的资源类型
const CACHEABLE_EXTENSIONS = [
  '.html', '.css', '.js', '.json',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.otf'
];

// 不缓存的路径
const EXCLUDE_PATHS = [
  '/api/',
  '/admin/',
  '/sw.js',
  '/monitor'
];

/**
 * 判断请求是否应该缓存
 */
function shouldCache(request) {
  const url = new URL(request.url);
  
  // 只缓存同源请求
  if (url.origin !== self.location.origin) {
    return false;
  }
  
  // 不缓存特定路径
  if (EXCLUDE_PATHS.some(path => url.pathname.startsWith(path))) {
    return false;
  }
  
  // 只缓存 GET 请求
  if (request.method !== 'GET') {
    return false;
  }
  
  // 检查文件扩展名
  const hasCacheableExt = CACHEABLE_EXTENSIONS.some(ext => 
    url.pathname.toLowerCase().endsWith(ext)
  );
  
  // 没有扩展名的路径（如 /posts/xxx/）也缓存（HTML页面）
  const hasNoExt = !url.pathname.includes('.') || url.pathname.endsWith('/');
  
  return hasCacheableExt || hasNoExt;
}

/**
 * 获取缓存的元数据
 */
async function getCacheMetadata(cache, request) {
  const response = await cache.match(request);
  if (!response) return null;
  
  const timestamp = response.headers.get('x-cache-timestamp');
  if (!timestamp) return null;
  
  return {
    timestamp: parseInt(timestamp, 10),
    age: Date.now() - parseInt(timestamp, 10)
  };
}

/**
 * 检查缓存是否过期
 */
function isCacheExpired(metadata) {
  if (!metadata) return true;
  return metadata.age > CACHE_MAX_AGE;
}

/**
 * 克隆响应并添加时间戳
 */
function addTimestampToResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('x-cache-timestamp', Date.now().toString());
  headers.set('x-cache-version', CACHE_VERSION);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

/**
 * 安装事件 - 预缓存核心资源
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  // 跳过等待，立即激活
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache opened');
      // 预缓存核心资源（可选）
      // return cache.addAll(['/']);
    })
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('fuwari-cache-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // 接管所有客户端
      return self.clients.claim();
    })
  );
});

/**
 * 获取缓存统计信息
 */
async function getCacheStats() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  let totalSize = 0;
  const entries = [];
  
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      const size = blob.size;
      totalSize += size;
      
      const timestamp = response.headers.get('x-cache-timestamp');
      entries.push({
        url: request.url,
        size: size,
        timestamp: timestamp ? parseInt(timestamp, 10) : null,
        age: timestamp ? Date.now() - parseInt(timestamp, 10) : null
      });
    }
  }
  
  return {
    version: CACHE_VERSION,
    entryCount: keys.length,
    totalSize: totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    entries: entries
  };
}

/**
 * 清理过期缓存
 */
async function cleanupExpiredCache() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let deletedCount = 0;
  
  for (const request of keys) {
    const metadata = await getCacheMetadata(cache, request);
    if (isCacheExpired(metadata)) {
      await cache.delete(request);
      deletedCount++;
    }
  }
  
  return { deleted: deletedCount };
}

/**
 * 获取请求 - 智能缓存策略
 */
async function fetchWithCache(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // 检查缓存
  const cachedResponse = await cache.match(request);
  const metadata = await getCacheMetadata(cache, request);
  
  // 如果有有效缓存，先返回缓存，然后后台更新
  if (cachedResponse && !isCacheExpired(metadata)) {
    console.log('[SW] Cache hit:', request.url);
    
    // 后台更新缓存（Stale-While-Revalidate）
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, addTimestampToResponse(networkResponse.clone()));
        console.log('[SW] Background update:', request.url);
      }
    }).catch(() => {
      // 网络请求失败，使用缓存
    });
    
    return cachedResponse;
  }
  
  // 缓存未命中或已过期，走网络请求
  console.log('[SW] Cache miss/expired:', request.url);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && shouldCache(request)) {
      // 缓存新响应
      cache.put(request, addTimestampToResponse(networkResponse.clone()));
      console.log('[SW] Cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network error:', error);
    
    // 网络失败，返回过期缓存（如果有）
    if (cachedResponse) {
      console.log('[SW] Serving stale cache:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * 获取请求事件
 */
self.addEventListener('fetch', (event) => {
  // 只处理应该缓存的请求
  if (!shouldCache(event.request)) {
    return;
  }
  
  event.respondWith(fetchWithCache(event.request));
});

/**
 * 消息事件 - 处理来自主线程的命令
 */
self.addEventListener('message', async (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'GET_STATUS':
      const stats = await getCacheStats();
      event.ports[0]?.postMessage({
        type: 'STATUS',
        payload: {
          ...stats,
          status: 'active',
          cacheName: CACHE_NAME,
          maxAge: CACHE_MAX_AGE
        }
      });
      break;
      
    case 'CLEAR_CACHE':
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      await Promise.all(keys.map(key => cache.delete(key)));
      event.ports[0]?.postMessage({
        type: 'CACHE_CLEARED',
        payload: { deleted: keys.length }
      });
      break;
      
    case 'CLEANUP_EXPIRED':
      const result = await cleanupExpiredCache();
      event.ports[0]?.postMessage({
        type: 'CLEANUP_RESULT',
        payload: result
      });
      break;
      
    case 'REFRESH_CACHE':
      // 强制刷新特定 URL
      if (payload?.url) {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(payload.url);
        
        try {
          const response = await fetch(payload.url);
          if (response.ok) {
            cache.put(payload.url, addTimestampToResponse(response.clone()));
            event.ports[0]?.postMessage({
              type: 'REFRESHED',
              payload: { url: payload.url, success: true }
            });
          }
        } catch (error) {
          event.ports[0]?.postMessage({
            type: 'REFRESHED',
            payload: { url: payload.url, success: false, error: error.message }
          });
        }
      }
      break;
  }
});

console.log('[SW] Service Worker loaded');
