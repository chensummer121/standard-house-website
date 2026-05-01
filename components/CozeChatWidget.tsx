"use client";

import { useEffect, useState } from "react";

const BOT_ID = "7629504335063334947";

// 右下角浮动按钮版本
export default function CozeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load Coze SDK (International version)
    const script = document.createElement("script");
    script.src = "https://lf-cdn.coze.com/obj/static/coze-us/assets/js-sdk/latest/sdk.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Coze SDK loaded");
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).CozeWebSDK) {
      const coze = new (window as any).CozeWebSDK({
        config: {
          bot_id: BOT_ID,
        },
        component: (window as any).CozeWebSDK.CHAT_PANEL,
        props: {
          title: "Standard House Assistant",
          theme: {
            primaryColor: "#b8954a",
          },
        },
      });
      coze.render();
    }
    setIsOpen(!isOpen);
  };

  return (
    <button
      onClick={openChat}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-earth-500 to-earth-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Chat with AI Assistant"
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
  useEffect(() => {
    // Load Coze SDK (International version)
    const existingScript = document.querySelector('script[src*="coze-us"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://lf-cdn.coze.com/obj/static/coze-us/assets/js-sdk/latest/sdk.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openChat = () => {
    if (typeof window !== "undefined" && (window as any).CozeWebSDK) {
      const coze = new (window as any).CozeWebSDK({
        config: {
          bot_id: BOT_ID,
        },
        component: (window as any).CozeWebSDK.CHAT_PANEL,
        props: {
          title: "Standard House Assistant",
          theme: {
            primaryColor: "#b8954a",
          },
        },
      });
      coze.render();
    }
  };

  return (
    <button
      onClick={openChat}
      className={className}
    >
      {children || (
        <span className="inline-flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
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
          AI Consultant
        </span>
      )}
    </button>
  );
}
