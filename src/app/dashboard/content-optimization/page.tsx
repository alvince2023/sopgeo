"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, FileText, PenLine, CheckCircle2, Clock, Zap, Target, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useBrandStore } from "@/stores/brand-store";
import { cn } from "@/lib/utils";

function Card({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.08 }}
      className={cn("rounded-xl border border-white/[0.06] bg-[#0f0f13] p-5", className)}
    >
      {children}
    </motion.div>
  );
}

interface OptimizationItem {
  id: string;
  title: string;
  category: "content" | "keyword" | "structure" | "authority";
  priority: "high" | "medium" | "low";
  description: string;
  impact: string;
  effort: string;
  expanded?: string;
}

export default function ContentOptimizationPage() {
  const brands = useBrandStore((s) => s.brands);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const recommendations: OptimizationItem[] = useMemo(() => [
    {
      id: "1",
      title: "品牌介绍页添加结构化数据",
      category: "content",
      priority: "high",
      description: "在官网品牌介绍页使用 FAQ 结构化数据，提高 AI 搜索引擎对品牌定位的理解准确度",
      impact: "高",
      effort: "中",
      expanded: "在品牌首页添加 FAQ Schema Markup，包含品牌成立时间、核心产品线、技术优势等结构化信息。参考 Google 结构化数据规范，使用 JSON-LD 格式嵌入。预计可使 AI 搜索结果中品牌信息准确率提升 40%。",
    },
    {
      id: "2",
      title: "核心关键词内容矩阵部署",
      category: "keyword",
      priority: "high",
      description: "围绕「品牌评测对比」「选购指南」「使用教程」三大内容类型，建立 20 篇关键词内容矩阵",
      impact: "高",
      effort: "高",
      expanded: "1. 识别 TOP20 高价值关键词\n2. 按推荐类/对比类/知识类分类\n3. 每篇 2000-3000 字深度内容\n4. 包含数据引用、专家观点、用户案例\n5. 确保内容首发于官网博客，再分发至知乎等平台\n6. 预计 1-2 个月完成内容矩阵部署",
    },
    {
      id: "3",
      title: "提升知乎品牌话题权威度",
      category: "authority",
      priority: "high",
      description: "运营品牌在知乎的机构号，发布专业回答并获取高票赞同，提升 AI 引用权重",
      impact: "高",
      effort: "中",
      expanded: "1. 完善品牌机构号主页信息\n2. 每周发布 2-3 条专业回答\n3. 重点回答推荐类/对比类问题（如「XX品牌怎么样」）\n4. 引用官方数据和第三方评测\n5. 与头部 KOL 互动提升内容曝光\n6. 问答长度建议 1000-2000 字",
    },
    {
      id: "4",
      title: "行业报告/白皮书发布",
      category: "authority",
      priority: "medium",
      description: "发布品牌年度行业报告或技术白皮书，建立行业权威引用源地位",
      impact: "中",
      effort: "高",
    },
    {
      id: "5",
      title: "竞品对比长文优化",
      category: "content",
      priority: "medium",
      description: "撰写客观全面的竞品对比文章，覆盖功能、价格、服务等维度，占据对比类查询首位",
      impact: "中",
      effort: "中",
    },
    {
      id: "6",
      title: "官网SEO技术优化",
      category: "structure",
      priority: "medium",
      description: "优化官网 Title/Meta/Header 标签，确保页面标题和描述可被 AI 搜索引擎正确索引",
      impact: "中",
      effort: "低",
    },
    {
      id: "7",
      title: "短视频内容布局（B站/小红书）",
      category: "content",
      priority: "medium",
      description: "AI 搜索引擎引用视频内容比例季度增长 45%，需加速视频内容部署",
      impact: "中",
      effort: "高",
    },
    {
      id: "8",
      title: "用户评价UGC引导",
      category: "authority",
      priority: "low",
      description: "鼓励真实用户在主流平台发布使用体验，增加真实 UGC 引用来源",
      impact: "低",
      effort: "中",
    },
    {
      id: "9",
      title: "增加产品页 FAQ 模块",
      category: "structure",
      priority: "low",
      description: "在每个产品页添加 FAQ 区块，覆盖高频搜索问题，提升页面被 AI 引用的概率",
      impact: "低",
      effort: "低",
    },
    {
      id: "10",
      title: "技术博客持续更新",
      category: "content",
      priority: "low",
      description: "每周发布 1 篇技术/行业深度文章，保持品牌在 AI 知识库中的新鲜度",
      impact: "中",
      effort: "高",
    },
  ], []);

  const firstBrand = brands[0];
  const categoryMeta = {
    content: { label: "内容优化", color: "#5C7CFA", icon: FileText },
    keyword: { label: "关键词策略", color: "#10B981", icon: Target },
    structure: { label: "结构优化", color: "#F59E0B", icon: PenLine },
    authority: { label: "权威建设", color: "#8B5CF6", icon: Zap },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> 返回仪表盘
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">内容优化工作台</h1>
        <p className="text-sm text-slate-400 mt-1">
          基于 AI 搜索可见度分析，获取针对性内容优化建议
        </p>
      </div>

      {!firstBrand ? (
        <Card className="text-center py-16">
          <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">请先添加品牌并完成首次扫描，获取个性化优化建议</p>
          <Link href="/dashboard/brands/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5C7CFA] text-white text-sm font-medium hover:bg-[#4B6FEF] transition-colors">
            添加品牌
          </Link>
        </Card>
      ) : (
        <>
          {/* Brand Context */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C7CFA]/20 to-[#8B5CF6]/20 flex items-center justify-center ring-1 ring-[#5C7CFA]/10">
                <span className="text-lg font-bold text-[#5C7CFA]">{firstBrand.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{firstBrand.name}</p>
                <p className="text-xs text-slate-400">
                  {firstBrand.keywords?.length || 0} 个监控关键词 · 优化建议基于最近一次扫描生成
                </p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  上次更新: 5 分钟前
                </span>
              </div>
            </div>
          </Card>

          {/* Priority Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "高优先级", count: 3, color: "#EF4444", bg: "bg-red-500/10", text: "text-red-400" },
              { label: "中优先级", count: 4, color: "#F59E0B", bg: "bg-amber-500/10", text: "text-amber-400" },
              { label: "低优先级", count: 3, color: "#3B82F6", bg: "bg-blue-500/10", text: "text-blue-400" },
            ].map((item) => (
              <Card key={item.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{item.count}<span className="text-xs text-slate-400 ml-1">项</span></p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                    <Lightbulb className={`w-5 h-5 ${item.text}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recommendations List */}
          <Card className="overflow-hidden">
            <h3 className="text-sm font-semibold text-white mb-1">优化建议清单</h3>
            <p className="text-xs text-slate-400 mb-4">共 {recommendations.length} 条建议，按优先级排列</p>
            <div className="divide-y divide-white/[0.04]">
              {recommendations.map((item, i) => {
                const cat = categoryMeta[item.category];
                const isExpanded = expandedId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="py-4"
                  >
                    <div className="flex items-start gap-3">
                      {/* Priority badge */}
                      <div className={cn(
                        "flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold",
                        item.priority === "high" ? "bg-red-500/10 text-red-400" :
                        item.priority === "medium" ? "bg-amber-500/10 text-amber-400" :
                        "bg-blue-500/10 text-blue-400"
                      )}>
                        {item.priority === "high" ? "高" : item.priority === "medium" ? "中" : "低"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white">{item.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${cat.color}10`, color: cat.color }}>
                            {cat.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                        
                        {/* Meta tags */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Target className="w-3 h-3" /> 影响: <span className={item.impact === "高" ? "text-emerald-400" : item.impact === "中" ? "text-amber-400" : "text-slate-400"}>{item.impact}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 投入: <span className={item.effort === "低" ? "text-emerald-400" : item.effort === "中" ? "text-amber-400" : "text-red-400"}>{item.effort}</span>
                          </span>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && item.expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                          >
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{item.expanded}</p>
                          </motion.div>
                        )}
                      </div>

                      {/* Expand button */}
                      {item.expanded && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-[#5C7CFA]/5 to-transparent border-[#5C7CFA]/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#5C7CFA]/15 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#5C7CFA]" />
                </div>
                <h4 className="text-sm font-semibold text-white">AI 内容生成</h4>
              </div>
              <p className="text-xs text-slate-400 mb-3">使用 AI 辅助生成基于 GEO 策略优化的品牌内容</p>
              <Link href="/dashboard/search-lab" className="inline-flex items-center gap-1.5 text-xs text-[#5C7CFA] hover:text-[#5C7CFA]/80 transition-colors">
                前往搜索实验室 <ExternalLink className="w-3 h-3" />
              </Link>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">效果追踪</h4>
              </div>
              <p className="text-xs text-slate-400 mb-3">查看优化后的排名变化和可见度进步趋势</p>
              <Link href="/dashboard/monitor" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-400/80 transition-colors">
                前往监控中心 <ExternalLink className="w-3 h-3" />
              </Link>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
