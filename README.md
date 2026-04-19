# lobster-system

445992律师AI协作系统 - 云端虾工作区

## 目录结构

```
lobster-system/
├── skills/               # 技能目录（22个技能）
├── rules/                # 规则文档（协作协议/汇报模板/权责边界）
├── memory/               # 记忆文件（每日笔记/长期记忆/项目记忆）
├── projects/             # 项目目录（各专项工作计划）
├── tasks/                # 任务追踪
├── docs/                  # 文档（协作流程/启动文件/接入方案）
├── 素材库/                # 图片素材
├── AGENTS.md             # Agent定义
├── USER.md               # 用户档案
├── SOUL.md               # 人格定义
├── HEARTBEAT.md          # 心跳巡逻规则
└── README.md
```

## 云端虾角色

- **名称**：云端虾
- **部署**：VPS（腾讯云）
- **定位**：并行研究Agent，负责飞书工具链/记忆/技能同步

## 同步规则

每次重要操作后自动同步到GitHub。
技能变更后立即推送，本地虾通过`git pull`获取。

## 主要技能

| 技能 | 功能 |
|------|------|
| feishu-doc-cn | 飞书文档 |
| feishu-wiki | 飞书知识库 |
| feishu-sheets-skill | 飞书表格 |
| feishu-api-bitable | 飞书多维表格 |
| feishu-edge-tts-voice | 飞书语音 |
| legalbot | 法律机器人 |
| feishu-chatrecord-ocr | 聊天记录OCR |
| lobster-training | 龙虾训练 |
| douyin-messager | 抖音消息 |
| douyin-video-analysis | 抖音视频分析 |
| pdf-processing | PDF处理 |
| document-summary | 文档摘要 |
| web-scraping | 网页抓取 |
| openclaw-tavily-search | 网络搜索 |
| github | GitHub |
| clawhub | 技能市场 |
| tencent-docs | 腾讯文档 |
| tencent-cos-skill | 腾讯云COS |
| tencentcloud-lighthouse | 腾讯云轻量应用服务器 |
| tencent-meeting-skill | 腾讯会议 |
| agent-browser-clawdbot | 浏览器自动化 |
| memory-hygiene | 记忆清理 |
| summarize | 摘要 |
