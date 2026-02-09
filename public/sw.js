/**
 * Service Worker - 本地资源缓存 + 外部资源缓存
 * 策略：首次网络优先，后续缓存优先，后台静默更新
 * 本地缓存有效期：3600秒（1小时）
 * 外部资源缓存：永久缓存（头像、Twikoo JS、自定义CDN）
 */

const CACHE_VERSION = "v2";
const CACHE_NAME = `fuwari-cache-${CACHE_VERSION}`;

// 本地资源缓存有效期（毫秒）
const CACHE_MAX_AGE = 3 * 3600 * 1000; // 3小时

// 外部资源永久缓存（不设置过期时间）
const _EXTERNAL_CACHE_MAX_AGE = Number.POSITIVE_INFINITY;

// 需要缓存的资源类型
const CACHEABLE_EXTENSIONS = [
	".html",
	".css",
	".js",
	".json",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg",
	".ico",
	".woff",
	".woff2",
	".ttf",
	".otf",
];

// 不缓存的路径
const EXCLUDE_PATHS = ["/api/", "/admin/", "/sw.js", "/monitor"];

// 外部资源白名单 - 这些域名的资源会被缓存
const EXTERNAL_CACHE_WHITELIST = [
	"s4.zstatic.net", // Twikoo CDN
	"weavatar.com", // 头像服务
	"photo.xiangming.site", // BLOGS·CN 图片
	"kpkcdn.hhj520.top", // 自定义 CDN 1
	"cdnkp.hhj520.top", // 自定义 CDN 2
];

// 预缓存的外部资源（安装时缓存）
const PRECACHE_EXTERNAL_RESOURCES = [
	"https://s4.zstatic.net/npm/twikoo@1.6.44/dist/twikoo.min.js",
];

/**
 * 判断请求是否应该缓存
 */
function shouldCache(request) {
	const url = new URL(request.url);

	// 只缓存 GET 请求
	if (request.method !== "GET") {
		return false;
	}

	// 不缓存特定路径（仅限同源）
	if (
		url.origin === self.location.origin &&
		EXCLUDE_PATHS.some((path) => url.pathname.startsWith(path))
	) {
		return false;
	}

	// 同源请求 - 正常缓存
	if (url.origin === self.location.origin) {
		// 检查文件扩展名
		const hasCacheableExt = CACHEABLE_EXTENSIONS.some((ext) =>
			url.pathname.toLowerCase().endsWith(ext),
		);
		// 没有扩展名的路径（如 /posts/xxx/）也缓存（HTML页面）
		const hasNoExt = !url.pathname.includes(".") || url.pathname.endsWith("/");
		return hasCacheableExt || hasNoExt;
	}

	// 外部请求 - 检查是否在白名单中
	const isWhitelisted = EXTERNAL_CACHE_WHITELIST.some(
		(domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
	);

	if (isWhitelisted) {
		// 检查文件扩展名
		const hasCacheableExt = CACHEABLE_EXTENSIONS.some((ext) =>
			url.pathname.toLowerCase().endsWith(ext),
		);
		return hasCacheableExt;
	}

	return false;
}

/**
 * 判断是否为外部资源
 */
function isExternalResource(request) {
	const url = new URL(request.url);
	return url.origin !== self.location.origin;
}

/**
 * 判断是否为永久缓存资源
 */
function isPermanentCacheResource(request) {
	const url = new URL(request.url);
	const hostname = url.hostname;

	// 头像和 Twikoo JS 永久缓存
	return (
		hostname === "weavatar.com" ||
		hostname === "s4.zstatic.net" ||
		hostname === "kpkcdn.hhj520.top" ||
		hostname === "cdnkp.hhj520.top"
	);
}

/**
 * 获取缓存的元数据
 */
async function getCacheMetadata(cache, request) {
	const response = await cache.match(request);
	if (!response) return null;

	const timestamp = response.headers.get("x-cache-timestamp");
	if (!timestamp) return null;

	return {
		timestamp: Number.parseInt(timestamp, 10),
		age: Date.now() - Number.parseInt(timestamp, 10),
	};
}

/**
 * 检查缓存是否过期
 */
function isCacheExpired(metadata, request) {
	if (!metadata) return true;

	// 永久缓存资源永不过期
	if (isPermanentCacheResource(request)) {
		return false;
	}

	return metadata.age > CACHE_MAX_AGE;
}

/**
 * 克隆响应并添加时间戳
 */
function addTimestampToResponse(response) {
	const headers = new Headers(response.headers);
	headers.set("x-cache-timestamp", Date.now().toString());
	headers.set("x-cache-version", CACHE_VERSION);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: headers,
	});
}

/**
 * 安装事件 - 预缓存核心资源
 */
self.addEventListener("install", (event) => {
	console.log("[SW] Installing...");

	// 跳过等待，立即激活
	self.skipWaiting();

	event.waitUntil(
		caches.open(CACHE_NAME).then(async (cache) => {
			console.log("[SW] Cache opened");

			// 预缓存外部资源
			if (PRECACHE_EXTERNAL_RESOURCES.length > 0) {
				console.log("[SW] Pre-caching external resources...");
				for (const url of PRECACHE_EXTERNAL_RESOURCES) {
					try {
						const response = await fetch(url, { mode: "no-cors" });
						if (response) {
							await cache.put(url, addTimestampToResponse(response.clone()));
							console.log("[SW] Pre-cached:", url);
						}
					} catch (error) {
						console.warn("[SW] Failed to pre-cache:", url, error);
					}
				}
			}
		}),
	);
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener("activate", (event) => {
	console.log("[SW] Activating...");

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter(
							(name) => name.startsWith("fuwari-cache-") && name !== CACHE_NAME,
						)
						.map((name) => {
							console.log("[SW] Deleting old cache:", name);
							return caches.delete(name);
						}),
				);
			})
			.then(() => {
				// 接管所有客户端
				return self.clients.claim();
			}),
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

			const timestamp = response.headers.get("x-cache-timestamp");
			entries.push({
				url: request.url,
				size: size,
				timestamp: timestamp ? Number.parseInt(timestamp, 10) : null,
				age: timestamp ? Date.now() - Number.parseInt(timestamp, 10) : null,
				isExternal: isExternalResource(request),
				isPermanent: isPermanentCacheResource(request),
			});
		}
	}

	return {
		version: CACHE_VERSION,
		entryCount: keys.length,
		totalSize: totalSize,
		totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
		entries: entries,
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
		// 永久缓存资源不清理
		if (isPermanentCacheResource(request)) {
			continue;
		}
		if (isCacheExpired(metadata, request)) {
			await cache.delete(request);
			deletedCount++;
		}
	}

	return { deleted: deletedCount };
}

/**
 * 获取请求 - 智能缓存策略
 * 策略：始终优先使用缓存（包括过期缓存），后台静默更新
 */
async function fetchWithCache(request) {
	const cache = await caches.open(CACHE_NAME);
	const isExternal = isExternalResource(request);
	const isPermanent = isPermanentCacheResource(request);

	// 检查缓存
	const cachedResponse = await cache.match(request);
	const metadata = await getCacheMetadata(cache, request);
	const expired = isCacheExpired(metadata, request);

	// 如果有缓存（无论是否过期），先返回缓存
	if (cachedResponse) {
		if (!expired) {
			console.log("[SW] Cache hit:", request.url);
		} else {
			console.log("[SW] Cache expired, serving stale:", request.url);
		}

		// 永久缓存资源不后台更新
		if (!isPermanent) {
			// 后台更新缓存（Stale-While-Revalidate）
			fetch(request, isExternal ? { mode: "no-cors" } : {})
				.then((networkResponse) => {
					if (
						networkResponse &&
						(networkResponse.ok || networkResponse.type === "opaque")
					) {
						cache.put(request, addTimestampToResponse(networkResponse.clone()));
						console.log("[SW] Background update:", request.url);
					}
				})
				.catch(() => {
					// 网络请求失败，保持现有缓存
				});
		}

		return cachedResponse;
	}

	// 缓存未命中，走网络请求
	console.log("[SW] Cache miss:", request.url);

	try {
		// 外部资源使用 no-cors 模式
		const fetchOptions = isExternal ? { mode: "no-cors" } : {};
		const networkResponse = await fetch(request, fetchOptions);

		if (
			networkResponse &&
			(networkResponse.ok || networkResponse.type === "opaque") &&
			shouldCache(request)
		) {
			// 缓存新响应
			cache.put(request, addTimestampToResponse(networkResponse.clone()));
			console.log("[SW] Cached:", request.url);
		}

		return networkResponse;
	} catch (error) {
		console.error("[SW] Network error:", error);
		throw error;
	}
}

/**
 * 获取请求事件
 */
self.addEventListener("fetch", (event) => {
	// 只处理应该缓存的请求
	if (!shouldCache(event.request)) {
		return;
	}

	event.respondWith(fetchWithCache(event.request));
});

/**
 * 消息事件 - 处理来自主线程的命令
 */
self.addEventListener("message", async (event) => {
	const { type, payload } = event.data || {};

	switch (type) {
		case "GET_STATUS": {
			const stats = await getCacheStats();
			event.ports[0]?.postMessage({
				type: "STATUS",
				payload: {
					...stats,
					status: "active",
					cacheName: CACHE_NAME,
					maxAge: CACHE_MAX_AGE,
					externalWhitelist: EXTERNAL_CACHE_WHITELIST,
				},
			});
			break;
		}

		case "CLEAR_CACHE": {
			const cache = await caches.open(CACHE_NAME);
			const keys = await cache.keys();
			await Promise.all(keys.map((key) => cache.delete(key)));
			event.ports[0]?.postMessage({
				type: "CACHE_CLEARED",
				payload: { deleted: keys.length },
			});
			break;
		}

		case "CLEANUP_EXPIRED": {
			const result = await cleanupExpiredCache();
			event.ports[0]?.postMessage({
				type: "CLEANUP_RESULT",
				payload: result,
			});
			break;
		}

		case "REFRESH_CACHE":
			// 强制刷新特定 URL
			if (payload?.url) {
				const cache = await caches.open(CACHE_NAME);
				await cache.delete(payload.url);

				try {
					const isExternal = isExternalResource(new Request(payload.url));
					const fetchOptions = isExternal ? { mode: "no-cors" } : {};
					const response = await fetch(payload.url, fetchOptions);
					if (response && (response.ok || response.type === "opaque")) {
						cache.put(payload.url, addTimestampToResponse(response.clone()));
						event.ports[0]?.postMessage({
							type: "REFRESHED",
							payload: { url: payload.url, success: true },
						});
					}
				} catch (error) {
					event.ports[0]?.postMessage({
						type: "REFRESHED",
						payload: { url: payload.url, success: false, error: error.message },
					});
				}
			}
			break;
	}
});

console.log("[SW] Service Worker loaded with external cache support");
