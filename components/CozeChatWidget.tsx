"use client";
import { useEffect, useState, useRef } from "react";

const PROJECT_ID = "7629504335063334947";
const COZE_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhlODUzNjkxLWYwOTEtNDgwMS1hM2U3LThhYTAyNzFhZmU2ZiJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbImUyc2tGZndKbHVzVEM0R2xSR3ExV1FRbEhhQWpidEtoIl0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzc3NDczMjE1LCJzdWIiOiJzcGlmZmU6Ly9hcGkuY296ZS5jbi93b3JrbG9hZF9pZGVudGl0eS9pZDo3NjI5NTE5NDYzMTEyNTA3MzkyIiwic3JjIjoiaW5ib3VuZF9hdXRoX2FjY2Vzc190b2tlbl9pZDo3NjM0MTg5MzMwMjAxNzA2NTM5In0.T4I6s4HsV_vSwbdNbxMphdGNSXRsD5XHaSbkC3fDmknsLjMwBX5Vvvw7P9QA_iBa7_ye48Jd5TIP7VwOtUYI9eDIdv_D08PInOkgV8CCPM0iOTILuAnYzHhycK-jR0T5o1XmQFStdYgdoz81Xw2MeAd0_aD2PvqwdfsZFPI3N7BzcFp_lvTLvwLUpN1_L5lYgzwtf4qDXkbrDr_XfQSJJ6HV8S9jeyPlE0nK8WJJA7RO4AhABNOcyazG7Hl1eu38m7RBOxraM0qpaZeq3O71ESx3glHKNVzKuklvuEML-gj4JgxVBva5kOtYd7FBwAKjhw46tVtS5TCiWBZUpYY1Lw";
const SDK_URL = "https://lf-cdn.coze.cn/obj/unpkg/latest/coze/web-sdk/dist/js-umd/index.min.js";

// 右下角浮动按钮 + 对话框
export default function CozeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkLoadedRef = useRef(false);
  const initRef = useRef(false);

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

// 内联按钮版本 - 主页Hero区域使用
export function CozeChatButton({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkLoadedRef = useRef(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (sdkLoadedRef.current) return;
    sdkLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isOpen || !sdkReady || !containerRef.current || initRef.current) return;
    initRef.current = true;

    try {
      // @ts-ignore
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
      <button onClick={() => setIsOpen(!isOpen)} className={className}>
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-[90vw] max-w-[500px] h-[75vh] max-h-[700px] shadow-2xl rounded-2xl overflow-hidden border border-earth-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3 bg-earth-800 text-white">
              <span className="font-display font-bold">Standard House AI Assistant</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div ref={containerRef} style={{ width: "100%", height: "calc(100% - 48px)" }} />
          </div>
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
