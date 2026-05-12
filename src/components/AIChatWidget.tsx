'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AIContextProvider, useAIContext, parsePageContextFromURL } from './AIContextProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: 'public' | 'internal' | 'classified';
  model?: string;
  chunksUsed?: number;
}

interface AIChatWidgetProps {
  pageContext?: string;
  pagePath?: string;
}

type ChatMode = 'default' | 'country' | 'cost' | 'risk' | 'approval';

const modeInstructions: Record<ChatMode, string> = {
  default: '',
  country: '帮我选国家：基于预算、行业、风险偏好推荐最优投资目的地',
  cost: '帮我算成本：计算在东非建厂的综合成本并做十一国对比',
  risk: '看风险：获取东非十一国投资风险的量化评估',
  approval: '问审批：了解在目标国家建厂需要经过哪些审批流程'
};

const quickQuestionsMap: Record<string, { mode: ChatMode; questions: string[] }> = {
  '侨民': {
    mode: 'default',
    questions: ['我想回国建房，有什么方案推荐？', '微工厂项目最低投资多少？', '侨汇建房有什么注意事项？', '哪种预制房屋性价比最高？']
  },
  'default': {
    mode: 'default', 
    questions: ['东非哪个国家最适合制造业投资？', '在乌干达建一个微工厂要多少钱？', '埃塞俄比亚外汇管制对投资有什么影响？', '帮我对比肯尼亚和坦桑尼亚的风险']
  }
};

const dedicatedModes = [
  { mode: 'country' as ChatMode, icon: '🌍', label: '选国家', desc: '基于预算/行业/风险推荐' },
  { mode: 'cost' as ChatMode, icon: '💰', label: '算成本', desc: '建厂成本十一国对比' },
  { mode: 'risk' as ChatMode, icon: '⚠️', label: '看风险', desc: '量化风险评分' },
  { mode: 'approval' as ChatMode, icon: '📋', label: '问审批', desc: '建厂审批流程' },
];

const generateSessionId = (): string => `sb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 内部聊天组件
function AIChatWidgetInner({ pageContext, pagePath }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>('default');
  const [sessionId] = useState<string>(() => generateSessionId());
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const historyRef = useRef<Array<{ role: string; content: string }>>([]);
  const { context: aiContext } = useAIContext();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);

  // 监听全局打开事件和预设问题
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      setIsOpen(true);
      const detail = (e as CustomEvent).detail;
      if (detail?.question) {
        setPendingQuestion(detail.question);
        setInput(detail.question);
      }
    };
    
    window.addEventListener('openCozeChat', handleOpenChat);
    return () => window.removeEventListener('openCozeChat', handleOpenChat);
  }, []);

  // 注册全局打开方法
  useEffect(() => {
    (window as any).__openAIChat = (question?: string) => {
      setIsOpen(true);
      if (question) {
        setPendingQuestion(question);
        setInput(question);
      }
    };
    
    return () => {
      delete (window as any).__openAIChat;
    };
  }, []);

  // 当有pending问题时自动发送
  useEffect(() => {
    if (pendingQuestion && isOpen) {
      const timer = setTimeout(() => {
        if (input.trim()) {
          sendMessage();
        }
        setPendingQuestion(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingQuestion, isOpen, input]);

  const buildModePrompt = (mode: ChatMode, userInput: string): string => {
    if (mode === 'default') return userInput;
    const modePrefixes: Record<ChatMode, string> = {
      default: '',
      country: '【国别对比模式】帮我分析并推荐：',
      cost: '【成本计算模式】帮我计算对比：',
      risk: '【风险评估模式】请给出风险分析：',
      approval: '【落地实操模式】请告诉我：',
    };
    return modePrefixes[mode] + userInput;
  };

  const updateHistory = (role: 'user' | 'assistant', content: string) => {
    historyRef.current.push({ role, content });
    if (historyRef.current.length > 20) historyRef.current = historyRef.current.slice(-20);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    updateHistory('user', userMessage.content);

    const modePrompt = buildModePrompt(activeMode, userMessage.content);
    const supportsStreaming = typeof window !== 'undefined' && 'ReadableStream' in window;

    try {
      if (supportsStreaming) {
        await sendWithStream(modePrompt);
      } else {
        await sendWithoutStream(modePrompt);
      }
    } catch (error) {
      try {
        await sendWithOldAPI(modePrompt);
      } catch (fallbackError) {
        setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ AI顾问暂时离线，请稍后再试。', source: 'public' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendWithStream = async (modePrompt: string) => {
    let fullReply = '';
    let replySource: 'public' | 'internal' | 'classified' = 'public';

    try {
      const response = await Promise.race([
        fetch('/api/summer-bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
          body: JSON.stringify({
            message: modePrompt,
            sessionId,
            history: historyRef.current.slice(-20),
            mode: activeMode,
            context: pageContext || aiContext.countryName || '',
            source: 'web'
          })
        }),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
      ]);

      if (!response.ok) throw new Error('API request failed');

      setMessages(prev => [...prev, { role: 'assistant', content: '', source: 'public' }]);

      if (response.body && typeof response.body.getReader === 'function') {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullReply += data.content;
                  setMessages(prev => {
                    const updated = [...prev];
                    if (updated.length > 0) updated[updated.length - 1] = { role: 'assistant', content: fullReply, source: replySource };
                    return updated;
                  });
                }
                if (data.source) replySource = data.source as 'public' | 'internal' | 'classified';
                if (data.done) break;
              } catch (e) {}
            }
          }
        }
      }

      updateHistory('assistant', fullReply);
    } catch (error) {
      setMessages(prev => prev.slice(0, -1));
      throw error;
    }
  };

  const sendWithoutStream = async (modePrompt: string) => {
    const response = await Promise.race([
      fetch('/api/summer-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: modePrompt, sessionId, history: historyRef.current.slice(-20), mode: activeMode, context: pageContext || '' })
      }),
      new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 20000))
    ]);

    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    const reply = data.reply || '';
    const source = (data.source as 'public' | 'internal' | 'classified') || 'public';
    const model = data.model || '';
    const chunksUsed = data.chunksUsed || 0;

    setMessages(prev => [...prev, { role: 'assistant', content: reply, source, model, chunksUsed }]);
    updateHistory('assistant', reply);
  };

  const sendWithOldAPI = async (modePrompt: string) => {
    const response = await Promise.race([
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: modePrompt, context: pageContext || '' })
      }),
      new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 20000))
    ]);

    if (!response.ok) throw new Error('Old API also failed');
    const data = await response.json();
    if (data.reply && data.reply !== '__FALLBACK__' && !data.reply.includes('unavailable')) {
      const source = (data.source as 'public' | 'internal' | 'classified') || 'public';
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, source }]);
      updateHistory('assistant', data.reply);
    } else {
      throw new Error('Invalid response from old API');
    }
  };

  const handleQuickQ = async (q: string) => {
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setIsLoading(true);
    updateHistory('user', q);
    const modePrompt = buildModePrompt(activeMode, q);
    const supportsStreaming = typeof window !== 'undefined' && 'ReadableStream' in window;

    try {
      if (supportsStreaming) await sendWithStream(modePrompt);
      else await sendWithoutStream(modePrompt);
    } catch (error) {
      try { await sendWithOldAPI(modePrompt); }
      catch (fallbackError) { setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ AI顾问暂时离线，请稍后再试。', source: 'public' }]); }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeClick = (mode: ChatMode) => {
    setActiveMode(mode);
    if (mode !== 'default') {
      const hint = modeInstructions[mode];
      setInput(hint);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // 构建页面上下文提示
  const getContextDisplay = () => {
    const parts: string[] = [];
    if (aiContext.countryName) parts.push(aiContext.countryName);
    if (aiContext.sectionName) parts.push(aiContext.sectionName);
    return parts.length > 0 ? parts.join(' · ') : '全站';
  };

  const isDiaspora = pageContext?.includes('侨民');
  const quickConfig = isDiaspora ? quickQuestionsMap['侨民'] : quickQuestionsMap['default'];
  const widgetTitle = isDiaspora ? '🏠 Summer Bot 侨民顾问' : '🤖 Summer Bot';
  const welcomeMsg = isDiaspora ? '你好！我是Summer Bot侨民顾问，可以帮你了解回国建房方案和微工厂投资。' : '你好！我是Summer Bot，STANDERRA Intelligence的东非投资情报分析师。';

  const sourceBadgeStyles: Record<string, { bg: string; color: string; label: string }> = {
    public: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: '公开' },
    internal: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: '内部' },
    classified: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: '机密' },
  };

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
          fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s', color: '#fff'
        }}
        onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.1)'}
        onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* 聊天面板 */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px', zIndex: 1000,
          width: '420px', maxWidth: 'calc(100vw - 48px)', height: '600px', maxHeight: 'calc(100vh - 120px)',
          background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {/* 头部 */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid rgba(245,158,11,0.15)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: '16px' }}>{widgetTitle}</div>
                <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>
                  📍 {getContextDisplay()}
                </div>
              </div>
            </div>
            
            {/* 模式切换 */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              {dedicatedModes.map(({ mode, icon, label, desc }) => (
                <button
                  key={mode}
                  onClick={() => handleModeClick(mode)}
                  title={desc}
                  style={{
                    background: activeMode === mode ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)',
                    border: activeMode === mode ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '4px 10px',
                    color: activeMode === mode ? '#fbbf24' : '#94a3b8',
                    fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 消息区 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <>
                <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#93c5fd', fontSize: '14px', lineHeight: 1.6 }}>
                  {activeMode !== 'default' ? modeInstructions[activeMode] : welcomeMsg}
                </div>
                {activeMode === 'default' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {quickConfig.questions.map((q, i) => (
                      <button key={i} onClick={() => handleQuickQ(q)} style={{
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '20px', padding: '6px 14px', color: '#fbbf24', fontSize: '13px',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(245,158,11,0.2)'}
                      onMouseLeave={e => (e.target as HTMLElement).style.background = 'rgba(245,158,11,0.1)'}
                      >{q}</button>
                    ))}
                  </div>
                )}
              </>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                {msg.role === 'assistant' && msg.source && (
                  <div style={{
                    display: 'inline-block',
                    background: sourceBadgeStyles[msg.source]?.bg,
                    color: sourceBadgeStyles[msg.source]?.color,
                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                    marginBottom: '4px', fontWeight: 500
                  }}>
                    📌 {sourceBadgeStyles[msg.source]?.label}信息来源
                  </div>
                )}
                <div style={{
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(30,41,59,0.8)',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px',
                  color: msg.role === 'user' ? '#fff' : '#e2e8f0',
                  fontSize: '14px', lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  border: msg.role === 'assistant' ? '1px solid rgba(100,116,139,0.2)' : 'none'
                }}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && msg.content && (msg.model || msg.chunksUsed) && (
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', paddingLeft: '4px' }}>
                    {msg.model && <span>{msg.model}</span>}
                    {msg.model && msg.chunksUsed && <span> · </span>}
                    {msg.chunksUsed && <span>{msg.chunksUsed}条知识片段</span>}
                  </div>
                )}
              </div>
            ))}

            {isLoading && <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '13px', paddingLeft: '8px' }}>思考中...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区 */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(245,158,11,0.1)', display: 'flex', gap: '8px' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeMode !== 'default' ? modeInstructions[activeMode] : "输入问题..."}
              rows={1}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px', padding: '10px 14px', color: '#e2e8f0', fontSize: '14px',
                outline: 'none', resize: 'none', fontFamily: 'inherit'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                background: input.trim() ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(245,158,11,0.2)',
                border: 'none', borderRadius: '12px', padding: '0 16px', cursor: input.trim() ? 'pointer' : 'default',
                color: input.trim() ? '#fff' : '#94a3b8', fontSize: '14px', fontWeight: 600
              }}
            >发送</button>
          </div>
          
          {/* 图例 */}
          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(245,158,11,0.1)', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', color: '#64748b' }}>
            <span><span style={{ color: '#22c55e' }}>●</span> 公开数据</span>
            <span><span style={{ color: '#fbbf24' }}>●</span> 内部研判</span>
            <span><span style={{ color: '#94a3b8' }}>●</span> 机密指引</span>
          </div>
        </div>
      )}
    </>
  );
}

// 包装组件，提供Context
export default function AIChatWidget(props: AIChatWidgetProps) {
  return (
    <AIContextProvider>
      <AIChatWidgetInner {...props} />
    </AIContextProvider>
  );
}
