# 记忆格式规范

## 每日 Memory 文件

路径：`memory/YYYY-MM-DD.md`

格式示例：

```markdown
## 2026-04-05

### TASK
- [状态: ACTIVE] 研究 graph-memory 项目
- [状态: WAITING_USER] 等主人确认起步方案

### SKILL
- [学到] graph-memory 双路径召回机制：精确路径 + 社区路径

### EVENT
- [遇到] 主人要求自主升级改造 agent 自身
- [解决] 创建 rules/ 目录，固化协作协议

### DECISION
- [决定] 从本条开始，memory 文件全部标签化
- [REJECTED: 等待外部工具] 先用现有文本文件跑通流程
- [依据] 2026-04-05 主人授权「内部升级无需询问」
```

---

## 标签格式规范

| 标签 | 格式 | 例子 |
|------|------|------|
| 任务状态 | `[状态: X]` | `[状态: ACTIVE]` |
| 节点类型 | `[类型: TASK/EVENT/SKILL/DECISION]` | `[类型: TASK]` |
| 边关系 | `[边: SOLVED_BY/REQUIRES/...]` | `[边: SOLVED_BY]` |
| 决策 | `[决定: ...]` | `[决定: 采用轻量起步方案]` |
| 拒绝 | `[REJECTED: ...]` | `[REJECTED: 上重型图数据库]` |

---

## 长期记忆更新时机

每次 session 结束时，检查：

1. 今天有哪些新决策 → 写入 `MEMORY.md` 的对应章节
2. 有哪些任务状态变化 → 更新到 daily file
3. 有哪些经验值得保留 → 提炼成 `MEMORY.md` 的 lessons 章节

---

## 禁止事项

- ❌ 不写「进行中」「差不多」「还行」等模糊状态
- ❌ 不写纯文本描述而不加标签
- ❌ 重要决策不留 `[DECIDED_BY]` 记录
