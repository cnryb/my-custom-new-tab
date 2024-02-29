<template>
	<div class="root-container">
		<div v-for="item in mostVisitedURLs " @click="onClickItem(item)">
			<img :src="getFaviconUrl(item.url)" :alt="`${item.title} ${item.url}`">
			{{ item.title }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted,ref } from "vue";

const mostVisitedURLs = ref<chrome.topSites.MostVisitedURL[]>([]);

function onClickItem(item: chrome.topSites.MostVisitedURL) {
	window.location.href = item.url;
}

function getFaviconUrl(url: string) {
  let faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
  faviconUrl.searchParams.append('pageUrl', url);
  faviconUrl.searchParams.append('size', '48');
  return faviconUrl.href;
}

onMounted(async () => {
	mostVisitedURLs.value = await chrome.topSites.get();
});
</script>

<style scoped>
.root-container {
	background-color: #242424;
}
</style>
