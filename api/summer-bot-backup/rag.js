/**
 * Summer Bot RAG 检索引擎 v2
 * 基于关键词匹配的轻量级检索
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  defaultIndexPath: '/root/invest-db/api/summer-bot/kb-index.json',
  defaultTopK: 8,
  maxContextChars: 6000,
  weights: { country: 3, section: 2, keyword: 1, title: 2 }
};

const COUNTRY_KEYWORDS = {
  'ethiopia': ['ethiopia', '埃塞', '埃塞俄比亚', 'abiy', 'addis', '提格雷', 'addis ababa'],
  'kenya': ['kenya', '肯尼亚', 'nairobi', 'ruto', '内罗毕', '蒙巴萨', 'safari'],
  'uganda': ['uganda', '乌干达', 'kampala', 'museveni', '坎帕拉', 'museveni'],
  'tanzania': ['tanzania', '坦桑尼亚', 'dar es salaam', 'samia', '苏卢胡', '达累斯萨拉姆', 'ccm'],
  'rwanda': ['rwanda', '卢旺达', 'kigali', 'kagame', '基加利']
};

const INDUSTRY_KEYWORDS = {
  'mining': ['mining', '矿', 'gold', '石油', 'oil', 'gas', '天然气', 'copper', '铜', 'mining'],
  'agriculture': ['agriculture', '农业', 'coffee', '咖啡', 'tea', '茶叶', 'cotton', '棉花'],
  'fintech': ['fintech', '金融科技', 'payment', '支付', 'mobile money', 'mpesa'],
  'manufacturing': ['manufacturing', '制造', 'industrial', '工业', 'factory', '工厂'],
  'energy': ['energy', '能源', '电力', 'solar', '太阳能', 'hydropower', '水电'],
  'logistics': ['logistics', '物流', 'transport', '交通', 'port', '港口', '航空'],
  'construction': ['construction', '建筑', '房地产', 'real estate', '基础设施'],
  'tourism': ['tourism', '旅游', 'hotel', '酒店', 'safari']
};

function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, ' ');
}

function extractCountry(query) {
  const normalized = normalizeText(query);
  const countries = [];
  for (const [country, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    for (const kw of keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        countries.push(country);
        break;
      }
    }
  }
  return [...new Set(countries)];
}

function extractIndustry(query) {
  const normalized = normalizeText(query);
  const industries = [];
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    for (const kw of keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        industries.push(industry);
        break;
      }
    }
  }
  return [...new Set(industries)];
}

function extractSection(query) {
  const normalized = normalizeText(query);
  const sections = [];
  const sectionKeywords = {
    'decision': ['决策', 'decision', '投资', '机会', 'recommend', '投资决策', '机会'],
    'insight': ['洞察', 'insight', '分析', '深度', 'political', '经济'],
    'risk': ['风险', 'risk', '红旗', '警告', '合规', '死结'],
    'industry': ['行业', 'industry', '产业', '市场'],
    'toolkit': ['工具', 'toolkit', '计算', '模板'],
    'archive': ['档案', 'archive', '历史', '案例'],
    'grey-economy': ['灰色', 'grey', 'shadow'],
    'political-intel': ['政治', 'political', '权力', 'museveni', 'kagame', 'abiy']
  };
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    for (const kw of keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        sections.push(section);
        break;
      }
    }
  }
  return [...new Set(sections)];
}

function extractQueryKeywords(query) {
  const normalized = normalizeText(query);
  const stopWords = ['的', '是', '在', '和', 'the', 'a', 'an', 'is', 'in', 'to', 'for', 'of', 'and', 'or'];
  const words = normalized.split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));
  const chineseWords = query.match(/[\u4e00-\u9fff]+/g) || [];
  words.push(...chineseWords);
  return [...new Set(words)];
}

function scoreChunk(chunk, query, extracted) {
  let score = 0;
  const normalizedQuery = normalizeText(query);
  
  if (extracted.countries.includes(chunk.country)) {
    score += CONFIG.weights.country;
  }
  if (extracted.sections.includes(chunk.section)) {
    score += CONFIG.weights.section;
  }
  
  const titleNorm = normalizeText(chunk.title);
  for (const kw of extracted.keywords) {
    if (titleNorm.includes(kw.toLowerCase())) {
      score += CONFIG.weights.title;
    }
  }
  
  for (const kw of extracted.keywords) {
    const kwLower = kw.toLowerCase();
    if (chunk.keywords.some(k => k.toLowerCase().includes(kwLower))) {
      score += CONFIG.weights.keyword;
    }
    if (normalizeText(chunk.preview).includes(kwLower)) {
      score += CONFIG.weights.keyword * 0.5;
    }
  }
  
  return score;
}

function loadIndex(indexPath) {
  if (!fs.existsSync(indexPath)) throw new Error(`索引文件不存在: ${indexPath}`);
  return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
}

function retrieveChunks(query, index, options = {}) {
  if (!index || !index.chunks) throw new Error('无效的索引对象');
  
  const topK = options.topK || CONFIG.defaultTopK;
  const extracted = {
    countries: extractCountry(query),
    industries: extractIndustry(query),
    sections: extractSection(query),
    keywords: extractQueryKeywords(query)
  };
  
  if (options.countries && options.countries.length > 0) {
    extracted.countries = options.countries;
  }
  
  const candidates = index.chunks.filter(chunk => {
    if (options.levels && options.levels.length > 0) {
      if (!options.levels.includes(chunk.level)) return false;
    }
    if (options.sections && options.sections.length > 0) {
      if (!options.sections.includes(chunk.section)) return false;
    }
    return true;
  });
  
  const scored = candidates.map(chunk => ({
    ...chunk,
    _score: scoreChunk(chunk, query, extracted)
  }));
  
  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, topK);
}

function locateChunkContent(chunk, indexPath) {
  let filePath = null;
  const roots = [
    '/root/invest-db/src/content/countries/',
    '/root/intel-kb/public/',
    '/root/intel-kb/internal/',
    '/root/intel-kb/classified/',
    '/root/intel-kb/structured-data/'
  ];
  
  for (const root of roots) {
    const potentialPath = path.join(root, chunk.file);
    if (fs.existsSync(potentialPath)) {
      filePath = potentialPath;
      break;
    }
  }
  
  if (!filePath) {
    return { error: `找不到源文件: ${chunk.file}` };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  const body = fmMatch ? content.substring(fmMatch[0].length).trim() : content;
  
  const lines = body.split('\n');
  let sectionStart = -1;
  let sectionEnd = lines.length;
  let targetTitle = chunk.title.replace(/\s*\(\d+\/\d+\)$/, '');
  
  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^#+\s+(.+)$/);
    if (headingMatch) {
      const headingTitle = headingMatch[1].trim();
      if (headingTitle === targetTitle || targetTitle.includes(headingTitle) || headingTitle.includes(targetTitle.split(' ')[0])) {
        if (sectionStart === -1) sectionStart = i;
        else { sectionEnd = i; break; }
      }
    }
  }
  
  const chunkMatch = chunk.title.match(/\((\d+)\/(\d+)\)$/);
  if (chunkMatch && sectionStart >= 0) {
    const partIndex = parseInt(chunkMatch[1]) - 1;
    const totalParts = parseInt(chunkMatch[2]);
    const sectionContent = lines.slice(sectionStart + 1, sectionEnd).join('\n');
    const paragraphs = sectionContent.split(/\n\n+/).filter(p => p.trim());
    
    if (paragraphs.length > 0) {
      const avgPartSize = Math.ceil(paragraphs.length / totalParts);
      const startIdx = partIndex * avgPartSize;
      const endIdx = Math.min(startIdx + avgPartSize, paragraphs.length);
      return { title: chunk.title, content: paragraphs.slice(startIdx, endIdx).join('\n\n'), file: chunk.file, level: chunk.level };
    }
  }
  
  if (sectionStart >= 0) {
    return { title: chunk.title, content: lines.slice(sectionStart + 1, sectionEnd).join('\n').trim(), file: chunk.file, level: chunk.level };
  }
  
  return { title: chunk.title, content: body.substring(0, 2000), file: chunk.file, level: chunk.level, note: '未找到精确匹配，返回文件开头' };
}

function loadChunkContent(chunkId, index) {
  const chunk = index.chunks.find(c => c.id === chunkId);
  if (!chunk) return { error: `Chunk不存在: ${chunkId}` };
  return locateChunkContent(chunk, index._path || CONFIG.defaultIndexPath);
}

function buildContext(query, indexPath, options = {}) {
  const index = loadIndex(indexPath);
  index._path = indexPath;
  
  let chunks = retrieveChunks(query, index, options);
  
  const grouped = { public: [], internal: [], classified: [] };
  for (const chunk of chunks) {
    if (grouped[chunk.level]) grouped[chunk.level].push(chunk);
  }
  
  const sections = [];
  const levelOrder = ['public', 'internal', 'classified'];
  const levelLabels = { public: '【公开信息】', internal: '【内部研判】', classified: '【机密参考】' };
  
  for (const level of levelOrder) {
    if (grouped[level].length === 0) continue;
    const levelSection = [levelLabels[level]];
    for (const chunk of grouped[level]) {
      const result = locateChunkContent(chunk, indexPath);
      if (result.error) {
        levelSection.push(`\n## ${chunk.title}`);
        levelSection.push(`[文件: ${chunk.file}]`);
        levelSection.push(`(内容加载失败: ${result.error})`);
      } else {
        levelSection.push(`\n## ${result.title}`);
        levelSection.push(result.content);
      }
      if (sections.join('\n').length + levelSection.join('\n').length > CONFIG.maxContextChars) break;
    }
    sections.push(levelSection.join('\n'));
    if (sections.join('\n').length > CONFIG.maxContextChars) break;
  }
  
  return {
    context: sections.join('\n').substring(0, CONFIG.maxContextChars),
    chunks: chunks.map(c => ({ id: c.id, title: c.title, level: c.level, score: c._score })),
    stats: { totalChunks: chunks.length, byLevel: { public: grouped.public.length, internal: grouped.internal.length, classified: grouped.classified.length } }
  };
}

export { retrieveChunks, loadChunkContent, loadIndex, buildContext, extractCountry, extractIndustry, extractSection, extractQueryKeywords, scoreChunk, CONFIG };

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node rag.js <query> [--top-k N] [--level LEVEL] [--show-content]');
  console.log('Examples:');
  console.log('  node rag.js "埃塞俄比亚矿业投资机会"');
  console.log('  node rag.js "肯尼亚 fintech" --top-k 5');
  console.log('  node rag.js "风险评估" --level internal');
  process.exit(0);
}

const query = args.filter(a => !a.startsWith('--')).join(' ');
const topK = parseInt(args.find(a => a === '--top-k') ? args[args.indexOf('--top-k') + 1] : '8') || 8;
const levels = args.find(a => a === '--level') ? [args[args.indexOf('--level') + 1]] : undefined;
const showContent = args.includes('--show-content');

console.log(`\n🔍 查询: "${query}"`);
console.log(`📊 Top-K: ${topK}`);
if (levels) console.log(`🔐 级别: ${levels}`);
console.log('='.repeat(60));

try {
  const result = buildContext(query, CONFIG.defaultIndexPath, { topK, levels });
  
  console.log('\n📋 检索结果:');
  result.chunks.forEach((c, i) => {
    console.log(`  ${i + 1}. [${c.level}] ${c.title} (score: ${c.score.toFixed(1)})`);
  });
  
  console.log('\n📊 统计:');
  console.log(`   总结果: ${result.stats.totalChunks}`);
  console.log(`   公开: ${result.stats.byLevel.public}`);
  console.log(`   内部: ${result.stats.byLevel.internal}`);
  console.log(`   机密: ${result.stats.byLevel.classified}`);
  
  if (showContent) {
    console.log('\n📄 Context内容:');
    console.log('-'.repeat(60));
    console.log(result.context);
    console.log('-'.repeat(60));
  } else {
    console.log(`\n💡 提示: 使用 --show-content 显示完整context`);
    console.log(`📝 Context长度: ${result.context.length} 字符`);
  }
} catch (err) {
  console.error(`❌ 错误: ${err.message}`);
  process.exit(1);
}
