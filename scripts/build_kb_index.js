#!/usr/bin/env node
/**
 * Summer Bot 知识库索引构建脚本 v2
 * 扫描所有知识库文件，按标题分段，构建索引
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  roots: [
    '/root/invest-db/src/content/countries/',
    '/root/intel-kb/public/',
    '/root/intel-kb/internal/',
    '/root/intel-kb/classified/',
    '/root/intel-kb/structured-data/'
  ],
  outputIndex: '/root/invest-db/api/summer-bot/kb-index.json',
  maxChunkSize: 2000,
  previewChars: 200
};

const COUNTRY_MAP = {
  'ethiopia': 'ethiopia', 'kenya': 'kenya', 
  'uganda': 'uganda', 'tanzania': 'tanzania', 'rwanda': 'rwanda'
};

function determineLevel(filePath) {
  if (filePath.includes('/classified/')) return 'classified';
  if (filePath.includes('/internal/')) return 'internal';
  if (filePath.includes('/public/')) return 'public';
  if (filePath.includes('/structured-data/')) return 'public';
  return 'public';
}

function extractCountry(filePath, frontmatter) {
  // 从frontmatter优先提取
  if (frontmatter && frontmatter.country) {
    const country = frontmatter.country.toLowerCase();
    if (COUNTRY_MAP[country]) return COUNTRY_MAP[country];
  }
  
  // 从路径提取
  const pathParts = filePath.split('/');
  for (const part of pathParts) {
    const lower = part.toLowerCase();
    if (COUNTRY_MAP[lower]) return COUNTRY_MAP[lower];
  }
  
  // 从文件名提取（针对intel-kb）
  const filename = path.basename(filePath).toLowerCase();
  for (const [country, code] of Object.entries(COUNTRY_MAP)) {
    if (filename.includes(country) || filename.includes(code)) {
      return country;
    }
  }
  // 简写匹配
  const abbrevs = { 'et': 'ethiopia', 'ke': 'kenya', 'ug': 'uganda', 'tz': 'tanzania', 'rw': 'rwanda' };
  for (const [abbr, country] of Object.entries(abbrevs)) {
    if (filename.includes(abbr)) return country;
  }
  
  return null;
}

function extractSection(filePath, frontmatter) {
  if (frontmatter && frontmatter.section) return frontmatter.section;
  const pathParts = filePath.split('/');
  const sections = ['decision', 'insight', 'industry', 'toolkit', 'archive', 
                    'grey-economy', 'political-intel', 'risk-cases', 'finance',
                    'construction', 'social-safety', 'competitor-intel', 
                    'pricing-intel', 'structured-data'];
  for (const part of pathParts) {
    if (sections.includes(part)) return part;
  }
  return 'general';
}

function extractSubsection(filePath, frontmatter) {
  if (frontmatter && frontmatter.subsection) return frontmatter.subsection;
  const pathParts = filePath.split('/');
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (['quick-cards', 'grey-economy', 'political-intel', 'risk-cases'].includes(pathParts[i])) {
      return pathParts[i];
    }
  }
  return '';
}

function parseFrontmatter(content) {
  const fm = {};
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (match) {
    const lines = match[1].split('\n');
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.substring(0, colonIdx).trim();
        let value = line.substring(colonIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        fm[key] = value;
      }
    }
  }
  return fm;
}

function removeFrontmatter(content) {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
}

function cleanTitle(title) {
  return title.replace(/^#+\s*/, '').trim();
}

function extractKeywords(title, content, country, section) {
  const keywords = new Set();
  const titleWords = title.replace(/[^\w\u4e00-\u9fff]/g, ' ')
                           .split(/\s+/)
                           .filter(w => w.length > 1);
  titleWords.forEach(w => keywords.add(w));
  if (country) keywords.add(country);
  if (section) keywords.add(section);
  
  const firstPara = content.split('\n').find(l => l.trim() && !l.startsWith('#') && !l.startsWith('>'));
  if (firstPara) {
    const words = firstPara.replace(/[^\w\u4e00-\u9fff]/g, ' ')
                           .split(/\s+/)
                           .filter(w => w.length > 2);
    words.slice(0, 10).forEach(w => keywords.add(w));
  }
  
  const industryTerms = ['mining', 'gold', 'agriculture', 'fintech', 'manufacturing',
                        'energy', 'logistics', 'construction', 'tourism', 'oil', 'gas'];
  industryTerms.forEach(term => {
    if (content.toLowerCase().includes(term)) keywords.add(term);
  });
  
  return Array.from(keywords).slice(0, 15);
}

function splitIntoChunks(text, maxSize) {
  if (text.length <= maxSize) return [text];
  const chunks = [];
  const paragraphs = text.split(/\n\n+/);
  let current = '';
  for (const para of paragraphs) {
    if (current.length + para.length + 2 <= maxSize) {
      current += (current ? '\n\n' : '') + para;
    } else {
      if (current) chunks.push(current);
      if (para.length > maxSize) {
        const sentences = para.split(/(?<=[。！？.!?])/);
        current = '';
        for (const sent of sentences) {
          if (current.length + sent.length <= maxSize) {
            current += sent;
          } else {
            if (current) chunks.push(current);
            current = sent;
          }
        }
      } else {
        current = para;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function generateChunkId(country, section, subsection, title, index) {
  const parts = [];
  if (country) parts.push(country);
  if (section) parts.push(section);
  const cleanTitle = title.toLowerCase().replace(/[^\w]/g, '-').replace(/-+/g, '-').substring(0, 30);
  parts.push(cleanTitle);
  parts.push(String(index).padStart(3, '0'));
  return parts.join('-');
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const body = removeFrontmatter(content);
    
    const country = extractCountry(filePath, frontmatter);
    const section = extractSection(filePath, frontmatter);
    const subsection = extractSubsection(filePath, frontmatter);
    const level = determineLevel(filePath);
    
    let relPath = filePath;
    for (const root of CONFIG.roots) {
      if (filePath.startsWith(root)) {
        relPath = filePath.substring(root.length);
        break;
      }
    }
    
    const chunks = [];
    const fileTitleMatch = body.match(/^#\s+(.+)$/m);
    const fileTitle = fileTitleMatch ? cleanTitle(fileTitleMatch[1]) : 
                     (frontmatter.title || path.basename(filePath, '.md'));
    
    const sections = [];
    let currentSection = { level: 0, title: '', content: '', startLine: 0 };
    const lines = body.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        if (currentSection.content || sections.length === 0) sections.push(currentSection);
        currentSection = { level: headingMatch[1].length, title: cleanTitle(headingMatch[2]), content: '', startLine: i };
      } else {
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      }
    }
    if (currentSection.content) sections.push(currentSection);
    
    for (let s = 0; s < sections.length; s++) {
      const sec = sections[s];
      const isTopLevel = s === 0;
      let title = isTopLevel ? fileTitle : sec.title;
      if (!title) title = `Section ${s + 1}`;
      
      let content = sec.content.trim();
      if (!content && !isTopLevel) continue;
      if (!content) continue;
      
      const subChunks = splitIntoChunks(content, CONFIG.maxChunkSize);
      
      for (let c = 0; c < subChunks.length; c++) {
        const chunkContent = subChunks[c];
        const uniqueTitle = subChunks.length > 1 ? `${title} (${c + 1}/${subChunks.length})` : title;
        
        chunks.push({
          id: generateChunkId(country, section, subsection, title, c),
          file: relPath,
          country: country,
          section: section,
          subsection: subsection,
          level: level,
          title: uniqueTitle,
          keywords: extractKeywords(uniqueTitle, chunkContent, country, section),
          charCount: chunkContent.length,
          preview: chunkContent.substring(0, CONFIG.previewChars).replace(/\n/g, ' ').trim()
        });
      }
    }
    return chunks;
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    return [];
  }
}

function scanDirectory(dir) {
  const files = [];
  function walk(d) {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(d, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
          files.push(fullPath);
        }
      }
    } catch (err) {}
  }
  walk(dir);
  return files;
}

function main() {
  console.log('\uD83D\uDD0D Summer Bot 知识库索引构建 v2');
  console.log('='.repeat(50));
  
  const allFiles = [];
  for (const root of CONFIG.roots) {
    if (fs.existsSync(root)) {
      const files = scanDirectory(root);
      console.log(`\uD83D\uDCC2 ${root}: ${files.length} 个文件`);
      allFiles.push(...files);
    } else {
      console.log(`\u26A0\uFE0F 目录不存在: ${root}`);
    }
  }
  
  console.log(`\n\uD83D\uDCCA 总计扫描 ${allFiles.length} 个文件`);
  
  const allChunks = [];
  let processed = 0;
  
  for (const file of allFiles) {
    const chunks = processFile(file);
    allChunks.push(...chunks);
    processed++;
    if (processed % 50 === 0) {
      console.log(`\u23F3 已处理 ${processed}/${allFiles.length} 个文件, 生成 ${allChunks.length} 个chunks...`);
    }
  }
  
  const stats = {
    totalFiles: allFiles.length,
    totalChunks: allChunks.length,
    totalChars: allChunks.reduce((sum, c) => sum + c.charCount, 0)
  };
  
  const byCountry = {};
  for (const chunk of allChunks) {
    const country = chunk.country || 'unknown';
    byCountry[country] = (byCountry[country] || 0) + 1;
  }
  
  const byLevel = {};
  for (const chunk of allChunks) {
    byLevel[chunk.level] = (byLevel[chunk.level] || 0) + 1;
  }
  
  const bySection = {};
  for (const chunk of allChunks) {
    bySection[chunk.section] = (bySection[chunk.section] || 0) + 1;
  }
  
  const index = {
    version: '1.0',
    builtAt: new Date().toISOString(),
    stats: stats,
    byCountry: byCountry,
    byLevel: byLevel,
    bySection: bySection,
    chunks: allChunks
  };
  
  const outputDir = path.dirname(CONFIG.outputIndex);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  fs.writeFileSync(CONFIG.outputIndex, JSON.stringify(index, null, 2), 'utf-8');
  
  console.log('\n\u2705 索引构建完成！');
  console.log('='.repeat(50));
  console.log(`\uD83D\uDCC4 输出文件: ${CONFIG.outputIndex}`);
  console.log(`\uD83D\uDCCA 文件大小: ${(fs.statSync(CONFIG.outputIndex).size / 1024).toFixed(1)} KB`);
  console.log('\n\uD83D\uDCC8 统计信息:');
  console.log(`   总文件数: ${stats.totalFiles}`);
  console.log(`   总chunk数: ${stats.totalChunks}`);
  console.log(`   总字符数: ${stats.totalChars.toLocaleString()}`);
  
  console.log('\n\uD83C\uDF0D 按国家分布:');
  for (const [country, count] of Object.entries(byCountry)) {
    console.log(`   ${country}: ${count}`);
  }
  
  console.log('\n\uD83D\uDD10 按级别分布:');
  for (const [level, count] of Object.entries(byLevel)) {
    console.log(`   ${level}: ${count}`);
  }
  
  console.log('\n\uD83D\uDCD1 按section分布:');
  for (const [section, count] of Object.entries(bySection)) {
    console.log(`   ${section}: ${count}`);
  }
}

main();
