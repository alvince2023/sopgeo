"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "免费版",
    price: "0",
    period: "永久免费",
    color: "bg-white/[0.03]",
    features: ["1个品牌监控", "2个AI平台", "50次/天查询", "基础可见度评分"],
  },
  {
    name: "专业版",
    price: "299",
    period: "/月",
    color: "bg-primary/5 border-primary/20",
    highlighted: true,
    features: [
      "5个品牌监控",
      "4个AI平台",
      "500次/天查询",
      "竞品对比分析",
      "月度报告导出",
      "邮件告警通知",
    ],
  },
  {
    name: "企业版",
    price: "定制",
    period: "效果付费",
    color: "bg-white/[0.03]",
    features: [
      "不限品牌数量",
      "全平台覆盖",
      "无限查询次数",
      "专属客户成功",
      "白标报告",
      "API接口",
      "SLA保障",
    ],
  },
];

export default function BillingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          计费方案
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          选择适合你的方案，按需灵活升级
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ y: -4 }}
            className={cn(
              "rounded-xl border border-white/[0.06] p-6 transition-all",
              plan.color
            )}
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-foreground">
                {plan.price === "0" ? "¥0" : plan.price === "定制" ? "" : "¥"}
                {plan.price}
              </span>
              <span className="text-xs text-muted-foreground">{plan.period}</span>
            </div>
            <button
              className={cn(
                "w-full py-2.5 rounded-lg text-sm font-medium transition-colors mb-5",
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-white/[0.06] text-foreground hover:bg-white/[0.03]"
              )}
            >
              {plan.highlighted ? "开始试用" : "选择方案"}
            </button>
            <ul className="space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
