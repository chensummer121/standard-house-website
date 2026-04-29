"use client";
import { useEffect } from "react";

const PROJECT_ID = "7629504335063334947";
const COZE_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhlODUzNjkxLWYwOTEtNDgwMS1hM2U3LThhYTAyNzFhZmU2ZiJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbImUyc2tGZndKbHVzVEM0R2xSR3ExV1FRbEhhQWpidEtoIl0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzc3NDczMjE1LCJzdWIiOiJzcGlmZmU6Ly9hcGkuY296ZS5jbi93b3JrbG9hZF9pZGVudGl0eS9pZDo3NjI5NTE5NDYzMTEyNTA3MzkyIiwic3JjIjoiaW5ib3VuZF9hdXRoX2FjY2Vzc190b2tlbl9pZDo3NjM0MTg5MzMwMjAxNzA2NTM5In0.T4I6s4HsV_vSwbdNbxMphdGNSXRsD5XHaSbkC3fDmknsLjMwBX5Vvvw7P9QA_iBa7_ye48Jd5TIP7VwOtUYI9eDIdv_D08PInOkgV8CCPM0iOTILuAnYzHhycK-jR0T5o1XmQFStdYgdoz81Xw2MeAd0_aD2PvqwdfsZFPI3N7BzcFp_lvTLvwLUpN1_L5lYgzwtf4qDXkbrDr_XfQSJJ6HV8S9jeyPlE0nK8WJJA7RO4AhABNOcyazG7Hl1eu38m7RBOxraM0qpaZeq3O71ESx3glHKNVzKuklvuEML-gj4JgxVBva5kOtYd7FBwAKjhw46tVtS5TCiWBZUpYY1Lw";

// 右下角浮动按钮 - 点击打开Agent
export default function CozeChatWidget() {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="coze/web-sdk"]');
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://lf-cdn.coze.cn/obj/unpkg/latest/coze/web-sdk/dist/js-umd/index.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Coze Web SDK loaded successfully");
    };

    script.onerror = () => {
      console.error("Failed to load Coze Web SDK");
    };
  }, []);

  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).cozeWebSDK) {
      (window as any).cozeWebSDK.init({
        projectId: PROJECT_ID,
        refreshToken: () => Promise.resolve(COZE_TOKEN),
      });
    } else {
      console.error("Coze SDK not loaded yet, trying to load...");
      const script = document.createElement("script");
      script.src = "https://lf-cdn.coze.cn/obj/unpkg/latest/coze/web-sdk/dist/js-umd/index.min.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        (window as any).cozeWebSDK.init({
          projectId: PROJECT_ID,
          refreshToken: () => Promise.resolve(COZE_TOKEN),
        });
      };
    }
  };

  return (
    <button
      onClick={openChat}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary to-earth-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Chat with AI Assistant"
      title="Chat with Standard House Assistant"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>
  );
}

// 内联按钮版本 - 主页"Chat with Agent"使用
export function CozeChatButton({ 
  className = "",
  children 
}: { 
  className?: string;
  children?: React.ReactNode;
}) {
  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).cozeWebSDK) {
      (window as any).cozeWebSDK.init({
        projectId: PROJECT_ID,
        refreshToken: () => Promise.resolve(COZE_TOKEN),
      });
    } else {
      const script = document.createElement("script");
      script.src = "https://lf-cdn.coze.cn/obj/unpkg/latest/coze/web-sdk/dist/js-umd/index.min.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        (window as any).cozeWebSDK.init({
          projectId: PROJECT_ID,
          refreshToken: () => Promise.resolve(COZE_TOKEN),
        });
      };
    }
  };

  return (
    <button
      onClick={openChat}
      className={className}
    >
      {children}
    </button>
  );
}
