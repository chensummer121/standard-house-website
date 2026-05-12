# Summer Bot API

STANDERRA Intelligence 东非投资情报AI助手核心API。

## 文件结构

```
api/summer-bot/
├── index.js      # 主API入口 (Vercel Serverless Function)
├── prompt.js     # 提示词构建器
├── llm.js        # LLM网关 (硅基流动 + Gemini)
├── session.js    # 会话管理
├── rag.js        # RAG检索引擎
└── kb-index.json # 知识库索引 (8847 chunks, 570 files)
```

## API 接口

### POST /api/summer-bot

主对话入口。

**请求体：**
```json
{
  "message": "用户消息",
  "sessionId": "客户端生成的会话ID",
  "history": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
  "mode": "default|country|cost|risk|approval",
  "context": "页面上下文（可选）",
  "source": "web|wechat"
}
```

**响应（非流式）：**
```json
{
  "reply": "AI回复内容",
  "source": "ai",
  "model": "deepseek-ai/DeepSeek-V3",
  "sessionId": "summer-xxx",
  "mode": "country",
  "chunksUsed": 8,
  "usage": {"prompt_tokens": 1500, "completion_tokens": 200}
}
```

**流式响应：**
- 设置请求头 `Accept: text/event-stream`
- 返回 SSE 格式数据流

### GET /api/summer-bot

健康检查。

**响应：**
```json
{
  "status": "ok",
  "version": "1.0",
  "service": "Summer Bot",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 对话模式

| 模式 | 说明 | 结构化数据 |
|------|------|-----------|
| `default` | 通用对话 | - |
| `country` | 国别对比 | country-matrix.md |
| `cost` | 成本计算 | cost-calculator.md |
| `risk` | 风险评估 | risk-radar.md |
| `approval` | 落地实操 | - |

## 环境变量

```env
SILICONFLOW_API_KEY=xxx  # 硅基流动API密钥
GEMINI_API_KEY=xxx        # Gemini API密钥（降级用）
```

## 模块说明

### prompt.js

```js
import { buildSystemPrompt, inferMode, MODES } from './prompt.js';

const systemPrompt = buildSystemPrompt({
  mode: MODES.COUNTRY,
  context: '用户在埃塞页面',
  knowledgeContext: { public: '...', internal: '...' },
  isDiaspora: false,
  structuredData: { countryMatrix: '...' }
});
```

### llm.js

```js
import { callLLM, callLLMStream } from './llm.js';

// 非流式
const result = await callLLM(messages, {
  maxTokens: 2048,
  temperature: 0.7
});

// 流式
const stream = await callLLMStream(messages, options);
```

### session.js

```js
import { buildMessages, extractContextFromHistory } from './session.js';

const messages = buildMessages(history, systemPrompt, currentMessage, {
  maxTokens: 2048
});

const context = extractContextFromHistory(history);
// { mentionedCountries: [], mentionedIndustries: [], discussedModes: [] }
```

## 前端调用示例

### Web

```js
const response = await fetch('/api/summer-bot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '帮我分析埃塞俄比亚的投资机会',
    sessionId: 'user-session-123',
    history: [],
    mode: 'country',
    context: '埃塞俄比亚投资页面'
  })
});

const data = await response.json();
console.log(data.reply);
```

### 微信小程序

```js
wx.request({
  url: 'https://your-domain.com/api/summer-bot',
  method: 'POST',
  header: { 'Content-Type': 'application/json' },
  data: { message: '...', source: 'wechat' },
  success: (res) => console.log(res.data.reply)
});
```

## Vercel 部署

1. 设置环境变量
2. `vercel deploy`
3. API路由: `/api/summer-bot`

## 本地测试

```bash
cd /root/invest-db
node --experimental-vm-modules api/summer-bot/rag.js "埃塞投资机会"
```

## 核心流程

```
请求 → 解析参数 → RAG检索 → 构建system prompt → 组装messages → 调用LLM → 返回响应
```

## 注意事项

- kb-index.json 在构建时打包，Vercel运行时从相对路径读取
- 会话历史最多保留20条消息
- token限制2048，超出自动裁剪
- 模式自动推断，也可在请求中显式指定
