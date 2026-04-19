#!/Users/jing/.openclaw/tools/node-v22.22.0/bin/node
/**
 * cluster-instincts.js
 * 读取 instincts/ 目录下所有 .json 文件，按 category 分组，
 * 同一 category 内把 pattern 文字相似度 > 60% 的合并，
 * 输出到 instincts/clusters/latest.json
 */

const fs = require('fs');
const path = require('path');

const INSTINCTS_DIR = path.join(__dirname, '../instincts');
const OUTPUT_FILE = path.join(INSTINCTS_DIR, 'clusters/latest.json');

// 确保输出目录存在
const clustersDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(clustersDir)) {
  fs.mkdirSync(clustersDir, { recursive: true });
}

// 1. 读取所有 instinct json 文件
const files = fs.readdirSync(INSTINCTS_DIR).filter(f => f.endsWith('.json'));
let allInstincts = [];
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(INSTINCTS_DIR, file), 'utf8'));
  if (data.instincts) {
    allInstincts = allInstincts.concat(data.instincts);
  }
}

console.log(`[cluster-instincts] 读取了 ${files.length} 个文件，共 ${allInstincts.length} 条本能`);

// 2. 按 category 分组
const byCategory = {};
for (const inst of allInstincts) {
  const cat = inst.category || 'unknown';
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(inst);
}

// 3. 计算文字相似度（简单关键词重叠率）
function textSimilarity(a, b) {
  const getWords = (s) => new Set((s || '').toLowerCase().split(/\W+/).filter(w => w.length > 1));
  const wa = getWords(a);
  const wb = getWords(b);
  if (wa.size === 0 && wb.size === 0) return 1;
  const intersection = [...wa].filter(w => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? intersection / union : 0;
}

// 4. 聚类函数
function clusterInstincts(instincts) {
  const clusters = [];
  const used = new Set();

  for (let i = 0; i < instincts.length; i++) {
    if (used.has(i)) continue;
    const group = [instincts[i]];
    used.add(i);

    for (let j = i + 1; j < instincts.length; j++) {
      if (used.has(j)) continue;
      const sim = textSimilarity(instincts[i].pattern, instincts[j].pattern);
      if (sim > 0.6) {
        group.push(instincts[j]);
        used.add(j);
      }
    }

    // 合并 group
    const totalFreq = group.reduce((sum, g) => sum + (g.frequency || 1), 0);
    const avgConf = group.reduce((sum, g) => sum + (g.confidence || 0.5), 0) / group.length;
    const allExamples = [];
    for (const g of group) {
      if (g.examples) allExamples.push(...g.examples);
    }

    clusters.push({
      pattern: group[0].pattern,
      confidence: Math.round(avgConf * 100) / 100,
      frequency: totalFreq,
      examples: allExamples.slice(0, 5) // 最多5个例子
    });
  }

  return clusters;
}

// 5. 按 category 分别聚类
const result = {
  clusteredAt: new Date().toISOString(),
  totalClusters: 0,
  clusters: []
};

for (const [cat, instincts] of Object.entries(byCategory)) {
  const clustered = clusterInstincts(instincts);
  for (const c of clustered) {
    c.category = cat;
    result.clusters.push(c);
  }
}

result.totalClusters = result.clusters.length;

// 6. 写文件
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
console.log(`[cluster-instincts] 聚类完成：共 ${result.totalClusters} 个聚类，输出到 ${OUTPUT_FILE}`);
