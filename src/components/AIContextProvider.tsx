'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 页面上下文类型定义
export interface PageContext {
  country?: string;
  countryName?: string;
  section?: 'decision' | 'insight' | 'industry' | 'toolkit';
  sectionName?: string;
  pageTitle?: string;
  pagePath?: string;
}

// 上下文默认值
const defaultContext: PageContext = {
  country: undefined,
  section: undefined,
  pageTitle: '',
  pagePath: '/'
};

// 创建上下文
const AIContext = createContext<{
  context: PageContext;
  setPageContext: (ctx: PageContext) => void;
}>({
  context: defaultContext,
  setPageContext: () => {}
});

// 从URL解析页面上下文
function parsePageContextFromURL(pathname: string): PageContext {
  const ctx: PageContext = {
    pagePath: pathname
  };

  // 国家路径解析: /invest/[country]/...
  const investMatch = pathname.match(/^\/invest\/([^\/]+)/);
  if (investMatch) {
    ctx.country = investMatch[1];
    
    // 国家名称映射
    const countryNames: Record<string, string> = {
      ethiopia: '埃塞俄比亚',
      uganda: '乌干达',
      kenya: '肯尼亚',
      tanzania: '坦桑尼亚',
      rwanda: '卢旺达'
    };
    ctx.countryName = countryNames[ctx.country] || ctx.country;

    // 板块解析: /invest/[country]/decision|insight|industry|toolkit/...
    const sectionMatch = pathname.match(/\/invest\/[^\/]+\/([^\/]+)/);
    if (sectionMatch) {
      const section = sectionMatch[1];
      if (['decision', 'insight', 'industry', 'toolkit'].includes(section)) {
        ctx.section = section as PageContext['section'];
        const sectionNames: Record<string, string> = {
          decision: '投资决策',
          insight: '深度透视',
          industry: '产业分析',
          toolkit: '落地工具'
        };
        ctx.sectionName = sectionNames[section];
      }
    }
  }

  // Intel路径解析
  const intelMatch = pathname.match(/^\/intel\//);
  if (intelMatch) {
    if (pathname.includes('/ai')) {
      ctx.sectionName = 'AI智库';
      ctx.pageTitle = 'AI智库';
    } else if (pathname.includes('/intelligence')) {
      ctx.sectionName = '情报中心';
    } else if (pathname.includes('/opportunities')) {
      ctx.sectionName = '方案包市场';
    }
  }

  return ctx;
}

// 板块快捷问题配置
export const sectionQuickQuestions: Record<string, string[]> = {
  'decision': [
    '这个国家的投资回报期多长？',
    '最大的坑是什么？',
    '和邻国比优劣势？'
  ],
  'insight': [
    '这个数据背后有什么灰色逻辑？',
    '权力结构如何影响投资？',
    '有哪些潜在风险案例？'
  ],
  'industry': [
    '这个行业准入门槛多高？',
    '本地供应链成熟度如何？',
    '竞争对手有哪些？'
  ],
  'toolkit': [
    '审批最快多久能拿到？',
    '哪些城市最适合建厂？',
    '需要哪些资质和许可？'
  ],
  'default': [
    '东非哪个国家最适合制造业投资？',
    '在乌干达建一个微工厂要多少钱？',
    '埃塞俄比亚外汇管制有什么影响？',
    '帮我对比肯尼亚和坦桑尼亚的风险'
  ],
  'intel': [
    '帮我选一个适合制造业投资的国家',
    '哪个国家劳动力成本最低？',
    '哪个国家政策最友好？',
    '帮我对比十一国风险评分'
  ]
};

export function AIContextProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<PageContext>(defaultContext);

  useEffect(() => {
    // 初始解析
    const initialCtx = parsePageContextFromURL(window.location.pathname);
    setContext(initialCtx);

    // 监听路由变化
    const handleRouteChange = () => {
      const newCtx = parsePageContextFromURL(window.location.pathname);
      setContext(newCtx);
    };

    // 使用 MutationObserver 监听 DOM 变化（简单实现）
    const observer = new MutationObserver((mutations) => {
      // 延迟检查以确保URL已更新
      setTimeout(handleRouteChange, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 监听 popstate 事件（浏览器前进后退）
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // 更新上下文
  const setPageContext = (ctx: PageContext) => {
    setContext(prev => ({ ...prev, ...ctx }));
  };

  return (
    <AIContext.Provider value={{ context, setPageContext }}>
      {children}
    </AIContext.Provider>
  );
}

// Hook获取AI上下文
export function useAIContext() {
  return useContext(AIContext);
}

// 导出快捷问题获取函数
export function getQuickQuestions(ctx: PageContext): string[] {
  if (ctx.section) {
    return sectionQuickQuestions[ctx.section] || sectionQuickQuestions['default'];
  }
  if (ctx.pagePath?.startsWith('/intel')) {
    return sectionQuickQuestions['intel'];
  }
  return sectionQuickQuestions['default'];
}
