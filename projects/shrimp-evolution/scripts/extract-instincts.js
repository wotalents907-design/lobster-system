#!/usr/bin/env node

/**
 * 本能提取脚本 - 从 daily notes 中提取模式
 * 基于 ECC 的持续学习理念
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 配置
const WORKSPACE_ROOT = path.join(os.homedir(), '.openclaw', 'workspace');
const MEMORY_DIR = path.join(WORKSPACE_ROOT, 'memory');
const INSTINCTS_DIR = path.join(WORKSPACE_ROOT, 'projects', 'shrimp-evolution', 'instincts');
const INSTINCT_CLUSTERS_DIR = path.join(INSTINCTS_DIR, 'clusters');

// 确保目录存在
[INSTINCTS_DIR, INSTINCT_CLUSTERS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 模式识别器
const PATTERN_DETECTORS = [
  {
    name: '用户偏好',
    regex: /用户(?:要求|明确|确认|新增).*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'preference',
      pattern: match[1].trim(),
      category: 'user-preference'
    })
  },
  {
    name: '任务状态',
    regex: /状态\s*[:：]\s*(\w+).*优先级\s*[:：]\s*(\w+)/gi,
    extractor: (match) => ({
      type: 'task-state',
      pattern: `任务状态: ${match[1]}, 优先级: ${match[2]}`,
      category: 'task-management'
    })
  },
  {
    name: '决策记录',
    regex: /\[DECIDED_BY\]\s*(\w+).*决策\s*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'decision',
      pattern: `决策者: ${match[1]}, 内容: ${match[2].trim()}`,
      category: 'decision-making'
    })
  },
  {
    name: '阻塞点',
    regex: /当前卡点\s*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'blocker',
      pattern: match[1].trim(),
      category: 'problem-solving'
    })
  },
  {
    name: '下一步行动',
    regex: /下一步\s*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'next-action',
      pattern: match[1].trim(),
      category: 'workflow'
    })
  },
  {
    name: '多代理协作',
    regex: /(?:本地虾|云端虾|秘书虾).*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'multi-agent',
      pattern: match[0].trim(),
      category: 'collaboration'
    })
  },
  {
    name: '记忆规则',
    regex: /记忆规则\s*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'memory-rule',
      pattern: match[1].trim(),
      category: 'memory-system'
    })
  },
  {
    name: '汇报格式',
    regex: /汇报.*格式\s*[:：]\s*([^\n]+)/gi,
    extractor: (match) => ({
      type: 'report-format',
      pattern: match[1].trim(),
      category: 'communication'
    })
  }
];

// 加载所有 daily notes
function loadDailyNotes(daysBack = 7) {
  const notes = [];
  
  try {
    const files = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .sort()
      .reverse();
    
    // 取最近几天
    const recentFiles = files.slice(0, Math.min(daysBack, files.length));
    
    for (const file of recentFiles) {
      const filePath = path.join(MEMORY_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const date = file.replace('.md', '');
      
      notes.push({
        date,
        file,
        content,
        filePath
      });
    }
    
    console.log(`[ExtractInstincts] 加载了 ${notes.length} 天的 daily notes`);
  } catch (error) {
    console.error('[ExtractInstincts] 加载 daily notes 失败:', error.message);
  }
  
  return notes;
}

// 从单篇笔记提取模式
function extractPatternsFromNote(note) {
  const patterns = [];
  
  for (const detector of PATTERN_DETECTORS) {
    const matches = [...note.content.matchAll(detector.regex)];
    
    for (const match of matches) {
      try {
        const pattern = detector.extractor(match);
        
        // 计算上下文
        const startIndex = Math.max(0, match.index - 100);
        const endIndex = Math.min(note.content.length, match.index + match[0].length + 100);
        const context = note.content.substring(startIndex, endIndex).trim();
        
        patterns.push({
          ...pattern,
          date: note.date,
          source: note.file,
          context,
          match: match[0],
          detector: detector.name,
          confidence: calculateConfidence(pattern, context)
        });
      } catch (error) {
        console.warn(`[ExtractInstincts] 提取模式失败: ${error.message}`);
      }
    }
  }
  
  return patterns;
}

// 计算置信度
function calculateConfidence(pattern, context) {
  let confidence = 0.5; // 基础置信度
  
  // 基于模式类型调整
  if (pattern.type === 'decision') confidence += 0.3;
  if (pattern.type === 'user-preference') confidence += 0.2;
  
  // 基于上下文长度调整
  const contextLength = context.length;
  if (contextLength > 200) confidence += 0.1;
  if (contextLength > 500) confidence += 0.1;
  
  // 基于重复出现调整（在聚类阶段处理）
  
  // 限制在 0.1-0.9 之间
  return Math.max(0.1, Math.min(0.9, confidence));
}

// 去重和合并相似模式
function deduplicatePatterns(patterns) {
  const uniquePatterns = [];
  const seenPatterns = new Set();
  
  for (const pattern of patterns) {
    // 创建模式指纹
    const fingerprint = `${pattern.type}:${pattern.category}:${pattern.pattern.substring(0, 50)}`;
    
    if (!seenPatterns.has(fingerprint)) {
      seenPatterns.add(fingerprint);
      
      // 查找相似模式合并
      const similar = uniquePatterns.find(p => 
        p.type === pattern.type && 
        p.category === pattern.category &&
        similarity(p.pattern, pattern.pattern) > 0.7
      );
      
      if (similar) {
        // 合并相似模式
        similar.examples.push({
          date: pattern.date,
          context: pattern.context,
          source: pattern.source
        });
        similar.confidence = Math.max(similar.confidence, pattern.confidence);
        similar.lastSeen = pattern.date;
      } else {
        // 新模式
        uniquePatterns.push({
          ...pattern,
          examples: [{
            date: pattern.date,
            context: pattern.context,
            source: pattern.source
          }],
          firstSeen: pattern.date,
          lastSeen: pattern.date,
          frequency: 1
        });
      }
    }
  }
  
  // 更新频率
  uniquePatterns.forEach(pattern => {
    pattern.frequency = pattern.examples.length;
  });
  
  return uniquePatterns;
}

// 简单字符串相似度计算
function similarity(str1, str2) {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// 保存本能到文件
function saveInstincts(instincts, date) {
  const outputFile = path.join(INSTINCTS_DIR, `${date}.json`);
  
  const output = {
    extractedAt: new Date().toISOString(),
    date,
    totalPatterns: instincts.length,
    patternsByCategory: {},
    instincts: instincts.map(inst => ({
      type: inst.type,
      category: inst.category,
      pattern: inst.pattern,
      confidence: inst.confidence,
      frequency: inst.frequency,
      firstSeen: inst.firstSeen,
      lastSeen: inst.lastSeen,
      detector: inst.detector,
      examples: inst.examples.slice(0, 3) // 只保存前3个示例
    }))
  };
  
  // 按类别统计
  instincts.forEach(inst => {
    if (!output.patternsByCategory[inst.category]) {
      output.patternsByCategory[inst.category] = 0;
    }
    output.patternsByCategory[inst.category]++;
  });
  
  try {
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`[ExtractInstincts] 保存了 ${instincts.length} 个本能到 ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error('[ExtractInstincts] 保存本能失败:', error.message);
    return null;
  }
}

// 生成提取报告
function generateReport(instincts, notesProcessed) {
  const report = [];
  
  report.push('# 本能提取报告');
  report.push(`提取时间: ${new Date().toISOString()}`);
  report.push(`处理笔记: ${notesProcessed} 篇`);
  report.push(`提取模式: ${instincts.length} 个`);
  report.push('');
  
  // 按类别统计
  const byCategory = {};
  instincts.forEach(inst => {
    if (!byCategory[inst.category]) {
      byCategory[inst.category] = [];
    }
    byCategory[inst.category].push(inst);
  });
  
  report.push('## 按类别统计');
  Object.entries(byCategory).forEach(([category, patterns]) => {
    report.push(`### ${category} (${patterns.length}个)`);
    
    // 取置信度最高的3个
    const topPatterns = patterns
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
    
    topPatterns.forEach(pattern => {
      report.push(`- **${pattern.pattern.substring(0, 50)}...**`);
      report.push(`  置信度: ${pattern.confidence.toFixed(2)}, 频率: ${pattern.frequency}`);
    });
    
    report.push('');
  });
  
  // 高频模式
  const frequentPatterns = instincts
    .filter(inst => inst.frequency >= 2)
    .sort((a, b) => b.frequency - a.confidence);
  
  if (frequentPatterns.length > 0) {
    report.push('## 高频模式 (出现≥2次)');
    frequentPatterns.forEach(pattern => {
      report.push(`- **${pattern.pattern.substring(0, 60)}...**`);
      report.push(`  类别: ${pattern.category}, 频率: ${pattern.frequency}, 置信度: ${pattern.confidence.toFixed(2)}`);
    });
    report.push('');
  }
  
  // 高置信度模式
  const highConfidencePatterns = instincts
    .filter(inst => inst.confidence >= 0.7)
    .sort((a, b) => b.confidence - a.confidence);
  
  if (highConfidencePatterns.length > 0) {
    report.push('## 高置信度模式 (≥0.7)');
    highConfidencePatterns.forEach(pattern => {
      report.push(`- **${pattern.pattern.substring(0, 60)}...**`);
      report.push(`  类别: ${pattern.category}, 置信度: ${pattern.confidence.toFixed(2)}, 频率: ${pattern.frequency}`);
    });
  }
  
  return report.join('\n');
}

// 主函数
function main() {
  console.log('[ExtractInstincts] 🧠 开始本能提取...');
  
  // 加载 daily notes
  const notes = loadDailyNotes(7);
  if (notes.length === 0) {
    console.log('[ExtractInstincts] 没有找到 daily notes，跳过提取');
    return 0;
  }
  
  // 提取模式
  let allPatterns = [];
  for (const note of notes) {
    const patterns = extractPatternsFromNote(note);
    allPatterns.push(...patterns);
  }
  
  console.log(`[ExtractInstincts] 初步提取了 ${allPatterns.length} 个模式`);
  
  // 去重和合并
  const uniqueInstincts = deduplicatePatterns(allPatterns);
  console.log(`[ExtractInstincts] 去重后得到 ${uniqueInstincts.length} 个独特本能`);
  
  // 保存本能
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '-');
  const savedFile = saveInstincts(uniqueInstincts, today);
  
  // 生成报告
  const report = generateReport(uniqueInstincts, notes.length);
  console.log('\n' + '='.repeat(60));
  console.log(report);
  console.log('='.repeat(60));
  
  if (savedFile) {
    console.log(`\n[ExtractInstincts] ✅ 本能提取完成，保存到: ${savedFile}`);
  } else {
    console.log('\n[ExtractInstincts] ⚠️ 本能提取完成，但保存失败');
  }
  
  return 0;
}

// 执行
if (require.main === module) {
  process.exit(main());
}

module.exports = {
  loadDailyNotes,
  extractPatternsFromNote,
  deduplicatePatterns,
  saveInstincts,
  generateReport
};