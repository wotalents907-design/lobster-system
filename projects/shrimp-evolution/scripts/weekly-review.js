#!/Users/jing/.openclaw/tools/node-v22.22.0/bin/node
/**
 * weekly-review.js
 * 读取最近7天的 memory/YYYY-MM-DD.md 文件，
 * 统计完成的任务、踩的坑、用的技能，
 * 结合本能聚类输出周报到 memory/weekly-review-YYYY-MM-DD.md
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(__dirname, '../../../memory');
const OUTPUT_FILE = path.join(MEMORY_DIR, `weekly-review-${new Date().toISOString().slice(0, 10)}.md`);
const CLUSTERS_FILE = path.join(__dirname, '../instincts/clusters/latest.json');

// 1. 找最近7天的日记
const today = new Date();
const days = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
}

const memoryFiles = days
  .map(d => path.join(MEMORY_DIR, `${d}.md`))
  .filter(f => fs.existsSync(f));

console.log(`[weekly-review] 找到 ${memoryFiles.length} 天的日记`);

let allContent = '';
for (const f of memoryFiles) {
  allContent += fs.readFileSync(f, 'utf8') + '\n';
}

// 2. 简单统计完成的任务（匹配 ✅ 或 "已完成"）
const completedMatches = [...allContent.matchAll(/✅\s*(.+)/g)].map(m => m[1].trim());
const doneMatches = [...allContent.matchAll(/已完成[：:]\s*(.+)/g)].map(m => m[1].trim());
const completed = [...new Set([...completedMatches, ...doneMatches])];

// 3. 踩坑（匹配 "卡点"、"问题"、"错误"）
const blockerMatches = [...allContent.matchAll(/卡点[：:]\s*(.+)/g)].map(m => m[1].trim());
const problemMatches = [...allContent.matchAll(/遇到[的问题]+[：:]\s*(.+)/g)].map(m => m[1].trim());
const blockers = [...new Set([...blockerMatches, ...problemMatches])];

// 4. 技能使用（匹配技能名：node/openclaw/飞书/github/cron等）
const skillMentionsRaw = allContent.matchAll(/feishu[_-]?(doc|wiki|sheets|bitable|tts)|openclaw|github|cron|node\.js|codex/gi);
const skillMentions = [...new Set([...skillMentionsRaw].map(m => m[0].toLowerCase()))];

// 5. 读取本能聚类
let clustersInfo = '';
if (fs.existsSync(CLUSTERS_FILE)) {
  const clusters = JSON.parse(fs.readFileSync(CLUSTERS_FILE, 'utf8'));
  clustersInfo = `本周新增本能聚类 ${clusters.totalClusters} 个，分布在：${Object.keys(clusters.clusters.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {})).join('、')}。`;
}

// 6. 组装输出
const weekStart = days[6];
const weekEnd = days[0];
const output = `# 本周复盘 · ${weekStart} ~ ${weekEnd}

## 完成项（共 ${completed.length} 项）

${completed.length > 0 ? completed.map(c => `- ${c}`).join('\n') : '- （无记录）'}

## 踩过的坑（共 ${blockers.length} 项）

${blockers.length > 0 ? blockers.map(b => `- ${b}`).join('\n') : '- （无记录）'}

## 用到的技能（共 ${skillMentions.length} 种）

${skillMentions.length > 0 ? skillMentions.map(s => `- ${s}`).join('\n') : '- （无记录）'}

## 本周进化洞察

${clustersInfo || '本能聚类数据暂无可用。'}

---

*由本地虾自动生成 · ${new Date().toISOString()}*
`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`[weekly-review] 周报已生成：${OUTPUT_FILE}`);
