## 1. 类型与数据模型清理

- [x] 1.1 从 `src/type.ts` 中移除 `ProxyDraft` 接口
- [x] 1.2 从 `NewTabSettings` 中移除 `proxyDraft` 字段，从 `DEFAULT_SETTINGS` 中移除对应默认值

## 2. ProxyPanel 组件重构

- [x] 2.1 移除 `proxyDraft` prop 和 `saveDraft` emit，表单初始值改为基于 `currentProxy` / `currentBypass`（已启用时取值，未启用时为空）
- [x] 2.2 移除"保存草稿"按钮

## 3. App 层适配

- [x] 3.1 移除 `App.vue` 中 `onSaveProxyDraft` 方法及传递给 `ProxyPanel` 的 `proxyDraft` / `saveDraft` 相关绑定

## 4. Spec 归档准备

- [x] 4.1 确认 `openspec/specs/proxy-control/spec.md` 的草稿相关需求已在 delta spec 中标记为 REMOVED
