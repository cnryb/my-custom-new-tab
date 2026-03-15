<template>
  <div class="search-bar">
    <div class="search-wrapper">
      <select
        class="engine-select"
        :value="searchEngine"
        @change="onEngineChange"
      >
        <option v-for="e in SEARCH_ENGINES" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>
      <input
        ref="inputRef"
        class="search-input"
        type="text"
        v-model="query"
        :placeholder="placeholder"
        @keydown.enter="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { type SearchEngineId, SEARCH_ENGINES } from "../type";

const props = defineProps<{ searchEngine: SearchEngineId }>();
const emit = defineEmits<{ "update:searchEngine": [value: SearchEngineId] }>();

const query = ref("");
const inputRef = ref<HTMLInputElement>();

const placeholder = computed(() => {
  const engine = SEARCH_ENGINES.find((e) => e.id === props.searchEngine);
  return `使用 ${engine?.name ?? "Google"} 搜索或输入网址`;
});

function isUrl(input: string): boolean {
  if (/^https?:\/\//i.test(input)) {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }
  return !input.includes(" ") && /^[\w-]+(\.[\w-]+)+/.test(input);
}

function onSubmit() {
  const input = query.value.trim();
  if (!input) return;

  if (isUrl(input)) {
    window.location.href = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  } else {
    const engine = SEARCH_ENGINES.find((e) => e.id === props.searchEngine);
    if (engine) {
      window.location.href = engine.urlTemplate.replace("{query}", encodeURIComponent(input));
    }
  }
}

function onEngineChange(e: Event) {
  emit("update:searchEngine", (e.target as HTMLSelectElement).value as SearchEngineId);
}

onMounted(() => inputRef.value?.focus());
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 584px;
  margin: 0 auto;
  padding: 40px 0 32px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}

.search-wrapper:focus-within {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.engine-select {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  outline: none;
  cursor: pointer;
  padding: 8px 4px 8px 0;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
  padding: 10px 16px 10px 8px;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}
</style>
