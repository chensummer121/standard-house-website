'use client';

import { useAIContext, getQuickQuestions, PageContext } from './AIContextProvider';

interface AIQuickAskProps {
  questions?: string[];
  position?: 'top' | 'bottom';
  title?: string;
  bordered?: boolean;
  className?: string;
}

export default function AIQuickAsk({
  questions,
  position = 'bottom',
  title = '💡 问问AI顾问',
  bordered = true,
  className = ''
}: AIQuickAskProps) {
  const { context } = useAIContext();
  const quickQuestions = questions || getQuickQuestions(context);

  const askQuestion = (question: string) => {
    if (typeof window !== 'undefined' && (window as any).__openAIChat) {
      (window as any).__openAIChat(question);
    } else {
      const event = new CustomEvent('openCozeChat', {
        detail: { question, context }
      });
      window.dispatchEvent(event);
    }
  };

  const getContextHint = (ctx: PageContext): string => {
    if (ctx.countryName && ctx.sectionName) {
      return `关于${ctx.countryName}${ctx.sectionName}`;
    }
    if (ctx.countryName) return `关于${ctx.countryName}`;
    if (ctx.sectionName) return `关于${ctx.sectionName}`;
    return '东非投资';
  };

  return (
    <div 
      className={`ai-quick-ask ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: position === 'top' ? '0 0 16px 0' : '16px 0 0 0',
        ...(bordered && { borderTop: '1px solid rgba(245, 158, 11, 0.15)', marginTop: '16px' })
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#F59E0B', fontWeight: 600, fontSize: '14px' }}>
          {title}
        </div>
        <div style={{ color: '#64748B', fontSize: '12px' }}>
          {getContextHint(context)}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => askQuestion(q)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              color: '#FBBF24',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(245, 158, 11, 0.18)';
              target.style.transform = 'scale(1.03)';
              target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.2)';
            }}
            onMouseLeave={e => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(245, 158, 11, 0.08)';
              target.style.transform = 'scale(1)';
              target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '14px' }}>❓</span>
            <span>{q}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => askQuestion('我想了解更多关于东非投资的信息')}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '12px',
          color: '#94A3B8',
          background: 'transparent',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => {
          const target = e.target as HTMLElement;
          target.style.color = '#E2E8F0';
          target.style.borderColor = 'rgba(148, 163, 184, 0.4)';
        }}
        onMouseLeave={e => {
          const target = e.target as HTMLElement;
          target.style.color = '#94A3B8';
          target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        }}
      >
        查看更多问题 →
      </button>
    </div>
  );
}
