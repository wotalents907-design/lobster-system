#!/usr/bin/env node

/**
 * 会话启动钩子 - 加载先前上下文
 * 基于 ECC 的 session-start-bootstrap.js 理念
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 配置
const WORKSPACE_ROOT = path.join(os.homedir(), '.openclaw', 'workspace');
const MEMORY_DIR = path.join(WORKSPACE_ROOT, 'memory');
const TASKS_DIR = path.join(WORKSPACE_ROOT, 'memory', 'tasks');
const INSTINCTS_DIR = path.join(WORKSPACE_ROOT, 'projects', 'shrimp-evolution', 'instincts');

// 会话状态文件
const SESSION_STATE_FILE = path.join(WORKSPACE_ROOT, '.session-state.json');

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function loadSessionState() {
  try {
    if (fs.existsSync(SESSION_STATE_FILE)) {
      const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('[SessionStart] 加载会话状态失败:', error.message);
  }
  return null;
}

function loadRecentMemory() {
  const memories = [];
  ensureDirExists(MEMORY_DIR);
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayFile = path.join(MEMORY_DIR, `${todayStr}.md`);
    
    if (fs.existsSync(todayFile)) {
      const content = fs.readFileSync(todayFile, 'utf8');
      memories.push({
        date: todayStr,
        content: content.substring(0, 1000) + (content.length > 1000 ? '...' : ''),
        source: todayFile
      });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayFile = path.join(MEMORY_DIR, `${yesterdayStr}.md`);
    
    if (fs.existsSync(yesterdayFile)) {
      const content = fs.readFileSync(yesterdayFile, 'utf8');
      memories.push({
        date: yesterdayStr,
        content: content.substring(0, 1000) + (content.length > 1000 ? '...' : ''),
        source: yesterdayFile
      });
    }
    
  } catch (error) {
    console.error('[SessionStart] 加载记忆失败:', error.message);
  }
  
  return memories;
}

function loadActiveTasks() {
  const tasks = [];
  ensureDirExists(TASKS_DIR);
  try {
    const ongoingFile = path.join(TASKS_DIR, 'ongoing-tasks.md');
    if (fs.existsSync(ongoingFile)) {
      const content = fs.readFileSync(ongoingFile, 'utf8');
      
      const taskRegex = /### \[(TASK-[^\]]+)\]/g;
      let match;
      while ((match = taskRegex.exec(content)) !== null) {
        const taskId = match[1];
        
        const startIndex = match.index;
        const nextTaskIndex = content.indexOf('### [', startIndex + 1);
        const taskContent = nextTaskIndex !== -1 
          ? content.substring(startIndex, nextTaskIndex)
          : content.substring(startIndex);
        
        const statusMatch = taskContent.match(/状态\s*[:：]\s*(\w+)/);
        const status = statusMatch ? statusMatch[1] : 'UNKNOWN';
        
        const priorityMatch = taskContent.match(/优先级\s*[:：]\s*(\w+)/);
        const priority = priorityMatch ? priorityMatch[1] : 'P1';
        
        const blockerMatch = taskContent.match(/当前卡点\s*[:：]\s*([^\n]+)/);
        const blocker = blockerMatch ? blockerMatch[1].trim() : '';
        
        if (status === 'ACTIVE' || status === 'BLOCKED') {
          tasks.push({
            id: taskId,
            status,
            priority,
            blocker,
            summary: taskContent.substring(0, 200) + (taskContent.length > 200 ? '...' : '')
          });
        }
      }
    }
  } catch (error) {
    console.error('[SessionStart] 加载任务失败:', error.message);
  }
  
  return tasks;
}

function loadRecentInstincts() {
    const instincts = [];
    ensureDirExists(INSTINCTS_DIR);
    try {
        const files = fs.readdirSync(INSTINCTS_DIR)
            .filter(f => f.endsWith('.json'))
            .sort()
            .reverse()
            .slice(0, 5);
        
        for (const file of files) {
            const filePath = path.join(INSTINCTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const instinctData = JSON.parse(content);
            
            if (Array.isArray(instinctData.instincts)) {
                instinctData.instincts.slice(0, 2).forEach(inst => {
                    instincts.push({
                        date: file.replace('.json', ''),
                        pattern: inst.pattern || 'N/A',
                        confidence: inst.confidence || 0,
                        examples: inst.examples ? inst.examples.length : 0
                    });
                });
            }
        }
    } catch (error) {
        console.error('[SessionStart] 加载本能失败:', error.message);
    }
    return instincts;
}

function generateRecoverySummary(memories, tasks, instincts) {
  const summary = [];
  
  if (memories.length > 0) {
    summary.push('## 📝 近期记忆');
    memories.forEach(mem => {
      summary.push(`- **${mem.date}**: ${mem.content.substring(0, 100)}...`);
    });
  }
  
  const p0Tasks = tasks.filter(t => t.priority === 'P0');
  const otherTasks = tasks.filter(t => t.priority !== 'P0');

  if (tasks.length > 0) {
    summary.push('\n## 📋 活跃任务');
    if (p0Tasks.length > 0) {
      summary.push('### 🔴 最高优先级 (P0)');
      p0Tasks.forEach(task => {
        summary.push(`- **${task.id}** - ${task.status}${task.blocker ? ` (卡点: ${task.blocker})` : ''}`);
      });
    }
    if (otherTasks.length > 0) {
      summary.push('### 🟡 其他优先级');
      otherTasks.forEach(task => {
        summary.push(`- **${task.id}** - ${task.status}${task.blocker ? ` (卡点: ${task.blocker})` : ''}`);
      });
    }
  }
  
  if (instincts.length > 0) {
    summary.push('\n## 🧠 近期学习');
    instincts.forEach(inst => {
      summary.push(`- **${inst.date}**: ${inst.pattern} (置信度: ${inst.confidence}, 示例: ${inst.examples})`);
    });
  }
  
  summary.push('\n## 🎯 恢复建议');
  
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED');
  if (blockedTasks.length > 0) {
    summary.push(`1. 优先解决阻塞任务: ${blockedTasks.map(t => t.id).join(', ')}`);
  }
  
  if (p0Tasks.length > 0) {
    summary.push(`2. 继续推进 P0 任务: ${p0Tasks.map(t => t.id).join(', ')}`);
  }
  
  summary.push('3. 检查今日 daily note，更新进展');
  summary.push('4. 按固定格式汇报当前状态');
  
  return summary.join('\n');
}

function main() {
  console.log('[SessionStart] 🦞 虾子会话恢复系统启动...');
  
  const sessionState = loadSessionState();
  if (sessionState) {
    console.log(`[SessionStart] 加载了 ${sessionState.lastSessionId ? '先前' : '新'} 会话状态`);
  }
  
  const memories = loadRecentMemory();
  console.log(`[SessionStart] 加载了 ${memories.length} 天记忆`);
  
  const tasks = loadActiveTasks();
  console.log(`[SessionStart] 发现了 ${tasks.length} 个活跃任务`);
  
  const instincts = loadRecentInstincts();
  console.log(`[SessionStart] 加载了 ${instincts.length} 个近期本能`);
  
  const recoverySummary = generateRecoverySummary(memories, tasks, instincts);
  
  console.log('\n' + '='.repeat(60));
  console.log('🦞 虾子会话恢复完成');
  console.log('='.repeat(60) + '\n');
  
  if (recoverySummary.trim().length > 0) {
    console.log(recoverySummary);
  } else {
    console.log('📭 无近期记忆或活跃任务，全新会话开始');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 提示: 使用 /status 查看详细状态，/tasks 查看所有任务');
  console.log('='.repeat(60));
  
  const newSessionState = {
    lastSessionId: sessionState?.sessionId || `session-${Date.now()}`,
    sessionId: `session-${Date.now()}`,
    startedAt: new Date().toISOString(),
    memoriesLoaded: memories.length,
    tasksLoaded: tasks.length,
    instinctsLoaded: instincts.length
  };
  
  try {
    fs.writeFileSync(SESSION_STATE_FILE, JSON.stringify(newSessionState, null, 2));
    console.log(`[SessionStart] 会话状态已保存: ${newSessionState.sessionId}`);
  } catch (error) {
    console.error('[SessionStart] 保存会话状态失败:', error.message);
  }
  
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main());
  } catch(e) {
    console.error("An unexpected error occurred:", e);
    process.exit(1);
  }
}

module.exports = {
  loadSessionState,
  loadRecentMemory,
  loadActiveTasks,
  loadRecentInstincts,
  generateRecoverySummary
};