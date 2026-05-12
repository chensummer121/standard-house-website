import fs from 'fs';
import path from 'path';

// ==================== 知识库配置 ====================
const KNOWLEDGE_SOURCES = {
  // 公开知识库 - AI直接引用
  public: [
    '/root/invest-db/src/content/countries/**/*.{md,astro}',
    '/root/intel-kb/public/**/*.{md}',
  ],
  
  // 内部知识库 - AI隐去来源和具体数字后引用
  internal: [
    '/root/intel-kb/internal/**/*.{md}',
  ],
  
  // 机密知识库 - AI只输出方向性建议
  classified: [
    '/root/intel-kb/classified/**/*.{md}',
  ],
  
  // 结构化数据 - 用于定量分析
  structured: [
    '/root/intel-kb/structured-data/*.md',
    '/root/intel-kb/structured-data/**/*.md',
  ],
  
  // 方案包（现有29个）
  packages: [
    '/root/invest-db/src/content/packages/**/*.md',
  ]
};

// ==================== 内容级别标记 ====================
const CONTENT_TAGS = {
  PUBLIC: '[公开]',
  INTERNAL: '[内部]',
  CLASSIFIED: '[机密]'
};

// ==================== 分级输出过滤逻辑 ====================
function filterOutput(content, level) {
  if (level === 'public') {
    return content; // 直接输出
  }
  
  if (level === 'internal') {
    // 隐去：具体人名、具体金额、具体渠道名、具体案例细节
    return content
      .replace(/\d+[%$¥€]/g, '[具体金额]')
      .replace(/[A-Z][a-z]+ [A-Z][a-z]+（[^）]+）/g, '[相关方]')
      .replace(/[A-Z][a-z]+[A-Z][a-z]+公司/gi, '[相关企业]')
      .replace(/具体.*?(人名|企业|金额|数字)[^。]*。/g, '相关信息详见内部研判。');
  }
  
  if (level === 'classified') {
    // 只输出方向性结论
    return '从多维度综合判断，该方向的[机遇/风险]需重点关注。建议通过专业渠道深入了解。';
  }
  
  return content;
}

// ==================== 知识库文件读取 ====================
function readKnowledgeFiles(source) {
  const files = [];
  
  for (const pattern of source) {
    try {
      const basePath = pattern.replace(/\*\*\/\*.*$/, '').replace(/\/\*.*$/, '');
      const extPattern = pattern.match(/\.\{([^}]+)\}/)?.[1] || 'md';
      const exts = extPattern.split(',');
      
      function walkDir(dir) {
        if (!fs.existsSync(dir)) return;
        
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walkDir(fullPath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).slice(1);
            if (exts.includes(ext)) {
              try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                files.push({ path: fullPath, content });
              } catch (e) { /* skip unreadable */ }
            }
          }
        }
      }
      
      walkDir(basePath);
    } catch (e) { /* skip invalid pattern */ }
  }
  
  return files;
}

// ==================== 知识检索增强 ====================
function enhanceKnowledgeRetrieval(message) {
  const lowerMsg = message.toLowerCase();
  let structuredContext = '';
  
  // 结构化数据优先级判断
  const isCountryComparison = lowerMsg.includes('哪个国家') || lowerMsg.includes('国家对比') || lowerMsg.includes('选国家');
  const isCostCalculation = lowerMsg.includes('成本') || lowerMsg.includes('建厂') || lowerMsg.includes('算') || lowerMsg.includes('划算');
  const isRiskAssessment = lowerMsg.includes('风险') || lowerMsg.includes('安全') || lowerMsg.includes('政治');
  const isIndustryInquiry = lowerMsg.includes('行业') || lowerMsg.includes('市场') || lowerMsg.includes('机会');
  
  try {
    // 读取结构化数据
    const structuredFiles = readKnowledgeFiles(KNOWLEDGE_SOURCES.structured);
    
    for (const file of structuredFiles) {
      const fileName = path.basename(file.path);
      
      if (isCountryComparison && fileName === 'country-matrix.md') {
        structuredContext += '\n【结构化数据 - 国别矩阵】\n' + file.content + '\n';
      }
      
      if (isCostCalculation && fileName === 'cost-calculator.md') {
        structuredContext += '\n【结构化数据 - 成本计算器】\n' + file.content + '\n';
      }
      
      if (isRiskAssessment && fileName === 'risk-radar.md') {
        structuredContext += '\n【结构化数据 - 风险雷达】\n' + file.content + '\n';
      }
      
      if (isIndustryInquiry && file.path.includes('industry-matrix')) {
        structuredContext += '\n【行业矩阵数据】\n' + file.content + '\n';
      }
    }
  } catch (e) {
    // 静默处理，structured-data可能不存在
  }
  
  return structuredContext;
}

// ==================== 构建分级知识上下文 ====================
function buildKnowledgeContext() {
  let context = {
    public: '',
    internal: '',
    classified: '',
    structured: ''
  };
  
  try {
    // 读取公开知识库
    const publicFiles = readKnowledgeFiles(KNOWLEDGE_SOURCES.public);
    for (const file of publicFiles) {
      context.public += '\n=== ' + path.basename(file.path) + ' ===\n' + file.content + '\n';
    }
    
    // 读取内部知识库（标记为内部）
    const internalFiles = readKnowledgeFiles(KNOWLEDGE_SOURCES.internal);
    for (const file of internalFiles) {
      context.internal += CONTENT_TAGS.INTERNAL + ' ' + file.content + '\n';
    }
    
    // 读取机密知识库（只取摘要）
    const classifiedFiles = readKnowledgeFiles(KNOWLEDGE_SOURCES.classified);
    for (const file of classifiedFiles) {
      // 机密文件只取前200字符作为摘要
      const summary = file.content.substring(0, 200);
      context.classified += CONTENT_TAGS.CLASSIFIED + ' [摘要] ' + summary + '...\n';
    }
  } catch (e) {
    // 静默处理，某些路径可能不存在
  }
  
  return context;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message, context } = req.body || {};
  if (!message) return res.status(400).json({ error: "Message is required" });
  const ctx = context || "";
  const isDiaspora = ctx.includes("侨民");
  const isModeCountry = message.includes("选国家") || message.includes("帮我选") || message.includes("哪个国家");
  const isModeCost = message.includes("算成本") || message.includes("帮我算") || message.includes("建厂");
  const isModeRisk = message.includes("看风险") || message.includes("风险评估");
  const isModeApproval = message.includes("审批") || message.includes("怎么做");
  
    const sharedKnowledge = [
    "【Standerra微工厂矩阵 - 27个方案包，覆盖建筑全产业链+市政基建+农业+能源+水工配套】",
    "",
    "🏗️ 建筑结构：①集装箱改造($20k起) ②轻钢屋面($25k起) ③陶粒微工厂($50k起) ④预制构件站($20k起)",
    "🧱 围护墙体：⑤轻质墙板($30k起) ⑥墙体材料站($15k起，纤维板+加气块+石膏板) ⑦景观水泥制品($15k起)",
    "💧 防水保温：⑧聚氨酯保温($20k起) ⑨防水保温喷涂站($5k起，聚脲+喷雾+丁基) ⑩发泡陶瓷站($15k起)",
    "🔧 密封粘接：⑪密封胶粘站($30k起，结构胶+渗透结晶)",
    "📦 板材：⑫保温板材厂($20k起，EPS/XPS)",
    "🎨 涂装地坪：⑬涂装地坪站($10k起，油漆+环氧+真石漆)",
    "🏠 屋面系统：⑭水泥瓦站($10k起) ⑮高端屋面站($10k起，彩石瓦+大波瓦+仿木纹)",
    "🚪 机电配套：⑯门窗管材站($15k起，铝合金+PVC管+电线)",
    "⚡ 能源：⑰离网能源站($15k起，太阳能+沼气+微电网)",
    "🌱 农业：⑱模块化农业站($5k起，蘑菇仓+昆虫仓)",
    "⛏️ 上游材料：⑲对辊制砂站($10k起) ⑳上游材料站($15k起，钙粉+PAN纤维)",
    "✨ 内装精饰：㉑内装精饰站($10k起，石英石+PVC天花板+水磨石)",
    "🛠️ 施工装备：㉒施工装备站($30k起，铝模+搅拌车+滑模)",
    "🌉 市政基建：㉓市政基建站($10k起，玻璃钢+灯杆+土工格室+无梁拱)",
    "🌿 机电健康：㉔机电健康站($15k起，地热交换+新风+碳纤维加固)",
    "🤖 智能内装：㉕智能内装站($10k起，厨卫模块+3D打印+折叠隔断)",
    "🏗️ 水工基建：㉖预制水工站($8k起，化粪池+检查井+围墙板+排水沟)",
    "💧 离网供水：㉗离网供水站($8k起，雨水收集+净水+水箱+太阳能水泵)",
    "",
    "🏪 渠道网络：㉘集装箱前置仓($8k起，分布式建材零售门店网络，前店后仓)",
    "🏠 服务平台：㉙侨民代建服务($5k起，海外侨民远程代建，美金前置+数字化交付)",
    "",
    "每个方案包均采用三步走投资路径：Phase1贸易验证→Phase2本地生产→Phase3深度本地化",
    "最低$5k即可入场，组合投资可覆盖从基础建材到精装交付的全链条，从地基到交付、从供电到供水的完整闭环",
    "",
    "【东非5国核心数据(仅供参考)】",
    "埃塞：GDP$150B，1.32亿人，增速7.3%，电力$0.03-0.05/kWh全球最低，外汇管制严",
    "肯尼亚：GDP$120B，5640万人，增速4.7%，Fintech领先M-PESA，债务危机风险",
    "坦桑：GDP$79B，6860万人，增速5.5%，天然气58TCF，港口竞争",
    "乌干达：GDP$54B，5000万人，增速6.1%，石油10万桶/日将产，年轻人口",
    "卢旺达：GDP$14B，1400万人，增速8.9%，治理最佳，ICT热土"
  ].join("\n");
  
  // 获取分级知识上下文
  const knowledgeContext = buildKnowledgeContext();
  
  // 增强知识检索
  const structuredEnhancement = enhanceKnowledgeRetrieval(message);
  
  // 根据对话模式选择提示词
  let modeInstructions = '';
  if (isModeCountry) {
    modeInstructions = '\n【国别对比模式】请结合结构化数据中的country-matrix.md进行多维度打分对比，输出包含具体数值的比较表格。';
  } else if (isModeCost) {
    modeInstructions = '\n【成本计算模式】请结合cost-calculator.md输出各方案在五国的成本对比，包含土地、人力、能耗、物流等明细。';
  } else if (isModeRisk) {
    modeInstructions = '\n【风险评估模式】请结合risk-radar.md给出量化的风险评分，并指出各国家的主要风险因素。';
  } else if (isModeApproval) {
    modeInstructions = '\n【落地实操模式】请给出清晰的审批流程清单，标注关键卡点和避坑提示。';
  }
  
  // 构建分级系统提示词
  const systemPromptPrefix = "你是**中资出海东非情报顾问**，专为去东非（乌干达/埃塞俄比亚/肯尼亚/坦桑尼亚/卢旺达）投资的中国企业家提供决策支持。

你的核心优势：
1. 你有中英文双语能力，能读取当地一手英文资料
2. 你有公开数据和内部研判双重知识底座
3. 你擅长把复杂信息翻译成"老板能用的结论"

你的回答风格：
- 结论先行，一句话说清楚
- 必要时给出数字对比（如：埃塞工业电价0.05/kWh，比肯尼亚低67%）
- 指出具体的坑和机会
- 给出行动建议（找谁、怎么进场、什么时候）

你的边界：
- 公开数据：直接引用，可以说出处
- 内部研判：隐去来源和具体数字，给出趋势判断
- 机密信息：只输出方向性建议，不透露任何可追溯细节" + modeInstructions + "

【知识库内容】
【公开信息】
" + (knowledgeContext.public || '(暂无公开知识库内容)') + "

【内部研判】【内部】
" + (knowledgeContext.internal || '(暂无内部知识库内容)') + "

【结构化数据】
" + (structuredEnhancement || '(暂无相关结构化数据)') + "
";
  
  const rolePart = isDiaspora
    ? "你现在的身份是Standerra侨民建房顾问，主要服务东非侨民群体。核心任务：帮侨民回国建房、投资微工厂项目。当用户聊到某个国家时，结合该国的投资环境、建材市场、土地政策来推荐合适的微工厂方案。比如用户说想在肯尼亚建房，推荐轻钢屋面+防水喷涂站+聚氨酯保温的组合，并说明肯尼亚建材进口税和工业用电成本。语气：像懂行的老朋友，亲切实用，用数字说话。"
    : "你是一位拥有20年经验的全球顶级战略顾问，精通宏观经济学、政治经济学、产业社会学和地缘政治。你同时是Standerra投资情报分析师，掌握东非5国投资数据和29个微工厂方案包。\n\n【核心思维模式】\n① 高维度视角：从全球博弈(政)、资本流动(经)、产业重构(产)、社会变迁(社)的交叉点分析\n② 数据驱动：引用核心宏观指标(GDP构成、CPI/PPI、负债率、全要素生产率)或行业关键数据\n③ 结构化输出：所有回答必须逻辑清晰，使用标题、层级和核心摘要\n④ 第一性原理：追溯问题本质，而非仅仅讨论现象\n\n【默认分析框架】分析任何议题时，请包含以下维度：\n• 宏观环境(Context)：周期位置(债务周期、技术周期)\n• 博弈逻辑(Logic)：各关键利益相关方(政府、企业、民众、国际力量)的动机与成本\n• 结构性变动(Structural Change)：正在发生且不可逆的趋势\n• 风险与不确定性(Risk)：概率极小但影响巨大的黑天鹅因素\n\n【交互约束】\n• 深度优先：宁可深入分析一个点，也不要泛泛而谈十个点\n• 语言风格：专业、冷静、克制，带有洞察者特有的锐利，避免情绪化和公关辞令\n• 查漏补缺：如果提问存在逻辑缺陷或数据过时，请直接指出并给予修正\n\n【投资分析融合】\n当用户聊到具体行业(建材/建筑/制造/能源/农业)时，关联到Standerra微工厂方案包，说明该方案在目标国家的投资回报和落地优势。比如用户问肯尼亚建材市场，推荐防水保温喷涂站(IRR 38%)或密封胶粘站(IRR 46%)，并结合肯尼亚税收政策和进口替代空间。风险提示用⚠️标记，投资机会用✅标记。每个方案包均采用三步走投资路径：Phase1贸易验证→Phase2本地生产→Phase3深度本地化。";
  const systemPrompt = systemPromptPrefix + "\n\n" + rolePart + "\n\n" + sharedKnowledge + "\n\n充分发挥你的全部知识来回答问题，以上内部数据仅供参考。你的专业知识才是核心价值。中文回答，简洁有力。" + (ctx ? "\n\n当前页面上下文：\n" + ctx : "");
  const SF_KEY = process.env.SILICONFLOW_API_KEY;
  if (SF_KEY) {
    try {
      const sfRes = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + SF_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 1024,
          stream: false
        })
      });
      if (sfRes.ok) {
        const sfData = await sfRes.json();
        const reply = sfData.choices && sfData.choices[0] && sfData.choices[0].message && sfData.choices[0].message.content;
        if (reply) return res.status(200).json({ reply: reply, source: 'public' });
      } else {
        const errInfo = await sfRes.text();
        console.error("SiliconFlow error:", sfRes.status, errInfo.substring(0, 200));
        try {
          const sfRes2 = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + SF_KEY,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
              ],
              temperature: 0.7,
              max_tokens: 1024,
              stream: false
            })
          });
          if (sfRes2.ok) {
            const sfData2 = await sfRes2.json();
            const reply2 = sfData2.choices && sfData2.choices[0] && sfData2.choices[0].message && sfData2.choices[0].message.content;
            if (reply2) return res.status(200).json({ reply: reply2, source: 'public' });
          }
        } catch(e2) { console.error("SF fallback error:", e2.message); }
      }
    } catch (e) {
      console.error("SiliconFlow exception:", e.message);
    }
  }
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (GEMINI_KEY) {
    const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];
    for (const model of models) {
      try {
        const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + GEMINI_KEY;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n用户问题：" + message }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          })
        });
        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
          if (reply) return res.status(200).json({ reply: reply, source: 'public' });
        }
        const errData = await response.json().catch(() => ({}));
        if (errData.error && errData.error.message && errData.error.message.includes("quota")) continue;
      } catch (e) { continue; }
    }
  }
  return res.status(200).json({ reply: "__FALLBACK__" });
}
