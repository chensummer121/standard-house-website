"use client";
import { useEffect, useState, useRef } from "react";

const PROJECT_ID = "7629504335063334947";
const COZE_TOKEN = "pat_yoU1PIM9h9xDhTE8Vz0Ge7BejjzgmjwoPCdV2Hb6E4kUrC9Jk7ZplQuYHkl4ifDR";
const SDK_URL = "https://lf-cdn.coze.cn/obj/unpkg/latest/coze/web-sdk/dist/js-umd/index.min.js";

// 右下角浮动按钮 + 对话框
export default function CozeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkLoadedRef = useRef(false);
  const initRef = useRef(false);

  // 监听首页AI Consultant按钮的事件
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openCozeChat", handleOpen);
    return () => window.removeEventListener("openCozeChat", handleOpen);
  }, []);

  // 加载SDK
  useEffect(() => {
    if (sdkLoadedRef.current) return;
    sdkLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => console.error("Failed to load Coze Web SDK");
    document.head.appendChild(script);
  }, []);

  // 打开对话框时初始化
  useEffect(() => {
    if (!isOpen || !sdkReady || !containerRef.current || initRef.current) return;
    initRef.current = true;

    try {
      // @ts-ignore - cozeWebSDK is loaded from CDN
      const sdk = window.cozeWebSDK;
      if (sdk && sdk.init) {
        sdk.init({
          token: COZE_TOKEN,
          projectId: PROJECT_ID,
          container: containerRef.current,
          style: "width: 100%; height: 100%;",
          refreshToken: async () => COZE_TOKEN,
        });
      }
    } catch (e) {
      console.error("Failed to init Coze SDK:", e);
    }
  }, [isOpen, sdkReady]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary to-earth-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Chat with AI Assistant"
        title="Chat with Standard House Assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] shadow-2xl rounded-2xl overflow-hidden border border-earth-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3 bg-earth-800 text-white">
            <span className="font-display font-bold text-sm">Standard House AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={containerRef} style={{ width: "100%", height: "calc(100% - 44px)" }} />
        </div>
      )}
    </>
  );
}

// 声明全局类型
declare global {
  interface Window {
    cozeWebSDK: {
      init: (config: {
        token: string;
        projectId: string;
        container: HTMLElement;
        style?: string;
        refreshToken?: () => Promise<string>;
      }) => void;
    };
  }
}
