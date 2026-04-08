# 结构化记忆 / 轻图谱 schema v1

## 目标

在保留现有文本记忆体系（`MEMORY.md`、`memory/YYYY-MM-DD.md`、`learnings/`）的前提下，新增可持久化、可迁移、可被多代理共享读取的结构化记忆层。

## 一、分层设计

### 1. 身份层（Identity Layer）
回答：这是谁？

节点示例：
- `PERSON`
- `AGENT`
- `CHANNEL`
- `ROLE`

典型字段：
- `id`
- `type`
- `name`
- `aliases`
- `responsibilities`
- `preferences`
- `status`
- `source_refs`
- `updated_at`

### 2. 运行层（Operational Layer）
回答：现在在发生什么？

节点示例：
- `TASK`
- `SUBTASK`
- `DECISION`
- `BLOCKER`
- `EVENT`
- `RULE`

典型字段：
- `id`
- `type`
- `title`
- `status`
- `owner`
- `priority`
- `summary`
- `next_action`
- `updated_at`
- `source_refs`

### 3. 知识层（Knowledge Layer）
回答：我们学到了什么？

节点示例：
- `RULE`
- `SKILL`
- `METHOD`
- `LEARNING`
- `RESOURCE`

典型字段：
- `id`
- `type`
- `title`
- `applicable_when`
- `not_applicable_when`
- `summary`
- `confidence`
- `source_refs`
- `updated_at`

## 二、首批节点类型

起步只用以下 6 类：
- `PERSON`
- `TASK`
- `RULE`
- `DECISION`
- `RESOURCE`
- `EVENT`

## 三、首批边类型

起步边类型控制在以下 7 类：
- `OWNS`
- `DEPENDS_ON`
- `BLOCKED_BY`
- `GOVERNS`
- `USES`
- `DECIDED_BY`
- `SUPERSEDES`

说明：
- 优先采用“可执行关系”
- 暂不大量引入 `RELATED_TO` 这类泛关系

## 四、任务状态标准

所有 `TASK` 节点只允许以下状态：
- `NEW`
- `ACTIVE`
- `WAITING_USER`
- `WAITING_SYSTEM`
- `BLOCKED`
- `REVIEWING`
- `DONE`
- `ARCHIVED`

## 五、建议存储文件

建议建立目录：`memory/graph/`

### 文件建议
- `nodes.jsonl`：节点主存储
- `edges.jsonl`：边主存储
- `state.json`：当前活跃任务、最近决策、重要阻塞摘要
- `index.md`：人工可读索引

## 六、节点样例

```json
{
  "id": "TASK-WXGZH-001",
  "type": "TASK",
  "title": "新公众号项目",
  "status": "WAITING_SYSTEM",
  "owner": "AGENT-COORD-001",
  "priority": "high",
  "summary": "推进注册、验证、内容规划与囤积并行",
  "next_action": "等待系统审核并同步内容筹备",
  "source_refs": ["MEMORY.md"],
  "updated_at": "2026-04-04T22:00:00-07:00"
}
```

## 七、边样例

```json
{
  "from": "TASK-WXGZH-001",
  "type": "BLOCKED_BY",
  "to": "EVENT-PLATFORM-REVIEW-001",
  "updated_at": "2026-04-04T22:00:00-07:00",
  "source_refs": ["MEMORY.md"]
}
```

## 八、写入规则

仅在以下情况进入结构化层：
- 信息已被确认
- 会影响后续行动
- 具有跨任务复用价值
- 改变任务状态
- 形成新决策或覆盖旧决策

默认不写入：
- 闲聊
- 一次性上下文
- 未证实猜测
- 无复用价值的过程噪音

## 九、抗失忆原则

该结构化层必须满足：
- 不依赖某个模型才能读懂
- 不依赖当前上下文窗口存在
- 支持换模型后重建认知
- 支持系统重启后恢复运行态
- 支持多代理共享读取
