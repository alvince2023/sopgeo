"use client";

import { motion } from "framer-motion";
import { Search, Settings, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "添加品牌与关键词",
    description:
      "输入品牌信息、核心关键词和目标AI平台，我们即刻开始扫描。3分钟完成配置，无技术门槛。",
  },
  {
    icon: Settings,
    number: "02",
    title: "AI 自动监控分析",
    description:
      "系统自动在多个AI平台查询你的品牌，追踪提及率、推荐位、情感倾向，生成可见度评分。",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "查看报告与优化",
    description:
      "获取可视化的AI可见度报告和优化建议，持续提升品牌在AI搜索结果中的推荐概率。",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-medium text-brand-500 mb-4 block"
          >
            三步开始
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            简单三步，开启
            <span className="text-gradient"> AI 可见度管理</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-0.5 bg-gradient-to-r from-brand-500/30 to-accent-500/30" />
              )}

              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-brand-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
