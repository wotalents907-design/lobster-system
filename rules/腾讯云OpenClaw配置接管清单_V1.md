# 腾讯云 OpenClaw 配置接管清单 V1

## 一、接管对象
- 环境：腾讯云服务器上的 OpenClaw
- SSH 别名：`txy-openclaw`
- 登录用户：`ubuntu`
- 主机名：`VM-0-6-ubuntu`
- 当前配置文件：`/home/ubuntu/.openclaw/openclaw.json`

## 二、当前已写入配置

### 1. Google AI
已写入：
- provider: `google`
- baseUrl: `https://generativelanguage.googleapis.com/v1beta/openai`
- api: `google-generative-ai`
- models:
  - `gemini-2.5-pro`
  - `gemini-2.5-flash`

### 2. Feishu
当前已写入并识别正常：
- appId：第一套（腾讯云专用）
- appSecret：第一套（腾讯云专用）
- encryptKey：已写入
- verificationToken：已写入
- domain：`xcnh9hfl25ws.feishu.cn`
- 状态：`Feishu ON / OK / configured`

### 3. Gateway
当前已写入：
- `gateway.mode = local`
- gateway auth token 已自动生成
- 当前地址：`ws://127.0.0.1:18789`

## 三、当前未补全项目

### 1. OpenRouter
待补回：
- provider: `openrouter`
- baseUrl: `https://openrouter.ai/api/v1`
- api: `openai-completions`
- 核心模型：`openai/gpt-5.3-chat`

### 2. DeepSeek
待补回：
- provider: `deepseek`
- baseUrl: `https://api.deepseek.com/v1`
- api: `openai-completions`
- 可用模型建议：
  - `deepseek-chat`
  - `deepseek-reasoner`

### 3. 默认模型策略
待补：
- 主模型：`gemini-2.5-pro`
- 默认/快速模型：`gemini-2.5-flash`

## 四、当前状态判断

### 已恢复可用
- `openclaw status` 可正常读取
- Gateway reachable
- Gateway service running
- Feishu configured

### 尚未闭环
- 模型配置未补齐
- 双备份未执行
- 安全策略未收紧

## 五、双备份目标目录

### 云端备份目录
- `/home/ubuntu/openclaw-backups/`

### 本地备份目录
- `/Users/jingboss/.openclaw/workspace/openclaw-backups/tencent-cloud/`

### 命名建议
- `openclaw-YYYY-MM-DD-HHMM.json`
- 示例：`openclaw-2026-03-26-0445.json`

## 六、后续接管顺序（建议）
1. 先补 OpenRouter / DeepSeek / 默认模型
2. 执行 `openclaw status` 验收
3. 立即做双备份
4. 输出安全收口建议

## 七、注意事项
- 不再假设 root 下存在旧配置
- 不再走“从 root 迁回 ubuntu”思路
- 当前腾讯云实例处于“本地模式（local）”，并非默认公网开放模式
- 若后续要支持跨设备连接，需单独设计 bind / 认证 / 网络暴露方案
