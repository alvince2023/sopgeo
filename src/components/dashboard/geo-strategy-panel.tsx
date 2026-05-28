"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  Link2,
  MessageSquare,
  BarChart3,
  Code2,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import type { GeoStrategyReport, GeoStrategyItem, GeoStrategyCategory } from "@/lib/monitor/geo-strategy";
import { cn } from "@/lib/utils";
import { useState } from "react";

const CATEGORY_CONFIG: Record<GeoStrategyCategory, { label: string; icon: React.ReactNode; color: string }> = {
  content:    { label: "内容策略",     icon: <BookOpen className="w-4 h-4" />,     color: "#5C7CFA" },
  knowledge:  { label: "知识图谱",     icon: <Target className="w-4 h-4" />,        color: "#8B5CF6" },
  authority:  { label: "权威建设",     icon: <BarChart3 className="w-4 h-4" />,     color: "#f59e0b" },
  citation:   { label: "引用链",       icon: <Link2 className="w-4 h-4" />,         color: "#10b981" },
  qa:         { label: "问答覆盖",     icon: <MessageSquare className="w-4 h-4" />, color: "#06b6d4" },
  comparison: { label: "竞品对比",     icon: <Zap className="w-4 h-4" />,           color: "#f97316" },
  technical:  { label: "技术优化",     icon: <Code2 className="w-4 h-4" />,         color: "#a78bfa" },
};

const PRIORITY_CONFIG = {
  critical: { label: "紧急",   color: "bg-red-500/15 text-red-400 border-red-500/30",     dot: "bg-red-500" },
  high:     { label: "高",     color: "bg-orange-500/15 text-orange-400 border-orange-500/30", dot: "bg-orange-500" },
  medium:   { label: "中",     color: "bg-blue-500/15 text-blue-400 border-blue-500/30",   dot: "bg-blue-500" },
  low:      { label: "低",     color: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-500" },
};

const TIMEFRAME_MAP = {
  immediate:  { label: "立即执行", color: "text-red-400" },
  "1-4weeks": { label: "1-4 周",   color: "text-orange-400" },
  "1-3months":{ label: "1-3 个月", color: "text-blue-400" },
  "3-6months":{ label: "3-6 个月", color: "text-slate-400" },
};

const DIFFICULTY_MAP = {
  easy:   { label: "简单", stars: 1 },
  medium: { label: "中等", stars: 2 },
  hard:   { label: "困难", stars: 3 },
};

function StrategyCard({ strategy }: { strategy: GeoStrategyItem }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_CONFIG[strategy.category];
  const pri = PRIORITY_CONFIG[strategy.priority];
  const tf  = TIMEFRAME_MAP[strategy.timeframe];
  const diff = DIFFICULTY_MAP[strategy.difficulty];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.06] bg-[#0f0f13] overflow-hidden"
    >
      {/* Header */}
      <button
        className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          {/* Category icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
          >
            {cat.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium",
                  pri.color
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", pri.dot)} />
                {pri.label}优先级
              </span>
              <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-white/[0.04]">
                {cat.label}
              </span>
              <span className={cn("text-[10px]", tf.color)}>⏱ {tf.label}</span>
              <span className="text-[10px] text-slate-500">
                {"⭐".repeat(diff.stars)} {diff.label}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white leading-snug">{strategy.title}</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{strategy.description}</p>
          </div>

          <div className="flex-shrink-0 ml-2">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pb-4 border-t border-white/[0.05]"
        >
          {/* Actions */}
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">执行步骤</p>
            {strategy.actions.map((action) => (
              <div key={action.step} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#5C7CFA]/20 text-[#5C7CFA] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {action.step}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{action.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{action.detail}</p>
                  {action.tool && (
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-[#5C7CFA]/10 text-[#5C7CFA]">
                      🛠 {action.tool}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Expected impact */}
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-400 font-medium">预期效果</p>
            </div>
            <p className="text-xs text-slate-300 mt-1">{strategy.expectedImpact}</p>
          </div>

          {/* Related keywords */}
          {strategy.relatedKeywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {strategy.relatedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function KeywordInsightRow({
  keyword, mentionRate, avgPosition, sentiment, gap, recommendation
}: GeoStrategyReport["keywordInsights"][0]) {
  const [showTip, setShowTip] = useState(false);
  const gapColor = gap === "high" ? "text-red-400" : gap === "medium" ? "text-amber-400" : "text-emerald-400";
  const gapLabel = gap === "high" ? "高机会" : gap === "medium" ? "待提升" : "良好";

  return (
    <div className="py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-medium truncate">{keyword}</span>
            <span className={cn("text-[10px] font-medium", gapColor)}>{gapLabel}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-slate-400">提及率 {mentionRate}%</span>
            {avgPosition && (
              <span className="text-[11px] text-slate-400">均位 #{avgPosition}</span>
            )}
            <span className="text-[11px] text-slate-400">
              {sentiment === "positive" ? "😊 正面" :
               sentiment === "negative" ? "😟 负面" :
               sentiment === "mixed"    ? "😐 混合" :
               sentiment === "none"     ? "🔇 无" : "😐 中性"}
            </span>
          </div>
        </div>
        {/* Mention rate bar */}
        <div className="w-20 flex-shrink-0">
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: mentionRate >= 60 ? "#22c55e" : mentionRate >= 30 ? "#f59e0b" : "#ef4444",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${mentionRate}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-[9px] text-slate-500 text-right mt-0.5">{mentionRate}%</p>
        </div>
        <button
          onClick={() => setShowTip(!showTip)}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
        </button>
      </div>
      {showTip && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 p-2.5 rounded-lg bg-[#5C7CFA]/5 border border-[#5C7CFA]/20"
        >
          <p className="text-[11px] text-slate-300 leading-relaxed">{recommendation}</p>
        </motion.div>
      )}
    </div>
  );
}

export function GeoStrategyPanel({ report }: { report: GeoStrategyReport }) {
  const [filter, setFilter] = useState<"all" | GeoStrategyCategory>("all");

  const criticalCount = report.strategies.filter((s) => s.priority === "critical").length;
  const highCount     = report.strategies.filter((s) => s.priority === "high").length;

  const filtered = filter === "all"
    ? report.strategies
    : report.strategies.filter((s) => s.category === filter);

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="rounded-xl border border-[#5C7CFA]/20 bg-[#5C7CFA]/5 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5C7CFA]/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-[#5C7CFA]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{report.summary.currentStatus}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <div className="p-2.5 rounded-lg bg-white/[0.04]">
                <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">最大机会</p>
                <p className="text-xs text-slate-300">{report.summary.topOpportunity}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] text-emerald-500 mb-0.5 uppercase tracking-wider">⚡ 快速见效</p>
                <p className="text-xs text-slate-300">{report.summary.quickWin}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400">{criticalCount} 个紧急策略</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-orange-400">{highCount} 个高优先级</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">预计 {report.summary.estimatedImprovementWeeks} 周见效</span>
          </div>
        </div>
      </div>

      {/* Keyword Insights */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-4">
        <h3 className="text-sm font-semibold text-white mb-3">关键词表现洞察</h3>
        <div>
          {report.keywordInsights.map((ki) => (
            <KeywordInsightRow key={ki.keyword} {...ki} />
          ))}
        </div>
      </div>

      {/* Strategy Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">GEO 优化策略</h3>
          <span className="text-xs text-slate-500">{report.strategies.length} 条建议</span>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "text-[11px] px-2.5 py-1 rounded-full border transition-colors",
              filter === "all"
                ? "bg-[#5C7CFA]/20 text-[#5C7CFA] border-[#5C7CFA]/30"
                : "text-slate-500 border-white/[0.06] hover:border-white/[0.1]"
            )}
          >
            全部
          </button>
          {(Object.keys(CATEGORY_CONFIG) as GeoStrategyCategory[]).filter(
            (cat) => report.strategies.some((s) => s.category === cat)
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full border transition-colors",
                filter === cat
                  ? "border-current"
                  : "text-slate-500 border-white/[0.06] hover:border-white/[0.1]"
              )}
              style={
                filter === cat
                  ? { color: CATEGORY_CONFIG[cat].color, backgroundColor: `${CATEGORY_CONFIG[cat].color}15`, borderColor: `${CATEGORY_CONFIG[cat].color}40` }
                  : {}
              }
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
      </div>
    </div>
  );
}
