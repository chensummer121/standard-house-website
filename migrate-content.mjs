import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = '/root/openclaw-data/workspace/knowledge/STANDERRA-Wiki/三、支撑域/市场研究/埃塞俄比亚';
const TARGET = './src/content/countries/ethiopia';

// 目录映射
const sectionMap = {
  '一、投资决策': 'decision',
  '二、国家透视': 'insight',
  '三、产业纵深': 'industry',
  '四、实操工具': 'toolkit',
  '五、原始资料': 'archive',
};

const subsectionMap = {
  '1-一页纸决策': 'summary',
  '2-行业速查卡': 'quick-cards',
  '3-避雷清单': 'red-flags',
  '4-政策窗口': 'policy-window',
  '5-风险情景推演': 'risk-scenarios',
  '0-国家底层数据': 'data-panels',
  '1-这个国家凭什么存在': 'why-exist',
  '2-谁在管这个国家': 'power-structure',
  '3-钱从哪来到哪去': 'money-flow',
  '4-社会怎么兜底的': 'social-safety',
  '5-正在发生的结构性变化': 'structural-change',
  '1-底座产业': 'foundation',
  '2-动脉产业': 'artery',
  '3-金融与分配': 'finance',
  '4-内需产业': 'domestic',
  '5-套利产业': 'arbitrage',
  '1-法规速查': 'laws',
  '2-企业与项目': 'companies',
  '3-城市档案': 'cities',
  '4-数据面板': 'data-dashboards',
};

function getFrontmatter(filePath, relativePath, section) {
  const filename = path.basename(filePath, '.md');
  let title = filename
    .replace(/^\d+-/, '')
    .replace(/\.[^.]+$/, '');
  
  if (title.includes('：')) {
    title = title.split('：').pop() || title;
  }
  
  let subsection = 'general';
  
  for (const [cn, en] of Object.entries(subsectionMap)) {
    if (relativePath.includes(cn)) {
      subsection = en;
      break;
    }
  }
  
  return `---\ntitle: "${title.replace(/"/g, '\\"')}"\nsection: "${section}"\nsubsection: "${subsection}"\ncountry: "ethiopia"\n---\n\n`;
}

function processFile(srcPath, destPath, section) {
  let content = fs.readFileSync(srcPath, 'utf-8');
  content = content.replace(/^---\n[\s\S]*?---\n\n?/, '');
  
  const relativePath = srcPath.replace(SOURCE, '');
  const frontmatter = getFrontmatter(srcPath, relativePath, section);
  
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.writeFileSync(destPath, frontmatter + content);
  console.log(`✓ ${relativePath}`);
}

function walkDir(srcDir, section, baseTarget) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relativePath = path.relative(SOURCE, srcPath);
    
    if (entry.isDirectory()) {
      if (entry.name === 'README.md') continue;
      
      let targetDir = baseTarget;
      for (const [cn, en] of Object.entries(subsectionMap)) {
        if (entry.name.includes(cn)) {
          targetDir = path.join(baseTarget, en);
          break;
        }
      }
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      walkDir(srcPath, section, targetDir);
    } else if (entry.name.endsWith('.md')) {
      if (entry.name === 'README.md' || entry.name.startsWith('_')) continue;
      
      let destName = entry.name
        .replace(/^\d+-/, '')
        .replace(/[：:]/g, '-');
      
      const destPath = path.join(baseTarget, destName);
      processFile(srcPath, destPath, section);
    }
  }
}

console.log('开始迁移MD文件...\n');

for (const [sectionCn, sectionEn] of Object.entries(sectionMap)) {
  const srcDir = path.join(SOURCE, sectionCn);
  if (fs.existsSync(srcDir)) {
    console.log(`\n📁 处理: ${sectionCn}`);
    const targetDir = path.join(TARGET, sectionEn);
    walkDir(srcDir, sectionEn, targetDir);
  }
}

// 处理原始资料 - 实际上在埃塞俄比亚目录内
console.log('\n📁 处理: 原始资料');
const reports = [
  '埃塞俄比亚国家全景底座模型.md',
  '埃塞俄比亚产业模型.md',
  '埃塞俄比亚模式崩塌：北京视角.md',
  '亚的斯亚贝巴长期发展潜力综合分析.md',
  '埃塞俄比亚国家基盘分析.md',
  '埃塞俄比亚基本盘.md',
  '埃塞俄比亚外资投资机遇分析.md',
  '伊朗冲突后埃塞俄比亚地缘金融重塑.md',
];

for (const file of reports) {
  const srcPath = path.join(SOURCE, file);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf-8');
    content = content.replace(/^---\n[\s\S]*?---\n\n?/, '');
    
    const destName = file.replace(/[：:]/g, '-');
    const destPath = path.join(TARGET, 'archive', destName);
    
    const title = destName.replace(/\.md$/, '');
    const frontmatter = `---\ntitle: "${title}"\nsection: "archive"\nsubsection: "reports"\ncountry: "ethiopia"\n---\n\n`;
    
    fs.writeFileSync(destPath, frontmatter + content);
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ 文件不存在: ${file}`);
  }
}

console.log('\n✅ 迁移完成！');
