"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const plans = [
  {
    name: "免费版",
    description: "适合体验GEO的个人品牌",
    price: "0",
    period: "/月",
    cta: "免费开始",
    href: "/signup",
    variant: "outline" as const,
    features: [
      "1个品牌监测",
      "3个AI平台",
      "5个关键词",
      "月度报告",
      "手动数据刷新",
      "基础Dashboard",
    ],
  },
  {
    name: "专业版",
    description: "适合追求增长的中小品牌",
    price: "299",
    period: "/月",
    cta: "开始免费试用",
    href: "/signup",
    variant: "gradient" as const,
    popular: true,
    features: [
      "3个品牌监测",
      "全部AI平台",
      "30个关键词",
      "周度自动报告",
      "2个竞品对比",
      "趋势分析与PDF导出",
      "自动每日监控",
      "邮件/站内告警",
    ],
  },
  {
    name: "企业版",
    description: "按效果付费，风险共担",
    price: "定制",
    period: "",
    cta: "联系销售",
    href: "mailto:hello@sopgeo.cn",
    variant: "outline" as const,
    features: [
      "不限品牌数量",
      "不限关键词",
      "不限竞品对比",
      "日报 + 实时预警",
      "API数据接入",
      "专属客户经理",
      "白标报告定制",
      "按有效展示计费",
      "不达标退费保障",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-medium text-brand-500 mb-4 block"
          >
            定价方案
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            按效果付费，
            <span className="text-gradient"> 风险共担</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            只为真实的AI可见度买单，不达标退费
          </motion.p>
        </div>

        {/* RaaS Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mb-12 p-4 rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-500/5 to-accent-500/5 flex items-center gap-3"
        >
          <Zap className="h-5 w-5 text-brand-500 shrink-0" />
          <p className="text-sm">
            <span className="font-semibold text-foreground">RaaS 模式说明：</span>
            企业版采用&ldquo;基础费 + 按有效展示计费&rdquo;，仅当品牌在AI结果中被有效推荐时才产生效果费，确保你的每一分钱都花在真正的品牌曝光上。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border bg-card p-8 flex flex-col ${
                plan.popular
                  ? "border-brand-500/50 shadow-xl shadow-brand-500/10 scale-[1.02]"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  最受欢迎
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {plan.price === "定制" ? plan.price : `¥${plan.price}`}
                </span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <Button
                variant={plan.variant}
                className="w-full mb-8"
                size="lg"
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
