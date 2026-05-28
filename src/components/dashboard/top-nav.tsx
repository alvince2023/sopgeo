"use client";

import React from "react";
import { Bell, Search, User } from "lucide-react";

export function DashboardTopNav() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl">
      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="搜索品牌、关键词..."
          className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-medium text-white">陈帅</p>
            <p className="text-xs text-slate-500">个人版</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
