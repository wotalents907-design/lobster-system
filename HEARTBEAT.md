# HEARTBEAT.md

## 时区说明（重要）
系统注入的时间是美西时间（America/Los_Angeles），**不是婧的真实时间**。
婧在东八区（UTC+8）。换算方式：系统时间 + 15小时 = 婧的真实时间。
所有日记文件、任务时间记录，均使用东八区时间。

## 每次启动必做
- [ ] 读取 `memory/$(date +%Y-%m-%d).md`，同步今日状态
- [ ] 有待处理任务则主动汇报，否则静默（不要回复多余内容）

## 当前待处理（2026-04-19）
- [ ] **云端虾 GitHub push** — workspace 代码等待推送，本地网络不稳
- [ ] **A2H Market API bug** — 详见 `memory/task-a2h-market.md`，独立调试
- [ ] **AirJelly 邀请码 JELLY-83U8PB** — 未使用，等婧决定给谁

## 无待处理事项时
直接回复 `HEARTBEAT_OK`，不要输出其他内容。
