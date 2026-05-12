const fs = require('fs');
const path = require('path');

const countries = ['uganda', 'kenya'];
const results = [];

countries.forEach(country => {
  const contentDir = `/root/invest-db/src/content/countries/${country}`;
  
  function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = filePath.replace(contentDir + '/', '');
    
    // Check frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let frontmatter = {};
    if (frontmatterMatch) {
      const fmContent = frontmatterMatch[1];
      frontmatterMatch[1].split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          frontmatter[key.trim()] = valueParts.join(':').trim();
        }
      });
    }
    
    // Content after frontmatter
    const bodyContent = frontmatterMatch ? content.split('---').slice(2).join('---').trim() : content;
    const bodyLines = bodyContent.split('\n').filter(l => l.trim());
    const bodyLineCount = bodyLines.length;
    
    // Placeholder detection
    const placeholders = [];
    const placeholderPatterns = [
      'Coming Soon', '待补充', 'TBD', '数据待更新', '暂无', 
      'TODO', '待定', '建设中', '即将上线', '持续更新中',
      'pending', 'not available', 'under development'
    ];
    placeholderPatterns.forEach(p => {
      if (content.toLowerCase().includes(p.toLowerCase())) {
        placeholders.push(p);
      }
    });
    
    // Vague data detection
    const vaguePatterns = [
      { pattern: /近年来/g, desc: '近年' },
      { pattern: /大幅[增长下降]/g, desc: '大幅X' },
      { pattern: /显著[增长下降]/g, desc: '显著X' },
      { pattern: /稳步[增长发展]/g, desc: '稳步X' },
      { pattern: /快速[增长发展]/g, desc: '快速X' },
      { pattern: /持续[增长发展]/g, desc: '持续X' },
      { pattern: /不断[增长发展]/g, desc: '不断X' },
      { pattern: /明显[增长改善]/g, desc: '明显X' },
      { pattern: /大约[0-9]+/g, desc: '大约X' },
      { pattern: /约[0-9]+/g, desc: '约X' },
    ];
    const vagueData = [];
    vaguePatterns.forEach(v => {
      const matches = content.match(v.pattern);
      if (matches) {
        vagueData.push(...matches.map(m => `${v.desc}:${m}`));
      }
    });
    
    // Specific data detection
    const specificPatterns = [
      { pattern: /\$[\d,]+\.?[\d]*[MBK]?/g, desc: '美元金额' },
      { pattern: /[0-9]+\.?[0-9]*%/g, desc: '百分比' },
      { pattern: /[0-9]{4}年/g, desc: '年份' },
      { pattern: /USD\s*[\d,]+/gi, desc: 'USD金额' },
      { pattern: /[0-9]+[\s]*(million|billion|M|B|K)/gi, desc: '英文数字' },
    ];
    const specificData = [];
    specificPatterns.forEach(s => {
      const matches = content.match(s.pattern);
      if (matches) {
        specificData.push(...matches.map(m => `${s.desc}:${m}`));
      }
    });
    
    // Check for auto-chart.js
    const hasAutoChart = content.includes('auto-chart.js');
    
    // Check frontmatter fields
    const requiredFields = ['title', 'section', 'country'];
    const missingFields = requiredFields.filter(f => !frontmatter[f]);
    
    return {
      file: fileName,
      lineCount: bodyLineCount,
      frontmatter,
      missingFields,
      placeholders,
      vagueData: [...new Set(vagueData)],
      specificData: [...new Set(specificData)],
      hasAutoChart,
      isShort: bodyLineCount < 20
    };
  }
  
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        results.push(processFile(fullPath));
      }
    }
  }
  
  walkDir(contentDir);
});

console.log(JSON.stringify(results, null, 2));
