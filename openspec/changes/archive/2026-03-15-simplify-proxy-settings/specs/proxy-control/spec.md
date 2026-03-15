## MODIFIED Requirements

### Requirement: 用户可以启用或关闭基础代理
系统 SHALL 允许用户在首页填写代理表单并启用代理，并支持一键关闭当前代理。

#### Scenario: 填写表单并启用代理
- **WHEN** 用户填写代理表单（scheme、host、port、bypassList）并执行启用操作
- **THEN** 系统必须将该配置应用到浏览器代理设置并刷新首页状态展示

#### Scenario: 一键关闭代理
- **WHEN** 用户在代理已启用状态下执行关闭操作
- **THEN** 系统必须清除当前浏览器代理设置并刷新首页状态展示

### Requirement: 用户可以维护基础代理表单值
系统 SHALL 在代理已启用时将表单初始值设置为当前生效的代理配置（scheme、host、port、bypassList），在代理关闭后保留上次配置值。

#### Scenario: 代理已启用时展开面板
- **WHEN** 用户展开代理面板且当前代理已启用
- **THEN** 表单必须显示当前生效的代理配置值

#### Scenario: 代理关闭后展开面板
- **WHEN** 用户关闭代理后展开面板
- **THEN** 表单保留上次启用时的配置值，方便用户快速重新启用

## REMOVED Requirements

### Requirement: 保存代理草稿配置
**Reason**: 草稿机制导致表单值与实际代理状态不一致，增加不必要的复杂度
**Migration**: 表单初始值改为直接读取浏览器当前代理配置，无需迁移数据
