import { NextRequest, NextResponse } from 'next/server';

// 预设的Gemini API Key
const GEMINI_API_KEY = 'AIzaSyC3cXDQYEPiERKwoDNcRDy__PtSiN3PiSw';

// Gemini模型列表
const GEMINI_MODELS = [
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Experimental' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash 001' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'gemini-1.5-pro-001', name: 'Gemini 1.5 Pro 001' },
  { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro 002' },
  { id: 'gemini-pro', name: 'Gemini Pro' },
  { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
];

function extractGeminiModel(model: string): string {
  // 将OpenAI格式的模型名转换为Gemini格式
  const modelMap: Record<string, string> = {
    'gemini-2.5-pro': 'gemini-2.0-flash-exp',
    'gemini-2.5-flash': 'gemini-2.0-flash-exp',
    'gemini-1.5-pro': 'gemini-1.5-pro',
    'gemini-1.5-flash': 'gemini-1.5-flash',
    'gemini-2.0-flash': 'gemini-2.0-flash-exp',
    'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
    'gemini-pro': 'gemini-pro',
    'gemini-pro-vision': 'gemini-pro-vision',
  };
  return modelMap[model] || 'gemini-2.0-flash-exp';
}

function convertToGeminiRequest(body: any) {
  const messages = body.messages || [];
  const model = extractGeminiModel(body.model || 'gemini-2.0-flash');
  
  // 将OpenAI格式的消息转换为Gemini格式
  const contents = [];
  let currentContent: any = { parts: [] };
  
  for (const msg of messages) {
    if (msg.role === 'system') {
      // 系统消息添加到第一个用户消息的开头
      continue;
    }
    
    const role = msg.role === 'assistant' ? 'model' : 'user';
    
    if (role === 'user') {
      if (currentContent.parts.length > 0 && currentContent.role === 'user') {
        currentContent.parts.push({ text: msg.content });
      } else {
        if (currentContent.parts.length > 0) {
          contents.push(currentContent);
        }
        currentContent = { role: 'user', parts: [{ text: msg.content }] };
      }
    } else if (role === 'model') {
      if (currentContent.role === 'model' && currentContent.parts.length > 0) {
        currentContent.parts.push({ text: msg.content });
      } else {
        if (currentContent.parts.length > 0) {
          contents.push(currentContent);
        }
        currentContent = { role: 'model', parts: [{ text: msg.content }] };
      }
    }
  }
  
  if (currentContent.parts.length > 0) {
    contents.push(currentContent);
  }
  
  return { model, contents };
}

// 模型列表端点
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // 如果是请求模型列表
  if (url.pathname.endsWith('/models') || url.searchParams.has('list')) {
    return NextResponse.json({
      object: 'list',
      data: GEMINI_MODELS.map(m => ({
        id: m.id,
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root_model: m.id,
        parent_model: null,
      }))
    });
  }
  
  // 否则作为Gemini请求处理
  const model = extractGeminiModel(url.searchParams.get('model') || 'gemini-2.0-flash-exp');
  const prompt = url.searchParams.get('prompt') || 'Hello';
  const apiKey = GEMINI_API_KEY;

  const geminiUrl = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`);

  try {
    const response = await fetch(geminiUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = body.apiKey || GEMINI_API_KEY;
    const { model, contents } = convertToGeminiRequest(body);

    const geminiUrl = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`);

    const response = await fetch(geminiUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    
    // 将Gemini响应转换为OpenAI格式
    const openAIResponse = {
      id: `gemini-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: body.model || 'gemini-2.0-flash-exp',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        },
        finish_reason: 'stop'
      }],
      usage: data.usageMetadata ? {
        prompt_tokens: data.usageMetadata.promptTokenCount,
        completion_tokens: data.usageMetadata.candidatesTokenCount,
        total_tokens: data.usageMetadata.totalTokenCount
      } : undefined
    };

    return NextResponse.json(openAIResponse, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
