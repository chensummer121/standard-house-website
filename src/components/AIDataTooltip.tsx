'use client';

import { useState } from 'react';

interface TooltipData {
  label: string;
  value: string;
  insight: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface AIDataTooltipProps {
  data: TooltipData;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export default function AIDataTooltip({ data, children, position = 'top' }: AIDataTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const positionStyles: Record<string, object> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
  };

  const arrowStyles: Record<string, object> = {
    top: { top: '100%', left: '50%', transform: 'translateX(-50%) rotate(180deg)' },
    bottom: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
    left: { left: '100%', top: '50%', transform: 'translateY(-50%) rotate(-90deg)' },
    right: { right: '100%', top: '50%', transform: 'translateY(-50%) rotate(90deg)' }
  };

  const trendColors = {
    up: '#22c55e',
    down: '#ef4444',
    neutral: '#94a3b8'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div 
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={() => { setIsVisible(true); setIsHovered(true); }}
      onMouseLeave={() => { setIsVisible(false); setIsHovered(false); }}
    >
      {children}
      
      {isVisible && (
        <div 
          style={{
            position: 'absolute',
            ...positionStyles[position],
            width: '300px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#1E293B',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            animation: 'tooltipFade 0.2s ease',
            ...(isHovered && { transform: `translateX(-50%) scale(1.02)` })
          }}
        >
          {/* 标题区 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '14px' }}>AI数据解读</span>
            </div>
            {data.trend && data.trendValue && (
              <div style={{ 
                color: trendColors[data.trend], 
                fontSize: '12px', 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                <span>{trendIcons[data.trend]}</span>
                <span>{data.trendValue}</span>
              </div>
            )}
          </div>

          {/* 数据标签 */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{data.label}</span>
          </div>

          {/* 数据值 */}
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', marginBottom: '12px' }}>
            {data.value}
          </div>

          {/* AI解读 */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            borderRadius: '8px',
            padding: '12px',
            borderLeft: '3px solid #F59E0B'
          }}>
            <div style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: 1.6 }}>
              {data.insight}
            </div>
          </div>

          {/* 追问按钮 */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).__openAIChat) {
                (window as any).__openAIChat(`深入分析这个数据：${data.label} ${data.value}。${data.insight}`);
              }
            }}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              color: '#FBBF24',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(245, 158, 11, 0.2)';
            }}
            onMouseLeave={e => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(245, 158, 11, 0.1)';
            }}
          >
            💬 追问AI顾问
          </button>
        </div>
      )}

      <style>{`
        @keyframes tooltipFade {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
