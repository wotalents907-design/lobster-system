#!/usr/bin/env node
/**
 * legalbot - 合同风险扫描脚本
 * 输入合同文本，输出风险分析报告
 */

const fs = require('fs');
const path = require('path');

const RISK_KEYWORDS_PATH = path.join(__dirname, '../data/contract_risk_keywords.json');

function loadRiskKeywords() {
    try {
        return JSON.parse(fs.readFileSync(RISK_KEYWORDS_PATH, 'utf8'));
    } catch (e) {
        return { high_risk: [], medium_risk: [], low_risk: [] };
    }
}

function scanContract(text) {
    const keywords = loadRiskKeywords();
    const findings = {
        high: [],
        medium: [],
        low: [],
        total: 0
    };

    const textLower = text.toLowerCase();

    // Scan for high risk keywords
    for (const item of keywords.high_risk || []) {
        if (textLower.includes(item.keyword.toLowerCase())) {
            findings.high.push(item);
        }
    }

    // Scan for medium risk keywords
    for (const item of keywords.medium_risk || []) {
        if (textLower.includes(item.keyword.toLowerCase())) {
            findings.medium.push(item);
        }
    }

    // Scan for low risk keywords
    for (const item of keywords.low_risk || []) {
        if (textLower.includes(item.keyword.toLowerCase())) {
            findings.low.push(item);
        }
    }

    findings.total = findings.high.length + findings.medium.length + findings.low.length;

    return findings;
}

function formatReport(findings) {
    let report = '## 合同风险扫描报告\n\n';

    report += `**扫描结果：共发现 ${findings.total} 个风险点**\n\n`;

    if (findings.high.length > 0) {
        report += '### 🔴 高风险项\n\n';
        for (const item of findings.high) {
            report += `- **"${item.keyword}"**（${item.location}）\n`;
            report += `  → ${item.risk}\n\n`;
        }
    }

    if (findings.medium.length > 0) {
        report += '### 🟡 中风险项\n\n';
        for (const item of findings.medium) {
            report += `- **"${item.keyword}"**（${item.location}）\n`;
            report += `  → ${item.risk}\n\n`;
        }
    }

    if (findings.low.length > 0) {
        report += '### 🟢 低风险项\n\n';
        for (const item of findings.low) {
            report += `- **"${item.keyword}"**（${item.location}）\n`;
            report += `  → ${item.risk}\n\n`;
        }
    }

    if (findings.total === 0) {
        report += '✅ 未发现明显风险关键词，建议人工复核。\n';
    }

    report += '---\n';
    report += '*本报告仅供参考，不构成正式法律意见。*\n';

    return report;
}

// CLI entry point
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node contract_scan.js <合同文本文件路径>');
        process.exit(1);
    }

    const filePath = args[0];

    if (!fs.existsSync(filePath)) {
        console.error(`文件不存在: ${filePath}`);
        process.exit(1);
    }

    const text = fs.readFileSync(filePath, 'utf8');
    const findings = scanContract(text);
    const report = formatReport(findings);

    console.log(report);
}

module.exports = { scanContract, formatReport };
