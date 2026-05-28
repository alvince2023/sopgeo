"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Sparkles, Zap } from "lucide-react";

const platforms = [
  { name: "豆包", icon: Bot, color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-500/10" },
  { name: "DeepSeek", icon: Cpu, color: "from-indigo-500 to-blue-500", bgColor: "bg-indigo-500/10" },
  { name: "Kimi", icon: Sparkles, color: "from-violet-500 to-purple-500", bgColor: "bg-violet-500/10" },
  { name: "文心一言", icon: Zap, color: "from-rose-500 to-pink-500", bgColor: "bg-rose-500/10" },
];

export function PlatformShowcase() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-sm font-medium text-brand-500 mb-4 block"
        >
          覆盖平台
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
        >
          覆盖 <span className="text-gradient">中文主流AI平台</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-12"
        >
          持续接入更多平台，确保你的品牌在每一个AI搜索入口都可见
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className={`${platform.bgColor} rounded-2xl p-6 flex flex-col items-center gap-3 border border-border hover:shadow-lg transition-all duration-300`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                  <platform.icon className="h-7 w-7 text-white" />
                </div>
                <span className="font-semibold text-sm">{platform.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          通义千问、智谱清言、元宝等更多平台即将接入
        </motion.p>
      </div>
    </section>
  );
}
