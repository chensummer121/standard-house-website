'use client';

import { ReactNode, useEffect } from 'react';
import AIContextProvider, { PageContext, useAIContext } from './AIContextProvider';

// 内部包装组件，负责将上下文同步到全局
function AIContextSync({ pageContext, children }: { pageContext?: string; children: ReactNode }) {
  const { setPageContext } = useAIContext();

  useEffect(() => {
    // 解析页面上下文
    const ctx: PageContext = { pagePath: typeof window !== 'undefined' ? window.location.pathname : '/' };
    
    if (pageContext) {
      // 从pageContext字符串解析（格式："国家名 - 板块名"）
      const parts = pageContext.split(' - ');
      if (parts.length >= 1) {
        ctx.countryName = parts[0].trim();
        if (parts.length >= 2) {
          ctx.pageTitle = parts[1].trim();
        }
      }
    }

    setPageContext(ctx);
  }, [pageContext, setPageContext]);

  return <>{children}</>;
}

export default function AIProviderLayout({ 
  pageContext, 
  children 
}: { 
  pageContext?: string; 
  children: ReactNode; 
}) {
  return (
    <AIContextProvider>
      <AIContextSync pageContext={pageContext}>
        {children}
      </AIContextSync>
    </AIContextProvider>
  );
}
