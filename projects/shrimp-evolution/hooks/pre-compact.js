#!/usr/bin/env node

/**
 * 压缩前钩子 - 备份关键信息
 * 在上下文压缩前保存重要状态，避免信息丢失
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 配置
const WORKSPACE_ROOT = path.join(os.homedir(), '.openclaw', 'workspace');
const COMPACT_BACKUP_DIR = path.join(WORKSPACE_ROOT, '.compact-backups');
const MEMORY_DIR = path.join(WORKSPACE_ROOT, 'memory');
const TASKS_DIR = path.join(WORKSPACE_ROOT, 'memory', 'tasks');

// 确保备份目录存在
if (!fs.existsSync(COMPACT_BACKUP_DIR)) {
  fs.mkdirSync(COMPACT_BACKUP_DIR, { recursive: true });
}

// 备份关键文件
function backupCriticalFiles() {
  const backupTime = new Date().toISOString().replace(/[:.]/g, '-');
  const backupSubDir = path.join(COMPACT_BACKUP_DIR, `pre-compact-${backupTime}`);
  
  if (!fs.existsSync(backupSubDir)) {
    fs.mkdirSync(backupSubDir, { recursive: true });
  }
  
  const filesToBackup = [
    {
      source: path.join(TASKS_DIR, 'ongoing-tasks.md'),
      dest: 'ongoing-tasks.md',
      critical: true
    },
    {
      source: path.join(TASKS_DIR, 'recovery-dashboard.md'),
      dest: 'recovery-dashboard.md',
      critical: true
    },
    {
      source: path.join(MEMORY_DIR, 'MEMORY.md'),
      dest: 'MEMORY.md',
      critical: true
    }
  ];
  
  let backedUp = 0;
  let failed = 0;
  
  for (const file of filesToBackup) {
    try {
      if (fs.existsSync(file.source)) {
        const content = fs.readFileSync(file.source, 'utf8');
        const destPath = path.join(backupSubDir, file.dest);
        fs.writeFileSync(destPath, content);
        
        if (file.critical) {
          console.log(`[PreCompact] ✅ 备份关键文件: ${file.dest}`);
        } else {
          console.log(`[PreCompact] 📋 备份文件: ${file.dest}`);
        }
        backedUp++;
      } else {
        console.warn(`[PreCompact] ⚠️ 文件不存在: ${file.source}`);
      }
    } catch (error) {
      console.error(`[PreCompact] ❌ 备份失败 ${file.dest}:`, error.message);
      failed++;
      
      if (file.critical) {
        console.error(`[PreCompact] 🚨 关键文件备份失败，压缩可能丢失重要信息!`);
      }
    }
  }
  
  // 保存备份元数据
  const metadata = {
    backedUpAt: new Date().toISOString(),
    backupId: `pre-compact-${backupTime}`,
    backedUpFiles: backedUp,
    failedFiles: failed,
    totalFiles: filesToBackup.length,
    files: filesToBackup.map(f => ({
      name: f.dest,
      critical: f.critical,
      backedUp: fs.existsSync(path.join(backupSubDir, f.dest))
    }))
  };
  
  const metadataFile = path.join(backupSubDir, 'backup-metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  
  return {
    backupDir: backupSubDir,
    backedUp,
    failed,
    metadata
  };
}

// 提取压缩前的关键信息摘要
function extractCriticalInfo() {
  const criticalInfo = {
    extractedAt: new Date().toISOString(),
    activeTasks: [],
    blockedItems: [],
    userDecisions: [],
    nextActions: []
  };
  
  try {
    // 提取活跃任务
    const ongoingFile = path.join(TASKS_DIR, 'ongoing-tasks.md');
    if (fs.existsSync(ongoingFile)) {
      const content = fs.readFileSync(ongoingFile, 'utf8');
      
      // 提取 ACTIVE 任务
      const taskRegex = /### \[(TASK-[^\]]+)\][\s\S]*?状态\s*[:：]\s*(ACTIVE)[\s\S]*?当前卡点\s*[:：]\s*([^\n]*)/g;
      let match;
      
      while ((match = taskRegex.exec(content)) !== null) {
        const taskId = match[1];
        const blocker = match[3].trim();
        
        criticalInfo.activeTasks.push({
          id: taskId,
          blocker: blocker || '无'
        });
        
        if (blocker && blocker !== '无') {
          criticalInfo.blockedItems.push({
            type: 'task',
            id: taskId,
            blocker
          });
        }
      }
    }
    
    // 提取用户决策
    const memoryFile = path.join(MEMORY_DIR, 'MEMORY.md');
    if (fs.existsSync(memoryFile)) {
      const content = fs.readFileSync(memoryFile, 'utf8');
      
      // 提取决策
      const decisionRegex = /\[DECIDED_BY\]\s*(\w+)[\s\S]*?决策\s*[:：]\s*([^\n]+)/g;
      let match;
      
      while ((match = decisionRegex.exec(content)) !== null) {
        criticalInfo.userDecisions.push({
          by: match[1],
          decision: match[2].trim()
        });
      }
    }
    
    // 提取下一步行动
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    const todayFile = path.join(MEMORY_DIR, `${today}.md`);
    
    if (fs.existsSync(todayFile)) {
      const content = fs.readFileSync(todayFile, 'utf8');
      
      // 提取下一步行动
      const nextActionRegex = /下一步\s*[:：]\s*([^\n]+)/g;
      let match;
      
      while ((match = nextActionRegex.exec(content)) !== null) {
        criticalInfo.nextActions.push(match[1].trim());
      }
    }
    
  } catch (error) {
    console.error('[PreCompact] 提取关键信息失败:', error.message);
  }
  
  return criticalInfo;
}

// 生成压缩建议
function generateCompactionAdvice(criticalInfo) {
  const advice = [];
  
  advice.push('# 上下文压缩建议');
  advice.push(`生成时间: ${new Date().toISOString()}`);
  advice.push('');
  
  if (criticalInfo.activeTasks.length > 0) {
    advice.push('## 活跃任务（建议保留）');
    criticalInfo.activeTasks.forEach(task => {
      advice.push(`- **${task.id}**${task.blocker ? ` (卡点: ${task.blocker})` : ''}`);
    });
    advice.push('');
  }
  
  if (criticalInfo.blockedItems.length > 0) {
    advice.push('## 阻塞项（必须保留）');
    criticalInfo.blockedItems.forEach(item => {
      advice.push(`- ${item.id}: ${item.blocker}`);
    });
    advice.push('');
  }
  
  if (criticalInfo.userDecisions.length > 0) {
    advice.push('## 用户决策（关键记忆）');
    criticalInfo.userDecisions.forEach(decision => {
      advice.push(`- ${decision.by}: ${decision.decision.substring(0, 80)}...`);
    });
    advice.push('');
  }
  
  if (criticalInfo.nextActions.length > 0) {
    advice.push('## 下一步行动（近期重点）');
    criticalInfo.nextActions.forEach((action, i) => {
      advice.push(`${i + 1}. ${action.substring(0, 100)}...`);
    });
    advice.push('');
  }
  
  // 压缩策略建议
  advice.push('## 压缩策略建议');
  
  if (criticalInfo.activeTasks.length >= 5) {
    advice.push('1. **保留所有活跃任务** - 任务数量多，压缩可能影响恢复');
  } else {
    advice.push('1. **可适度压缩任务历史** - 任务数量适中');
  }
  
  if (criticalInfo.blockedItems.length > 0) {
    advice.push('2. **必须保留阻塞项** - 解决阻塞是当前优先级');
  }
  
  if (criticalInfo.userDecisions.length > 0) {
    advice.push('3. **保留关键决策** - 用户决策影响长期行为');
  }
  
  advice.push('4. **压缩早期对话历史** - 保留最近2-3轮对话即可');
  advice.push('5. **保留系统提示和规则** - 这些是行为基础');
  
  return advice.join('\n');
}

// 清理旧备份
function cleanupOldBackups() {
  try {
    const backups = fs.readdirSync(COMPACT_BACKUP_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('pre-compact-'))
      .map(dirent => ({
        name: dirent.name,
        path: path.join(COMPACT_BACKUP_DIR, dirent.name),
        time: dirent.name.replace('pre-compact-', '')
      }))
      .sort((a, b) => b.time.localeCompare(a.time)); // 最新在前
    
    // 保留最近5个备份
    const toKeep = backups.slice(0, 5);
    const toDelete = backups.slice(5);
    
    for (const backup of toDelete) {
      try {
        fs.rmSync(backup.path, { recursive: true, force: true });
        console.log(`[PreCompact] 清理旧备份: ${backup.name}`);
      } catch (error) {
        console.warn(`[PreCompact] 清理备份失败 ${backup.name}:`, error.message);
      }
    }
    
    console.log(`[PreCompact] 备份保留策略: 保留最近 ${toKeep.length} 个，清理 ${toDelete.length} 个`);
    
  } catch (error) {
    console.error('[PreCompact] 清理旧备份失败:', error.message);
  }
}

// 主函数
function main() {
  console.log('[PreCompact] 🦞 上下文压缩前处理...');
  
  // 备份关键文件
  console.log('[PreCompact] 1. 备份关键文件...');
  const backupResult = backupCriticalFiles();
  
  // 提取关键信息
  console.log('[PreCompact] 2. 提取关键信息...');
  const criticalInfo = extractCriticalInfo();
  
  // 生成压缩建议
  console.log('[PreCompact] 3. 生成压缩建议...');
  const advice = generateCompactionAdvice(criticalInfo);
  
  // 保存压缩建议
  const adviceFile = path.join(backupResult.backupDir, 'compaction-advice.md');
  fs.writeFileSync(adviceFile, advice);
  
  // 清理旧备份
  console.log('[PreCompact] 4. 清理旧备份...');
  cleanupOldBackups();
  
  // 输出总结
  console.log('\n' + '='.repeat(60));
  console.log('🦞 压缩前处理完成');
  console.log('='.repeat(60) + '\n');
  
  console.log('📊 处理结果:');
  console.log(`- 备份文件: ${backupResult.backedUp} 个成功, ${backupResult.failed} 个失败`);
  console.log(`- 活跃任务: ${criticalInfo.activeTasks.length} 个`);
  console.log(`- 阻塞项: ${criticalInfo.blockedItems.length} 个`);
  console.log(`- 用户决策: ${criticalInfo.userDecisions.length} 个`);
  console.log(`- 下一步行动: ${criticalInfo.nextActions.length} 个`);
  
  console.log('\n💡 压缩建议摘要:');
  const adviceLines = advice.split('\n').slice(0, 10);
  adviceLines.forEach(line => {
    if (line.trim()) console.log(line);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📁 备份目录: ${backupResult.backupDir}`);
  console.log(`📄 详细建议: ${adviceFile}`);
  console.log('='.repeat(60));
  
  return 0;
}

// 执行
if (require.main === module) {
  process.exit(main());
}

module.exports = {
  backupCriticalFiles,
  extractCriticalInfo,
  generateCompactionAdvice,
  cleanupOldBackups
};