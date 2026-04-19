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
