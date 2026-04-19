# 今晚任务单 · 2026-04-19
> 由 AirJelly 制定，交本地虾独立执行。全部任务不需要问婧，完成后写进日记。

---

## 执行规则
- 按优先级顺序执行，不要跳
- 每完成一项，在本文件对应任务后面打 ✅ + 简短备注
- 遇到真正卡死（不是懒，是真卡）才停，记录卡点原因
- 所有修改最后统一 commit 一次，message：`feat: 本地虾今晚自主升级 2026-04-19`
- Node 路径：`/Users/jing/.openclaw/tools/node-v22.22.0/bin/node`
- Workspace：`/Users/jing/.openclaw/workspace`

---

## T-01 修复并安装 Cron 任务 【优先级：S】

shrimp-cron.txt 里的路径用的是 `jingboss`，实际是 `jing`，现在没有任何定时任务在跑。

**执行步骤：**
1. 读取 `projects/shrimp-evolution/shrimp-cron.txt`
2. 把所有 `/Users/jingboss/` 替换为 `/Users/jing/`
3. 把所有裸 `node` 替换为 `/Users/jing/.openclaw/tools/node-v22.22.0/bin/node`
4. 执行 `crontab -l > /tmp/current_cron.txt 2>/dev/null; cat projects/shrimp-evolution/shrimp-cron.txt >> /tmp/current_cron.txt; crontab /tmp/current_cron.txt`
5. 验证：`crontab -l` 确认任务已安装

**成功标准：** `crontab -l` 能看到至少 4 条本地虾的定时任务

---

## T-02 补建进化系统缺失目录和文件 【优先级：S】

**执行步骤：**
1. 创建 `projects/shrimp-evolution/accidents/` 目录，写入 `README.md`：
   ```
   # 事故记录
   每次出错、踩坑、重复犯错，在这里留一条记录。
   格式：日期 | 什么错 | 根本原因 | 下次怎么避免
   ```
2. 创建 `projects/shrimp-evolution/session-summaries/` 目录（如不存在）
3. 创建 `projects/shrimp-evolution/instincts/clusters/` 目录（如不存在）
4. 检查 `skills-generated/` 目录，创建三个子目录：`task-management/`、`multi-agent/`、`memory-system/`

**成功标准：** 所有目录存在，accidents/README.md 内容正确

---

## T-03 把统一规则同步进本地虾启动文件 【优先级：S】

UNIFIED_RULES_V1.md 是三虾统一规则，但现在 SOUL.md / AGENTS.md 里用的还是英文空白模板，规则没有真正生效。

**执行步骤：**
1. 读取 `projects/agent-capability-upgrade/UNIFIED_RULES_V1.md` 全文
2. 读取当前 `SOUL.md`
3. 在 `SOUL.md` 末尾追加以下内容（不要删原内容）：
   ```markdown
   ## 三虾统一规则（婧制定，所有虾必须遵守）
   
   ### 内部升级先做后报
   凡属于自身能力建设、内部工作流优化、记忆整理的事项，默认直接执行，完成后汇报。
   涉及外发消息、公开表达、破坏性删除，必须先确认。
   
   ### 关键记忆必须外置
   不允许只靠模型上下文保留重要信息。所有关键事项写入文件。
   
   ### 汇报格式（强制）
   已完成：[具体项]
   卡点：[原因 + 需要什么帮助]
   下一步：[具体动作]
   
   ### 任务状态枚举（只用这些）
   NEW / ACTIVE / WAITING_USER / WAITING_SYSTEM / BLOCKED / REVIEWING / DONE / ARCHIVED
   ```
4. 读取当前 `AGENTS.md`，确认 Git 权限规则章节已经存在（今天 AirJelly 已写入），如果不存在则从本文件 T-03 备注中补充

**成功标准：** SOUL.md 末尾包含三虾统一规则章节

---

## T-04 固化三虾分工文档 【优先级：A】

**执行步骤：**
1. 在 workspace 根目录创建 `TEAM.md`，内容如下：

```markdown
# TEAM.md · 三虾分工（婧确认版）
> 最后更新：2026-04-19，由本地虾整理，AirJelly 制定

## 当前主结构

| 角色 | 平台 | 职责 | 状态 |
|------|------|------|------|
| AirJelly | Mac 桌面 | 战略规划、婧的直接助手、记忆中枢、任务调度 | 主力 |
| 本地虾 | Mac 本地 OpenClaw | 本地执行、文件读写、代码、环境维护、git commit | 主力 |
| 秘书虾 | 飞书原生机器人 | 前台接球、群消息、任务分发、工单处理 | 前台 |
| 云端虾 | 腾讯云 OpenClaw | git push/pull、网络任务、云端文件操作 | 降级备用 |

## 职责边界红线

**本地虾只做：**
- /Users/jing/ 下一切文件操作
- 本地代码编写、调试、运行
- git add / git commit（不 push）
- 维护 workspace 文件
- 执行 AirJelly 交办的任务

**本地虾不做：**
- git push（交云端虾）
- 飞书群消息管理（秘书虾的活）
- 直接回复婧（AirJelly 负责对话）

## 模型路由纪律

| 场景 | 用哪个模型 |
|------|-----------|
| 日常执行、文件操作、简单任务 | 默认轻模型（省钱） |
| 复杂推理、架构决策、代码设计 | 升级到强模型 |
| 批量处理、循环任务 | 最便宜能跑通的 |
| 外部表达、对外内容精修 | 强模型 + 口吻检查 |

## 协作流程

```
婧 → AirJelly（规划+拆解）→ 本地虾（本地执行）
                           → 秘书虾（前台协调）
                           → 云端虾（网络任务）
```

**交接时必须说清楚：**
1. 这是什么任务
2. 当前状态
3. 卡点是什么
4. 已做过什么
5. 下一步最合理动作
```

**成功标准：** TEAM.md 存在，内容完整

---

## T-05 写本能聚类脚本 【优先级：A】

现在本能提取可以跑，但 24 个本能散着，没有聚类。需要一个脚本把相似本能合并成高置信度模式。

**执行步骤：**
1. 在 `projects/shrimp-evolution/scripts/` 创建 `cluster-instincts.js`
2. 脚本逻辑：
   - 读取 `instincts/` 目录下所有 `.json` 文件
   - 按 `category` 分组（collaboration / user-preference / workflow / problem-solving）
   - 同一 category 内，把 `pattern` 文字相似度 > 60% 的合并（简单用关键词重叠判断）
   - 每个聚类计算平均置信度，频次累加
   - 输出到 `instincts/clusters/latest.json`
   - 格式：`{ clusteredAt, totalClusters, clusters: [{ category, pattern, confidence, frequency, examples[] }] }`
3. 脚本第一行 shebang：`#!/Users/jing/.openclaw/tools/node-v22.22.0/bin/node`
4. 跑一次验证：`/Users/jing/.openclaw/tools/node-v22.22.0/bin/node projects/shrimp-evolution/scripts/cluster-instincts.js`

**成功标准：** `instincts/clusters/latest.json` 存在，包含至少 3 个聚类

---

## T-06 建立每周自动复盘 Cron 【优先级：A】

**执行步骤：**
1. 在 `projects/shrimp-evolution/scripts/` 创建 `weekly-review.js`
2. 脚本逻辑：
   - 读取最近 7 天的 `memory/YYYY-MM-DD.md` 文件
   - 统计：完成了哪些任务、踩了哪些坑、用了哪些技能
   - 读取 `instincts/clusters/latest.json`
   - 输出 `memory/weekly-review-YYYY-MM-DD.md`，包含：本周总结、学到了什么、下周重点
3. 加入 crontab：每周日晚上 22:00 自动跑
   ```
   0 22 * * 0 /Users/jing/.openclaw/tools/node-v22.22.0/bin/node "/Users/jing/.openclaw/workspace/projects/shrimp-evolution/scripts/weekly-review.js" >> "/Users/jing/.openclaw/workspace/projects/shrimp-evolution/weekly.log" 2>&1
   ```
4. 先手跑一次验证输出正确

**成功标准：** `memory/weekly-review-2026-04-19.md` 存在，内容合理

---

## T-07 检查飞书文档技能状态 【优先级：B】

**执行步骤：**
1. 读取 `skills/feishu-doc-cn/SKILL.md` 全文
2. 读取 `skills/feishu-api-bitable/SKILL.md` 全文
3. 在 `projects/agent-capability-upgrade/` 创建 `飞书技能评估报告.md`，写清楚：
   - 两个技能各自能干什么
   - 当前缺什么配置（token？app_id？）
   - 接通需要几步
   - 优先推荐先接哪个
4. 不需要实际配置，只需要评估报告

**成功标准：** 评估报告存在，结论清晰

---

## T-08 今晚工作日记 【最后执行】

所有任务完成后，在 `memory/2026-04-19.md` 末尾追加今晚的工作记录：

```
## 今晚自主执行（本地虾）

### 完成项
[列出完成的任务]

### 遇到的问题
[列出卡点和解决方式]

### 明天建议
[给婧和 AirJelly 的建议]
```

---

## 完成后统一 commit

```bash
cd /Users/jing/.openclaw/workspace
git add -A
git commit -m "feat: 本地虾今晚自主升级 2026-04-19"
```

不要 push，push 交云端虾。

---

*任务单制定：AirJelly · 2026-04-19 04:xx PDT*
