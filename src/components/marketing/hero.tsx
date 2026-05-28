"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "12+", label: "AI平台覆盖" },
  { value: "99.7%", label: "语义匹配准确度" },
  { value: "327%", label: "平均可见度提升" },
  { value: "48h", label: "最快见效周期" },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-950/20 via-background to-background"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div style={{ y, opacity }} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="brand" className="mb-6 px-4 py-1.5 text-sm gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              全新 AI 搜索优化范式 — GEO
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            让你的品牌，
            <br />
            <span className="text-gradient">在 AI 搜索结果中</span>
            <br />
            被看见
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            首个专注中文市场的 AI 搜索 GEO 平台。实时监控豆包、DeepSeek、Kimi、文心一言等主流 AI 引擎中的品牌可见度，
            <span className="font-medium text-foreground">按效果付费</span>，只为真实可见度买单。
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="gradient" size="xl" asChild>
              <Link href="/signup">
                开始免费试用
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="#how-it-works">
                <Play className="mr-2 h-5 w-5" />
                了解工作原理
              </Link>
            </Button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border/50 bg-gradient-to-b from-card to-background shadow-2xl shadow-brand-950/10 overflow-hidden">
            {/* Mock Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
              <div className="ml-3 text-xs text-muted-foreground">
                SopGeo Dashboard — AI Visibility Overview
              </div>
            </div>
            {/* Mock Dashboard Content */}
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "AI 可见度综合评分", value: "87", color: "text-green-400" },
                  { label: "提及率", value: "94.2%", color: "text-brand-400" },
                  { label: "竞品声量占比", value: "62%", color: "text-accent-400" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="p-5 rounded-xl border border-border bg-card/50"
                  >
                    <div className="text-xs text-muted-foreground mb-2">
                      {card.label}
                    </div>
                    <div className={`text-2xl font-bold ${card.color}`}>
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-5 rounded-xl border border-border bg-card/50 h-40 flex items-end gap-1">
                {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-brand-500/40 to-brand-400/20"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/10 to-brand-500/10 blur-3xl -z-10" />
        </motion.div>
      </motion.div>
    </section>
  );
}
