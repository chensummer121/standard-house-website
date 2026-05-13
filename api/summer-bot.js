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

    // 调用Coze Chat API (stream mode required by v3)
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
        }],
        custom_variables: {
          country_count: '11',
          countries: '埃塞俄比亚、乌干达、肯尼亚、坦桑尼亚、卢旺达、南苏丹、布隆迪、吉布提、索马里、厄立特里亚、刚果金'
        }
      })
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      console.error('Coze API error:', chatRes.status, errText);
      return res.status(200).json({
        reply: 'AI顾问暂时无法响应，请稍后再试。',
        source: 'fallback',
        error: 'Coze API unavailable'
      });
    }

    // 解析SSE流 - 使用getReader()兼容Web ReadableStream
    let reply = '';
    let chatId = '';
    let conversationId = '';
    let chatCompleted = false;
    const startTime = Date.now();
    const MAX_WAIT = 55000;

    // Web ReadableStream
    const reader = chatRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (!chatCompleted && (Date.now() - startTime) < MAX_WAIT) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // 按行解析SSE
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        
        try {
          const data = JSON.parse(line.slice(5).trim());
          
          // 提取chat_id和conversation_id
          if (data.id && !chatId) chatId = data.id;
          if (data.conversation_id && !conversationId) conversationId = data.conversation_id;
          
          // 收集answer增量内容
          if (data.type === 'answer') {
            if (data.event === 'conversation.message.delta') {
              reply += data.content || '';
            }
            if (data.event === 'conversation.message.completed') {
              // completed时content是完整answer，直接覆盖
              reply = data.content || reply;
            }
          }
          
          // 检测chat完成
          if (data.event === 'conversation.chat.completed' || data.status === 'completed') {
            chatCompleted = true;
          }
        } catch (e) {
          // 跳过无效JSON行
        }
      }
    }

    // 如果没收集到answer，尝试用retrieve API
    if (!reply && chatId && conversationId) {
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 2000));
        
        const msgRes = await fetch(
          `${COZE_API_BASE}/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
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
    return res.status(200).json({
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
