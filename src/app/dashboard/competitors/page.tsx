"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  BarChart3,
  Eye,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORMS } from "@/lib/utils/constants";
import type { PlatformKey } from "@/types";

// ---- Types ----
interface Competitor {
  id: string;
  name: string;
  industry: string;
  overallScore: number;
  scoreChange: number;
  platforms: Record<
    string,
    {
      score: number;
      mentionRate: number;
      position: number;
      trend: "up" | "down" | "stable";
    }
  >;
}

interface ComparisonData {
  brand: Competitor;
  competitors: Competitor[];
}

// ---- Mock data ----
const MOCK_DATA: ComparisonData = {
  brand: {
    id: "brand",
    name: "SopGeo",
    industry: "GEO/SEO",
    overallScore: 62,
    scoreChange: 5.8,
    platforms: {
      doubao: { score: 72, mentionRate: 0.65, position: 1.8, trend: "up" },
      deepseek: { score: 58, mentionRate: 0.48, position: 2.3, trend: "up" },
      kimi: { score: 63, mentionRate: 0.55, position: 2.1, trend: "stable" },
      wenxin: { score: 51, mentionRate: 0.42, position: 2.8, trend: "down" },
    },
  },
  competitors: [
    {
      id: "comp1",
      name: "SEO智推",
      industry: "GEO服务",
      overallScore: 58,
      scoreChange: -2.1,
      platforms: {
        doubao: { score: 65, mentionRate: 0.58, position: 2.1, trend: "down" },
        deepseek: { score: 55, mentionRate: 0.45, position: 2.5, trend: "stable" },
        kimi: { score: 60, mentionRate: 0.52, position: 2.3, trend: "up" },
        wenxin: { score: 48, mentionRate: 0.38, position: 3.0, trend: "down" },
      },
    },
    {
      id: "comp2",
      name: "AI优品牌",
      industry: "品牌AI优化",
      overallScore: 71,
      scoreChange: 3.2,
      platforms: {
        doubao: { score: 78, mentionRate: 0.72, position: 1.5, trend: "up" },
        deepseek: { score: 68, mentionRate: 0.55, position: 1.9, trend: "up" },
        kimi: { score: 70, mentionRate: 0.62, position: 2.0, trend: "up" },
        wenxin: { score: 62, mentionRate: 0.50, position: 2.4, trend: "stable" },
      },
    },
    {
      id: "comp3",
      name: "数据脉动",
      industry: "数据监测工具",
      overallScore: 45,
      scoreChange: -4.5,
      platforms: {
        doubao: { score: 52, mentionRate: 0.40, position: 2.8, trend: "down" },
        deepseek: { score: 42, mentionRate: 0.32, position: 3.2, trend: "down" },
        kimi: { score: 48, mentionRate: 0.38, position: 2.9, trend: "down" },
        wenxin: { score: 35, mentionRate: 0.28, position: 3.5, trend: "down" },
      },
    },
  ],
};

const PLATFORM_KEYS = ["doubao", "deepseek", "kimi", "wenxin"] as PlatformKey[];

// ---- Sub-components ----
function ComparisonBar({
  label,
  brandValue,
  competitorValue,
  maxValue,
  color,
}: {
  label: string;
  brandValue: number;
  competitorValue: number;
  maxValue: number;
  color: string;
}) {
  const brandPct = (brandValue / maxValue) * 100;
  const compPct = (competitorValue / maxValue) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium">{brandValue}</span>
          <span className="text-muted-foreground">{competitorValue}</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-primary/80 transition-all"
          style={{ width: `${brandPct}%` }}
        />
        <div
          className="absolute top-0 left-0 h-full rounded-full opacity-40 transition-all"
          style={{ width: `${compPct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function CompetitorsPage() {
  const [data] = useState(MOCK_DATA);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const allEntities = [data.brand, ...data.competitors];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            竞品分析
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            对比你的品牌与竞品在 AI 搜索中的表现
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/[0.04] text-foreground hover:bg-white/[0.06] transition-all">
          <Plus className="w-4 h-4" />
          添加竞品
        </button>
      </div>

      {/* Overall ranking */}
      <div className="rounded-xl border border-white/[0.06] bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          综合可见度排名
        </h2>
        <div className="space-y-3">
          {allEntities
            .sort((a, b) => b.overallScore - a.overallScore)
            .map((entity, index) => {
              const isBrand = entity.id === "brand";
              return (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-colors",
                    isBrand
                      ? "bg-primary/[0.06] border border-primary/20"
                      : "bg-white/[0.02] hover:bg-white/[0.03]"
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0
                        ? "bg-amber-500/20 text-amber-400"
                        : index === 1
                        ? "bg-gray-400/20 text-gray-400"
                        : index === 2
                        ? "bg-amber-700/20 text-amber-700"
                        : "bg-white/[0.06] text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {entity.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {entity.name}
                        </span>
                        {isBrand && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary">
                            你的品牌
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {entity.industry}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {entity.overallScore}
                      </p>
                      <div
                        className={cn(
                          "flex items-center gap-0.5 text-xs",
                          entity.scoreChange > 0
                            ? "text-emerald-400"
                            : entity.scoreChange < 0
                            ? "text-red-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {entity.scoreChange > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : entity.scoreChange < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                        {entity.scoreChange > 0 && "+"}
                        {entity.scoreChange}
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      {PLATFORM_KEYS.map((pk) => {
                        const ps = entity.platforms[pk];
                        if (!ps) return null;
                        const platform = PLATFORMS[pk];
                        return (
                          <div key={pk} className="text-center w-12">
                            <div
                              className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden mb-1"
                            >
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${ps.score}%`,
                                  background: platform?.color,
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {platform?.name?.[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Platform comparison detail */}
      <div className="rounded-xl border border-white/[0.06] bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          各平台详细对比
        </h2>
        <div className="space-y-3">
          {PLATFORM_KEYS.map((pk) => {
            const platform = PLATFORMS[pk];
            const isExpanded = expandedPlatform === pk;
            const brandScore = data.brand.platforms[pk]?.score ?? 0;
            const bestCompScore = Math.max(
              ...data.competitors.map((c) => c.platforms[pk]?.score ?? 0)
            );

            return (
              <div key={pk} className="rounded-lg bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedPlatform(isExpanded ? null : pk)
                  }
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: platform?.color }}
                  >
                    {platform?.name?.[0]}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">
                      {platform?.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        你的评分: {brandScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">|</span>
                      <span className="text-xs text-muted-foreground">
                        竞品最高: {bestCompScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {data.competitors.slice(0, 2).map((c) => {
                      const cs = c.platforms[pk];
                      return (
                        <div key={c.id} className="flex items-center gap-1">
                          <div className="h-5 w-5 rounded bg-white/[0.04] flex items-center justify-center text-[10px] text-muted-foreground">
                            {c.name[0]}
                          </div>
                          <span className="text-xs font-medium text-foreground w-6">
                            {cs?.score ?? "-"}
                          </span>
                        </div>
                      );
                    })}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[data.brand, ...data.competitors].map((entity) => {
                            const ps = entity.platforms[pk];
                            if (!ps) return null;
                            const isBrand = entity.id === "brand";
                            return (
                              <div
                                key={entity.id}
                                className={cn(
                                  "rounded-lg p-3",
                                  isBrand
                                    ? "bg-primary/[0.06] border border-primary/20"
                                    : "bg-white/[0.02]"
                                )}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-foreground">
                                    {entity.name}
                                  </span>
                                  {isBrand && (
                                    <span className="text-[10px] px-1 py-0.5 rounded bg-primary/20 text-primary">
                                      你
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">
                                      可见度
                                    </span>
                                    <p className="text-base font-bold text-foreground">
                                      {ps.score}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      提及率
                                    </span>
                                    <p className="text-base font-bold text-foreground">
                                      {(ps.mentionRate * 100).toFixed(0)}%
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      平均位置
                                    </span>
                                    <p className="text-base font-bold text-foreground">
                                      {ps.position.toFixed(1)}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      趋势
                                    </span>
                                    <p
                                      className={cn(
                                        "text-base font-bold flex items-center gap-1",
                                        ps.trend === "up"
                                          ? "text-emerald-400"
                                          : ps.trend === "down"
                                          ? "text-red-400"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {ps.trend === "up" ? (
                                        <TrendingUp className="w-3.5 h-3.5" />
                                      ) : ps.trend === "down" ? (
                                        <TrendingDown className="w-3.5 h-3.5" />
                                      ) : (
                                        <Minus className="w-3.5 h-3.5" />
                                      )}
                                      {ps.trend === "up"
                                        ? "上升"
                                        : ps.trend === "down"
                                        ? "下降"
                                        : "稳定"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Head-to-head comparison */}
      <div className="rounded-xl border border-white/[0.06] bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          一对一对比
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="rounded-lg bg-white/[0.02] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">
                  SopGeo vs {competitor.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    综合分差
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      data.brand.overallScore > competitor.overallScore
                        ? "text-emerald-400"
                        : "text-red-400"
                    )}
                  >
                    {data.brand.overallScore > competitor.overallScore ? "+" : ""}
                    {data.brand.overallScore - competitor.overallScore}
                  </span>
                </div>
              </div>
              <ComparisonBar
                label="提及率"
                brandValue={Math.round(
                  (Object.values(data.brand.platforms).reduce(
                    (s, p) => s + p.mentionRate,
                    0
                  ) /
                    4) *
                    100
                )}
                competitorValue={Math.round(
                  (Object.values(competitor.platforms).reduce(
                    (s, p) => s + p.mentionRate,
                    0
                  ) /
                    4) *
                    100
                )}
                maxValue={100}
                color="#f59e0b"
              />
              <ComparisonBar
                label="推荐度"
                brandValue={data.brand.overallScore}
                competitorValue={competitor.overallScore}
                maxValue={100}
                color="#ef4444"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-4 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Eye className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            发现 {data.competitors.length} 个竞品的可见度差异
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            AI优品牌在多个平台上得分高于你，建议重点分析其关键词策略
          </p>
        </div>
        <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          生成报告
        </button>
      </div>
    </div>
  );
}
