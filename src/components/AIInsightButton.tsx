'use client';

import { useState, useCallback } from 'react';
import { useAIContext } from './AIContextProvider';

interface AIInsightButtonProps {
  /** 解读的内容类型 */
  type?: 'chart' | 'kpi' | 'text' | 'risk' | 'policy';
  /** 预生成的解读文本（可选，用于静态模式） */
  insight?: string;
  /** 触发按钮的文本 */
  label?: string;
  /** 关联的数据点（用于发送给AI） */
  dataPoint?: string;
  /** 是否展开面板 */
  defaultExpanded?: boolean;
  /** 自定义类名 */
  className?: string;
}

// 各类型对应的图标
const typeIcons: Record<string, string> = {
  chart: '📊',
  kpi: '💡',
  text: '📝',
  risk: '⚠️',
  policy: '📜'
};

// 各类型的默认标签
const typeLabels: Record<string, string> = {
  chart: 'AI解读',
  kpi: 'AI解读',
  text: 'AI分析',
  risk: '风险分析',
  policy: '政策解读'
};

export default function AIInsightButton({
  type = 'kpi',
  insight,
  label,
  dataPoint,
  defaultExpanded = false,
  className = ''
}: AIInsightButtonProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useAIContext();

  const icon = typeIcons[type] || '💡';
  const defaultLabel = label || typeLabels[type] || 'AI解读';

  // 打开AI聊天窗口并发送问题
  const openAIChat = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).__openAIChat) {
      // 构建上下文感知的问题
      let question = `请分析这个${type === 'chart' ? '图表' : type === 'kpi' ? 'KPI指标' : type === 'risk' ? '风险点' : type === 'policy' ? '政策' : '内容'}`;
      
      if (dataPoint) {
        question += `：${dataPoint}`;
      }
      
      if (context.countryName) {
        question += `（关于${context.countryName}）`;
      }

      (window as any).__openAIChat(question);
    } else {
      // 降级：尝试派发事件
      const event = new CustomEvent('openCozeChat', {
        detail: {
          question: dataPoint || `请分析这个${type}`,
          context: context
        }
      });
      window.dispatchEvent(event);
    }
  }, [type, dataPoint, context]);

  // 切换展开状态
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`ai-insight-wrapper ${className}`} style={{ display: 'inline-block', position: 'relative' }}>
      {/* 触发按钮 */}
      <button
        onClick={insight ? toggleExpand : openAIChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="ai-insight-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#F59E0B',
          background: isHovered 
            ? 'rgba(245, 158, 11, 0.2)' 
            : 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          boxShadow: isHovered 
            ? '0 4px 12px rgba(245, 158, 11, 0.25)' 
            : 'none'
        }}
        title={insight ? '点击查看AI解读' : `点击AI帮你分析：${dataPoint || defaultLabel}`}
      >
        <span style={{ fontSize: '14px' }}>{icon}</span>
        <span>{defaultLabel}</span>
        {insight && (
          <span style={{ 
            marginLeft: '2px',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>▼</span>
        )}
      </button>

      {/* 展开的解读面板 */}
      {isExpanded && insight && (
        <div 
          className="ai-insight-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '8px',
            width: '320px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#1E293B',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            animation: 'slideDown 0.2s ease'
          }}
        >
          {/* 面板头部 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#F59E0B',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              <span>🤖</span>
              <span>AI智能解读</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0 4px'
              }}
            >
              ✕
            </button>
          </div>

          {/* 解读内容 */}
          <div style={{
            color: '#E2E8F0',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            {insight}
          </div>

          {/* 追问按钮 */}
          <button
            onClick={() => {
              setIsExpanded(false);
              openAIChat();
            }}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '8px 12px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.9'}
            onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}
          >
            💬 追问AI顾问
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
