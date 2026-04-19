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
