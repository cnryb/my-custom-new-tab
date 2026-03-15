<template>
  <div class="proxy-section">
    <div class="section-header" @click="expanded = !expanded">
      <div class="header-left">
        <span class="expand-arrow" :class="{ open: expanded }">▶</span>
        <h3>代理设置</h3>
        <span class="proxy-badge" :class="proxyEnabled ? 'active' : 'inactive'">
          {{ proxyEnabled ? "已启用" : "未启用" }}
        </span>
      </div>
      <span v-if="proxyEnabled && currentProxy && !expanded" class="proxy-summary">
        {{ currentProxy.scheme }}://{{ currentProxy.host }}:{{ currentProxy.port }}
      </span>
    </div>

    <template v-if="expanded">
      <div v-if="proxyEnabled && currentProxy" class="proxy-current">
        {{ currentProxy.scheme }}://{{ currentProxy.host }}:{{ currentProxy.port }}
        <template v-if="currentBypass?.length">
          <br />绕过: {{ currentBypass.join(", ") }}
        </template>
      </div>

      <div class="proxy-form">
        <div class="form-row">
          <label class="field">
            协议
            <select v-model="draft.scheme">
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks5">SOCKS5</option>
            </select>
          </label>
          <label class="field">
            主机
            <input v-model="draft.host" type="text" placeholder="127.0.0.1" />
          </label>
          <label class="field field-port">
            端口
            <input v-model.number="draft.port" type="number" placeholder="1080" />
          </label>
        </div>
        <label class="field">
          绕过列表 <small>(逗号分隔)</small>
          <input v-model="bypassInput" type="text" placeholder="localhost, 127.0.0.1" />
        </label>
        <div class="proxy-actions">
          <button @click="onSaveDraft">保存草稿</button>
          <button class="primary" @click="onApply">启用代理</button>
          <button v-if="proxyEnabled" class="danger" @click="onClear">关闭代理</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ProxyDraft } from "../type";

const props = defineProps<{
  proxyEnabled: boolean;
  currentProxy: chrome.proxy.ProxyServer | undefined;
  currentBypass: string[] | undefined;
  proxyDraft: ProxyDraft;
}>();

const emit = defineEmits<{
  apply: [config: chrome.proxy.ProxyConfig];
  clear: [];
  saveDraft: [draft: ProxyDraft];
}>();

const expanded = ref(false);
const draft = ref<ProxyDraft>({ ...props.proxyDraft });
const bypassInput = ref(props.proxyDraft.bypassList.join(", "));

watch(
  () => props.proxyDraft,
  (val) => {
    draft.value = { ...val };
    bypassInput.value = val.bypassList.join(", ");
  },
  { deep: true },
);

function parsedBypass(): string[] {
  return bypassInput.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function onSaveDraft() {
  emit("saveDraft", { ...draft.value, bypassList: parsedBypass() });
}

function onApply() {
  const bypass = parsedBypass();
  const config: chrome.proxy.ProxyConfig = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: draft.value.scheme,
        host: draft.value.host,
        port: draft.value.port,
      },
      bypassList: bypass,
    },
  };
  emit("apply", config);
  emit("saveDraft", { ...draft.value, bypassList: bypass });
}

function onClear() {
  emit("clear");
}
</script>

<style scoped>
.proxy-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.section-header:has(+ *) {
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-arrow {
  font-size: 10px;
  color: var(--text-tertiary);
  transition: transform 0.2s;
}

.expand-arrow.open {
  transform: rotate(90deg);
}

.proxy-summary {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-tertiary);
}

.proxy-badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.proxy-badge.active {
  background: #d4edda;
  color: #155724;
}

.proxy-badge.inactive {
  background: var(--border-color);
  color: var(--text-secondary);
}

@media (prefers-color-scheme: dark) {
  .proxy-badge.active {
    background: #1a3a2a;
    color: #6fcf97;
  }
}

.proxy-current {
  font-family: monospace;
  font-size: 13px;
  color: var(--text-secondary);
  padding: 8px 12px;
  background: var(--bg);
  border-radius: 6px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.proxy-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  flex: 1;
}

.field-port {
  flex: 0 0 100px;
}

.field input,
.field select {
  width: 100%;
}

.field small {
  color: var(--text-tertiary);
}

.proxy-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
</style>
