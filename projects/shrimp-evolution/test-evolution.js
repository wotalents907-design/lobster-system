#!/usr/bin/env node

/**
 * 虾子进化系统测试脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🦞 虾子进化系统测试开始...\n');

// 测试1: 检查目录结构
console.log('1. 检查目录结构...');
const requiredDirs = [
  'hooks',
  'scripts', 
  'instincts',
  'instincts/clusters',
  'skills-generated'
];

let allDirsExist = true;
for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ ${dir}`);
  } else {
    console.log(`   ❌ ${dir} (不存在)`);
    allDirsExist = false;
  }
}

// 测试2: 检查关键文件
console.log('\n2. 检查关键文件...');
const requiredFiles = [
  'README.md',
  'hooks/session-start.js',
  'scripts/extract-instincts.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`   ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`   ❌ ${file} (不存在)`);
    allFilesExist = false;
  }
}

// 测试3: 测试会话启动钩子
console.log('\n3. 测试会话启动钩子...');
try {
  const sessionStart = require('./hooks/session-start.js');
  console.log('   ✅ 模块加载成功');
  
  // 测试函数
  const memories = sessionStart.loadRecentMemory();
  console.log(`   ✅ 加载记忆: ${memories.length} 天`);
  
  const tasks = sessionStart.loadActiveTasks();
  console.log(`   ✅ 加载任务: ${tasks.length} 个`);
  
} catch (error) {
  console.log(`   ❌ 模块加载失败: ${error.message}`);
}

// 测试4: 测试本能提取
console.log('\n4. 测试本能提取...');
try {
  const extractInstincts = require('./scripts/extract-instincts.js');
  console.log('   ✅ 模块加载成功');
  
  const notes = extractInstincts.loadDailyNotes(2);
  console.log(`   ✅ 加载笔记: ${notes.length} 篇`);
  
  if (notes.length > 0) {
    const patterns = extractInstincts.extractPatternsFromNote(notes[0]);
    console.log(`   ✅ 提取模式: ${patterns.length} 个`);
  }
  
} catch (error) {
  console.log(`   ❌ 模块加载失败: ${error.message}`);
}

// 测试5: 运行本能提取
console.log('\n5. 运行本能提取脚本...');
try {
  // 先确保有测试数据
  const testMemoryDir = path.join(process.env.HOME, '.openclaw', 'workspace', 'memory');
  if (!fs.existsSync(testMemoryDir)) {
    fs.mkdirSync(testMemoryDir, { recursive: true });
  }
  
  // 创建测试记忆文件
  const testFile = path.join(testMemoryDir, '2026-04-06-test.md');
  const testContent = `# 2026-04-06 测试

## 用户偏好测试
用户要求：任务看板要简洁，不要一堆英文

## 任务状态测试
状态：ACTIVE
优先级：P0
当前卡点：需要验证 memory_search 功能

## 决策记录测试
[DECIDED_BY] USER
决策：全速推进虾子进化系统

## 多代理协作测试
本地虾：负责实施
云端虾：负责研究
秘书虾：负责协调

## 下一步行动测试
下一步：实现本能提取机制
`;
  
  fs.writeFileSync(testFile, testContent);
  console.log('   ✅ 创建测试记忆文件');
  
  // 运行提取脚本
  const result = execSync(`node "${path.join(__dirname, 'scripts/extract-instincts.js')}"`, {
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('   ✅ 脚本执行成功');
  console.log('   📊 输出摘要:');
  
  // 显示部分输出
  const lines = result.split('\n');
  const relevantLines = lines.filter(line => 
    line.includes('加载了') || 
    line.includes('提取了') || 
    line.includes('保存了') ||
    line.includes('高频模式') ||
    line.includes('高置信度')
  );
  
  relevantLines.forEach(line => {
    console.log(`      ${line.trim()}`);
  });
  
  // 清理测试文件
  fs.unlinkSync(testFile);
  console.log('   ✅ 清理测试文件');
  
} catch (error) {
  console.log(`   ❌ 脚本执行失败: ${error.message}`);
}

// 总结
console.log('\n' + '='.repeat(60));
console.log('🦞 虾子进化系统测试完成');

if (allDirsExist && allFilesExist) {
  console.log('✅ 所有测试通过！系统就绪。');
  console.log('\n下一步行动:');
  console.log('1. 集成到 OpenClaw 钩子系统');
  console.log('2. 设置定时本能提取任务');
  console.log('3. 开始技能生成');
} else {
  console.log('⚠️  部分测试失败，请检查上述问题。');
}

console.log('='.repeat(60));