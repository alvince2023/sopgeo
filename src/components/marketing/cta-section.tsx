"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900/90 to-accent-900" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight"
        >
          准备好让品牌在 AI 时代被看见了吗？
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-white/60 max-w-xl mx-auto"
        >
          免费开始，3分钟完成配置。看看你的品牌在豆包、DeepSeek、Kimi中的真实表现。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="xl"
            className="bg-white text-brand-900 hover:bg-white/90 hover:shadow-xl hover:shadow-white/10"
            asChild
          >
            <Link href="/signup">
              免费开始
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="xl"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 border-white/20"
            asChild
          >
            <Link href="mailto:hello@sopgeo.cn">预约演示</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm text-white/40"
        >
          无需信用卡，免费版永久可用
        </motion.p>
      </div>
    </section>
  );
}
