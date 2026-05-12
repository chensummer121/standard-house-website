/**
 * Summer Bot API Proxy - Vercel Serverless Function
 * 使用Coze v3 stream API，解析SSE获取answer
 */

const COZE_API_BASE = 'https://api.coze.cn';
const COZE_BOT_ID = '7638944446553276468';
const COZE_API_KEY = process.env.COZE_API_KEY || 'pat_EJAlSKp7c9TAxns7bHeb1oRApUDY0U3qzHZCyRnRtjxFNzA2PpB5XZ582Gdncjgq';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', service: 'summer-bot-proxy' });
  }

  try {
    const { message, sessionId, mode, context } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const user_id = sessionId || `web-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // 调用Coze Chat API (stream mode required)
    const chatRes = await fetch(`${COZE_API_BASE}/v3/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: COZE_BOT_ID,
        user_id: user_id,
        stream: true,
        auto_save_history: true,
        additional_messages: [{
          role: 'user',
          content: message,
          content_type: 'text'
        }]
      })
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      console.error('Coze API error:', chatRes.status, errText);
      return res.status(200).json({
        reply: 'AI顾问暂时无法响应，请稍后再试。您可以直接浏览站内各国投资报告获取信息。',
        source: 'fallback',
        error: 'Coze API unavailable'
      });
    }

    // 解析SSE流，收集answer内容
    let reply = '';
    const reader = chatRes.body;
    const decoder = new TextDecoder();
    let buffer = '';
    let chatCompleted = false;
    const startTime = Date.now();
    const MAX_WAIT = 55000; // 55秒超时（Vercel Pro 60s）

    while (!chatCompleted && (Date.now() - startTime) < MAX_WAIT) {
      const chunk = await reader.read();
      if (chunk.done) break;
      
      buffer += decoder.decode(chunk.value, { stream: true });
      
      // 按行解析SSE
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留不完整的行
      
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        
        try {
          const data = JSON.parse(line.slice(5).trim());
          
          // 收集answer类型的completed消息
          if (data.type === 'answer' && data.event === 'conversation.message.completed') {
            reply += data.content || '';
          }
          
          // 检测chat完成
          if (data.status === 'completed' || data.event === 'conversation.chat.completed') {
            chatCompleted = true;
          }
        } catch (e) {
          // 跳过无效JSON
        }
      }
    }

    // 如果没收集到answer，尝试用retrieve API获取
    if (!reply) {
      // 从SSE中提取chat_id和conversation_id
      // 备选方案：用非流式retrieve
      const chatIdMatch = buffer.match(/"id":"(\d+)"/);
      const convIdMatch = buffer.match(/"conversation_id":"(\d+)"/);
      
      if (chatIdMatch && convIdMatch) {
        const chatId = chatIdMatch[1];
        const convId = convIdMatch[1];
        
        // 等待完成后获取消息列表
        for (let i = 0; i < 5; i++) {
          await new Promise(r => setTimeout(r, 2000));
          
          const msgRes = await fetch(
            `${COZE_API_BASE}/v3/chat/message/list?chat_id=${chatId}&conversation_id=${convId}`,
            { headers: { 'Authorization': `Bearer ${COZE_API_KEY}` } }
          );
          
          if (msgRes.ok) {
            const msgData = await msgRes.json();
            const answer = msgData?.data?.find(m => m.type === 'answer');
            if (answer?.content) {
              reply = answer.content;
              break;
            }
          }
        }
      }
    }

    if (reply) {
      return res.status(200).json({
        reply,
        source: 'public',
        sessionId: user_id,
        mode
      });
    } else {
      return res.status(200).json({
        reply: 'AI顾问响应超时，请稍后再试。',
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      reply: '服务暂时不可用，请稍后再试。',
      source: 'fallback',
      error: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
