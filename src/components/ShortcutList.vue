<template>
  <div class="shortcut-section">
    <div class="section-header">
      <h3>快捷网站</h3>
    </div>
    <div class="shortcut-grid">
      <div
        v-for="(item, index) in shortcuts"
        :key="item.id"
        class="shortcut-item"
        @mouseenter="hoveredId = item.id"
        @mouseleave="hoveredId = ''"
      >
        <a :href="item.url" class="shortcut-link">
          <img :src="faviconURL(item.url)" :alt="item.title" class="shortcut-icon" />
          <span class="shortcut-title">{{ item.title }}</span>
        </a>
        <div v-if="hoveredId === item.id" class="shortcut-actions">
          <button @click.prevent="startEdit(item)" title="编辑">✎</button>
          <button @click.prevent="onDelete(item)" title="删除">×</button>
          <button v-if="index > 0" @click.prevent="onMoveUp(index)" title="上移">↑</button>
          <button v-if="index < shortcuts.length - 1" @click.prevent="onMoveDown(index)" title="下移">↓</button>
        </div>
      </div>
      <div class="shortcut-item add-item" @click="startAdd">
        <div class="add-icon">+</div>
        <span class="shortcut-title">添加</span>
      </div>
    </div>

    <div v-if="showForm" class="form-overlay" @click.self="closeForm">
      <div class="form-dialog">
        <h4>{{ editingItem ? "编辑快捷网站" : "添加快捷网站" }}</h4>
        <label>
          标题
          <input v-model="formTitle" type="text" placeholder="网站标题" />
        </label>
        <label>
          URL
          <input v-model="formUrl" type="text" placeholder="https://example.com" />
        </label>
        <div class="form-buttons">
          <button @click="closeForm">取消</button>
          <button class="primary" @click="onSave">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Shortcut } from "../type";

const props = defineProps<{ shortcuts: Shortcut[] }>();
const emit = defineEmits<{
  add: [shortcut: Omit<Shortcut, "id" | "order">];
  update: [shortcut: Shortcut];
  delete: [shortcut: Shortcut];
  reorder: [shortcuts: Shortcut[]];
}>();

const hoveredId = ref("");
const showForm = ref(false);
const editingItem = ref<Shortcut | null>(null);
const formTitle = ref("");
const formUrl = ref("");

function faviconURL(u: string, size = 32): string {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", `${size}`);
  return url.toString();
}

function startAdd() {
  editingItem.value = null;
  formTitle.value = "";
  formUrl.value = "";
  showForm.value = true;
}

function startEdit(item: Shortcut) {
  editingItem.value = item;
  formTitle.value = item.title;
  formUrl.value = item.url;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editingItem.value = null;
}

function onSave() {
  const title = formTitle.value.trim();
  const url = formUrl.value.trim();
  if (!title || !url) return;
  if (editingItem.value) {
    emit("update", { ...editingItem.value, title, url });
  } else {
    emit("add", { title, url });
  }
  closeForm();
}

function onDelete(item: Shortcut) {
  emit("delete", item);
}

function onMoveUp(index: number) {
  const list = [...props.shortcuts];
  [list[index - 1], list[index]] = [list[index], list[index - 1]];
  emit("reorder", list);
}

function onMoveDown(index: number) {
  const list = [...props.shortcuts];
  [list[index], list[index + 1]] = [list[index + 1], list[index]];
  emit("reorder", list);
}
</script>

<style scoped>
.shortcut-section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.shortcut-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.shortcut-item {
  position: relative;
  width: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 12px;
  transition: background 0.15s;
  cursor: pointer;
}

.shortcut-item:hover {
  background: var(--card-bg);
}

.shortcut-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: inherit;
}

.shortcut-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.shortcut-title {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 72px;
  text-align: center;
}

.shortcut-actions {
  position: absolute;
  top: -8px;
  right: -12px;
  display: flex;
  gap: 2px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.shortcut-actions button {
  padding: 2px 6px;
  font-size: 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 4px;
}

.shortcut-actions button:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.add-item {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  justify-content: center;
}

.add-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-tertiary);
  border-radius: 50%;
  background: var(--card-bg);
}

.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.form-dialog {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-dialog h4 {
  font-size: 16px;
  font-weight: 600;
}

.form-dialog label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.form-dialog input {
  width: 100%;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
