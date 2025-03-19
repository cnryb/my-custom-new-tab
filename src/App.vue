<template>
	<div class="root-container">
		<!-- <div class="item" v-for="item in mostVisitedURLs " @click="onClickItem(item)" :href="item.url">
			<img :src="getFaviconUrl(item.url)" :alt="`${item.title} ${item.url}`">
			<div>
				{{ item.title }}
			</div>
		</div> -->

		<!-- <button @click="onClickItem({ url: '', title: '' })">TEST2</button> -->
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

function getFaviconUrl(url: string) {
	let faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
	faviconUrl.searchParams.append('pageUrl', url);
	faviconUrl.searchParams.append('size', '48');
	return faviconUrl.href;
}

onMounted(async () => {
	// const urls = await chrome.topSites.get();
	// mostVisitedURLs.value = urls.slice(0, 6);
	
	// 发送消息
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
});
</script>

<style scoped>
.root-container {
	background-color: #242424;
	display: flex;
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
