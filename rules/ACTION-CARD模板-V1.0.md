# ACTION-CARD 模板 V1.0

## 什么是 ACTION-CARD

ACTION-CARD 是云端虾发给本地虾的结构化动作指令。
本地虾只认此格式，不认情绪化废话。

---

## 格式

```markdown
# ACTION-CARD

## 任务信息
- task_id:        # GitHub 任务ID，例：2026-04-02-001
- task_name:      # 任务名称
- created_by:     # 云端虾
- created_at:     # ISO时间

## 执行信息
- action_type:   # 执行类型（见下方类型清单）
- target:        # 目标平台或对象
- priority:      # high / normal / low
- confirmation_required: yes / no

## 输入材料
- input_material:   # 具体输入内容
  - ...

## 动作详情
- step_1: ...
- step_2: ...
- step_3: ...

## 预期输出
- expected_output:  # 成功时应该输出什么

## 风险提示
- risk_level: L1 / L2 / L3
- risk_notes:       # 可能的失败点和注意事项

## 失败处理
- fallback_rule: 失败时如何处理
  - fail_action: 截图 / 返回错误 / 重试 / 人工介入
  - fail_notify:  yes / no
```

---

## action_type 类型清单

| type | 说明 | 必须本地执行 |
|------|------|-------------|
| browser_action | 浏览器自动化操作 | yes |
| platform_reply | 平台回复（评论/私信） | yes |
| file_fetch | 读取本地文件/素材 | yes |
| clipboard | 剪贴板读写 | yes |
| publish_draft | 发布草稿到平台 | yes |
| api_call | 调用外部API | no |
| data_collect | 数据采集/整理 | no |
| content_generate | 内容生成 | no |

---

## 示例

```markdown
# ACTION-CARD

## 任务信息
- task_id: 2026-04-02-001
- task_name: 回复公众号评论区
- created_by: 云端虾
- created_at: 2026-04-02T16:00:00+08:00

## 执行信息
- action_type: platform_reply
- target: 微信公众号-婧律纪事
- priority: normal
- confirmation_required: no

## 输入材料
- input_material:
  - 原评论: "请问这个功能怎么使用？"
  - 回复话术: "您好，该功能请参考我们的使用指南：xxx"
  - 目标位置: 评论区第3条

## 动作详情
- step_1: 打开微信公众号后台
- step_2: 定位到评论区第3条
- step_3: 输入回复话术
- step_4: 点击发送

## 预期输出
- expected_output: 回复成功发送，截图确认

## 风险提示
- risk_level: L2
- risk_notes: 需要确认登录态有效；避免重复发送

## 失败处理
- fallback_rule:
  - fail_action: 截图并返回错误信息
  - fail_notify: yes
```

---

## 使用规则

1. 本地虾收到 ACTION-CARD 后必须绑定 task_id 才能执行
2. 未给出 target_platform 不得执行
3. confirmation_required=yes 时，执行前必须截图确认
4. 执行完成后必须返回结果（success/failed/截图）
5. 失败时必须按 fallback_rule 处理并通知
