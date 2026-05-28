"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Eye,
  TrendingUp,
  FileText,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  {
    section: "总览",
    items: [
      { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
      { href: "/dashboard/brands", label: "品牌管理", icon: Building2 },
    ],
  },
  {
    section: "监控分析",
    items: [
      { href: "/dashboard/monitor", label: "AI可见度", icon: Eye },
      { href: "/dashboard/competitors", label: "竞品分析", icon: TrendingUp },
      { href: "/dashboard/reports", label: "数据报告", icon: FileText },
    ],
  },
  {
    section: "设置",
    items: [
      { href: "/dashboard/settings", label: "账户设置", icon: Settings },
      { href: "/dashboard/billing", label: "计费方案", icon: CreditCard },
    ],
  },
];

export function DashboardSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col border-r border-white/10 bg-slate-900 h-screen overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="mr-auto"
            >
              <Logo className="text-sm" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded-lg hover:bg-white/5 transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key={`section-${section.section}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-2"
                >
                  <span className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {section.section}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 font-medium"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive
                          ? "text-indigo-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          key={`label-${item.label}`}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-400 rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
