# 虾子进化系统部署指南

## 系统概述
基于 Everything-Claude-Code 优化理念的虾子自我进化系统，实现跨会话记忆持久化、本能学习和技能自动生成。

## 部署状态

### ✅ 已完成组件
1. **会话启动钩子** (`hooks/session-start.js`)
   - 加载近期记忆（今天+昨天）
   - 加载活跃任务
   - 加载近期本能
   - 生成恢复摘要

2. **本能提取系统** (`scripts/extract-instincts.js`)
   - 从 daily notes 提取8类模式
   - 自动去重和合并
   - 置信度评分
   - JSON格式保存

3. **会话结束钩子** (`hooks/session-end.js`)
   - 更新会话统计
   - 自动运行本能提取
   - 生成会话总结

4. **压缩前钩子** (`hooks/pre-compact.js`)
   - 备份关键文件
   - 提取关键信息
   - 生成压缩建议
   - 自动清理旧备份

5. **钩子配置** (`config/hooks.json`)
   - SessionStart 钩子
   - Stop 钩子（会话结束）
   - PreCompact 钩子

6. **测试系统** (`test-evolution.js`)
   - 目录结构检查
   - 模块功能测试
   - 本能提取验证

### 📊 实际测试结果
- **本能提取**: 成功从7天 daily notes 提取24个本能
- **模式识别**: 识别出15个用户偏好、2个问题解决、3个工作流、4个协作模式
- **会话恢复**: 成功加载1天记忆、13个活跃任务
- **系统稳定性**: 所有模块加载正常

## 部署步骤

### 第一步：环境准备
```bash
# 确保目录结构
mkdir -p ~/.openclaw/workspace/projects/shrimp-evolution/{hooks,scripts,instincts/clusters,skills-generated,config,session-summaries}

# 安装 Node.js 依赖（如果需要）
cd ~/.openclaw/workspace/projects/shrimp-evolution
npm init -y
```

### 第二步：集成到 OpenClaw
1. 复制钩子配置到 OpenClaw 设置：
   ```bash
   # 查看当前 OpenClaw 配置
   openclaw config get
   
   # 手动将 config/hooks.json 内容合并到 ~/.openclaw/config.json
   # 或使用配置命令添加
   ```

2. 或者通过环境变量启用：
   ```bash
   export SHRIMP_EVOLUTION_ENABLED=1
   export CLAUDE_HOOKS_PATH=~/.openclaw/workspace/projects/shrimp-evolution/config/hooks.json
   ```

### 第三步：测试集成
```bash
# 测试会话启动
node ~/.openclaw/workspace/projects/shrimp-evolution/hooks/session-start.js

# 测试本能提取
node ~/.openclaw/workspace/projects/shrimp-evolution/scripts/extract-instincts.js

# 测试完整流程
node ~/.openclaw/workspace/projects/shrimp-evolution/test-evolution.js
```

### 第四步：设置定时任务
```bash
# 每日本能提取（可选）
crontab -e
# 添加：0 2 * * * node ~/.openclaw/workspace/projects/shrimp-evolution/scripts/extract-instincts.js
```

## 配置说明

### 钩子触发时机
1. **SessionStart**: 新会话开始时，恢复上下文
2. **Stop**: 每次响应结束时，保存状态和提取本能
3. **PreCompact**: 上下文压缩前，备份关键信息

### 本能提取配置
- **提取范围**: 最近7天 daily notes
- **模式类型**: 8类检测器（用户偏好、任务状态、决策记录等）
- **置信度**: 基于类型、上下文长度、重复出现计算
- **输出格式**: JSON + 聚类目录

### 备份策略
- **关键文件**: ongoing-tasks.md, recovery-dashboard.md, MEMORY.md
- **保留策略**: 最近5个备份
- **清理时机**: 每次压缩前自动清理

## 使用说明

### 日常使用
1. **会话开始**: 自动恢复记忆和任务
2. **工作期间**: 正常使用，系统自动观察
3. **会话结束**: 自动提取本能和保存状态
4. **压缩前**: 自动备份和建议

### 监控和维护
```bash
# 查看会话统计
cat ~/.openclaw/workspace/projects/shrimp-evolution/session-stats.json

# 查看最近本能
ls -la ~/.openclaw/workspace/projects/shrimp-evolution/instincts/

# 查看会话总结
ls -la ~/.openclaw/workspace/projects/shrimp-evolution/session-summaries/
```

### 故障排除
1. **钩子不执行**: 检查 OpenClaw 配置和权限
2. **本能提取失败**: 检查 daily notes 格式和权限
3. **备份失败**: 检查磁盘空间和目录权限
4. **性能问题**: 调整提取范围或禁用非关键钩子

## 性能考虑

### 资源使用
- **内存**: 每个钩子约10-50MB
- **CPU**: 本能提取可能较耗时（解析大量文本）
- **磁盘**: 备份文件占用空间，自动清理控制

### 优化建议
1. **生产环境**: 调整提取范围为3天
2. **低资源环境**: 禁用压缩前备份
3. **高频使用**: 增加备份保留数量
4. **大规模部署**: 考虑数据库存储本能

## 扩展计划

### 短期扩展（1-2周）
1. **技能生成器**: 基于本能聚类自动生成 SKILL.md
2. **本能聚类**: 相似本能聚合成高级模式
3. **质量评估**: 本能质量评分和过滤

### 中期扩展（3-4周）
1. **多代理协调**: 三虾协作模式优化
2. **验证循环**: 任务完成质量验证
3. **安全扫描**: 配置和模式安全检查

### 长期愿景（1-2月）
1. **完全自主进化**: 虾子自我改进工作流
2. **跨实例同步**: 多设备记忆同步
3. **社区共享**: 本能和技能共享生态

## 成功指标

### 定量指标
- **失忆减少**: 跨会话上下文恢复成功率 >90%
- **效率提升**: 重复工作自动化率 >50%
- **学习质量**: 高置信度本能比例 >30%
- **系统稳定性**: 钩子执行成功率 >95%

### 定性指标
- **用户体验**: 更少的手动恢复操作
- **协作效率**: 三虾分工更清晰
- **进化能力**: 虾子能从经验中学习
- **系统智能**: 自动识别和优化工作模式

## 支持与反馈

### 问题报告
1. GitHub Issues: [项目地址]
2. 飞书群组: 虾子进化系统反馈
3. 邮件: shrimp-evolution@example.com

### 文档更新
- 每次重大更新后更新本文档
- 记录配置变更和兼容性说明
- 维护故障排除指南

---

**部署时间**: 2026-04-07  
**部署版本**: v1.0.0  
**部署人员**: 本地虾  
**状态**: ✅ 就绪部署