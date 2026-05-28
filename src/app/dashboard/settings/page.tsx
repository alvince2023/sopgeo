"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    icon: User,
    title: "个人资料",
    description: "更新你的姓名、邮箱和公司信息",
    items: [
      { label: "姓名", value: "陈帅" },
      { label: "邮箱", value: "chenshuai@example.com" },
      { label: "公司", value: "一人公司" },
    ],
  },
  {
    icon: Bell,
    title: "通知设置",
    description: "管理告警和报告的通知方式",
    items: [
      { label: "可见度告警", value: "开启", active: true },
      { label: "周报推送", value: "开启", active: true },
      { label: "邮件通知", value: "关闭", active: false },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          账户设置
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          管理你的账户和安全设置
        </p>
      </div>

      {settingsSections.map((section) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/[0.06] bg-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/[0.03]">
              <section.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {section.description}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <span
                  className={cn(
                    "text-sm",
                    "active" in item && item.active !== undefined
                      ? item.active
                        ? "text-emerald-400"
                        : "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="rounded-xl border border-red-500/10 bg-red-500/[0.02] p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              危险操作
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              删除账户会永久移除所有品牌数据和监控记录
            </p>
            <button className="px-4 py-2 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/10 transition-colors">
              删除账户
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
