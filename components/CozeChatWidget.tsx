"use client";
import { useEffect, useState } from "react";

const BOT_ID = "7629504335063334947";

// 右下角浮动按钮版本
export default function CozeChatWidget() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    // Load Coze Web SDK (国内版)
    const existingScript = document.querySelector('script[src*="lf-cdn.coze.cn"]');
    if (existingScript) {
      setIsSDKLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/latest/libs/cn/index.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Coze SDK loaded successfully");
      setIsSDKLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Coze SDK");
    };

    return () => {
      // Don't remove script on unmount to persist across navigation
    };
  }, []);

  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).CozeWebSDK) {
      new (window as any).CozeWebSDK.WebChatClient({
        config: {
          bot_id: BOT_ID,
        },
        componentProps: {
          title: "Standard House Assistant",
        },
      });
    } else {
      console.error("Coze SDK not loaded yet");
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

// 内联按钮版本 - 可在页面任意位置使用
export function CozeChatButton({ 
  className = "",
  children 
}: { 
  className?: string;
  children?: React.ReactNode;
}) {
  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).CozeWebSDK) {
      new (window as any).CozeWebSDK.WebChatClient({
        config: {
          bot_id: BOT_ID,
        },
        componentProps: {
          title: "Standard House Assistant",
        },
      });
    } else {
      console.error("Coze SDK not loaded yet");
      // Try to load SDK first
      const script = document.createElement("script");
      script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/latest/libs/cn/index.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        new (window as any).CozeWebSDK.WebChatClient({
          config: {
            bot_id: BOT_ID,
          },
          componentProps: {
            title: "Standard House Assistant",
          },
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
