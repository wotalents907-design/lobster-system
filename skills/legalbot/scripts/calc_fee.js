#!/usr/bin/env node
/**
 * legalbot - 诉讼费计算脚本
 * 根据标的额计算诉讼费
 */

const fs = require('fs');
const path = require('path');

const LITIGATION_FEES_PATH = path.join(__dirname, '../data/litigation_fees.json');

function loadLitigationFees() {
    try {
        return JSON.parse(fs.readFileSync(LITIGATION_FEES_PATH, 'utf8'));
    } catch (e) {
        return null;
    }
}

function calculateLitigationFee(amount) {
    const data = loadLitigationFees();
    if (!data) {
        return calculateBasicFee(amount);
    }

    const ranges = data.ranges;
    for (const range of ranges) {
        if (amount >= range.min && (range.max === null || amount < range.max)) {
            if (range.fee !== undefined) {
                return range.fee;
            } else {
                return Math.floor(amount * range.rate - range.base);
            }
        }
    }
    return null;
}

function calculateBasicFee(amount) {
    // Fallback calculation
    if (amount <= 10000) return 50;
    if (amount <= 100000) return Math.floor(50 + (amount - 10000) * 0.025);
    if (amount <= 200000) return Math.floor(2000 + (amount - 100000) * 0.02);
    if (amount <= 500000) return Math.floor(4000 + (amount - 200000) * 0.015);
    if (amount <= 1000000) return Math.floor(8500 + (amount - 500000) * 0.01);
    if (amount <= 2000000) return Math.floor(13500 + (amount - 1000000) * 0.009);
    if (amount <= 5000000) return Math.floor(22500 + (amount - 2000000) * 0.008);
    if (amount <= 10000000) return Math.floor(46500 + (amount - 5000000) * 0.007);
    return Math.floor(81500 + (amount - 1000000) * 0.006);
}

function formatFeeReport(amount, fee) {
    let report = '## 诉讼费计算报告\n\n';
    report += `**标的额：** ${amount.toLocaleString()} 元\n`;
    report += `**诉讼费：** ${fee.toLocaleString()} 元\n\n`;

    report += '### 费用构成说明\n\n';
    report += '- 案件受理费（交给法院）\n';
    report += `- 简易程序减半：${Math.floor(fee / 2).toLocaleString()} 元\n` if (amount < 100000);
    report += '\n---\n';
    report += '*注：实际费用以法院开具的缴费通知书为准。*\n';

    return report;
}

// CLI entry point
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node calc_fee.js <标的额(元)>');
        console.log('Example: node calc_fee.js 100000');
        process.exit(1);
    }

    const amount = parseFloat(args[0].replace(/,/g, ''));

    if (isNaN(amount) || amount < 0) {
        console.error('请输入有效的标的额');
        process.exit(1);
    }

    const fee = calculateLitigationFee(amount);
    const report = formatFeeReport(amount, fee);
    console.log(report);
}

module.exports = { calculateLitigationFee, formatFeeReport };
