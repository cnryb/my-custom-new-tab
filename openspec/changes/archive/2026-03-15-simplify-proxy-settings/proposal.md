## Why

当前代理设置面板的表单值来源于持久化的"草稿"（`proxyDraft`），而非浏览器实际生效的代理配置。导致用户看到的表单值与实际代理状态不一致，"保存草稿"按钮也缺乏实际意义。

## What Changes

- 移除 `proxyDraft` 持久化机制及"保存草稿"按钮
- 表单初始值改为：代理已启用时取 `currentProxy`；未启用时为空，靠 placeholder 提示
- 从 `NewTabSettings` 类型和 `DEFAULT_SETTINGS` 中移除 `proxyDraft` 字段

## Capabilities

### New Capabilities

无

### Modified Capabilities

- `proxy-control`: 移除草稿持久化需求，表单值改为反映当前生效的代理配置

## Impact

- `src/type.ts` — 移除 `ProxyDraft` 接口、`NewTabSettings.proxyDraft` 字段、`DEFAULT_SETTINGS.proxyDraft`
- `src/components/ProxyPanel.vue` — 移除草稿相关 props/emit/逻辑，表单初始值改为基于 `currentProxy`
- `src/App.vue` — 移除 `onSaveProxyDraft` 及相关 prop 传递
- `openspec/specs/proxy-control/spec.md` — 更新需求描述
