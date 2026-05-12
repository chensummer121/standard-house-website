/**
 * Summer Bot LLM 网关
 * 支持硅基流动(DeepSeek)和Gemini降级
 * 支持流式和非流式输出
 */

// API配置
const SILICON_FLOW_API = 'https://api.siliconflow.cn/v1/chat/completions';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// 模型优先级
const SILICON_FLOW_MODELS = [
  'deepseek-ai/DeepSeek-V3',
  'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'
];

const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash'
];

// 默认参数
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2048;

/**
 * 调用硅基流动API
 * @param {string} apiKey - API密钥
 * @param {string} model - 模型名称
 * @param {Array} messages - 消息列表
 * @param {Object} options - 配置选项
 * @returns {Promise<{content: string, model: string, usage: Object}>}
 */
async function callSiliconFlow(apiKey, model, messages, options = {}) {
  const { temperature = DEFAULT_TEMPERATURE, maxTokens = DEFAULT_MAX_TOKENS, stream = false } = options;
  
  const response = await fetch(SILICON_FLOW_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SiliconFlow API error: ${response.status} - ${errorText}`);
  }
  
  if (stream) {
    // 流式响应
    return {
      stream: response.body,
      model
    };
  }
  
  const data = await response.json();
  
  return {
    content: data.choices?.[0]?.message?.content || '',
    model,
    usage: data.usage || {},
    raw: data
  };
}

/**
 * 调用Gemini API
 * @param {string} apiKey - API密钥
 * @param {string} model - 模型名称
 * @param {string} prompt - 提示词
 * @param {Object} options - 配置选项
 * @returns {Promise<{content: string, model: string, usage: Object}>}
 */
async function callGemini(apiKey, model, prompt, options = {}) {
  const { temperature = DEFAULT_TEMPERATURE, maxOutputTokens = DEFAULT_MAX_TOKENS } = options;
  
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens
      }
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.error?.message?.includes('quota')) {
      throw new Error('GEMINI_QUOTA_EXCEEDED');
    }
    throw new Error(`Gemini API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    model,
    usage: {
      prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
      completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
      total_tokens: data.usageMetadata?.totalTokenCount || 0
    },
    raw: data
  };
}

/**
 * 主调用函数 - LLM网关
 * @param {Array} messages - 消息列表 (OpenAI格式)
 * @param {Object} options - 配置选项
 * @param {boolean} options.stream - 是否流式输出
 * @param {number} options.maxTokens - 最大token数
 * @param {number} options.temperature - 温度参数
 * @returns {Promise<{content: string, model: string, usage: Object}> | ReadableStream}
 */
export async function callLLM(messages, options = {}) {
  const { stream = false, maxTokens = DEFAULT_MAX_TOKENS, temperature = DEFAULT_TEMPERATURE } = options;
  
  // 获取API密钥
  const sfKey = process.env.SILICONFLOW_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  
  // 优先尝试硅基流动
  if (sfKey) {
    for (const model of SILICON_FLOW_MODELS) {
      try {
        const result = await callSiliconFlow(sfKey, model, messages, {
          stream,
          maxTokens,
          temperature
        });
        
        if (stream) {
          // 流式响应需要包装
          return wrapSSEStream(result.stream, model);
        }
        
        if (result.content) {
          return result;
        }
      } catch (error) {
        console.error(`SiliconFlow model ${model} failed:`, error.message);
        
        // 如果是R1模型且失败，尝试下一个
        if (!error.message.includes('rate') && !error.message.includes('quota')) {
          continue;
        }
      }
    }
  }
  
  // 降级到Gemini
  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        // Gemini使用简单的文本拼接格式
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
        
        const result = await callGemini(geminiKey, model, prompt, {
          maxOutputTokens: maxTokens,
          temperature
        });
        
        if (result.content) {
          return result;
        }
      } catch (error) {
        console.error(`Gemini model ${model} failed:`, error.message);
        
        if (error.message === 'GEMINI_QUOTA_EXCEEDED') {
          continue; // 尝试下一个模型
        }
      }
    }
  }
  
  // 所有API都失败
  throw new Error('All LLM providers failed');
}

/**
 * 包装SSE流，转换为统一格式
 * @param {ReadableStream} stream - 原始流
 * @param {string} model - 模型名称
 * @returns {ReadableStream}
 */
function wrapSSEStream(stream, model) {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();
      let buffer = '';
      let usage = {};
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            // 发送结束标记
            const endData = JSON.stringify({
              done: true,
              model,
              usage
            });
            controller.enqueue(encoder.encode(`data: ${endData}\n\n`));
            controller.close();
            break;
          }
          
          buffer += new TextDecoder().decode(value, { stream: true });
          
          // 处理SSE行
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              
              if (dataStr === '[DONE]') {
                const endData = JSON.stringify({ done: true, model, usage });
                controller.enqueue(encoder.encode(`data: ${endData}\n\n`));
                continue;
              }
              
              try {
                const data = JSON.parse(dataStr);
                
                // 提取增量内容
                if (data.choices?.[0]?.delta?.content) {
                  const content = data.choices[0].delta.content;
                  const chunkData = JSON.stringify({
                    content,
                    done: false
                  });
                  controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
                }
                
                // 收集usage信息
                if (data.usage) {
                  usage = data.usage;
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    
    cancel() {
      // 处理取消
    }
  });
}

/**
 * 流式响应处理器
 * 将LLM流转换为SSE格式
 * @param {Array} messages - 消息列表
 * @param {Object} options - 配置选项
 * @returns {Promise<ReadableStream>}
 */
export async function callLLMStream(messages, options = {}) {
  return callLLM(messages, { ...options, stream: true });
}

/**
 * 非流式响应处理器
 * @param {Array} messages - 消息列表
 * @param {Object} options - 配置选项
 * @returns {Promise<{content: string, model: string, usage: Object}>}
 */
export async function callLLMBlocking(messages, options = {}) {
  return callLLM(messages, { ...options, stream: false });
}

export default {
  callLLM,
  callLLMStream,
  callLLMBlocking
};
