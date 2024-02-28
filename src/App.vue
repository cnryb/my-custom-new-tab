<script setup lang="ts">

</script>

<template>
	<div class="root-container">
		<!-- <img src="chrome-search://ntpicon/?size=48@1.000000x&amp;url=https://wiki.zhaopin.com/"> -->
		<img :src="test" >
	</div>
</template>

<script setup lang="ts">
import { onMounted,ref } from "vue";

const test = ref('')
function getFaviconUrl(url) {
  let faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
  faviconUrl.searchParams.append('pageUrl', url);
  faviconUrl.searchParams.append('size', '32');
  return faviconUrl.href;
}

test.value = getFaviconUrl('https://github.com/')
onMounted(async () => {
	console.log('App mounted');
	const mostVisitedURLs:{title:string;url:string}[] = await chrome.topSites.get();

	console.log(mostVisitedURLs);
});
</script>

<style scoped>
.root-container {
	background-color: #242424;
}
</style>
