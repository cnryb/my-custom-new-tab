<template>
	<div class="root-container">

		<button @click="onGetProxyConfig">Get Proxy Config</button>
		<button @click="onSetProxyConfig">Set Proxy Config</button>
		<button @click="onClearProxyConfig">Clear Proxy Config</button>
		<div>
			<div>
				<span>Proxy Config</span>
				<span>{{ proxyConfig }}</span>
			</div>
			
		</div>
		<div>
			<div>
				<span>Pass List</span>
				<span>{{ passList }}</span>
			</div>
		</div>
		<div>
			<img :src="faviconURL('https://github.com/')" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Message, MessageAction } from "./type";

const proxyConfig = ref<chrome.proxy.ProxyServer | undefined>(undefined);
const passList = ref<string[] | undefined>(undefined);

// import { getUserInfo } from './utils'

// const mostVisitedURLs = ref<chrome.topSites.MostVisitedURL[]>([]);

// async function onClickItem(item: chrome.topSites.MostVisitedURL) {
// 	// console.log("onClickItem: ", chrome.identity.getRedirectURL());
// 	// 	return;
// 	// window.location.href = item.url;
// 	await getUserInfo();


// }

function faviconURL(u: string, size: number = 32): string {
	const url = new URL(chrome.runtime.getURL("/_favicon/"));
	url.searchParams.set("pageUrl", u);
	url.searchParams.set("size", `${size}`);
	return url.toString();
}

function onClearProxyConfig() {
	chrome.runtime.sendMessage(
		{ action: MessageAction.CLEAR_PROXY_CONFIG, data: null },
		(response: { success: boolean }) => {
			console.log("Service Worker 回复:", response);
			if (response.success) {
				onGetProxyConfig();
			}
		}
	);
}

function onGetProxyConfig() {
	chrome.runtime.sendMessage(
		{ action: MessageAction.GET_PROXY_CONFIG, data: null },
		(response: chrome.types.ChromeSettingGetResult<chrome.proxy.ProxyConfig>) => {
			const config: chrome.proxy.ProxyServer | undefined = response.value.rules?.singleProxy;
			proxyConfig.value = config;

			const list: string[] | undefined = response.value.rules?.bypassList;

			passList.value = list;
			console.log("Service Worker 回复:", response);
		}
	);
}

function onSetProxyConfig() {
	const config: chrome.proxy.ProxyConfig = {
		mode: "fixed_servers",
		rules: {
			singleProxy: {
				scheme: "http",
				host: "127.0.0.1",
				port: 1082
			},
			bypassList: ["localhost", "127.0.0.1", "192.168.1.100", "cnryb.com"]
		}
	};

	chrome.runtime.sendMessage(
		{ action: MessageAction.SET_PROXY_CONFIG, data: config },
		(response: { success: boolean }) => {
			console.log("Service Worker 回复:", response);
			if (response.success) {
				onGetProxyConfig();
			}
		}
	);
}

onMounted(async () => {
	// const urls = await chrome.topSites.get();
	// mostVisitedURLs.value = urls.slice(0, 6);

	onGetProxyConfig();
});
</script>

<style>
.root-container {
	background-color: #242424;
	display: flex;
	flex-direction: column;
}

.root-container .item {
	padding: 10px;
	cursor: pointer;
}

.root-container .item img {
	width: 24px;
	height: 24px;
}
</style>
