/**
 * Service Worker - 本地资源缓存
 * 策略：本地资源缓存优先，外部资源不拦截
 */

const CACHE_VERSION = "v6";
const CACHE_NAME = `fuwari-cache-${CACHE_VERSION}`;
const CACHE_MAX_AGE = 3 * 3600 * 1000; // 3小时

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

/**
 * 判断请求是否应该缓存
 */
function shouldCache(request) {
	const url = new URL(request.url);

	if (request.method !== "GET") return false;

	// 只缓存同源请求
	if (url.origin !== self.location.origin) return false;

	// 不缓存特定路径
	if (EXCLUDE_PATHS.some((path) => url.pathname.startsWith(path))) return false;

	const hasCacheableExt = CACHEABLE_EXTENSIONS.some((ext) =>
		url.pathname.toLowerCase().endsWith(ext),
	);
	const hasNoExt = !url.pathname.includes(".") || url.pathname.endsWith("/");

	return hasCacheableExt || hasNoExt;
}

/**
 * 克隆响应并添加时间戳
 */
function addTimestampToResponse(response) {
	const headers = new Headers(response.headers);
	headers.set("x-cache-timestamp", Date.now().toString());
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: headers,
	});
}

/**
 * 安装事件
 */
self.addEventListener("install", (_event) => {
	console.log("[SW] Installing...");
	self.skipWaiting();
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
						.map((name) => caches.delete(name)),
				);
			})
			.then(() => self.clients.claim()),
	);
});

/**
 * 获取请求 - 缓存策略
 */
async function fetchWithCache(request) {
	const cache = await caches.open(CACHE_NAME);
	const cachedResponse = await cache.match(request);

	if (cachedResponse) {
		const timestamp = cachedResponse.headers.get("x-cache-timestamp");
		const age = timestamp
			? Date.now() - Number.parseInt(timestamp, 10)
			: Number.POSITIVE_INFINITY;

		if (age < CACHE_MAX_AGE) {
			// 缓存有效，直接返回
			return cachedResponse;
		}

		// 缓存过期，后台更新
		fetch(request)
			.then((networkResponse) => {
				if (networkResponse?.ok) {
					cache.put(request, addTimestampToResponse(networkResponse.clone()));
				}
			})
			.catch(() => {});

		// 返回过期缓存
		return cachedResponse;
	}

	// 缓存未命中，走网络请求
	const networkResponse = await fetch(request);
	if (networkResponse?.ok) {
		cache.put(request, addTimestampToResponse(networkResponse.clone()));
	}
	return networkResponse;
}

/**
 * 获取请求事件
 */
self.addEventListener("fetch", (event) => {
	if (!shouldCache(event.request)) return;
	event.respondWith(fetchWithCache(event.request));
});

console.log("[SW] Service Worker loaded", CACHE_VERSION);
