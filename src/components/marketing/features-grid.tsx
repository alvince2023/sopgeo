"use client";

import { motion } from "framer-motion";
import {
  Eye,
  TrendingUp,
  BarChart3,
  Shield,
  Globe,
  Zap,
} from "lucide-react";

interface Feature {
  icon: typeof Eye;
  title: string;
  description: string;
  size: "lg" | "md" | "sm";
  gradient: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Eye,
    title: "AI 可见度追踪",
    description: "实时监控品牌在豆包、DeepSeek、Kimi、文心一言等主流AI平台中的提及情况",
    size: "lg",
    gradient: "from-brand-500/10 to-brand-500/5",
    iconColor: "text-brand-500",
  },
  {
    icon: TrendingUp,
    title: "竞品对比分析",
    description: "与竞品并排对比AI可见度分数、提及率、声量占比，发现差距和机会",
    size: "md",
    gradient: "from-accent-500/10 to-accent-500/5",
    iconColor: "text-accent-500",
  },
  {
    icon: BarChart3,
    title: "周月度报告",
    description: "自动生成专业AI可见度报告，含趋势图、平台明细、优化建议，可导出PDF",
    size: "md",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Shield,
    title: "实时预警通知",
    description: "品牌可见度下降、竞品突增、负面提及等异常情况即时告警",
    size: "md",
    gradient: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-500",
  },
  {
    icon: Globe,
    title: "多平台覆盖",
    description: "覆盖国内9+主流AI平台，统一Dashboard查看全平台表现",
    size: "sm",
    gradient: "from-cyan-500/10 to-cyan-500/5",
    iconColor: "text-cyan-500",
  },
  {
    icon: Zap,
    title: "优化建议引擎",
    description: "AI驱动的品牌内容优化建议，告诉你该如何提升AI推荐率",
    size: "sm",
    gradient: "from-rose-500/10 to-rose-500/5",
    iconColor: "text-rose-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesGrid() {
  const lgFeature = features[0];
  const otherFeatures = features.slice(1);

  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-medium text-brand-500 mb-4 block"
          >
            核心功能
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            一站式的 AI 搜索
            <span className="text-gradient"> 品牌可见度管理</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            从监控到优化，从数据到决策，覆盖完整的 GEO 工作流
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto"
        >
          <motion.div
            variants={item}
            className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 flex items-center justify-center mb-4">
                <lgFeature.icon className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{lgFeature.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                {lgFeature.description}
              </p>
              <div className="mt-8 flex gap-2">
                {["豆包", "DeepSeek", "Kimi", "文心"].map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-full bg-brand-500/10 text-xs font-medium text-brand-600"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {otherFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="relative group overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
