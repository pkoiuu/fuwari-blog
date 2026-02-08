/**
 * 缓存管理器 - 提供缓存状态监控和控制功能
 * 全局访问: window.__CACHE_MONITOR__
 */

interface CacheStatus {
	status: "active" | "inactive" | "error";
	version: string;
	cacheName: string;
	entryCount: number;
	totalSize: number;
	totalSizeMB: string;
	maxAge: number;
	entries: CacheEntry[];
}

interface CacheEntry {
	url: string;
	size: number;
	timestamp: number | null;
	age: number | null;
}

interface CacheStats {
	hitCount: number;
	missCount: number;
	totalRequests: number;
	hitRate: string;
}

class CacheManager {
	private swRegistration: ServiceWorkerRegistration | null = null;
	private stats: CacheStats = {
		hitCount: 0,
		missCount: 0,
		totalRequests: 0,
		hitRate: "0%",
	};

	/**
	 * 检查 Service Worker 是否支持
	 */
	isSupported(): boolean {
		return "serviceWorker" in navigator && "caches" in window;
	}

	/**
	 * 注册 Service Worker（延迟注册，确保页面加载完成）
	 */
	async register(delay = true): Promise<void> {
		if (!this.isSupported()) {
			console.warn("[CacheManager] Service Worker not supported");
			return;
		}

		const doRegister = async () => {
			try {
				this.swRegistration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
					updateViaCache: "imports",
				});

				console.log(
					"[CacheManager] Service Worker registered:",
					this.swRegistration.scope,
				);

				// 监听 Service Worker 状态变化
				this.swRegistration.addEventListener("updatefound", () => {
					const newWorker = this.swRegistration?.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								console.log("[CacheManager] New Service Worker available");
							}
						});
					}
				});
			} catch (error) {
				console.error("[CacheManager] Registration failed:", error);
			}
		};

		if (delay) {
			// 延迟注册策略：使用 requestIdleCallback 或 setTimeout
			if ("requestIdleCallback" in window) {
				window.requestIdleCallback(
					() => {
						doRegister();
					},
					{ timeout: 5000 },
				);
			} else {
				// 降级方案：load 事件后 3 秒注册
				if (document.readyState === "complete") {
					setTimeout(doRegister, 3000);
				} else {
					window.addEventListener("load", () => {
						setTimeout(doRegister, 3000);
					});
				}
			}
		} else {
			await doRegister();
		}
	}

	/**
	 * 向 Service Worker 发送消息
	 */
	private async sendMessage(type: string, payload?: any): Promise<any> {
		return new Promise((resolve, reject) => {
			const channel = new MessageChannel();

			channel.port1.onmessage = (event) => {
				if (event.data.error) {
					reject(event.data.error);
				} else {
					resolve(event.data);
				}
			};

			const controller = navigator.serviceWorker.controller;
			if (controller) {
				controller.postMessage({ type, payload }, [channel.port2]);
			} else {
				reject(new Error("Service Worker not active"));
			}

			// 超时处理
			setTimeout(() => {
				reject(new Error("Message timeout"));
			}, 5000);
		});
	}

	/**
	 * 获取缓存状态
	 */
	async getStatus(): Promise<CacheStatus | null> {
		try {
			const response = await this.sendMessage("GET_STATUS");
			return response.payload;
		} catch (error) {
			console.error("[CacheManager] Failed to get status:", error);
			return null;
		}
	}

	/**
	 * 获取缓存统计
	 */
	getStats(): CacheStats {
		return { ...this.stats };
	}

	/**
	 * 清理所有缓存
	 */
	async clearCache(): Promise<{ deleted: number }> {
		try {
			const response = await this.sendMessage("CLEAR_CACHE");
			console.log("[CacheManager] Cache cleared:", response.payload);
			return response.payload;
		} catch (error) {
			console.error("[CacheManager] Failed to clear cache:", error);
			throw error;
		}
	}

	/**
	 * 清理过期缓存
	 */
	async cleanupExpired(): Promise<{ deleted: number }> {
		try {
			const response = await this.sendMessage("CLEANUP_EXPIRED");
			console.log("[CacheManager] Expired cache cleaned:", response.payload);
			return response.payload;
		} catch (error) {
			console.error("[CacheManager] Failed to cleanup:", error);
			throw error;
		}
	}

	/**
	 * 刷新特定 URL 的缓存
	 */
	async refreshCache(
		url: string,
	): Promise<{ url: string; success: boolean; error?: string }> {
		try {
			const response = await this.sendMessage("REFRESH_CACHE", { url });
			console.log("[CacheManager] Cache refreshed:", response.payload);
			return response.payload;
		} catch (error) {
			console.error("[CacheManager] Failed to refresh:", error);
			throw error;
		}
	}

	/**
	 * 更新 Service Worker
	 */
	async update(): Promise<void> {
		if (this.swRegistration) {
			await this.swRegistration.update();
			console.log("[CacheManager] Service Worker update checked");
		}
	}

	/**
	 * 注销 Service Worker
	 */
	async unregister(): Promise<boolean> {
		if (this.swRegistration) {
			const result = await this.swRegistration.unregister();
			console.log("[CacheManager] Service Worker unregistered:", result);
			return result;
		}
		return false;
	}

	/**
	 * 打印缓存报告到控制台
	 */
	async printReport(): Promise<void> {
		const status = await this.getStatus();
		if (!status) {
			console.log("%c[CacheManager] Cache not active", "color: #ff6b6b");
			return;
		}

		console.group(
			"%c📦 Cache Manager Report",
			"color: #4ecdc4; font-size: 14px; font-weight: bold;",
		);

		console.log(
			"%cStatus:",
			"color: #95e1d3; font-weight: bold;",
			status.status,
		);
		console.log(
			"%cVersion:",
			"color: #95e1d3; font-weight: bold;",
			status.version,
		);
		console.log(
			"%cCache Name:",
			"color: #95e1d3; font-weight: bold;",
			status.cacheName,
		);
		console.log(
			"%cMax Age:",
			"color: #95e1d3; font-weight: bold;",
			`${status.maxAge / 1000}s`,
		);
		console.log(
			"%cEntries:",
			"color: #95e1d3; font-weight: bold;",
			status.entryCount,
		);
		console.log(
			"%cTotal Size:",
			"color: #95e1d3; font-weight: bold;",
			`${status.totalSizeMB} MB`,
		);

		if (status.entries.length > 0) {
			console.group(
				"%cCached Resources:",
				"color: #f38181; font-weight: bold;",
			);
			status.entries.forEach((entry, index) => {
				const age = entry.age
					? `${(entry.age / 1000 / 60).toFixed(1)}m`
					: "N/A";
				const size = entry.size ? `${(entry.size / 1024).toFixed(1)}KB` : "N/A";
				console.log(
					`  ${index + 1}. ${entry.url.substring(0, 60)}... (${size}, ${age})`,
				);
			});
			console.groupEnd();
		}

		console.groupEnd();
	}
}

// 创建全局实例 - 只在浏览器环境
let cacheManager: CacheManager | null = null;

// 初始化函数
function initCacheManager() {
	if (typeof window === "undefined" || typeof document === "undefined") {
		return;
	}

	// 防止重复初始化
	if ((window as any).__CACHE_MONITOR__) {
		return;
	}

	cacheManager = new CacheManager();

	// 暴露到全局
	const cacheMonitor = {
		manager: cacheManager,

		// 快捷方法
		getStatus: () => cacheManager?.getStatus(),
		getStats: () => cacheManager?.getStats(),
		clearCache: () => cacheManager?.clearCache(),
		cleanupExpired: () => cacheManager?.cleanupExpired(),
		refreshCache: (url: string) => cacheManager?.refreshCache(url),
		update: () => cacheManager?.update(),
		unregister: () => cacheManager?.unregister(),
		report: () => cacheManager?.printReport(),

		// 帮助信息
		help: () => {
			console.log(
				"%c📦 Cache Monitor API",
				"color: #4ecdc4; font-size: 16px; font-weight: bold;",
			);
			console.log("");
			console.log("%cAvailable Methods:", "color: #95e1d3; font-weight: bold;");
			console.log("  __CACHE_MONITOR__.getStatus()     - Get cache status");
			console.log("  __CACHE_MONITOR__.getStats()      - Get cache statistics");
			console.log("  __CACHE_MONITOR__.clearCache()    - Clear all cache");
			console.log("  __CACHE_MONITOR__.cleanupExpired() - Clean expired cache");
			console.log(
				"  __CACHE_MONITOR__.refreshCache(url) - Refresh specific URL",
			);
			console.log(
				"  __CACHE_MONITOR__.update()        - Update Service Worker",
			);
			console.log(
				"  __CACHE_MONITOR__.unregister()    - Unregister Service Worker",
			);
			console.log("  __CACHE_MONITOR__.report()        - Print cache report");
			console.log("  __CACHE_MONITOR__.help()          - Show this help");
		},
	};

	// 使用 Object.defineProperty 确保全局可访问
	Object.defineProperty(window, "__CACHE_MONITOR__", {
		value: cacheMonitor,
		writable: false,
		configurable: false,
		enumerable: true,
	});

	// 自动注册（延迟）
	cacheManager.register(true);

	// 注册完成后打印提示
	setTimeout(() => {
		console.log(
			"%c📦 Cache Manager loaded. Type __CACHE_MONITOR__.help() for available commands.",
			"color: #4ecdc4;",
		);
	}, 3000);
}

// 立即执行初始化
initCacheManager();

export { cacheManager, initCacheManager };
export default cacheManager;
