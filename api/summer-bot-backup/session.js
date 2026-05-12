/**
 * Summer Bot 会话管理模块
 * 处理消息历史、上下文组装和token限制
 */

// 最大对话轮数（每轮包含user和assistant各一条消息）
const MAX_CONVERSATION_TURNS = 10;

// 估算token数（中文约1字=1token，英文约4字符=1token）
const TOKEN_ESTIMATION = {
  chinese: 1,
  english: 0.25,
  overhead: 500 // system prompt等固定开销
};

/**
 * 估算文本token数量
 * @param {string} text - 输入文本
 * @returns {number} 估算token数
 */
export function estimateTokens(text) {
  if (!text) return 0;
  
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  
  return Math.ceil(chineseChars * TOKEN_ESTIMATION.chinese + 
                   otherChars * TOKEN_ESTIMATION.english);
}

/**
 * 计算消息列表的总token数
 * @param {Array} messages - 消息列表
 * @param {string} systemPrompt - 系统提示词
 * @returns {number} 总token数
 */
export function calculateTotalTokens(messages, systemPrompt = '') {
  let total = estimateTokens(systemPrompt);
  
  for (const msg of messages) {
    total += estimateTokens(msg.role) + estimateTokens(msg.content);
    total += 4; // role和content标记的固定开销
  }
  
  return total + TOKEN_ESTIMATION.overhead;
}

/**
 * 构建发送给LLM的消息列表
 * @param {Array} history - 历史消息 [{role: "user"|"assistant", content: string}]
 * @param {string} systemPrompt - 系统提示词
 * @param {string} currentMessage - 当前用户消息
 * @param {Object} options - 配置选项
 * @param {number} options.maxTokens - 最大token限制，默认2048
 * @returns {Array} 符合LLM格式的消息列表
 */
export function buildMessages(history = [], systemPrompt, currentMessage, options = {}) {
  const { maxTokens = 2048 } = options;
  
  // 构建完整消息列表
  const allMessages = [];
  
  // 添加系统提示词
  if (systemPrompt) {
    allMessages.push({ role: 'system', content: systemPrompt });
  }
  
  // 添加历史消息（最多保留最近10轮）
  const recentHistory = history.slice(-MAX_CONVERSATION_TURNS * 2);
  allMessages.push(...recentHistory);
  
  // 添加当前消息
  if (currentMessage) {
    allMessages.push({ role: 'user', content: currentMessage });
  }
  
  // 如果总token超限，裁剪最早的对话
  if (calculateTotalTokens(recentHistory, systemPrompt) > maxTokens * 0.6) {
    return trimMessages(allMessages, maxTokens);
  }
  
  return allMessages;
}

/**
 * 裁剪消息列表以适应token限制
 * @param {Array} messages - 消息列表
 * @param {number} maxTokens - 最大token数
 * @returns {Array} 裁剪后的消息列表
 */
function trimMessages(messages, maxTokens) {
  // 分离系统消息和对话消息
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');
  
  if (!systemMessage) {
    // 没有系统消息，直接裁剪对话
    return trimConversationOnly(conversationMessages, maxTokens);
  }
  
  // 预留系统消息的空间
  const systemTokens = estimateTokens(systemMessage.content);
  const availableTokens = maxTokens - systemTokens - TOKEN_ESTIMATION.overhead;
  
  // 从最新的消息开始保留，直到达到限制
  const trimmedConversation = [];
  let currentTokens = 0;
  
  // 逆序遍历，从最新消息开始
  for (let i = conversationMessages.length - 1; i >= 0; i--) {
    const msg = conversationMessages[i];
    const msgTokens = estimateTokens(msg.content) + 4;
    
    if (currentTokens + msgTokens <= availableTokens) {
      trimmedConversation.unshift(msg);
      currentTokens += msgTokens;
    } else {
      break;
    }
  }
  
  // 返回包含系统消息的结果
  const result = [systemMessage, ...trimmedConversation];
  return result;
}

/**
 * 仅裁剪对话消息（无系统消息时）
 */
function trimConversationOnly(messages, maxTokens) {
  const availableTokens = maxTokens - TOKEN_ESTIMATION.overhead;
  const result = [];
  let currentTokens = 0;
  
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const msgTokens = estimateTokens(msg.content) + 4;
    
    if (currentTokens + msgTokens <= availableTokens) {
      result.unshift(msg);
      currentTokens += msgTokens;
    } else {
      break;
    }
  }
  
  return result;
}

/**
 * 从消息历史中提取关键上下文
 * 用于快速判断对话主题和需求
 * @param {Array} history - 历史消息
 * @returns {Object} 提取的上下文信息
 */
export function extractContextFromHistory(history = []) {
  const context = {
    mentionedCountries: [],
    mentionedIndustries: [],
    discussedModes: [],
    userGoals: []
  };
  
  const countryPatterns = /埃塞|肯尼亚|坦桑尼亚|乌干达|卢旺达|ethiopia|kenya|tanzania|uganda|rwanda/gi;
  const industryPatterns = /建材|制造|农业|能源|ICT|建筑|房地产|物流|制造|工厂/gi;
  const modePatterns = /选国家|算成本|看风险|问审批|国别|成本|风险|审批/gi;
  
  for (const msg of history) {
    if (msg.role === 'user') {
      // 检测提到的国家
      const countries = msg.content.match(countryPatterns);
      if (countries) {
        context.mentionedCountries.push(...countries);
      }
      
      // 检测提到的行业
      const industries = msg.content.match(industryPatterns);
      if (industries) {
        context.mentionedIndustries.push(...industries);
      }
      
      // 检测讨论模式
      const modes = msg.content.match(modePatterns);
      if (modes) {
        context.discussedModes.push(...modes);
      }
    }
  }
  
  // 去重
  context.mentionedCountries = [...new Set(context.mentionedCountries)];
  context.mentionedIndustries = [...new Set(context.mentionedIndustries)];
  context.discussedModes = [...new Set(context.discussedModes)];
  
  return context;
}

/**
 * 生成会话摘要（用于长期记忆）
 * @param {Array} history - 历史消息
 * @returns {string} 会话摘要
 */
export function generateSessionSummary(history = []) {
  if (history.length === 0) {
    return '新会话';
  }
  
  const context = extractContextFromHistory(history);
  const lastMessage = history[history.length - 1]?.content || '';
  
  let summary = '对话摘要：';
  
  if (context.mentionedCountries.length > 0) {
    summary += `涉及国家[${context.mentionedCountries.join(', ')}]。`;
  }
  
  if (context.mentionedIndustries.length > 0) {
    summary += `涉及行业[${context.mentionedIndustries.join(', ')}]。`;
  }
  
  if (context.discussedModes.length > 0) {
    summary += `使用模式[${context.discussedModes.join(', ')}]。`;
  }
  
  summary += `最新问题：[${lastMessage.substring(0, 50)}${lastMessage.length > 50 ? '...' : ''}]`;
  
  return summary;
}

export default {
  buildMessages,
  estimateTokens,
  calculateTotalTokens,
  extractContextFromHistory,
  generateSessionSummary
};
