#!/usr/bin/env node
/**
 * 数据刷新脚本 - 埃塞俄比亚投资数据库
 * 
 * 功能：
 * 1. 从公开API获取最新数据（汇率、宏观指标）
 * 2. 更新 MD 文件中的数据
 * 3. 生成更新日志
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// 更新日志文件路径
const LOG_FILE = path.join(PROJECT_ROOT, 'public', 'data-update-log.json');

// 要更新的 MD 文件路径
const MACROECONOMY_FILE = path.join(PROJECT_ROOT, 'src/content/countries/ethiopia/insight/data-panels/macroeconomy.md');

// 静态 fallback 数据（当 API 不可用时使用）
const FALLBACK_DATA = {
  exchangeRate: {
    value: 136.4,
    date: '2025-07-18',
    source: 'Fallback data'
  },
  inflationRate: {
    value: 10.9,
    date: '2025-11',
    source: 'Fallback data'
  },
  policyRate: {
    value: 15,
    date: '2025-09',
    source: 'Fallback data'
  }
};

/**
 * 读取现有更新日志
 */
function readLogFile() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const content = fs.readFileSync(LOG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('读取日志文件失败:', e.message);
  }
  return { updates: [], lastUpdate: null };
}

/**
 * 写入更新日志
 */
function writeLogFile(logData) {
  try {
    // 确保 public 目录存在
    const publicDir = path.dirname(LOG_FILE);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2), 'utf-8');
    console.log('✓ 更新日志已保存: ' + LOG_FILE);
  } catch (e) {
    console.error('写入日志文件失败:', e.message);
  }
}

/**
 * 从多个 API 获取汇率数据
 */
async function fetchExchangeRate() {
  const apis = [
    {
      name: 'Exchangerate-API',
      url: 'https://api.exchangerate-api.com/v4/latest/USD',
      parse: function(data) {
        return {
          value: data.rates && data.rates.ETB ? data.rates.ETB : null,
          date: new Date().toISOString().split('T')[0]
        };
      }
    },
    {
      name: 'Open Exchange Rates',
      url: 'https://open.er-api.com/v6/latest/USD',
      parse: function(data) {
        return {
          value: data.rates && data.rates.ETB ? data.rates.ETB : null,
          date: new Date().toISOString().split('T')[0]
        };
      }
    }
  ];

  for (const api of apis) {
    try {
      console.log('正在从 ' + api.name + ' 获取汇率数据...');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(api.url, { 
        signal: controller.signal,
        headers: { 'User-Agent': 'Invest-DB-DataRefresh/1.0' }
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        console.log('  ' + api.name + ' 返回错误: ' + response.status);
        continue;
      }
      
      const data = await response.json();
      const result = api.parse(data);
      
      if (result.value) {
        console.log('✓ 从 ' + api.name + ' 获取成功: 1 USD = ' + result.value + ' ETB');
        return { ...result, source: api.name };
      }
    } catch (e) {
      console.log('  ' + api.name + ' 请求失败: ' + e.message);
    }
  }

  console.log('⚠️ 所有汇率 API 均不可用，使用 fallback 数据');
  return { ...FALLBACK_DATA.exchangeRate, source: 'Fallback' };
}

/**
 * 获取通胀数据（使用备用方法）
 */
async function fetchInflationRate() {
  // 由于 Trading Economics API 需要认证，这里使用备用方法
  console.log('⚠️ 通胀数据 API 需要认证，使用 fallback 数据');
  return { ...FALLBACK_DATA.inflationRate, source: 'Fallback' };
}

/**
 * 更新 macroeconomic.md 文件中的汇率数据
 */
function updateMacroeconomyFile(data, log) {
  try {
    let content = fs.readFileSync(MACROECONOMY_FILE, 'utf-8');
    let hasChanges = false;
    const changes = [];

    // 获取当前日期用于更新
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = monthNames[today.getMonth()] + ' ' + today.getFullYear();
    
    // 计算整数汇率（用于概览表）
    const roundedRate = Math.round(data.exchangeRate.value);
    const decimalRate = data.exchangeRate.value.toFixed(1);

    // 更新汇率数据 - 快速概览表（格式: | 官方汇率 | ~136 ETB/USD | Jul 2025 |）
    const overviewPattern = /(\| 官方汇率 \| ~?)(\d+\.?\d*)( ETB\/USD \|)(\s*)(\w+\s*\d{4})(\s*\|)/;
    const overviewMatch = content.match(overviewPattern);
    
    if (overviewMatch) {
      const oldValue = overviewMatch[2];
      const newValue = roundedRate.toString();
      
      if (oldValue !== newValue) {
        content = content.replace(overviewPattern, '$1' + newValue + '$3$4' + dateStr + '$6');
        hasChanges = true;
        changes.push({
          field: 'officialExchangeRate',
          oldValue: oldValue,
          newValue: newValue,
          file: 'macroeconomy.md'
        });
        console.log('  汇率(概览): ' + oldValue + ' → ' + newValue);
      }
    }

    // 更新汇率详细表格中的当前汇率（格式: | 2025年7月18日 | 136.4 | 当前汇率 |）
    const currentRatePattern = /(\| \d{4}年\d{1,2}月\d{1,2}日 \|)(\d+\.?\d*)(\s*\| 当前汇率 \|)/;
    const currentRateMatch = content.match(currentRatePattern);
    
    if (currentRateMatch) {
      const oldValue = currentRateMatch[2];
      const newValue = decimalRate;
      
      if (oldValue !== newValue) {
        content = content.replace(currentRatePattern, '$1' + newValue + '$3');
        hasChanges = true;
        console.log('  当前汇率(详细): ' + oldValue + ' → ' + newValue);
      }
    }

    if (hasChanges) {
      fs.writeFileSync(MACROECONOMY_FILE, content, 'utf-8');
      console.log('✓ macroeconomic.md 已更新');
      
      // 记录到日志
      changes.forEach(function(change) {
        log.updates.push({
          timestamp: new Date().toISOString(),
          field: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
          file: change.file,
          source: data.exchangeRate.source
        });
      });
    } else {
      console.log('  无需更新 macroeconomic.md（汇率未变化）');
    }

    return hasChanges;
  } catch (e) {
    console.error('更新 macroeconomic.md 失败: ' + e.message);
    return false;
  }
}

/**
 * 检查 git 状态
 */
function checkGitChanges() {
  try {
    // 检查是否是 git 仓库
    const isRepo = execSync('git rev-parse --is-inside-work-tree 2>/dev/null || echo "false"', { 
      cwd: PROJECT_ROOT,
      encoding: 'utf-8'
    }).trim();
    
    if (isRepo !== 'true') {
      console.log('  当前目录不是 git 仓库');
      return false;
    }
    
    const status = execSync('git status --porcelain', { 
      cwd: PROJECT_ROOT,
      encoding: 'utf-8'
    });
    
    return status.trim().length > 0;
  } catch (e) {
    console.error('检查 git 状态失败:', e.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('===========================================');
  console.log('  埃塞俄比亚投资数据库 - 数据刷新脚本');
  console.log('===========================================');
  console.log('  时间: ' + new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  console.log('');

  // 读取现有日志
  const log = readLogFile();
  
  // 获取最新数据
  console.log('--- 获取最新数据 ---');
  
  const exchangeRate = await fetchExchangeRate();
  const inflationRate = await fetchInflationRate();
  
  const allData = {
    exchangeRate,
    inflationRate,
    policyRate: FALLBACK_DATA.policyRate
  };
  
  console.log('');
  console.log('--- 更新 MD 文件 ---');
  
  // 更新文件
  const hasChanges = updateMacroeconomyFile(allData, log);
  
  // 更新日志时间戳
  log.lastUpdate = new Date().toISOString();
  log.lastDataFetch = {
    exchangeRate: exchangeRate,
    inflationRate: inflationRate,
    fetchedAt: new Date().toISOString()
  };
  
  // 写入日志
  writeLogFile(log);
  
  console.log('');
  console.log('--- 检查变化 ---');
  
  // 检查是否有实际变化
  const hasGitChanges = checkGitChanges();
  
  if (hasGitChanges) {
    console.log('✓ 检测到文件变化，需要提交部署');
    console.log('');
    console.log('===========================================');
    console.log('  数据刷新完成，准备触发部署');
    console.log('===========================================');
    process.exit(0); // 有变化，退出码 0
  } else {
    console.log('  无文件变化，跳过部署');
    console.log('');
    console.log('===========================================');
    console.log('  数据刷新完成（无变化）');
    console.log('===========================================');
    process.exit(0); // 无变化也退出码 0
  }
}

// 运行
main().catch(function(e) {
  console.error('脚本执行失败:', e);
  process.exit(1);
});
