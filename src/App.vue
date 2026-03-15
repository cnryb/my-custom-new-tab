<template>
  <div class="page">
    <div class="content">
      <SearchBar
        :search-engine="settings.searchEngine"
        @update:search-engine="onSearchEngineChange"
      />

      <ShortcutList
        :shortcuts="shortcuts"
        @add="onAddShortcut"
        @update="onUpdateShortcut"
        @delete="onDeleteShortcut"
        @reorder="onReorderShortcuts"
      />

      <TopSites
        :sites="filteredTopSites"
        :show="settings.showTopSites"
        @toggle-show="onToggleTopSites"
      />

      <div v-if="!settings.showTopSites" class="restore-topsites">
        <button class="link-btn" @click="onToggleTopSites">显示最常访问</button>
      </div>

      <ProxyPanel
        :proxy-enabled="proxyEnabled"
        :current-proxy="currentProxy"
        :current-bypass="currentBypass"
        @apply="onApplyProxy"
        @clear="onClearProxy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Shortcut, NewTabSettings } from "./type";
import { DEFAULT_SETTINGS } from "./type";
import { loadSettings, saveSettings, loadShortcuts, saveShortcuts } from "./storage";
import SearchBar from "./components/SearchBar.vue";
import ShortcutList from "./components/ShortcutList.vue";
import TopSites from "./components/TopSites.vue";
import ProxyPanel from "./components/ProxyPanel.vue";

const settings = ref<NewTabSettings>({ ...DEFAULT_SETTINGS });
const shortcuts = ref<Shortcut[]>([]);
const topSites = ref<chrome.topSites.MostVisitedURL[]>([]);
const proxyEnabled = ref(false);
const currentProxy = ref<chrome.proxy.ProxyServer>();
const currentBypass = ref<string[]>();

const filteredTopSites = computed(() => {
  const shortcutHosts = new Set(
    shortcuts.value.map((s) => {
      try {
        return new URL(s.url).hostname;
      } catch {
        return s.url;
      }
    }),
  );
  return topSites.value
    .filter((site) => {
      if (!site.url) return false;
      try {
        return !shortcutHosts.has(new URL(site.url).hostname);
      } catch {
        return false;
      }
    })
    .slice(0, 8);
});

async function init() {
  const [s, sc] = await Promise.all([loadSettings(), loadShortcuts()]);
  settings.value = s;
  shortcuts.value = sc;

  try {
    const urls = await chrome.topSites.get();
    topSites.value = urls;
  } catch {
    /* topSites permission may not be available */
  }

  refreshProxyStatus();
}

async function refreshProxyStatus() {
  try {
    const result = await chrome.proxy.settings.get({});
    const cfg = result.value;
    const proxy = cfg.rules?.singleProxy;
    proxyEnabled.value = cfg.mode === "fixed_servers" && !!proxy;
    currentProxy.value = proxy;
    currentBypass.value = cfg.rules?.bypassList;
  } catch {
    proxyEnabled.value = false;
  }
}

async function onSearchEngineChange(engine: NewTabSettings["searchEngine"]) {
  settings.value.searchEngine = engine;
  await saveSettings({ searchEngine: engine });
}

async function onAddShortcut(data: Omit<Shortcut, "id" | "order">) {
  const item: Shortcut = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    order: shortcuts.value.length,
  };
  shortcuts.value.push(item);
  await saveShortcuts(shortcuts.value);
}

async function onUpdateShortcut(item: Shortcut) {
  const idx = shortcuts.value.findIndex((s) => s.id === item.id);
  if (idx >= 0) {
    shortcuts.value[idx] = item;
    await saveShortcuts(shortcuts.value);
  }
}

async function onDeleteShortcut(item: Shortcut) {
  shortcuts.value = shortcuts.value.filter((s) => s.id !== item.id);
  await saveShortcuts(shortcuts.value);
}

async function onReorderShortcuts(list: Shortcut[]) {
  shortcuts.value = list;
  await saveShortcuts(list);
}

async function onToggleTopSites() {
  settings.value.showTopSites = !settings.value.showTopSites;
  await saveSettings({ showTopSites: settings.value.showTopSites });
}

async function onApplyProxy(config: chrome.proxy.ProxyConfig) {
  try {
    await chrome.proxy.settings.set({ value: config, scope: "regular" });
    await refreshProxyStatus();
  } catch (e) {
    console.error("Failed to set proxy:", e);
  }
}

async function onClearProxy() {
  try {
    await chrome.proxy.settings.clear({});
    await refreshProxyStatus();
  } catch (e) {
    console.error("Failed to clear proxy:", e);
  }
}

onMounted(init);
</script>

<style>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.content {
  width: 100%;
  max-width: 720px;
  padding: 24px 0 48px;
}

.restore-topsites {
  margin-bottom: 28px;
}

.link-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.link-btn:hover {
  color: var(--text-secondary);
}
</style>
