# MEMORY.md - 长期记忆

> **文档类型：参考** — 查阅用。记录长期项目状态、工具链配置、协作规则。
> **安全规则：** 只在主会话（直接和婧对话）加载。群聊/共享会话中绝不加载。

## 用户核心特质
- 闭环强迫 - 通知未达=任务未完
- 数据完整偏执 - 不接受"先凑合"
- 即时行动 - 有想法立即执行
- DevOps闭环思维 - 部署服务必验证端到端
- 情感先于任务 - 先回应情绪再推进任务
- 止损意识强 - 超时不决主动终止

## 长期项目状态

| 项目 | 状态 |
|------|------|
| 律师汽融诉讼业务 | 稳定，台账3273条记录 |
| AI协作系统 | Codex替代OpenClaw（04-18决策） |
| 多平台内容运营 | 公众号/朋友圈/小红书 |
| 抖音账号自动化 | 已终止，所有方案均被反爬虫封堵 |

## ⚠️ 不属于婧业务范畴（遇到这类话题先问是否同事提问）

| 方向 | 决策日期 | 说明 |
|------|----------|------|
| **汽车维权 / 二手车 / ABD 三类 / 4S 店猫腻** | 2026-05-26 21:38 澄清 | 18:18 调用过一轮诊断是**同事问题**，不是婧本人的产品方向。原诊断长文及 drafts 文件夹均已删除。拖音 IP「长沙周婧律师」**是劳动法赛道**，不是车辆维权赛道。遇到这类话题默认问“这是给谁的问题”，不默认当作婧本人的项目。完整记录见 `memory/2026-05-26-1818.md` |

## 协作规则

### 进程卸干净（2026-05-24 婧要求）：
- 任务结束后主动清理自己产生的 exec/process 会话（特别是 PTY、后台会话）
- UI 上“已完成/已退出”的进程框 → 随手清，避免堆积
- 还在跑的进程 → 不动（可能是 cron 或后台任务）

### 三段式汇报（强制）：
```
已完成：[具体完成项]
卡点：[原因 + 需要什么帮助]
下一步：[接下来要做什么]
```

### 不重复汇报原则：
同一任务只需一个人汇报。秋刀鱼/本地虾另一方不重复汇报节奏，只在有实质性进展、卡点需要解除或被要求时才发声。

## 飞书文档资产

| 文档 | URL |
|------|-----|
| 刘思毅AI协作宪法 v2.0 | https://feishu.cn/docx/R1lVdMY7xoXsOAxqzhocxfM7nyc |
| 劳动法咨询话术｜完整版 | https://feishu.cn/docx/JmVVdCXnMo33sHxnIkTcqPdLnYe |
| 大虾升级指南｜Mac合伙人 | https://feishu.cn/docx/HrJgdD5FfoNGqOxLynycQjk7ncf |
| AI智能体专家团队库 - 项目概述 | https://feishu.cn/docx/Fvi0dO1AFoMblaxsKvqccWMdnId |
| AI智能体专家团队库 - 完整速查表 | https://feishu.cn/docx/KEPydpzi1opqFcxx0xicOkgwnfe |
| AI智能体专家团队库 - 云盘文件夹（18部门文档） | https://xcnh9hfl25ws.feishu.cn/drive/folder/CXoKf7SSPlnCk3dmhEEcZ7Tzn0g |

## 模型配置（2026-05-24 更新）
- **primary（当前）：** proai/claude-opus-4-7（三天试用，05-27 13:08 自动回切）
- **回切目标：** moonshot/kimi-k2.6
- **切换原因：** 婧批准三天测试 Claude Opus 4.7 推理能力
- **已移除：** deepseek-reasoner fallback

## Claude 专线接口（2026-05-22 新增）
- **provider：** proai（OpenAI 兼容格式）
- **baseUrl：** https://claude.proai.love
- **apiKey：** [REDACTED — 见本地 .env 或 OpenClaw 凭证管理]
- **可用模型：** claude-opus-4-7（最强）/ claude-opus-4-6-thinking（思考版）/ claude-sonnet-4-6 / claude-haiku-4-5
- **别名使用：** proai/claude-opus-4-7、proai/claude-sonnet-4-6
- **注意：** 时间卡自首次使用计时，用量查询 https://claude.proai.love/balance

## 工具链配置
- **主要AI工具：** Codex（04-18起替代OpenClaw）
- **飞书TTS：** feishu-edge-tts-voice（支持--rate参数，1.25倍速=+25%）
- **浏览器桥接：** kimi-webbridge（Safari 桥接 Kimi 付费账号，04-30安装）

## 朋友圈文案排版规则（2026-04-30 婧制定）

**硬性要求：**
1. **短句** — 每句精简，不绕
2. **长文案** — 头三句话必须有悬念/钩子，能吸引人打开继续读
3. **短文案** — 不超过5行
4. **递进节奏** — 每行字数递增（前短后长，有张力）

**示例节奏：**
```
第一句话很短。（6字）
第二句话稍微长一点，制造好奇。（14字）
第三句话再长一些，把悬念拉满，让人必须点开看全文。（24字）
```

## 飞书连通性（重要修正）
- **正确 open_id：** `ou_080a451ddcdb4d4b5a5213d8f6a7b11d`（从session历史发现）
- 旧值 "445992" 是无效格式，正确格式以 `ou_` 开头
- Chrome 调试端口必须用命令启动：`/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222`，点开无效

## 新装技能与角色（2026-05-01 ~ 05-02）

### agency-agents-zh 211角色库
- **状态：** ✅ 已转换并安装到 `~/.openclaw/agency-agents/`
- **数量：** 211个智能体角色（18个部门分类）
- **安装方式：** `convert.sh --tool openclaw` + `install.sh --tool openclaw`
- **关键角色已研究：** 抖音策略师/小红书运营/微信运营/知乎策略师/增长黑客/私域运营/产品经理/品牌守护者/合同审查/客户接案/法律文书/文档生成器/会议效率专家
- **五组学习心得报告：** `reports/agency-agents-zh-五组学习心得.md`（2026-05-01完成）
- **应用方向：** 内容生产效率提升3倍、私域客户管理升级、律师服务产品化（MCP封装）、品牌一致性检查

### superpowers-zh 编程超能力包
- **状态：** ✅ 20个skills + 6个中国原创已安装
- **核心skill：** workflow-runner / mcp-builder / chinese-documentation / verification-before-completion / dispatching-parallel-agents
- **工作流模板：** `workflows/content-production.yaml`、`workflows/legal-review.yaml`

### khazix-skills
- `neat-freak`（洁癖）：会话结束自动审查同步知识 ✅（2026-05-21 从 Codex 同步至 workspace/skills/neat-freak/）
- `hv-analysis`（横纵分析法）：万字PDF研究报告 ✅
- `khazix-writer`（卡兹克写作）：公众号长文风格参考 ✅

### pyq-weekly-guard（朋友圈守护）
- **状态：** ✅ 已落地（2026-05-21）
- **功能：** 每周日 21:00 自动检查下周朋友圈排期，缺图自动补、缺文案飞书报警
- **cron：** `0 21 * * 0 Asia/Shanghai`
- **位置：** `workspace/skills/pyq-weekly-guard/` 和 `secretary-import/skills/pyq-weekly-guard/`
- **图库状态：** 32张图含场景标签，四类匹配规则已建立（A场景型/B反sale型/C认知重塑型/D知识科普型）
- **本周排期：** 05-20~05-26 全部就绪（18个时段），05-20补发3条
- **当前缺口：** 通勤外出场景已部分补齐（05-25 入库 3 张商务车后排办公图，可用于 C 类文案兜底）

### skill-vetter
- 安全审查skill，装任何skill之前先过检查清单 ✅

## 工具链配置
- **主要AI工具：** OpenClaw（重新启用，agency-agents-zh专用）+ Claude Code（主力）+ Kimi（写作/日常）
- **飞书TTS：** feishu-edge-tts-voice（支持--rate参数，1.25倍速=+25%）
- **浏览器桥接：** kimi-webbridge（Safari 桥接 Kimi 付费账号，04-30安装）
- **文档生成：** specialized-document-generator 角色模板（PDF/PPTX/XLSX/DOCX代码生成）

## 工具权限修复（2026-05-22 水母虾执行）

**问题：** 飞书多维表格写操作工具长期未开放，导致小龙虾无法直接创建/更新飞书记录，只能读不能写。

**修复内容（openclaw.json 全局 + main agent 同步补全）：**
- ✅ `feishu_bitable_create_record` — 可直接写入台账记录
- ✅ `feishu_bitable_update_record` — 可更新已有记录状态
- ✅ `feishu_bitable_create_app` — 可新建多维表格
- ✅ `feishu_bitable_create_field` — 可新增字段
- ✅ `feishu_message_history` — 可读群聊历史消息（翻页）
- ✅ `feishu_perm` — 权限查询
- ✅ 模型 fallback 补充：kimi/kimi-code 主力 → 失败时自动切换 minimax/MiniMax-M2.7-highspeed

**备份：** `openclaw.json.bak-before-airjelly-*`

---

## 活跃任务（截至2026-05-25 23:00）
- 早报（每日cron）：✅ 文字版正常发送；✅ 语音版恢复（Edge TTS 05-13 恢复正常）
- **Cron 残余任务清理：⏳ 14 个清单已给婧，待点名删除**
- **素材群采集 cron：🟡 单点恢复（05-25 拉 10 条 / 3 张通勤图入库，累计 62 条），状态未稳定，待观察次日是否继续跑通**
- 朋友圈 cron：❌ 发送失败（2026-05-09 起 Bot 不在目标群聊，需重新入群或换群）
- agency-agents-zh 211角色：✅ 已安装，五组学习心得已完成
- kimi-webbridge：✅ 已安装，用于 Safari 浏览器桥接
- 素材群图片采集：🟡 间歇性可用（05-19 全量恢复 9 张；05-21 增量 20 张；05-25 增量 3 张通勤场景，累计 62 条消息处理完毕）
- 公众号爆文模板测试：⏳ 草稿 `drafts/公众号爆文-降薪博弈.md` 待发布测试A标题
- 飞书群聊摘要方案：❌ 不可行（OpenClaw无im:history接口，已终止）
- **伙伴群下午总结cron：** ✅ 已恢复（2026-05-18，通过 `oc_55c2d8dcc6c1419947cca29fa83549ef` 成功读写并发送摘要）
- **朋友圈21槽文案：✅ 文案已就绪（05-08~05-14）；❌ 实际发送受阻（Bot不在群）**
- 99 System规则补全：✅ 已完成（2026-05-07）
- 飞书核心文档沉淀：✅ 话术/宪法/专家库三篇写入本地知识库（2026-05-07）
- Inbox分流：🟡 进行中，收集箱剩135条（2026-05-09，无新进展）
- **pyq-weekly-guard：** ✅ 已落地（2026-05-21），周日21:00自检cron激活，本周排期05-20~05-26全部就绪
- **P0 飞书内容盘点（AIRJELLY-FEISHU-READ-2026-05-07）：** ✅ 关闭（2026-05-24，婧决策）
  - 任务 B（核心文档沉淀）已完成于 05-07
  - 任务 A（伙伴群聊天）/任务 C（云盘清单）因权限不到位放弃
  - 进度报告：`memory/p0-feishu-read-progress-2026-05-24.md`
  - 复用脚本沉淀：`scripts/feishu_get_chat_history.js`、`scripts/feishu_list_drive_folder.js`

## 知识库同步架构（2026-05-08 确认）

> Obsidian Vault → Codex（章鱼）→ 飞书/大虾 全链路同步，大虾承担本地执行层。

### 大虾在同步架构中的职责

| 职责 | 具体操作 | 脚本/工具 |
|------|----------|-----------|
| 图片上传 | 本地图片 → 飞书多维表格附件 | `feishu_import_from_local_folder` / `generate_feishu_import.py` |
| 注册表维护 | 上传成功后回写 feishu_url 至 `image_registry.json` | 同步脚本 |
| 任务队列消费 | 读取 `task_queue.json`，按序执行上传任务 | 本地 cron / 触发器 |
| 同步日志回写 | 每次执行后更新 Obsidian 同步日志.md | 脚本尾部钩子 |

### 图片路径一致性规则（重要）

**核心原则：大虾推送图片时，永远读 `image_registry.json` 中的 feishu_url，禁止直接使用本地路径。**

image_registry.json 结构示例：
- local_path：本地原始路径
- feishu_url：上传飞书后写入，推送时读此字段
- upload_status：pending / success / error
- used_in：已排期使用的日期列表

> **这解决了历史 bug：** 群组收到的是图片地址而非文件——根因是大虾直接传了本地路径。

### 同步触发方式（大虾响应）

| 触发方式 | 大虾行为 |
|----------|----------|
| Obsidian 图片素材文件变更 | 检查 feishu_url 是否为空，空则加入上传队列 |
| task_queue.json 有新任务 | 自动消费队列，上传并回写注册表 |
| 水母虾/章鱼发指令「同步图片」 | 立即执行待上传任务 |
| 每日 08:00 cron | 全量检查注册表，重试 error 状态条目 |

### 朋友圈助手与 Obsidian 协作流

Obsidian 排期日历.md → 章鱼读取 → 朋友圈助手生成7天文案+图片映射 → 大虾执行飞书附件上传 + image_registry 回写 → 大虾飞书机器人推送（读 feishu_url，不读本地路径）

---

## 未决待处理项（截至2026-05-24）
- **素材群图片自动归档：** 🟡 间歇性可用（2026-05-25，3 张通勤图增量入库，累计 62 条消息处理完毕；cron 稳定性仍待观察）
- **公众号内容发布测试：** ⏳ 爆文模板效果待验证（标题A/B测试、打开率追踪）
- **Kimi Token 配置：** ⏳ 付费账号在 Safari，需从开放平台获取正确 Key 更新桥接
- **A2H Market 发帖接口：** 🔴 INTERNAL_ERROR 持续未决
- **飞书群聊摘要方案：** ❌ 已终止 — 缺少 `im:history` 接口，OpenClaw无法自动读取群聊历史
- **伙伴群下午总结cron：** ✅ 已恢复（2026-05-18，通过 `oc_55c2d8dcc6c1419947cca29fa83549ef` 成功读写并发送摘要）
- **Inbox 分流剩余：** 🟡 收集箱剩135条待处理（2026-05-09，无新进展）
- **朋友圈发送失败：** 🔴 Bot 不在销转交流群（oc_55c2d8dcc6c1419947cca29fa83549ef），需重新入群或换群ID（2026-05-09~05-17 连续失败）
- **语音早报失败：** 🔴 Edge TTS 连接超时，需检查网络或换 TTS 方案

## 客户预约（2026-05-21 新增）
- **曹先生（氩焊）** | 周五 20:30 电话咨询 | 500元已预付 | 提纲准备中（2026-05-25 倒计时 3 天）

## 抖音账号（本虾）
- **长沙周婧律师** | https://www.douyin.com/user/MS4wLjABAAAAd5rZ_ziqx_8mTUb63Q54hnb2TXZsZi7rOT-l8VzAOlA | 3.1万粉 | 律师认证 | 这是婧的抖音号

## 合同协议生成规则
- **超过两页的合同/协议，必须带页码**
- 页码格式：第 X 页 / 共 Y 页，置于页眉或页脚

## 团队花名对照（2026-05-09 确认）

| 花名 | 身份 | 说明 |
|------|------|------|
| 🪼 水母虾 | AirJelly 桌面 AI | 规划、分析、调度层 |
| 🦐 大虾 | 本地 OpenClaw agent | 执行 cron、发飞书、跑脚本；飞书里叫"小龙虾" |
| 🐙 章鱼 | Codex | 总控、任务编排、IDE 层 |
| 🫧 圈圈 | 飞书自建 bot | 专职朋友圈内容日常推送至群组 |

