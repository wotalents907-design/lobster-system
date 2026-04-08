#!/usr/bin/env node

/**
 * 会话结束钩子 - 保存状态和提取本能
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// 配置
const WORKSPACE_ROOT = path.join(os.homedir(), '.openclaw', 'workspace');
const SHRIMP_EVOLUTION_ROOT = path.join(WORKSPACE_ROOT, 'projects', 'shrimp-evolution');
const SESSION_STATE_FILE = path.join(WORKSPACE_ROOT, '.session-state.json');

// 加载当前会话状态
function loadCurrentSessionState() {
  try {
    if (fs.existsSync(SESSION_STATE_FILE)) {
      const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('[SessionEnd] 加载会话状态失败:', error.message);
  }
  return null;
}

// 更新会话统计
function updateSessionStats(sessionState) {
  if (!sessionState) return;
  
  const statsFile = path.join(SHRIMP_EVOLUTION_ROOT, 'session-stats.json');
  let stats = { totalSessions: 0, averageTasks: 0, lastUpdated: '' };
  
  try {
    if (fs.existsSync(statsFile)) {
      stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    }
  } catch (error) {
    console.warn('[SessionEnd] 加载会话统计失败，创建新文件:', error.message);
  }
  
  // 更新统计
  stats.totalSessions = (stats.totalSessions || 0) + 1;
  stats.lastSessionId = sessionState.sessionId;
  stats.lastSessionDate = new Date().toISOString().split('T')[0];
  stats.lastUpdated = new Date().toISOString();
  
  // 计算平均任务数
  const previousAverage = stats.averageTasks || 0;
  const currentTasks = sessionState.tasksLoaded || 0;
  stats.averageTasks = previousAverage + (currentTasks - previousAverage) / stats.totalSessions;
  
  // 保存统计
  try {
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    console.log(`[SessionEnd] 更新会话统计: 总会话 ${stats.totalSessions}, 平均任务 ${stats.averageTasks.toFixed(1)}`);
  } catch (error) {
    console.error('[SessionEnd] 保存会话统计失败:', error.message);
  }
  
  return stats;
}

// 运行本能提取
function runInstinctExtraction() {
  console.log('[SessionEnd] 开始本能提取...');
  
  try {
    const extractScript = path.join(SHRIMP_EVOLUTION_ROOT, 'scripts', 'extract-instincts.js');
    
    if (fs.existsSync(extractScript)) {
      const result = execSync(`node "${extractScript}"`, {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: SHRIMP_EVOLUTION_ROOT
      });
      
      // 解析输出
      const lines = result.split('\n');
      const savedLine = lines.find(line => line.includes('保存了') && line.includes('个本能到'));
      
      if (savedLine) {
        const match = savedLine.match(/保存了 (\d+) 个本能到/);
        if (match) {
          console.log(`[SessionEnd] ✅ 提取了 ${match[1]} 个本能`);
          return parseInt(match[1]);
        }
      }
      
      console.log('[SessionEnd] ✅ 本能提取完成');
      return 0;
    } else {
      console.warn('[SessionEnd] ⚠️ 本能提取脚本不存在:', extractScript);
      return -1;
    }
  } catch (error) {
    console.error('[SessionEnd] ❌ 本能提取失败:', error.message);
    return -1;
  }
}

// 生成会话总结
function generateSessionSummary(sessionState, stats, instinctsExtracted) {
  const summary = [];
  
  summary.push('# 会话总结');
  summary.push(`会话ID: ${sessionState?.sessionId || '未知'}`);
  summary.push(`开始时间: ${sessionState?.startedAt || '未知'}`);
  summary.push(`结束时间: ${new Date().toISOString()}`);
  summary.push('');
  
  if (sessionState) {
    summary.push('## 会话统计');
    summary.push(`- 加载记忆: ${sessionState.memoriesLoaded || 0} 天`);
    summary.push(`- 加载任务: ${sessionState.tasksLoaded || 0} 个`);
    summary.push(`- 加载本能: ${sessionState.instinctsLoaded || 0} 个`);
    summary.push('');
  }
  
  if (stats) {
    summary.push('## 累计统计');
    summary.push(`- 总会话数: ${stats.totalSessions}`);
    summary.push(`- 平均任务数: ${stats.averageTasks?.toFixed(1) || 0}`);
    summary.push('');
  }
  
  if (instinctsExtracted >= 0) {
    summary.push('## 学习成果');
    if (instinctsExtracted > 0) {
      summary.push(`- 提取本能: ${instinctsExtracted} 个`);
      summary.push('- 已保存到 instincts/ 目录');
    } else {
      summary.push('- 本次会话无新本能提取');
    }
    summary.push('');
  }
  
  summary.push('## 建议');
  summary.push('1. 检查提取的本能，确认学习质量');
  summary.push('2. 定期运行本能聚类，生成技能');
  summary.push('3. 更新任务状态，确保进展可见');
  summary.push('4. 准备下一次会话的恢复上下文');
  
  return summary.join('\n');
}

// 保存会话总结
function saveSessionSummary(summary, sessionState) {
  const summaryDir = path.join(SHRIMP_EVOLUTION_ROOT, 'session-summaries');
  if (!fs.existsSync(summaryDir)) {
    fs.mkdirSync(summaryDir, { recursive: true });
  }
  
  const summaryFile = path.join(summaryDir, `${sessionState?.sessionId || `session-${Date.now()}`}.md`);
  
  try {
    fs.writeFileSync(summaryFile, summary);
    console.log(`[SessionEnd] 会话总结保存到: ${summaryFile}`);
    return summaryFile;
  } catch (error) {
    console.error('[SessionEnd] 保存会话总结失败:', error.message);
    return null;
  }
}

// 主函数
function main() {
  console.log('[SessionEnd] 🦞 虾子会话结束处理...');
  
  // 加载当前会话状态
  const sessionState = loadCurrentSessionState();
  if (sessionState) {
    console.log(`[SessionEnd] 处理会话: ${sessionState.sessionId}`);
  }
  
  // 更新会话统计
  const stats = updateSessionStats(sessionState);
  
  // 运行本能提取
  const instinctsExtracted = runInstinctExtraction();
  
  // 生成会话总结
  const summary = generateSessionSummary(sessionState, stats, instinctsExtracted);
  
  // 保存会话总结
  const summaryFile = saveSessionSummary(summary, sessionState);
  
  // 输出总结
  console.log('\n' + '='.repeat(60));
  console.log('🦞 会话结束处理完成');
  console.log('='.repeat(60) + '\n');
  
  // 显示简要总结
  const lines = summary.split('\n').slice(0, 15);
  lines.forEach(line => {
    if (line.trim()) console.log(line);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 详细总结已保存');
  if (summaryFile) {
    console.log(`📄 文件: ${summaryFile}`);
  }
  console.log('='.repeat(60));
  
  return 0;
}

// 执行
if (require.main === module) {
  process.exit(main());
}

module.exports = {
  loadCurrentSessionState,
  updateSessionStats,
  runInstinctExtraction,
  generateSessionSummary,
  saveSessionSummary
};