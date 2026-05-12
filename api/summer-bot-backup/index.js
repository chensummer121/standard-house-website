/**
 * Summer Bot 主API入口
 * Vercel Serverless Function
 * 
 * 支持:
 * - POST /api/summer-bot - 主对话入口
 * - GET /api/summer-bot - 健康检查
 * 
 * 特性:
 * - 流式/非流式响应
 * - 多模式支持 (default/country/cost/risk/approval)
 * - RAG增强检索
 * - 会话管理
 * - 分级信息处理
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 导入本地模块
import { buildSystemPrompt, inferMode, isDiasporaUser, MODES } from './prompt.js';
import { buildMessages } from './session.js';
import { callLLM, callLLMStream } from './llm.js';

// 导入RAG模块
import { buildContext, retrieveChunks, CONFIG as RAG_CONFIG } from './rag.js';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const API_VERSION = '1.0';

// RAG索引文件路径
const KB_INDEX_PATH = join(__dirname, 'kb-index.json');

// 最大历史消息数
const MAX_HISTORY_LENGTH = 20;

/**
 * CORS预检处理
 */
function handleCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

/**
 * 获取结构化数据
 * @param {string} mode - 对话模式
 * @returns {Object}
 */
function getStructuredData(mode) {
  // 结构化数据路径 - 兼容Vercel和本地开发
  const possiblePaths = [
    join(__dirname, '..', '..', 'intel-kb', 'structured-data'),
    join(process.cwd(), 'intel-kb', 'structured-data'),
    '/root/invest-db/intel-kb/structured-data'
  ];
  
  let structuredDataDir = null;
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      structuredDataDir = p;
      break;
    }
  }
  
  const result = {};
  
  if (structuredDataDir) {
    if (mode === MODES.COUNTRY) {
      const countryMatrixPath = join(structuredDataDir, 'country-matrix.md');
      if (existsSync(countryMatrixPath)) {
        result.countryMatrix = readFileSync(countryMatrixPath, 'utf-8');
      }
    }
    
    if (mode === MODES.COST) {
      const costCalculatorPath = join(structuredDataDir, 'cost-calculator.md');
      if (existsSync(costCalculatorPath)) {
        result.costCalculator = readFileSync(costCalculatorPath, 'utf-8');
      }
    }
    
    if (mode === MODES.RISK) {
      const riskRadarPath = join(structuredDataDir, 'risk-radar.md');
      if (existsSync(riskRadarPath)) {
        result.riskRadar = readFileSync(riskRadarPath, 'utf-8');
      }
    }
  }
  
  return result;
}

/**
 * 主请求处理器
 */
export default async function handler(req, res) {
  // CORS头
  handleCORS(res);
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 健康检查
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      version: API_VERSION,
      service: 'Summer Bot',
      timestamp: new Date().toISOString()
    });
  }
  
  // 仅接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 解析请求体
    const {
      message,
      sessionId,
      history = [],
      mode: requestedMode,
      context = '',
      source = 'web'
    } = req.body || {};
    
    // 验证必填字段
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // 检查是否请求流式响应
    const acceptHeader = req.headers['accept'] || '';
    const wantsStream = acceptHeader.includes('text/event-stream') || 
                        req.body?.stream === true;
    
    // 确定对话模式
    const mode = requestedMode || inferMode(message, context);
    
    // 判断是否为侨民用户
    const diaspora = isDiasporaUser(context, message);
    
    // 使用RAG模块检索相关知识
    let knowledgeContext = { public: '', internal: '', classified: '' };
    let chunksUsed = 0;
    
    try {
      // RAG检索 - 根据模式设置topK
      const ragTopK = mode === MODES.DEFAULT ? 8 : 12;
      
      // 构建完整查询（包含模式和上下文）
      const fullQuery = `${mode} ${message} ${context}`;
      
      const ragResult = buildContext(fullQuery, KB_INDEX_PATH, {
        topK: ragTopK,
        // 根据模式过滤级别
        levels: mode === MODES.DEFAULT ? undefined : ['public', 'internal']
      });
      
      if (ragResult && ragResult.context) {
        // 按级别分组
        const chunksByLevel = {
          public: [],
          internal: [],
          classified: []
        };
        
        for (const chunk of ragResult.chunks || []) {
          const level = chunk.level || 'public';
          if (chunksByLevel[level]) {
            chunksByLevel[level].push(chunk.content);
          }
        }
        
        knowledgeContext = {
          public: chunksByLevel.public.join('\n\n'),
          internal: chunksByLevel.internal.join('\n\n'),
          classified: chunksByLevel.classified.join('\n\n')
        };
        
        chunksUsed = ragResult.stats?.totalChunks || 0;
      }
    } catch (ragError) {
      console.warn('RAG retrieval failed, continuing without knowledge context:', ragError.message);
    }
    
    // 获取结构化数据
    const structuredData = getStructuredData(mode);
    
    // 构建系统提示词
    const systemPrompt = buildSystemPrompt({
      mode,
      context,
      knowledgeContext,
      isDiaspora: diaspora,
      structuredData
    });
    
    // 准备历史消息（限制长度）
    const limitedHistory = history.slice(-MAX_HISTORY_LENGTH);
    
    // 构建消息列表
    const messages = buildMessages(limitedHistory, systemPrompt, message, {
      maxTokens: 2048
    });
    
    // 流式响应
    if (wantsStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      try {
        const stream = await callLLMStream(messages, {
          maxTokens: 2048,
          temperature: 0.7
        });
        
        // 将流式响应转发给客户端
        const reader = stream.getReader();
        const encoder = new TextEncoder();
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            res.end();
            break;
          }
          
          res.write(value);
        }
      } catch (error) {
        console.error('Stream error:', error);
        res.status(500).json({ error: 'Stream processing failed' });
      }
      return;
    }
    
    // 非流式响应
    try {
      const result = await callLLM(messages, {
        maxTokens: 2048,
        temperature: 0.7,
        stream: false
      });
      
      return res.status(200).json({
        reply: result.content,
        source: 'ai',
        model: result.model,
        sessionId: sessionId || generateSessionId(),
        mode,
        chunksUsed,
        usage: result.usage || {}
      });
    } catch (error) {
      console.error('LLM call failed:', error);
      
      // 返回优雅降级响应
      return res.status(200).json({
        reply: '抱歉，AI顾问暂时无法响应。请稍后再试，或浏览站内各国投资报告获取详细信息。',
        source: 'fallback',
        sessionId: sessionId || generateSessionId(),
        mode,
        error: 'AI service temporarily unavailable'
      });
    }
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * 生成会话ID
 */
function generateSessionId() {
  return `summer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 保持向后兼容
export const config = {
  api: {
    bodyParser: true,
  },
};
