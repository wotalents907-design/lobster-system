# 本地执行类 SKILL 规范 V1.0

## 目的

让本地虾能执行的 skill 必须写成「可操作的技能手册」，不是提示词。

---

## 目录结构

```plain_text
/SKILLS/
  platform_reply.md        # 平台回复类
  publish_draft.md        # 发布草稿类
  local_file_fetch.md     # 本地文件读取类
  browser_action.md       # 浏览器自动化类
  clipboard.md            # 剪贴板操作类
```

---

## 每份 SKILL 的固定结构

```markdown
# SKILL: [技能名称]

## 基本信息
- skill_id:       # 例：SKILL-001
- version:         # 例：V1.0
- author:          # 创建者
- created_at:      # 创建时间
- updated_at:      # 更新时间

## 技能概述
- description:     # 一句话说清这个技能做什么
-适用场景:         # 什么情况下用这个技能

## 执行位置
- execution_location: local_only / cloud_preferred / any
- 说明: local_only = 必须本地执行; cloud_preferred = 优先云端; any = 都可以

## 输入格式
- input_format:
  - 参数1: 说明
  - 参数2: 说明

## 输出格式
- output_format:
  - success: 成功时的返回格式
  - failed: 失败时的返回格式

## 执行步骤
- step_1: ...
- step_2: ...
- step_3: ...

## 依赖要求
- dependencies:     # 执行前需要确认的条件
  - 需要登录态: yes/no
  - 需要本地文件: yes/no
  - 需要浏览器: yes/no
- required_env:     # 需要的环境变量

## 风险等级
- risk_level: L1 / L2 / L3
  - L1: 低风险，自动执行
  - L2: 中风险，需要确认
  - L3: 高风险，必须人工审批

## 失败处理
- fallback:
  - 失败表现: ...
  - 处理方式: ...
  - 通知要求: ...

## 示例
```bash
# 调用示例
SKILL=SKILL-001 INPUT='...' python scripts/skill_runner.py
```
```

---

## 示例：公众号回复 SKILL

```markdown
# SKILL: SKILL-001
## platform_reply

## 基本信息
- skill_id: SKILL-001
- version: V1.0
- description: 在微信公众号回复用户评论
- 适用场景: 需要以公众号身份回复评论时使用

## 执行位置
- execution_location: local_only
- 说明: 必须本地执行，因为需要公众号登录态

## 输入格式
- input_format:
  - platform: 固定为 "wechat"
  - comment_id: 评论ID或位置
  - reply_content: 回复内容
  - article_id: 文章ID（可选）

## 输出格式
- output_format:
  - success: {"status": "success", "comment_id": "xxx"}
  - failed: {"status": "failed", "error": "xxx"}

## 执行步骤
- step_1: 打开微信公众平台后台
- step_2: 登录有效账号
- step_3: 定位到目标文章评论区
- step_4: 找到目标评论
- step_5: 输入回复内容
- step_6: 点击发送
- step_7: 截图确认

## 依赖要求
- dependencies:
  - 需要登录态: yes（公众号后台登录态）
  - 需要本地文件: no
  - 需要浏览器: yes
- required_env:
  - WECHAT_APPID
  - WECHAT_APPSECRET

## 风险等级
- risk_level: L2
- 说明: 回复发送后不可撤回，需要确认

## 失败处理
- fallback:
  - 失败表现: 无法登录、评论不存在、发送失败
  - 处理方式: 截图并返回错误信息
  - 通知要求: 失败时通知秘书虾
```

---

## 命名规则

- 文件名：小写+下划线，例 `platform_reply.md`
- skill_id：SKILL-XXX，例 SKILL-001
- 版本号：V1.0 / V1.1 格式

---

## 更新规则

1. 每次更新需要记录 updated_at 和 version
2. 大改版本号 +1，小改日期 +1
3. 更新后 push 到 GitHub，本地虾 pull 同步
