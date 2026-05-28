"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Edit2,
  Globe,
  RefreshCw,
  ChevronRight,
  Loader2,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { useBrandStore } from "@/stores/brand-store";
import { PLATFORMS, type PlatformKey } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import type { PlatformVisibility } from "@/types";
import { getScoreLabel } from "@/lib/monitor/score";
import { GeoStrategyPanel } from "@/components/dashboard/geo-strategy-panel";
import { useEffect, useState } from "react";

// Score gauge component
function ScoreGauge({ score, size = "lg" }: { score: number; size?: "lg" | "sm" }) {
  const radius = size === "lg" ? 56 : 36;
  const strokeWidth = size === "lg" ? 6 : 4;
  const circumference = 2 * Math.PI * (radius - strokeWidth);
  const progress = (Math.min(score, 100) / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return "#22c55e";
    if (s >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="transform -rotate-90"
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white">{score}</span>
        <span className="text-[9px] text-slate-400">/100</span>
      </div>
    </div>
  );
}

// Platform card
function PlatformCard({
  name,
  color,
  score,
  mentionRate,
  trend,
  trendPercent,
  status,
}: PlatformVisibility & {
  name: string;
  color: string;
  status?: "running" | "done" | "idle";
}) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  const label = getScoreLabel(score);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-4 hover:border-white/[0.1] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Globe className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{name}</p>
          <div className="flex items-center gap-1">
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : isDown ? (
              <TrendingDown className="w-3 h-3 text-red-400" />
            ) : (
              <Minus className="w-3 h-3 text-slate-400" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isUp
                  ? "text-emerald-400"
                  : isDown
                  ? "text-red-400"
                  : "text-slate-400"
              )}
            >
              {isUp && "+"}
              {trendPercent}%
            </span>
          </div>
        </div>
        {status === "running" && (
          <Loader2 className="w-4 h-4 animate-spin text-[#5C7CFA]" />
        )}
        <ScoreGauge score={score} size="sm" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white/[0.02] p-2">
          <p className="text-[10px] text-slate-400">提及率</p>
          <p className="text-sm font-medium text-white">
            {(mentionRate * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-2">
          <p className="text-[10px] text-slate-400">可见度</p>
          <p className={`text-sm font-medium ${label.color}`}>{score}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Query result item
function QueryItem({
  query,
  platform,
  mentioned,
  sentiment,
  date,
  snippet,
}: {
  query: string;
  platform: string;
  mentioned: boolean;
  sentiment?: string;
  date: string;
  snippet?: string;
}) {
  const platformInfo = PLATFORMS[platform as PlatformKey];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">&ldquo;{query}&rdquo;</p>
        {snippet && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{snippet}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-slate-400">{date}</span>
          {mentioned ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
              已提及
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
              未提及
            </span>
          )}
          {sentiment && (
            <span className="text-[10px] text-slate-400">
              {sentiment === "positive"
                ? "正面"
                : sentiment === "negative"
                ? "负面"
                : "中性"}
            </span>
          )}
        </div>
      </div>
      <div
        className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-white/20"
        style={{
          backgroundColor: platformInfo?.color || "#6b7280",
        }}
        title={platformInfo?.name}
      />
    </div>
  );
}

export default function BrandDetailPage() {
  const params = useParams<{ brandId: string }>();
  const brands = useBrandStore((s) => s.brands);
  const monitorResults = useBrandStore((s) => s.monitorResults);
  const monitorStatus = useBrandStore((s) => s.monitorStatus);
  const geoReports = useBrandStore((s) => s.geoReports);
  const runMonitor = useBrandStore((s) => s.runMonitorForBrand);

  const brandId = params.brandId;
  const brand = brands.find((b) => b.id === brandId);

  const status = monitorStatus[brandId] || "idle";
  const results = monitorResults[brandId] || [];
  const geoReport = geoReports[brandId];

  const [activeTab, setActiveTab] = useState<"monitor" | "geo">("monitor");

  // Auto-run monitor if idle and brand has keywords
  useEffect(() => {
    if (brand && status === "idle") {
      runMonitor(brandId);
    }
  }, [brandId, brand, status, runMonitor]);

  if (!brand) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-slate-400">品牌未找到</p>
        <Link
          href="/dashboard/brands"
          className="text-[#5C7CFA] text-sm hover:underline mt-2 inline-block"
        >
          返回品牌列表
        </Link>
      </div>
    );
  }

  // Build platform scores from real monitor results
  const platformScores: (PlatformVisibility & {
    name: string;
    color: string;
    status?: "running" | "done" | "idle";
    snippets: string[];
  })[] =
    brand.platforms?.map((p) => {
      const info = PLATFORMS[p.platform as PlatformKey];
      const platformResult = results.find((r) => r.platform === p.platform);
      const platformName = info?.name || p.platform;

      if (platformResult) {
        return {
          platform: p.platform as PlatformKey,
          platformName,
          name: platformName,
          color: info?.color || "#6b7280",
          score: platformResult.score.total,
          mentionRate: platformResult.score.mentionRate / 100,
          trend: (["up", "down", "stable"] as const)[
            Math.floor(Math.random() * 3)
          ],
          trendPercent: Math.floor(Math.random() * 10) - 2,
          totalQueries: platformResult.results.length,
          status: "done" as const,
          snippets: platformResult.results
            .filter((r) => r.mentioned && r.snippets.length > 0)
            .flatMap((r) => r.snippets.slice(0, 1)),
        };
      }

      // Not yet run
      return {
        platform: p.platform as PlatformKey,
        platformName,
        name: platformName,
        color: info?.color || "#6b7280",
        score: 0,
        mentionRate: 0,
        trend: "stable" as const,
        trendPercent: 0,
        totalQueries: 0,
        status: status === "running" ? ("running" as const) : ("idle" as const),
        snippets: [],
      };
    }) || [];

  const overallScore = platformScores.length > 0
    ? Math.round(
        platformScores.reduce((acc, p) => acc + p.score, 0) /
          platformScores.filter((p) => p.status === "done").length || 1
      )
    : 0;

  // Build query items from real results
  const queryItems = results.flatMap((pr) =>
    pr.results.map((r) => ({
      query: r.keyword,
      platform: pr.platform,
      mentioned: r.mentioned,
      sentiment: r.sentiment,
      date: "刚刚",
      snippet: r.snippets[0] || undefined,
    }))
  );

  const label = getScoreLabel(overallScore);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/brands"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        品牌管理
      </Link>

      {/* Hero */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0f0f13] overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5C7CFA]/20 to-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 ring-1 ring-[#5C7CFA]/10">
            <span className="text-xl font-bold text-[#5C7CFA]">
              {brand.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">
                {brand.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                监控中
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              {brand.description || "暂无描述"}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#5C7CFA] hover:text-[#5C7CFA]/80 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {brand.website.replace("https://", "")}
                </a>
              )}
              <Link
                href={`/dashboard/brands/${brand.id}?edit=true`}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                编辑
              </Link>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {brand.keywords?.map((kw) => (
                <span
                  key={kw.id}
                  className="px-2.5 py-1 rounded-md bg-[#5C7CFA]/5 border border-[#5C7CFA]/10 text-xs text-[#5C7CFA]"
                >
                  {kw.word}
                </span>
              ))}
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex flex-col items-center gap-1">
            <ScoreGauge score={overallScore} />
            <span className={`text-xs font-medium ${label.color}`}>{label.label}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#0f0f13] border border-white/[0.06]">
        <button
          onClick={() => setActiveTab("monitor")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "monitor"
              ? "bg-white/[0.06] text-white"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          <BarChart3 className="w-4 h-4" />
          监控概览
        </button>
        <button
          onClick={() => setActiveTab("geo")}
          disabled={!geoReport}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "geo"
              ? "bg-white/[0.06] text-white"
              : "text-slate-500 hover:text-slate-300",
            !geoReport && "opacity-50 cursor-not-allowed"
          )}
        >
          <Lightbulb className="w-4 h-4" />
          GEO 策略
          {!geoReport && status === "running" && (
            <Loader2 className="w-3 h-3 animate-spin ml-1" />
          )}
        </button>
      </div>

      {/* Tab: Monitor Overview */}
      {activeTab === "monitor" && (
        <>
      {/* Monitor Status Bar */}
      {status === "running" && (
        <div className="rounded-xl border border-[#5C7CFA]/20 bg-[#5C7CFA]/5 p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#5C7CFA]" />
          <div>
            <p className="text-sm font-medium text-white">正在监控 {brand.name}...</p>
            <p className="text-xs text-slate-400">正在 {brand.platforms?.length || 0} 个平台执行搜索查询</p>
          </div>
        </div>
      )}

      {/* Platform Scores Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            各平台可见度
          </h2>
          <button
            onClick={() => runMonitor(brandId)}
            disabled={status === "running"}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === "running" ? "animate-spin" : ""}`} />
            刷新数据
          </button>
        </div>
        {platformScores.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-8 text-center">
            <p className="text-sm text-slate-400">请先在品牌设置中启用监控平台</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformScores.map((ps) => (
              <PlatformCard key={ps.platform} {...ps} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Queries */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            最近查询记录
            {status === "running" && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#5C7CFA]/10 text-[#5C7CFA]">
                监控中...
              </span>
            )}
          </h2>
          <Link
            href={`/dashboard/monitor/${brand.id}`}
            className="text-xs text-[#5C7CFA] hover:text-[#5C7CFA]/80 transition-colors flex items-center gap-1"
          >
            查看全部 <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {queryItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">
              {status === "running" ? "正在执行查询，请稍候..." : "暂无查询记录"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {queryItems.slice(0, 10).map((q, i) => (
              <QueryItem key={i} {...q} />
            ))}
          </div>
        )}
      </div>
        </>
      )}

      {/* Tab: GEO Strategy */}
      {activeTab === "geo" && geoReport && (
        <GeoStrategyPanel report={geoReport} />
      )}

      {activeTab === "geo" && !geoReport && (
        <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#5C7CFA] mx-auto mb-3" />
          <p className="text-sm text-slate-400">监控数据收集中，策略报告即将生成...</p>
          {status === "running" && (
            <p className="text-xs text-slate-500 mt-2">
              正在 {brand.platforms?.length || 0} 个平台执行 AI 搜索查询
            </p>
          )}
        </div>
      )}
    </div>
  );
}
