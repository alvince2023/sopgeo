"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "什么是GEO？和传统SEO有什么区别？",
    answer:
      "GEO（生成式引擎优化）是针对豆包、DeepSeek、Kimi等AI大模型搜索的优化技术。与SEO不同，GEO不依赖关键词堆砌和外链，而是通过构建符合AI语义逻辑的品牌知识体系，让AI引擎在回答用户问题时主动推荐你的品牌。",
  },
  {
    question: "如何知道我的品牌在AI搜索中的表现？",
    answer:
      "我们的系统会在多个AI平台发送精心设计的查询Prompt，追踪你的品牌是否被提及、被推荐、被正面评价，并生成一个0-100分的AI可见度综合评分。你可以直观地看到品牌在AI世界里的表现。",
  },
  {
    question: "按效果付费具体怎么算？",
    answer:
      "企业版采用'基础费 + 效果费'模式。每次品牌在AI搜索结果中被'有效展示'（被推荐且排名靠前、情感正面），计为一次效果。月度达到约定展示量后收取基础费，超出部分按次计费。未达标则减免基础费——我们与你共担风险。",
  },
  {
    question: "数据多久更新一次？",
    answer:
      "免费版支持手动刷新。专业版每日自动扫描一次。企业版可根据需求定制频率（每小时/每4小时/每日），确保你第一时间掌握品牌AI可见度变化。",
  },
  {
    question: "支持哪些AI平台？",
    answer:
      "当前已支持豆包、DeepSeek、Kimi、文心一言4个核心平台。通义千问、智谱清言、腾讯元宝等平台正在接入中，预计2-3周内完成。另外秘塔搜索、天工AI等也在路线图上。",
  },
  {
    question: "是否需要技术团队才能使用？",
    answer:
      "完全不需要。你只需要输入品牌名称、官网和核心关键词，系统自动完成所有技术工作。Dashboard界面直观可视化，非技术人员也能轻松掌握。3分钟即可完成初始配置。",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-medium text-brand-500 mb-4 block"
          >
            常见问题
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            关于 GEO，你可能想知道
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
