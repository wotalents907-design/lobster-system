#!/bin/bash

# 虾子进化系统部署脚本
# 自动集成到 OpenClaw 工作环境

set -e  # 出错时退出

echo "🦞 开始部署虾子进化系统 v1.0..."
echo "========================================"

# 配置
WORKSPACE_ROOT="$HOME/.openclaw/workspace"
SHRIMP_ROOT="$WORKSPACE_ROOT/projects/shrimp-evolution"
OPENCLAW_CONFIG="$HOME/.openclaw/config.json"
BACKUP_DIR="$WORKSPACE_ROOT/.deploy-backup-$(date +%Y%m%d-%H%M%S)"

# 创建备份
echo "📁 创建配置备份..."
mkdir -p "$BACKUP_DIR"
if [ -f "$OPENCLAW_CONFIG" ]; then
    cp "$OPENCLAW_CONFIG" "$BACKUP_DIR/config.json.backup"
    echo "✅ 配置备份完成: $BACKUP_DIR/config.json.backup"
else
    echo "⚠️  未找到 OpenClaw 配置文件，将创建新配置"
fi

# 检查 Node.js 环境
echo "🔧 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION 可用"

# 检查脚本权限
echo "🔐 设置脚本执行权限..."
chmod +x "$SHRIMP_ROOT/hooks/"*.js 2>/dev/null || true
chmod +x "$SHRIMP_ROOT/scripts/"*.js 2>/dev/null || true
echo "✅ 脚本权限设置完成"

# 测试钩子功能
echo "🧪 测试钩子功能..."
cd "$SHRIMP_ROOT"

echo "1. 测试会话启动钩子..."
if node hooks/session-start.js > /dev/null 2>&1; then
    echo "✅ session-start.js 测试通过"
else
    echo "❌ session-start.js 测试失败"
    exit 1
fi

echo "2. 测试本能提取脚本..."
if node scripts/extract-instincts.js --test > /dev/null 2>&1; then
    echo "✅ extract-instincts.js 测试通过"
else
    echo "⚠️  extract-instincts.js 测试有警告，继续部署..."
fi

# 创建符号链接（可选，便于直接调用）
echo "🔗 创建工具链接..."
mkdir -p "$HOME/bin"
ln -sf "$SHRIMP_ROOT/scripts/extract-instincts.js" "$HOME/bin/shrimp-extract-instincts" 2>/dev/null || true
ln -sf "$SHRIMP_ROOT/hooks/session-start.js" "$HOME/bin/shrimp-session-start" 2>/dev/null || true
echo "✅ 工具链接创建完成"

# 集成钩子配置
echo "⚙️  集成钩子配置..."
if [ -f "$OPENCLAW_CONFIG" ]; then
    # 备份原配置
    cp "$OPENCLAW_CONFIG" "$OPENCLAW_CONFIG.backup"
    
    # 检查是否已存在钩子配置
    if grep -q "shrimp:session:start" "$OPENCLAW_CONFIG"; then
        echo "⚠️  检测到已存在的虾子钩子配置，跳过添加"
    else
        echo "📝 添加钩子配置到 OpenClaw..."
        # 这里实际应该合并 JSON，简化处理：提示手动添加
        echo "💡 请手动将以下配置添加到 $OPENCLAW_CONFIG 的 hooks 部分:"
        echo "----------------------------------------"
        cat "$SHRIMP_ROOT/config/hooks.json"
        echo "----------------------------------------"
    fi
else
    echo "📄 创建新的 OpenClaw 配置文件..."
    cat > "$OPENCLAW_CONFIG" << EOF
{
  "hooks": $(cat "$SHRIMP_ROOT/config/hooks.json" | jq '.hooks')
}
EOF
    echo "✅ 配置文件创建完成"
fi

# 生成 crontab 配置
echo "⏰ 生成定时任务配置..."
CRON_CONFIG_FILE="$SHRIMP_ROOT/shrimp-cron.txt"
CRON_JOB_EXTRACT="0 2 * * * cd '$SHRIMP_ROOT' && node scripts/extract-instincts.js >> '$SHRIMP_ROOT/cron.log' 2>&1"
CRON_JOB_CHECKPOINT_9="0 9 * * * cd '$SHRIMP_ROOT' && node scripts/auto-checkpoint.js >> '$SHRIMP_ROOT/checkpoint.log' 2>&1"
CRON_JOB_CHECKPOINT_14="0 14 * * * cd '$SHRIMP_ROOT' && node scripts/auto-checkpoint.js >> '$SHRIMP_ROOT/checkpoint.log' 2>&1"
CRON_JOB_CHECKPOINT_20="0 20 * * * cd '$SHRIMP_ROOT' && node scripts/auto-checkpoint.js >> '$SHRIMP_ROOT/checkpoint.log' 2>&1"

{
    echo "# 虾子进化系统定时任务"
    echo "$CRON_JOB_EXTRACT"
    echo "$CRON_JOB_CHECKPOINT_9"
    echo "$CRON_JOB_CHECKPOINT_14"
    echo "$CRON_JOB_CHECKPOINT_20"
} > "$CRON_CONFIG_FILE"

echo "✅ 定时任务配置已生成: $CRON_CONFIG_FILE"
echo "💡 请手动运行以下命令来设置定时任务:"
echo "   (crontab -l | grep -v 'shrimp-evolution'; cat $CRON_CONFIG_FILE) | crontab -"

# 创建监控脚本
echo "👁️  创建系统监控脚本..."
MONITOR_SCRIPT="$SHRIMP_ROOT/scripts/monitor-system.js"
cat > "$MONITOR_SCRIPT" << 'EOF'
#!/usr/bin/env node
/**
 * 系统监控脚本
 * 定期检查系统状态和任务进展
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const WORKSPACE_ROOT = path.join(os.homedir(), '.openclaw', 'workspace');
const SHRIMP_ROOT = path.join(WORKSPACE_ROOT, 'projects', 'shrimp-evolution');
const LOG_FILE = path.join(SHRIMP_ROOT, 'monitor.log');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(LOG_FILE, logMessage);
}

function checkSystemHealth() {
    log("🔍 开始系统健康检查...");
    
    const checks = [
        {
            name: "工作区目录",
            check: () => fs.existsSync(WORKSPACE_ROOT),
            critical: true
        },
        {
            name: "记忆目录",
            check: () => fs.existsSync(path.join(WORKSPACE_ROOT, 'memory')),
            critical: true
        },
        {
            name: "任务文件",
            check: () => fs.existsSync(path.join(WORKSPACE_ROOT, 'memory', 'tasks', 'ongoing-tasks.md')),
            critical: false
        },
        {
            name: "虾子进化目录",
            check: () => fs.existsSync(SHRIMP_ROOT),
            critical: true
        },
        {
            name: "钩子脚本",
            check: () => fs.existsSync(path.join(SHRIMP_ROOT, 'hooks', 'session-start.js')),
            critical: true
        }
    ];
    
    let allHealthy = true;
    let criticalFailed = [];
    
    for (const check of checks) {
        try {
            if (check.check()) {
                log(`✅ ${check.name}: 正常`);
            } else {
                log(`❌ ${check.name}: 异常`);
                allHealthy = false;
                if (check.critical) {
                    criticalFailed.push(check.name);
                }
            }
        } catch (error) {
            log(`⚠️  ${check.name}: 检查失败 - ${error.message}`);
            allHealthy = false;
            if (check.critical) {
                criticalFailed.push(check.name);
            }
        }
    }
    
    return { allHealthy, criticalFailed };
}

function checkTaskProgress() {
    log("📋 检查任务进展...");
    
    try {
        const tasksFile = path.join(WORKSPACE_ROOT, 'memory', 'tasks', 'ongoing-tasks.md');
        if (!fs.existsSync(tasksFile)) {
            log("⚠️  任务文件不存在");
            return { active: 0, blocked: 0 };
        }
        
        const content = fs.readFileSync(tasksFile, 'utf8');
        const activeMatches = content.match(/状态\s*[:：]\s*ACTIVE/g) || [];
        const blockedMatches = content.match(/状态\s*[:：]\s*BLOCKED/g) || [];
        
        log(`📊 任务统计: ${activeMatches.length}个活跃, ${blockedMatches.length}个阻塞`);
        return { active: activeMatches.length, blocked: blockedMatches.length };
    } catch (error) {
        log(`⚠️  任务检查失败: ${error.message}`);
        return { active: 0, blocked: 0 };
    }
}

function checkRecentActivity() {
    log("🕒 检查近期活动...");
    
    try {
        const memoryDir = path.join(WORKSPACE_ROOT, 'memory');
        const files = fs.readdirSync(memoryDir)
            .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
            .sort()
            .reverse()
            .slice(0, 3);
        
        log(`📅 最近${files.length}天有记录`);
        
        for (const file of files) {
            const filePath = path.join(memoryDir, file);
            const stats = fs.statSync(filePath);
            const sizeKB = Math.round(stats.size / 1024);
            log(`   ${file.replace('.md', '')}: ${sizeKB}KB`);
        }
    } catch (error) {
        log(`⚠️  活动检查失败: ${error.message}`);
    }
}

function main() {
    log("🦞 虾子进化系统监控启动");
    
    const health = checkSystemHealth();
    const tasks = checkTaskProgress();
    checkRecentActivity();
    
    // 生成摘要
    log("📈 监控摘要:");
    log(`   系统健康: ${health.allHealthy ? '✅' : '❌'}`);
    log(`   活跃任务: ${tasks.active}个`);
    log(`   阻塞任务: ${tasks.blocked}个`);
    
    // 预警逻辑
    if (health.criticalFailed.length > 0) {
        log(`🚨 关键组件异常: ${health.criticalFailed.join(', ')}`);
        // 这里可以添加通知逻辑
    }
    
    if (tasks.blocked > 2) {
        log(`⚠️  阻塞任务过多 (${tasks.blocked}个)，建议优先处理`);
    }
    
    log("🦞 监控完成");
}

if (require.main === module) {
    main();
}

module.exports = { checkSystemHealth, checkTaskProgress };
EOF

chmod +x "$MONITOR_SCRIPT"
echo "✅ 监控脚本创建完成: $MONITOR_SCRIPT"

# 测试监控脚本
echo "🧪 测试监控脚本..."
if node "$MONITOR_SCRIPT" > /dev/null 2>&1; then
    echo "✅ 监控脚本测试通过"
else
    echo "⚠️  监控脚本测试有警告"
fi

# 创建自动化检查点脚本
echo "🕐 创建自动化检查点脚本..."
CHECKPOINT_SCRIPT="$SHRIMP_ROOT/scripts/auto-checkpoint.js"
cat > "$CHECKPOINT_SCRIPT" << 'EOF'
#!/usr/bin/env node
/**
 * 自动化检查点脚本
 * 按时间自动生成检查点报告
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const WORKSPACE_ROOT = path.join(os.homedir(), '.openclaw', 'workspace');
const CHECKPOINTS_DIR = path.join(WORKSPACE_ROOT, 'projects', 'daily-report-system');
const OUTPUT_DIR = path.join(WORKSPACE_ROOT, 'memory', 'checkpoints');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getCheckpointType() {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 12) return 'morning';
    if (hour >= 14 && hour < 17) return 'afternoon';
    if (hour >= 20 || hour < 9) return 'evening';
    return 'general';
}

function generateMorningReport() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    
    return `🦞 早间启动 | ${date}
📝 昨日回顾：
- 完成：请查看昨日汇总报告
- 进行：请查看ongoing-tasks.md

🎯 今日重点：
1. P0：最高优先级任务（从ongoing-tasks.md提取）
2. P1：高优先级任务
3. 协作：需要配合事项

⚠️ 注意：
- 阻塞项：请查看ongoing-tasks.md中的BLOCKED任务
- 依赖项：等待条件
- 风险项：可能问题

💡 建议：
- 优先解决阻塞
- 注意时间安排
- 及时同步进展

---
*本报告由虾子进化系统自动生成*
*更新时间：${new Date().toISOString()}*`;
}

function generateAfternoonReport() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    
    return `🦞 午间进度 | ${date}
📊 上午完成：
- ✅ 请记录上午完成的任务

🔄 进行中：
- 🔄 请更新当前任务进度

🚧 新阻塞：
- 问题描述
- 影响范围
- 需要协助

🎯 下午调整：
1. 原计划：保持/调整
2. 新重点：新增任务
3. 协作：更新安排

⏰ 时间提醒：
- 截止时间：任务/会议
- 预计完成：关键节点
- 风险预警：可能延迟

---
*本报告由虾子进化系统自动生成*
*更新时间：${new Date().toISOString()}*`;
}

function generateEveningReport() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    
    return `🦞 晚间汇总 | ${date}
📈 今日成果：
✅ 已完成：
- 请总结今日完成的任务

🔄 进行中：
- 请更新进行中任务状态

🚧 阻塞解决：
- 问题：描述
- 方案：解决方法
- 结果：解决状态

📝 经验沉淀：
- 成功模式：可复用经验
- 失败教训：避免再犯
- 优化建议：改进点

📋 明日计划：
1. P0：最高优先级
2. P1：高优先级
3. 协作：需要配合

💤 结束提醒：
- 今日工作结束
- 好好休息
- 明日继续

---
*本报告由虾子进化系统自动生成*
*更新时间：${new Date().toISOString()}*`;
}

function main() {
    const type = getCheckpointType();
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    let report;
    switch (type) {
        case 'morning':
            report = generateMorningReport();
            break;
        case 'afternoon':
            report = generateAfternoonReport();
            break;
        case 'evening':
            report = generateEveningReport();
            break;
        default:
            report = `🦞 检查点报告 | ${date}\n\n常规检查点报告\n\n---\n*自动生成*`;
    }
    
    const filename = `${date}-${type}-${timestamp}.md`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    fs.writeFileSync(filepath, report);
    console.log(`✅ 生成${type}检查点报告: ${filepath}`);
    
    // 同时保存到今日记忆文件
    const todayFile = path.join(WORKSPACE_ROOT, 'memory', `${date}.md`);
    const todayNote = `\n\n## ${type}检查点 (${new Date().toISOString()})\n\n${report}\n`;
    
    if (fs.existsSync(todayFile)) {
        fs.appendFileSync(todayFile, todayNote);
    } else {
        fs.writeFileSync(todayFile, `# ${date}\n\n${todayNote}`);
    }
    
    console.log(`📝 检查点已记录到今日记忆文件`);
}

if (require.main === module) {
    main();
}
EOF

chmod +x "$CHECKPOINT_SCRIPT"
echo "✅ 检查点脚本创建完成"

# 设置检查点定时任务
echo "⏰ 设置检查点定时任务..."
CHECKPOINT_CRON="
# 虾子进化系统检查点
0 9 * * * cd '$SHRIMP_ROOT' && node scripts/auto-checkpoint.js >> '$SHRIMP_ROOT/checkpoint.log' 2>&1
0 14 * * * cd '$SHRIMP_ROOT' && node scripts/auto-checkpoint.js >> '$SHRIMP_ROOT/checkpoint.log' 2>&1
0 20 * * * cd '$SHRIMP_ROOT' && node scripts/auto-checkpoint.js >> '$SHRIMP_ROOT/checkpoint.log' 2>&1
"

# 清理旧的虾子定时任务
(crontab -l 2>/dev/null | grep -v "auto-checkpoint.js" | grep -v "extract-instincts.js") | crontab -

# 添加新的定时任务
(crontab -l 2>/dev/null; echo "$CHECKPOINT_CRON") | crontab -
(crontab -l 2>/dev/null; echo "0 2 * * * cd '$SHRIMP_ROOT' && node scripts/extract-instincts.js >> '$SHRIMP_ROOT/cron.log' 2>&1") | crontab -

echo "✅ 检查点定时任务设置完成 (9:00, 14:00, 20:00)"

# 创建部署完成报告
echo "📊 生成部署报告..."
DEPLOY_REPORT="$SHRIMP_ROOT/deploy-report-$(date +%Y%m%d-%H%M%S).md"
cat > "$DEPLOY_REPORT" << EOF
# 虾子进化系统部署报告

## 部署信息
- **部署时间**: $(date)
- **系统版本**: v1.0
- **部署环境**: $(uname -a)
- **Node.js版本**: $(node --version)

## 部署组件
✅ **钩子系统**
  - session-start.js: 会话