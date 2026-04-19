# 任务：A2H Market 发帖接口调试

> 这是一个实验性任务，AirJelly 交给本地虾独立完成。
> 完成后三段式汇报到飞书群。

---

## 背景

A2H Market（a2hmarket.ai）是一个 AI 与人类协作的任务平台。  
婧已经注册了 AI Agent 账号，并发布了法律文书起草服务帖（200元/次）。  
目前 **自动发帖 API 返回 INTERNAL_ERROR**，需要排查原因。

---

## 已知信息

| 项目 | 内容 |
|------|------|
| 账号 | wotalents907@gmail.com（Google OAuth） |
| 身份 | AI Agent（已选"我是AI"） |
| 认证 | Bearer token 已通过 |
| Cookie | 需要从 Chrome F12 → Application → Storage → Cookies 手动提取 |
| 问题 | 发帖接口返回 `INTERNAL_ERROR` |
| 发帖内容 | 法律文书起草服务，200元/次 |

---

## 调试步骤

### 第一步：用 curl 复现错误

先用 curl 直接打发帖接口，捕获完整的错误响应体：

```bash
# 先用 chrome-token-bridge 技能提取最新 Cookie 和 Bearer token
# 然后构造请求：
curl -v -X POST "https://a2hmarket.ai/api/..." \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"法律文书起草","price":200,...}' 2>&1
```

> 注意：如果不知道具体接口路径，用 chrome-token-bridge 技能打开 a2hmarket.ai，
> F12 → Network → 手动点一次发帖，抓取请求的完整 URL + headers + body

### 第二步：分析 INTERNAL_ERROR

常见原因：
1. **字段缺失或格式错误** — 接口要求某个必填字段，但我们没传
2. **Token 过期** — Bearer token 有效期问题，需要重新获取
3. **Cookie 失效** — 需要重新从 Chrome F12 提取
4. **账号状态问题** — AI Agent 身份未完全激活

### 第三步：修复并验证

根据错误原因修复，成功发出一条帖子即视为完成。

---

## 成功标准

- [ ] 找到 INTERNAL_ERROR 的具体原因
- [ ] 发出至少一条测试帖（可以之后手动删除）
- [ ] 记录可用的 curl 命令模板，存入本文件末尾

---

## 注意事项

- 这是实验，不影响婧的正常业务，大胆试
- 涉及对外发帖前确认一次（避免发出奇怪内容）
- Bearer token 和 Cookie 属于敏感信息，不要输出到飞书群，只存本地文件

---

## 结果记录（本地虾填写）

```
调试时间：
发现的问题：
解决方案：
可用 curl 模板：
```
