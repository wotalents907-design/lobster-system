# ongoing-tasks

> 说明:本文件用于跨 session 恢复正在推进中的事项。任务状态统一遵循 `rules/CONSTANTS.md`。

## 项目任务

### [TASK-CLAUDECODE-001] 本地实现 Claude Code 类系统专题研究
- 类型:项目
- 状态:ACTIVE
- 优先级:P0
- 责任人:ASSISTANT
- 创建时间:2026-04-05 00:05
- 最后更新:2026-04-05 00:15
- 来源:用户提出
- 当前卡点:第一轮可行性判断已完成,但能力对比、MVP 结构、记忆检索员机制和 coding mode 落地方案还需继续细化
- 下一步:继续输出能力对比表与第一阶段实施方案,并把视频/仓库里的高价值架构点逐步转成我们的系统升级任务
- 用户待确认:无
- 关联文件:`projects/claudecode-local-study/README.md`、`projects/claudecode-local-study/FEASIBILITY_V1.md`、`projects/claudecode-local-study/INSIGHTS_FROM_VIDEO_V1.md`、`projects/claudecode-local-study/UPGRADE_CHECKLIST_V1.md`
- 上次做到:已完成第一版可行性判断,并根据用户转写视频内容沉淀出可借鉴点与升级清单第一版
- 备注:该任务不是吃瓜任务,而是直接服务于我们自己的本地能力建设决策


### [TASK-CLOUDSHRIMP-BOOTFILE-001] 云端虾启动文件 v1
- 类型:项目
- 状态:ACTIVE
- 优先级:P0
- 责任人:JOINT
- 创建时间:2026-04-04 23:53
- 最后更新:2026-04-04 23:53
- 来源:用户提出
- 当前卡点:云端虾尚未完成可交付初稿,存在"隔天忘任务""有做没回"的稳定性问题
- 下一步:由我统筹分派与验收;云端虾产出启动文件初稿,补齐续接机制与固定汇报格式
- 用户待确认:无,用户已明确要求直接推进并跟踪到完成
- 关联文件:`projects/agent-capability-upgrade/UNIFIED_RULES_V1.md`、`projects/agent-capability-upgrade/GRAPH_MEMORY_SCHEMA_V1.md`
- 上次做到:已完成任务定义、目标拆解与统筹安排,待执行方回传产物
- 备注:本任务目标是让云端虾启动后知道自己该读什么、当前有什么未完成任务、如何持续跟进并回复
- [DECIDED_BY] USER
- 决策:该事项不再停留在讨论层,由我负责安排分工、节点确认、必要支持和结果汇总
- 原因:用户明确要求不是讨论,而是追踪到底、确认没有卡点、完全完成任务
- 生效时间:2026-04-04 23:53


### [TASK-WX-001] 公众号双号内容系统
- 类型:项目
- 状态:CANCELLED
- 优先级:P3
- 责任人:JOINT
- 创建时间:2026-03-29 00:00
- 最后更新:2026-04-07 04:46
- 来源:用户提出
- 当前卡点:用户已明确表示"公众号，你先不管了"，项目暂时搁置
- 下一步:无，项目已暂停
- 用户待确认:无
- 关联文件:`projects/wechat-content-system/docs/strategy.md`、`projects/wechat-content-system/docs/workflow.md`、`projects/wechat-content-system/data/accounts.json`、`projects/wechat-content-system/data/topics.json`、`projects/wechat-content-system/data/schedule.json`、`projects/wechat-content-system/templates/client_account.md`、`projects/wechat-content-system/templates/peer_account.md`、`projects/wechat-content-system/scripts/dashboard.py`、`projects/wechat-content-system/scripts/topic_router.py`
- 上次做到:已完成双号策略文档、流程文档、数据文件、模板文件、脚本骨架初始化
- 备注:项目暂时搁置，保留现有成果供未来可能重启使用
- [DECIDED_BY] USER
- 决策:公众号项目暂时搁置，不再作为当前高优先级主线推进
- 原因:用户当前业务优先级调整
- 生效时间:2026-04-07 04:46

### [TASK-AGENT-001] 轻量版子代理试运行
- 类型:项目
- 状态:ACTIVE
- 优先级:P1
- 责任人:ASSISTANT
- 创建时间:2026-03-29 00:00
- 最后更新:2026-04-07 04:49
- 来源:派生任务
- 当前卡点:多线程协作规则已初步明确，但具体分工模型、冲突解决机制和实际试运行案例尚未完全落地
- 下一步:细化多线程分工模型（主线程/信息线程/执行线程/校验线程），建立冲突解决协议，开展实际试运行
- 用户待确认:无
- 关联文件:`MEMORY.md`、`memory/2026-04-03.md`、`memory/2026-04-04.md`
- 上次做到:用户于2026-04-03明确确认多步骤项目默认按多线程/多线协作思路处理，并制定了多线程分工口径与禁止事项
- 备注:多线程分工模型：主线程负责对话/判断/收口；信息线程负责检索/回读/摘要；执行线程负责文件/脚本/落盘；校验线程负责一致性/风险/遗漏复核
- [DECIDED_BY] USER
- 决策:对多步骤项目、可拆模块任务、需"查资料 + 写文件 + 验证"并行推进的任务，默认按多线程/多线协作思路处理
- 原因:提高任务执行效率，避免机械串行推进
- 生效时间:2026-04-03

### [TASK-MEM-001] 跨 session 任务恢复机制升级
- 类型:项目
- 状态:✅ DONE
- 优先级:P0
- 责任人:ASSISTANT
- 创建时间:2026-04-04 23:40
- 最后更新:2026-04-07 04:52
- 来源:用户提出
- 当前卡点:✅ 已完成2026-04-03 / 2026-04-04 的跨天事项清洗，识别并提升了4个关键事项到统一任务视图
- 下一步:无，本轮清洗已完成
- 用户待确认:无
- 关联文件:`rules/CONSTANTS.md`、`rules/MEMORY_SCHEMA.md`、`memory/tasks/ongoing-tasks.md`、`memory/tasks/recovery-dashboard.md`、`AGENTS.md`、`memory/2026-04-03.md`、`memory/2026-04-04.md`、`memory/2026-04-07.md`
- 上次做到:已完成跨天事项清洗，新增了[TASK-AGENT-ROLES-001]、更新了[TASK-AGENT-001]和[TASK-CLOUDSHRIMP-BOOTFILE-001]、创建了[TASK-EVOLUTION-SYSTEM-001]，并更新了所有相关状态
- 备注:本轮清洗显著改善了任务恢复机制，跨天事项现在有统一的任务视图跟踪
- [DECIDED_BY] USER
- 决策:只要用户没有明确反对、叫停或改向,不用等待提示命令,应默认主动推进并完成任务
- 原因:用户不接受低效、反锁式、等待命令式协作体验
- 生效时间:2026-04-04 23:56

### [TASK-CLOUD-001] 云端 OpenClaw 托管实例收口排查
- 类型:项目
- 状态:ACTIVE
- 优先级:P1
- 责任人:ASSISTANT
- 创建时间:2026-04-03 00:00
- 最后更新:2026-04-04 23:56
- 来源:用户提出
- 当前卡点:已确认腾讯云轻量应用托管层在跑 OpenClaw,但裸 shell 环境与托管层状态存在割裂,后续修复路径尚未完全收口
- 下一步:后续优先围绕腾讯云托管实例本身做状态核验、入口梳理和修复方案,避免在 SSH 环境另装一套造成双实例打架
- 用户待确认:无
- 关联文件:`memory/2026-04-03.md`
- 上次做到:已确认根因不是"整机没装",而是"托管层有 OpenClaw,裸 shell 无 openclaw/node"
- 备注:这是跨天基础设施问题,后续若继续推进应保持单一修复主线

### [TASK-FEISHU-001] 主会话飞书文档工具白名单问题修复
- 类型:项目
- 状态:BLOCKED
- 优先级:P1
- 责任人:ASSISTANT
- 创建时间:2026-04-03 00:00
- 最后更新:2026-04-04 23:56
- 来源:排查派生
- 当前卡点:插件层已确认正常,但当前 main agent 主会话工具白名单未放行 `feishu_doc` / `feishu_wiki` / `feishu_drive`
- 下一步:后续应查明并修复 main agent 的 policy tool projection / tool whitelist 投影问题
- 用户待确认:无
- 关联文件:`memory/2026-04-03.md`、`TOOLS.md`
- 上次做到:已确认并非飞书插件未装,而是主会话工具白名单层未投影相关工具
- 备注:当前不能再误判为"已具备主会话直写飞书文档能力"

### [TASK-BROWSER-001] 多平台后台浏览器协同能力建设
- 类型:项目
- 状态:ACTIVE
- 优先级:P1
- 责任人:ASSISTANT
- 创建时间:2026-04-03 00:00
- 最后更新:2026-04-04 23:56
- 来源:用户提出
- 当前卡点:自动化浏览器会话与人类浏览器登录态尚未打通,当前不能稳定继承后台登录态
- 下一步:后续统一按 OpenClaw 独立 browser profile 或显式 user attach 路径建设后台协同能力,而不是继续赌现成人类登录态复用
- 用户待确认:无
- 关联文件:`memory/2026-04-03.md`
- 上次做到:已确认能力本身存在,真正未打通的是登录态继承/浏览器会话对齐
- 备注:该任务属于公众号后台、抖音后台、视频号后台、小红书后台的一类能力建设主线

### [TASK-CLOUDSHRIMP-BOOTFILE-001] 云端虾启动文件 v1 持续跟踪
- 类型:项目
- 状态:ACTIVE
- 优先级:P1
- 责任人:JOINT
- 创建时间:2026-04-04 00:00
- 最后更新:2026-04-07 22:31
- 来源:用户提出
- 当前卡点:云端虾稳定性问题已明确收口方向，但仍需把“启动强制回读、四节点留痕、三段式汇报、超时主动汇报”真正并入日常执行
- 下一步:按新产出的协作简报与启动补丁推进试运行，并验证是否明显减少“隔天忘任务 / 有做没回”
- 用户待确认:无
- 关联文件:`projects/agent-capability-upgrade/`、`memory/2026-04-04.md`、`archive/repo-cleanup-2026-04-04/`、`memory/2026-04-07.md`、`projects/cloud-shrimp-sync/CLOUDSHRIMP_COORDINATION_BRIEF_2026-04-07.md`、`projects/cloud-shrimp-sync/CLOUDSHRIMP_BOOTFILE_PATCH_2026-04-07.md`
- 上次做到:已补出《云端虾协作推进简报》和启动文件补丁，明确云端虾承接动作、转本地边界、固定节奏与最小修补措施
- 备注:这是多代理一致性与抗失忆升级的关键部分，需要通过试运行验证修补是否生效

### [TASK-EVOLUTION-SYSTEM-001] 虾子进化系统集成与部署
- 类型:项目
- 状态:ACTIVE
- 优先级:P0
- 责任人:ASSISTANT
- 创建时间:2026-04-07 04:50
- 最后更新:2026-04-07 04:50
- 来源:daily note 提升（2026-04-07）
- 当前卡点:虾子进化系统v1.0已完成全功能实现，部署工作已启动，正在建立基础目录结构
- 下一步:集成内存持久化钩子（session-start/session-end/pre-compact），解决跨会话失忆问题
- 用户待确认:无，按计划推进
- 关联文件:`memory/2026-04-07.md`、`projects/agent-evolution-system/`、`memory/accidents/`
- 上次做到:已创建 `memory/accidents/` 目录，完成部署第一步
- 备注:基于ECC理念实现，解决跨会话失忆和本能学习问题，用户已确认"集成"

### [TASK-REPO-001] 仓库旧文件与同步冲突清理
- 类型：项目
- 状态：ACTIVE
- 优先级：P0
- 责任人：ASSISTANT
- 创建时间：2026-04-04 23:58
- 最后更新：2026-04-04 23:59
- 来源：用户提出
- 当前卡点：顶层重复文件、临时文件和一批大型外来仓已隔离，但主仓中仍需继续判断哪些历史资料目录应收口、哪些项目文件应保留为唯一入口
- 下一步：继续清理主仓内的历史资料目录与重复说明文件，进一步压缩同步主面，只保留当前真实生效的规则、记忆、项目与必要文档
- 用户待确认：无
- 关联文件：`archive/repo-cleanup-2026-04-04/`、`memory/tasks/recovery-dashboard.md`
- 上次做到：已将顶层 `CLOUD_SYNC_PACK.md`、`HANDOFF.md`、`ROLE_LOCAL.md` 及若干截图、临时文件移入归档隔离目录，并将 `awesome-openclaw-skills`、`ansible-skill`、`mcp-ssh-manager`、`tools`、`.clawhub` 移出主同步面
- 备注：用户已明确授权我整理和删除无用文档；当前仍优先采用"先隔离、后复核、再删除"的稳妥策略，以降低同步歧义与误删风险

### [TASK-MEMORY-RETRIEVAL-001] 记忆检索Loop验证（T-02）
- 类型：项目
- 状态：ACTIVE
- 优先级：P0
- 责任人：JOINT
- 创建时间：2026-04-06 21:55
- 最后更新：2026-04-06 23:26
- 来源：用户提出
- 当前卡点：✅ 本地虾已完成 memory_search 功能验证，工具可用
- 下一步：云端虾继续推进记忆层研究，本地虾配合后续测试
- 用户待确认：无
- 关联文件：`memory/2026-04-06.md`
- 上次做到：本地虾已验证 memory_search 工具完全可用，阻塞已解除
- 备注：记忆检索功能验证完成，云端虾可继续推进研究

### [TASK-AGENT-ROLES-001] 多代理角色稳定性与职责调整
- 类型：项目
- 状态：ACTIVE
- 优先级：P1
- 责任人：ASSISTANT
- 创建时间：2026-04-07 04:48
- 最后更新：2026-04-07 04:48
- 来源：daily note 提升（2026-04-03）
- 当前卡点：秘书虾出现故障，云端虾暂不降级作为稳定备援协调层，长期是否弱化云端虾取决于秘书虾稳定性验证结果
- 下一步：持续监控秘书虾稳定性，根据验证结果调整云端虾角色定位
- 用户待确认：无
- 关联文件：`memory/2026-04-03.md`、`ROLE_CLOUD.md`、`ROLE_LOCAL.md`
- 上次做到：已记录当前多节点协作结构为：本地虾=第一执行主脑/第一收口主脑；云端虾=常驻协调主脑/在线值守主脑；秘书虾=飞书前台秘书协调位
- 备注：这是代理角色管理的持续性跟踪事项，需要根据各代理稳定性动态调整

### [TASK-MULTI-AGENT-RULES-001] 多虾协作规则文档（T-08）
- 类型：项目
- 状态：✅ DONE
- 优先级：P1
- 责任人：ASSISTANT
- 创建时间：2026-04-06 21:55
- 最后更新：2026-04-07 18:11
- 来源：用户提出
- 当前卡点：✅ 已完成收尾工作
- 下一步：集成到日常协作，定期优化更新
- 用户待确认：无
- 关联文件：`projects/multi-agent-collaboration/RULES.md`、`MEMORY.md`、`memory/2026-04-07.md`
- 上次做到：已完成完整规则文档，包含职责边界、工作区划分、交接协议、质量检查、升级判断、固定格式汇报、冲突解决和持续改进机制
- 备注：多代理协作基础设施完成，可立即投入使用

### [TASK-DAILY-REPORT-001] 每日汇报检查点（T-09）
- 类型：项目
- 状态：✅ DONE
- 优先级：P1
- 责任人：ASSISTANT
- 创建时间：2026-04-06 21:55
- 最后更新：2026-04-07 18:11
- 来源：用户提出
- 当前卡点：✅ 已完成收尾工作
- 下一步：实施自动化检查机制，集成到日常汇报
- 用户待确认：无
- 关联文件：`projects/daily-report-system/CHECKPOINTS.md`、`MEMORY.md`、`memory/2026-04-07.md`
- 上次做到：已完成完整检查点系统，包含每日固定检查点（早中晚）、任务级检查点（启动/里程碑/阻塞/完成）、自动化触发机制、质量保证和实施集成方案
- 备注：日常协作效率提升机制完成，可立即投入使用
