"use client";
import { useEffect, useState } from "react";

const PROJECT_ID = "7629504335063334947";
const COZE_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhlODUzNjkxLWYwOTEtNDgwMS1hM2U3LThhYTAyNzFhZmU2ZiJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbImUyc2tGZndKbHVzVEM0R2xSR3ExV1FRbEhhQWpidEtoIl0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzc3NDczMjE1LCJzdWIiOiJzcGlmZmU6Ly9hcGkuY296ZS5jbi93b3JrbG9hZF9pZGVudGl0eS9pZDo3NjI5NTE5NDYzMTEyNTA3MzkyIiwic3JjIjoiaW5ib3VuZF9hdXRoX2FjY2Vzc190b2tlbl9pZDo3NjM0MTg5MzMwMjAxNzA2NTM5In0.T4I6s4HsV_vSwbdNbxMphdGNSXRsD5XHaSbkC3fDmknsLjMwBX5Vvvw7P9QA_iBa7_ye48Jd5TIP7VwOtUYI9eDIdv_D08PInOkgV8CCPM0iOTILuAnYzHhycK-jR0T5o1XmQFStdYgdoz81Xw2MeAd0_aD2PvqwdfsZFPI3N7BzcFp_lvTLvwLUpN1_L5lYgzwtf4qDXkbrDr_XfQSJJ6HV8S9jeyPlE0nK8WJJA7RO4AhABNOcyazG7Hl1eu38m7RBOxraM0qpaZeq3O71ESx3glHKNVzKuklvuEML-gj4JgxVBva5kOtYd7FBwAKjhw46tVtS5TCiWBZUpYY1Lw";

// 右下角浮动按钮
export default function CozeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 监听iframe消息
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://sdk.coze.site") return;
      const data = event.data;

      if (data.type === "IFRAME_READY") {
        const iframe = document.getElementById("coze-iframe") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: "INIT",
            payload: {
              token: COZE_TOKEN,
              projectId: PROJECT_ID,
            },
          }, "https://sdk.coze.site");
        }
      }

      if (data.type === "TOKEN_EXPIRED") {
        const iframe = document.getElementById("coze-iframe") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: "UPDATE_TOKEN",
            payload: { token: COZE_TOKEN },
          }, "https://sdk.coze.site");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] shadow-2xl rounded-2xl overflow-hidden border border-earth-200">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-earth-600 hover:text-earth-800 hover:bg-white transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              id="coze-iframe"
              src="https://sdk.coze.site"
              className="w-full h-full border-0"
              allow="microphone; camera"
            />
          </div>
        </div>
      )}
    </>
  );
}

// 内联按钮版本 - 主页使用
export function CozeChatButton({ 
  className = "",
  children 
}: { 
  className?: string;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://sdk.coze.site") return;
      const data = event.data;

      if (data.type === "IFRAME_READY") {
        const iframe = document.getElementById("coze-iframe-inline") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: "INIT",
            payload: {
              token: COZE_TOKEN,
              projectId: PROJECT_ID,
            },
          }, "https://sdk.coze.site");
        }
      }

      if (data.type === "TOKEN_EXPIRED") {
        const iframe = document.getElementById("coze-iframe-inline") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: "UPDATE_TOKEN",
            payload: { token: COZE_TOKEN },
          }, "https://sdk.coze.site");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
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
            <iframe
              id="coze-iframe-inline"
              src="https://sdk.coze.site"
              className="w-full border-0"
              style={{ height: "calc(100% - 48px)" }}
              allow="microphone; camera"
            />
          </div>
        </div>
      )}
    </>
  );
}
