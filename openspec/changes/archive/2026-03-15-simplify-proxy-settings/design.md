## Context

当前 `ProxyPanel` 组件维护了一套独立于浏览器代理状态的"草稿"数据流：`ProxyDraft` 持久化在 `chrome.storage` 中，表单绑定草稿值，用户可单独保存草稿。这导致表单显示的内容与实际代理配置脱节，增加了不必要的复杂度。

## Goals / Non-Goals

**Goals:**
- 表单值与浏览器实际代理状态保持一致（所见即所得）
- 移除草稿持久化，简化数据模型和交互

**Non-Goals:**
- 不改变代理启用/关闭的核心流程
- 不引入新的代理功能（如 PAC 脚本、多规则等）

## Decisions

### 表单初始值来源

**选择**：代理已启用时从 `currentProxy` / `currentBypass` 同步表单值；关闭代理后保留上次配置值（内存中），方便用户快速重新启用。

### 组件 props 简化

**选择**：移除 `proxyDraft` prop 和 `saveDraft` emit，`ProxyPanel` 仅接收 `proxyEnabled`、`currentProxy`、`currentBypass`。

## Risks / Trade-offs

- **[页面刷新后丢失]** 关闭代理后表单值仅保留在内存中，刷新页面后会清空 → 可接受，代理配置变更不频繁
- **[storage 兼容]** 已有用户的 `NewTabSettings` 中存在 `proxyDraft` 字段 → `loadSettings` 使用展开合并，多余字段自动忽略，无需迁移
