<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		result = [];
		return;
	}

	// 如果 Pagefind 未加载，先尝试初始化
	if (!pagefindLoaded && !initialized) {
		await initSearch();
	}

	isSearching = true;
	if (import.meta.env.DEV) {
		result = fakeResult;
	} else {
		if (!pagefindLoaded) {
			console.warn("Pagefind not loaded, using fallback.");
			result = [];
			isSearching = false;
			return;
		}
		try {
			const search = await window.pagefind.search(keyword);
			result = await Promise.all(
				search.results.slice(0, 5).map((r: any) => r.data()),
			);
		} catch (error) {
			console.error("Search error:", error);
			result = [];
		}
	}
	isSearching = false;
};

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const handleSearch = (keyword: string, isDesktop: boolean): void => {
	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}
	searchTimeout = setTimeout(() => {
		search(keyword, isDesktop);
	}, 150); // 添加防抖，减少搜索频率
};

// 搜索初始化
async function initSearch(): Promise<void> {
	if (initialized) return;
	initialized = true;

	if (import.meta.env.DEV) {
		console.log("Search initialized (dev mode)");
		return;
	}

	// 预加载 Pagefind
	try {
		if (typeof window !== 'undefined' && window.pagefind) {
			pagefindLoaded = true;
			console.log("Pagefind already loaded");
		} else {
			// 等待 Pagefind 加载
			await new Promise<void>((resolve) => {
				const checkPagefind = () => {
					if (typeof window !== 'undefined' && window.pagefind) {
						pagefindLoaded = true;
						resolve();
					} else {
						setTimeout(checkPagefind, 100);
					}
				};
				checkPagefind();
			});
		}
	} catch (error) {
		console.warn("Pagefind init error:", error);
	}
}

// 延迟初始化标志
let searchTriggered = false;

// 延迟初始化 Pagefind
const lazyInitSearch = () => {
	if (initialized || searchTriggered) return;
	searchTriggered = true;
	
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	if (import.meta.env.DEV) {
		initializeSearch();
	} else {
		// 延迟加载 Pagefind，使用 requestIdleCallback
		const initWhenIdle = () => {
			if (typeof window !== 'undefined' && window.pagefind) {
				initializeSearch();
			} else {
				document.addEventListener("pagefindready", initializeSearch, { once: true });
				document.addEventListener("pagefindloaderror", initializeSearch, { once: true });
			}
		};
		
		if ('requestIdleCallback' in window) {
			requestIdleCallback(initWhenIdle, { timeout: 3000 });
		} else {
			setTimeout(initWhenIdle, 1000);
		}
	}
};

onMount(() => {
	// 监听搜索输入框聚焦事件，延迟初始化
	const searchBar = document.getElementById('search-bar');
	const searchSwitch = document.getElementById('search-switch');
	
	if (searchBar) {
		searchBar.addEventListener('focusin', lazyInitSearch, { once: true });
	}
	if (searchSwitch) {
		searchSwitch.addEventListener('click', lazyInitSearch, { once: true });
	}
	
	// 预加载 hint：如果用户鼠标悬停在搜索按钮上，提前初始化
	if (searchSwitch) {
		searchSwitch.addEventListener('mouseenter', () => {
			if (!initialized && !searchTriggered) {
				setTimeout(lazyInitSearch, 100);
			}
		}, { once: true });
	}
});
</script>

<!-- search bar for desktop -->
<div id="search-bar" class="hidden lg:flex items-center h-11 rounded-full bg-black/[0.04] dark:bg-white/5 hover:bg-black/[0.06] hover:dark:bg-white/10 transition-all duration-300 px-4 cursor-text"
     on:click={() => document.getElementById('search-input-desktop')?.focus()}
     on:focusin={() => setPanelVisibility(true, true)}
     on:focusout={() => setPanelVisibility(false, true)}
>
    <Icon name="material-symbols:search-rounded" class="text-xl text-black/30 dark:text-white/30 transition"></Icon>
    <input id="search-input-desktop" type="text" placeholder={i18n(I18nKey.search)} bind:value={keywordDesktop}
           on:input={() => handleSearch(keywordDesktop, true)}
           class="input-reset ml-2 text-sm text-black/50 dark:text-white/50 placeholder-black/30 dark:placeholder-white/30 bg-transparent outline-none w-24 focus:w-48 transition-all duration-300"
    >
</div>

<!-- toggle btn for phone/tablet -->
<button id="search-switch" aria-label="Search" class="btn-plain scale-animation rounded-lg h-11 w-11 lg:hidden"
        on:click={() => togglePanel()}
>
    <Icon name="material-symbols:search-rounded" class="text-2xl"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed absolute z-50 right-0 top-20 w-[calc(100vw-2rem)] lg:w-[30rem] max-w-[30rem] rounded-2xl p-4 bg-[var(--card-bg)] transition shadow-xl border border-[var(--line-divider)]">
    <!-- search input for phone/tablet -->
    <div class="flex lg:hidden items-center h-10 rounded-full bg-black/[0.04] dark:bg-white/5 px-4 mb-4">
        <Icon name="material-symbols:search-rounded" class="text-lg text-black/30 dark:text-white/30 transition"></Icon>
        <input type="text" placeholder={i18n(I18nKey.search)} bind:value={keywordMobile}
               on:input={() => handleSearch(keywordMobile, false)}
               class="input-reset ml-2 text-sm text-black/50 dark:text-white/50 placeholder-black/30 dark:placeholder-white/30 bg-transparent outline-none w-full"
        >
    </div>

    <!-- search results -->
    <div class="max-h-[60vh] overflow-y-auto">
        {#if isSearching}
            <div class="flex items-center justify-center py-8 text-black/30 dark:text-white/30">
                <Icon name="material-symbols:sync-rounded" class="text-2xl animate-spin"></Icon>
                <span class="ml-2">{i18n(I18nKey.searching)}...</span>
            </div>
        {:else if result.length > 0}
            <div class="space-y-2">
                {#each result as item}
                    <a href={item.url} class="block p-3 rounded-xl hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition-colors">
                        <div class="font-medium text-[var(--primary)] line-clamp-1">{item.meta.title}</div>
                        <div class="text-sm text-black/50 dark:text-white/50 line-clamp-2 mt-1">{@html item.excerpt}</div>
                    </a>
                {/each}
            </div>
        {:else if keywordDesktop || keywordMobile}
            <div class="text-center py-8 text-black/30 dark:text-white/30">
                {i18n(I18nKey.noResultsFound)}
            </div>
        {:else}
            <div class="text-center py-8 text-black/30 dark:text-white/30">
                {i18n(I18nKey.typeToSearch)}
            </div>
        {/if}
    </div>
</div>
