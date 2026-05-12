import fs from 'fs';
import path from 'path';

const baseDir = '/root/invest-db/src/pages/invest/[country]';

// Define all sections and their paths
const sections = [
  // Decision section
  { path: 'decision', subsection: '', slugPath: 'decision' },
  { path: 'decision/quick-cards', subsection: 'quick-cards', slugPath: 'decision/quick-cards' },
  { path: 'decision/policy-window', subsection: 'policy-window', slugPath: 'decision/policy-window' },
  { path: 'decision/red-flags', subsection: 'red-flags', slugPath: 'decision/red-flags' },
  { path: 'decision/risk-scenarios', subsection: 'risk-scenarios', slugPath: 'decision/risk-scenarios' },
  
  // Insight section
  { path: 'insight/data-panels', subsection: 'data-panels', slugPath: 'insight/data-panels' },
  { path: 'insight/why-exist', subsection: 'why-exist', slugPath: 'insight/why-exist' },
  { path: 'insight/power-structure', subsection: 'power-structure', slugPath: 'insight/power-structure' },
  { path: 'insight/money-flow', subsection: 'money-flow', slugPath: 'insight/money-flow' },
  { path: 'insight/social-safety', subsection: 'social-safety', slugPath: 'insight/social-safety' },
  { path: 'insight/structural-change', subsection: 'structural-change', slugPath: 'insight/structural-change' },
  
  // Industry section
  { path: 'industry/foundation', subsection: 'foundation', slugPath: 'industry/foundation' },
  { path: 'industry/artery', subsection: 'artery', slugPath: 'industry/artery' },
  { path: 'industry/finance', subsection: 'finance', slugPath: 'industry/finance' },
  { path: 'industry/domestic', subsection: 'domestic', slugPath: 'industry/domestic' },
  { path: 'industry/arbitrage', subsection: 'arbitrage', slugPath: 'industry/arbitrage' },
  
  // Toolkit section
  { path: 'toolkit/laws', subsection: 'laws', slugPath: 'toolkit/laws' },
  { path: 'toolkit/companies', subsection: 'companies', slugPath: 'toolkit/companies' },
  { path: 'toolkit/cities', subsection: 'cities', slugPath: 'toolkit/cities' },
  { path: 'toolkit/data-dashboards', subsection: 'data-dashboards', slugPath: 'toolkit/data-dashboards' },
];

// Section display names and icons
const sectionMeta = {
  'decision': { name: '投资决策', icon: '💰', parent: null },
  'decision/quick-cards': { name: '行业速查卡', icon: '💳', parent: '投资决策' },
  'decision/policy-window': { name: '政策窗口', icon: '🪟', parent: '投资决策' },
  'decision/red-flags': { name: '避雷清单', icon: '⚠️', parent: '投资决策' },
  'decision/risk-scenarios': { name: '风险情景推演', icon: '🎭', parent: '投资决策' },
  'insight': { name: '深度透视', icon: '🔍', parent: null },
  'insight/data-panels': { name: '数据面板', icon: '📊', parent: '深度透视' },
  'insight/why-exist': { name: '地缘成因', icon: '🌍', parent: '深度透视' },
  'insight/power-structure': { name: '权力结构', icon: '⚖️', parent: '深度透视' },
  'insight/money-flow': { name: '资金流向', icon: '💸', parent: '深度透视' },
  'insight/social-safety': { name: '社会稳定', icon: '🛡️', parent: '深度透视' },
  'insight/structural-change': { name: '结构变化', icon: '📈', parent: '深度透视' },
  'industry': { name: '产业纵深', icon: '🏭', parent: null },
  'industry/foundation': { name: '基础产业', icon: '🏗️', parent: '产业纵深' },
  'industry/artery': { name: '动脉产业', icon: '🛤️', parent: '产业纵深' },
  'industry/finance': { name: '金融产业', icon: '🏦', parent: '产业纵深' },
  'industry/domestic': { name: '内销产业', icon: '🛒', parent: '产业纵深' },
  'industry/arbitrage': { name: '套利机会', icon: '🎯', parent: '产业纵深' },
  'toolkit': { name: '投资工具', icon: '🧰', parent: null },
  'toolkit/laws': { name: '法规指南', icon: '📜', parent: '投资工具' },
  'toolkit/companies': { name: '企业数据库', icon: '🏢', parent: '投资工具' },
  'toolkit/cities': { name: '城市图谱', icon: '🗺️', parent: '投资工具' },
  'toolkit/data-dashboards': { name: '数据看板', icon: '📋', parent: '投资工具' },
};

function generateSlugAstro(section) {
  const meta = sectionMeta[section.path] || { name: section.path, parent: null };
  const { name, icon, parent } = meta;
  
  // Calculate relative path depth based on nesting
  // From [slug].astro to src/:
  // decision/[slug].astro -> decision/ -> [country]/ -> invest/ -> pages/ -> src/
  // That's 5 levels up (or 4 ../ to reach pages, then we need one more to reach src)
  // Actually: decision/ is 1 level, so we need 4 ../ to reach pages, then 1 more to reach src = 5 total
  // For quick-cards/ (2 levels): need 5 ../ to reach pages, 1 more to reach src = 6 total
  const pathDepth = section.path.split('/').length;
  // pathDepth + 3 gives us the correct number: depth 1 -> 4, depth 2 -> 5
  const numLevelsUp = pathDepth + 3;
  const relPath = '../'.repeat(numLevelsUp);
  
  // Filter pattern based on subsection
  let filterPattern;
  if (section.subsection === '') {
    // Root section files (like decision/one-page-decision.md)
    filterPattern = `id.startsWith('ethiopia/${section.path}/') && id.split('/').length === 3`;
  } else {
    filterPattern = `id.startsWith('ethiopia/${section.path}/')`;
  }
  
  // Breadcrumb items (using proper escaping for template literals)
  let breadcrumbItems;
  if (parent) {
    breadcrumbItems = `[
      { name: '${parent}', href: \`/invest/\${country}/${section.path.split('/')[0]}\` },
      { name: '${name}', href: \`/invest/\${country}/${section.path}\` },
      { name: doc.data.title }
    ]`;
  } else {
    breadcrumbItems = `[
      { name: '${name}', href: \`/invest/\${country}/${section.path}\` },
      { name: doc.data.title }
    ]`;
  }
  
  const showSubsection = section.subsection !== '';
  
  return `---
import BaseLayout from '${relPath}layouts/BaseLayout.astro';
import Header from '${relPath}components/Header.astro';
import Sidebar from '${relPath}components/Sidebar.astro';
import Breadcrumb from '${relPath}components/Breadcrumb.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const docs = await getCollection('countries', ({ id }) => 
    ${filterPattern} && id.endsWith('.md')
  );
  
  return docs.map(doc => ({
    params: { 
      country: 'ethiopia', 
      slug: doc.id.split('/').pop().replace('.md', '')
    },
    props: { doc },
  }));
}

const { doc } = Astro.props;
const { Content } = await doc.render();
const { country } = Astro.params;
const currentPath = Astro.url.pathname;
---

<BaseLayout title={\`\${doc.data.title} - Standerra\`}>
  <Header country={country} />
  <div class="flex">
    <Sidebar currentPath={currentPath} country={country} />
    <main class="flex-1 p-8 max-w-4xl">
      <Breadcrumb items={${breadcrumbItems}} />
      <article class="bg-white rounded-xl shadow-sm p-8">
        <header class="mb-8 pb-6 border-b">
          ${showSubsection ? `<div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span class="px-2 py-1 bg-secondary/10 text-secondary rounded">{doc.data.section}</span>
            <span>/</span>
            <span>{doc.data.subsection}</span>
          </div>` : ''}
          <h1 class="text-3xl font-bold text-gray-900">{doc.data.title}</h1>
        </header>
        <div class="prose prose-lg max-w-none">
          <Content />
        </div>
      </article>
    </main>
  </div>
</BaseLayout>

<style is:global>
  .prose h1 { font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem; }
  .prose h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
  .prose h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
  .prose p { margin: 0.75rem 0; line-height: 1.8; }
  .prose ul, .prose ol { margin: 1rem 0; padding-left: 1.5rem; }
  .prose li { margin: 0.5rem 0; line-height: 1.7; }
  .prose strong { font-weight: 600; color: #1a1a2e; }
  .prose em { font-style: italic; }
  .prose blockquote { border-left: 4px solid #e94560; padding-left: 1rem; margin: 1.5rem 0; background: #f9f9f9; padding: 1rem; border-radius: 0 8px 8px 0; }
  .prose code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
  .prose pre { background: #1a1a2e; color: #fff; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
  .prose pre code { background: none; padding: 0; }
  .prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  .prose th, .prose td { border: 1px solid #e5e5e5; padding: 0.75rem; text-align: left; }
  .prose th { background: #f5f5f5; font-weight: 600; }
  .prose tr:nth-child(even) { background: #fafafa; }
  .prose a { color: #e94560; text-decoration: underline; }
  .prose a:hover { color: #0f3460; }
  .prose hr { border: none; border-top: 1px solid #e5e5e5; margin: 2rem 0; }
</style>
`;
}

// Generate [slug].astro for each section
for (const section of sections) {
  const dirPath = path.join(baseDir, section.path);
  const filePath = path.join(dirPath, '[slug].astro');
  
  const content = generateSlugAstro(section);
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

console.log('All [slug].astro files created!');
