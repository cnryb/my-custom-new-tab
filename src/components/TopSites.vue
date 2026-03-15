<template>
  <div class="topsites-section" v-if="show">
    <div class="section-header">
      <h3>最常访问</h3>
      <button class="toggle-btn" @click="$emit('toggleShow')" title="隐藏最常访问">×</button>
    </div>
    <div class="topsites-grid">
      <div v-for="item in sites" :key="item.url" class="topsites-item">
        <a :href="item.url">
          <img :src="faviconURL(item.url)" :alt="item.title" class="topsites-icon" />
          <span class="topsites-title">{{ displayTitle(item) }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sites: chrome.topSites.MostVisitedURL[];
  show: boolean;
}>();
defineEmits<{ toggleShow: [] }>();

function faviconURL(u: string, size = 32): string {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", `${size}`);
  return url.toString();
}

function displayTitle(item: chrome.topSites.MostVisitedURL): string {
  if (item.title) return item.title;
  try {
    return new URL(item.url).hostname;
  } catch {
    return item.url;
  }
}
</script>

<style scoped>
.topsites-section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toggle-btn {
  padding: 2px 8px;
  font-size: 14px;
  line-height: 1;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 4px;
}

.toggle-btn:hover {
  color: var(--text-primary);
  background: var(--border-color);
}

.topsites-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
}

.topsites-item {
  width: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 12px;
  transition: background 0.15s;
}

.topsites-item:hover {
  background: var(--card-bg);
}

.topsites-item a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: inherit;
}

.topsites-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.topsites-title {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 72px;
  text-align: center;
}
</style>
