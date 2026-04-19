# FEASIBILITY_V1 - 本地实现 Claude Code 类系统可行性判断

## 一句话结论

**能做，但不该把目标定义成“复刻官方 Claude Code”；应该定义成“做一个本地可用、适配我们工作流的 Claude Code-like coding agent 系统”。**

---

## 一、为什么“完全复刻”不现实

### 1. 原始官方实现并不完整公开
即使出现了逆向恢复仓，也不是原始上游仓库。
缺失部分仍然包括：
- 私有集成
- 原生绑定
- 动态资源
- 部分类型与构建产物

### 2. 就算拿到近似源码，也不等于拿到原生态能力
真正的能力不只在代码里，还在：
- 后端接口
- 模型接入策略
- 工具权限体系
- 运行环境
- 产品级工作流细节

### 3. 直接复刻会把我们拖进“兼容历史包袱”
如果照着恢复仓硬抄，容易把：
- shim
- fallback
- 兼容层
- 历史目录结构
一起抄进来。
这对我们没有价值。

---

## 二、为什么“本地实现 Claude Code-like 系统”可行

### 我们已经具备的底座

#### 1. 会话与代理能力
- OpenClaw 已有主会话
- 已有子代理 / session / ACP harness 机制
- 已有多线程/多线协作规则

#### 2. 工具能力
- 文件读写
- shell 执行
- 会话调度
- 网页检索
- 本地记忆检索

#### 3. 记忆与恢复能力
- `MEMORY.md`
- `memory/YYYY-MM-DD.md`
- `memory/tasks/ongoing-tasks.md`
- `memory/tasks/recovery-dashboard.md`
- `rules/CONSTANTS.md`
- `rules/MEMORY_SCHEMA.md`

#### 4. 工作流基础
- 已经开始收口任务状态
- 已经建立恢复摘要
- 已经在做仓库清理和同步面收口

所以，我们并不是从 0 开始。
我们缺的不是“能不能做 agent”，而是：
**如何把现有能力收束成一个专用于 coding 的高效模式。**

---

## 三、我们要做的不是“Claude Code 克隆”，而是 4 个核心模块

### 模块 1：Coding Loop
目标：
- 接一个 coding 任务
- 自动读仓
- 规划
- 改文件
- 运行验证
- 汇报结果

最低能力：
- repo scan
- task plan
- file edit
- command run
- verify

### 模块 2：Permission & Risk Layer
目标：
- 区分可自动执行动作和需确认动作
- 防止误删、误发、误部署

最低能力：
- 读 / 写 / 执行 / 外发分级
- 高风险操作前置确认
- 批量动作预览

### 模块 3：Task Recovery Layer
目标：
- 中断后能继续
- 知道做到哪
- 知道卡在哪

最低能力：
- 标准任务状态
- recovery dashboard
- daily note 提升规则
- project/task file 统一入口

### 模块 4：Coding Mode Interface
目标：
- 给用户一个明确的“现在进入编码模式”的体验
- 降低通用聊天模式带来的噪音

最低能力：
- coding 专题项目入口
- coding 任务模板
- 统一汇报格式
- 可选的 CLI/脚本入口

---

## 四、推荐实施路线

### 第一阶段：借壳 OpenClaw，做 Claude Code-like 模式
目标：2-5 天内做出可工作的最小版本

应做：
- 定义 coding-task 模板
- 定义 coding mode 的输入/输出格式
- 定义 coding 专题任务页
- 定义“读仓 → 计划 → 改动 → 验证 → 汇报”的固定流程
- 必要时增加专门的项目目录与脚本

不做：
- 不追求一比一复刻原版交互
- 不先做复杂 UI
- 不先做花哨插件生态

### 第二阶段：补 CLI 化与并行子代理
目标：让 coding 任务更像真正 harness

应做：
- 增加统一入口脚本
- 增加 repo scan / verify helpers
- 增加并行子任务模板
- 增加 patch/review 汇总格式

### 第三阶段：再决定是否抽离成独立系统
只有在以下条件满足时再考虑：
- coding mode 高频使用
- OpenClaw 主系统限制明显
- 已形成稳定模块边界

---

## 五、现在最现实的判断

### 能实现到什么程度？
**70%~85% 的“实用 Claude Code 体验”可以自己做出来。**

能做出的体验包括：
- 读代码
- 拆任务
- 改文件
- 跑命令
- 验证
- 保持任务连续性
- 用子代理并行处理复杂工程任务

### 难以原样复制的部分
- 官方产品级细节打磨
- 原生私有集成
- 某些 Anthropic 内部工作流
- 特定交互手感与历史兼容层

---

## 六、当前建议

**建议立项，但目标名要改。**

不要叫：
- “复刻 Claude Code”

建议叫：
- “本地 Claude Code-like coding harness”
- “本地 coding mode”
- “本地代码代理执行系统”

因为这样目标更清晰，也更能避免一开始就走偏。

---

## 七、下一步研究重点

下一轮我会继续补：
1. Claude Code / OpenClaw / 我们目标系统的能力对比表
2. MVP 模块清单
3. 第一阶段文件结构建议
4. 是否需要引入单独 CLI 包装层
