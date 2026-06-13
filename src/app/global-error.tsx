"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="zh-CN" className="scroll-smooth dark">
      <body className="font-sans antialiased bg-[#0a0a0e] text-white">
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              系统异常
            </h2>
            <p className="text-sm text-slate-400 mb-1">
              {error.message || "发生了未预期的错误，请稍后重试"}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-500 font-mono mb-6">
                Error ID: {error.digest}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-sm font-medium hover:bg-indigo-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] text-slate-400 border border-white/[0.08] text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-all"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
