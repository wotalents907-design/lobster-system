# SKILLS_STATUS.md

## 已装技能总表（2026-03-29）

### 基础安装层

#### clawhub 相关能力
- 状态：已装
- 说明：`clawhub` 相关 skill 已可用，`clawhub` CLI 本体已全局安装。
- 作用：后续搜索、安装、更新技能的基础设施。

---

## 今日已装技能

> 说明：本表已按 2026-04-03 实际目录复核更新。此前旧台账存在“部分技能已装但未记入台账”的滞后问题，现已收口。

### 1. skill-creator
- 状态：已装
- 风险：中高
- 备注：安装时触发 `suspicious`，已按用户授权 `--force`
- 适用场景：
  - 创建新 skill
  - 改造已有 skill
  - 审查 `SKILL.md`
  - 整理 skill 目录结构

### 2. automation-workflows
- 状态：已装
- 风险：中
- 适用场景：
  - 设计自动化流程
  - 梳理 Zapier / Make / n8n 路线
  - 识别哪些工作值得自动化

### 3. file-manager
- 状态：已装
- 风险：中
- 适用场景：
  - 批量重命名
  - 文件整理归档
  - 目录同步
  - 重复文件清理
- 注意：涉及批量改名、移动、清理时，优先先做预览或副本。

### 4. clawlist
- 状态：已装
- 风险：低到中
- 适用场景：
  - 多步骤任务跟踪
  - 长线项目推进
  - 持续性工作流管理
  - 检查点式推进

### 5. openclaw-backup
- 状态：已装
- 风险：低到中
- 适用场景：
  - 备份 `~/.openclaw` 数据
  - 做恢复点
  - 备份轮转
  - 在大改动前先兜底
- 备注：当前这批中最值得优先保留和使用的技能之一。

### 6. agent-team-orchestration
- 状态：已装
- 风险：中
- 适用场景：
  - 多 agent 分工
  - 角色边界设计
  - 任务流与质量关口
  - 三子代理 / 多代理编排
- 备注：和当前“三子代理”方向高度贴合。

### 7. playwright-mcp
- 状态：已装
- 风险：中
- 适用场景：
  - 浏览器自动化
  - 网页操作
  - 结构化浏览器控制
  - 网页任务流程
- 备注：是现有浏览器能力的补件，不是唯一浏览器方案。

### 8. baidu-web-search
- 状态：已装
- 风险：中高
- 备注：安装时触发 `suspicious`，已按用户授权 `--force`
- 适用场景：
  - 中文网页搜索
  - 百度生态内容检索
  - 国内语境下的补充搜索
- 注意：适合作为补充搜索源，不宜默认当唯一搜索依据。

### 9. spreadsheet
- 状态：已装
- 风险：中高
- 备注：安装时触发 `suspicious`，已按用户授权 `--force`
- 适用场景：
  - 表格读取
  - 表格写入
  - 表格分析
  - 多平台表格处理
- 注意：涉及重要表格时，优先先做副本再操作。

### 10. openclaw-token-optimizer
- 状态：已装
- 风险：中高
- 备注：此前多次因 `Rate limit exceeded` 未装成，后已成功补装。
- 适用场景：
  - 审视上下文注入
  - 优化提示与记忆占用
  - 控制 token 使用与成本
- 注意：会碰上下文、记忆、提示裁剪，不宜激进启用或大改现有工作区结构。

### 11. openclaw-memory
- 状态：已装
- 风险：高
- 备注：安装时触发 `suspicious`，已按用户授权 `--force`
- 适用场景：
  - 会话优先记忆
  - 持久知识保存
  - 记忆检索增强
- 注意：这是高耦合件，可能与现有 `MEMORY.md / memory/` 体系发生重叠或冲突，使用前宜先备份。

### 12. find-skills-v2
- 状态：已装
- 风险：低到中
- 适用场景：
  - 用户要找新技能
  - 需要判断某能力是否已有现成 skill
  - 在“扩能力”前先做技能发现
- 备注：与 `openclaw-find-skills` 功能相近，但命名与说明更偏新版发现入口；后续应避免两套口径混用。

### 13. local-memory-system
- 状态：已装
- 风险：中
- 适用场景：
  - 整理长期记忆
  - 维护本地免费持久记忆体系
  - 梳理 MEMORY / daily / 项目记忆分层
- 备注：和用户当前正在推进的本地记忆系统主线高度贴合，优先级应高于 `openclaw-memory`。

### 14. rpa-caller
- 状态：已装
- 风险：中到高
- 适用场景：
  - 通过 HTTP 触发 RPA 流程
  - 查询 RPA 任务状态
  - 停止任务 / 传递参数
- 注意：只有在本地已具备可调用 RPA 服务端点时才真正有用；否则先别空转。

### 15. skill-vetter
- 状态：已装
- 风险：低
- 适用场景：
  - 安装外部 skill 前先做安全审查
  - 检查来源、权限范围、可疑脚本
- 备注：以后继续补装技能时，这个应成为前置步骤之一。

---

## 高风险已装组

### skill-creator
- 原因：被标记 `suspicious`
- 建议：用于 skill 创建/审查可以，但不要自动处理不明来源 skill。

### baidu-web-search
- 原因：被标记 `suspicious`
- 建议：作为补充搜索使用，不作为唯一权威来源。

### spreadsheet
- 原因：被标记 `suspicious`
- 建议：重要表格先复制再改。

### openclaw-memory
- 原因：被标记 `suspicious`
- 建议：记忆类高耦合，不要贸然替换现有 `MEMORY.md / memory/` 工作方式；先观察其实际行为。

---

## 当前判断：暂无必须立刻补装的核心缺口

- 结合当前实际目录复核，技能数量已不算少，问题主要不是“没装”，而是“没纳管、没形成明确启用顺序”。
- 现阶段更值得做的是：
  - 收口台账
  - 明确优先启用顺序
  - 把高相关技能接入真实工作流验证
- 若后续出现明确新需求，再按需增补，不建议为了“看起来全”继续盲目扩装。

---

## 已有 / 已内置同类能力

以下能力已存在，不宜无脑重复建设：
- `self-improving-agent`
- `find-skills`
- `summarize`
- `weather`
- `agent-browser`
- 系统自带：`web_search`
- 系统自带：`memory_search` / `memory_get`
- 系统自带：cron / message / image / sessions 等能力

---

## 使用优先级建议

### 第一梯队：优先使用
1. `clawlist`
2. `openclaw-backup`
3. `automation-workflows`
4. `agent-team-orchestration`
5. `local-memory-system`
6. `file-manager`
7. `skill-vetter`

### 第二梯队：按场景使用
8. `playwright-mcp`
9. `openclaw-agent-browser`
10. `spreadsheet`
11. `baidu-web-search`
12. `rpa-caller`
13. `find-skills-v2`
14. `openclaw-find-skills`

### 第三梯队：谨慎推进
15. `skill-creator`
16. `openclaw-token-optimizer`
17. `openclaw-memory`

## 本轮收口结论（2026-04-03）

- 已确认：当前工作区与 `~/.agents/skills` 下，技能总体已较完整。
- 已确认：旧台账漏记了 `find-skills-v2`、`local-memory-system`、`rpa-caller`、`skill-vetter`。
- 当前不建议为了“补完”继续盲装一批新 skill。
- 更正确的动作是：先把现有技能接进真实工作流，验证哪些真的常用、哪些只是占位。