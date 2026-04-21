"use client";

import { useEffect } from "react";

const BOT_ID = "7629504335063334947";

export default function CozeChatWidget() {
  useEffect(() => {
    // Dynamically load Coze SDK
    const loadCozeSDK = () => {
      const script = document.createElement("script");
      script.src = "https://lf-cdn.coze.cn/sdk/sdk.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (typeof window !== "undefined" && (window as any).CozeWebSDK) {
          initCozeChat();
        }
      };
    };

    const initCozeChat = () => {
      const coze = new (window as any).CozeWebSDK({
        config: {
          bot_id: BOT_ID,
        },
        component: (window as any).CozeWebSDK.CHAT_PANEL,
        props: {
          showPic: true,
          showAudio: true,
          showFile: true,
          assistantType: "app_at",
          title: "Standard House Assistant",
          icon: "/favicon.ico",
          theme: {
            primaryColor: "#b8954a",
          },
        },
      });
      coze.render();
    };

    loadCozeSDK();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <div id="coze-chat-container" />;
}
