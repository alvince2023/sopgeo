"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Globe,
  RefreshCw,
  ChevronRight,
  Loader2,
  BarChart3,
  Lightbulb,
  ChevronDown,
  Zap,
  Eye,
  Clock,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useBrandStore } from "@/stores/brand-store";
import { PLATFORMS, type PlatformKey } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import { getScoreLabel } from "@/lib/monitor/score";
import { GeoStrategyPanel } from "@/components/dashboard/geo-strategy-panel";
import { useEffect, useState } from "react";
import type { MonitorResult } from "@/lib/monitor/platforms";

// ─── Score gauge ─────────────────────────────────────────────
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

// ─── Data source badge ────────────────────────────────────────
function DataSourceBadge({ isRealApi }: { isRealApi: boolean }) {
  if (isRealApi) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Zap className="w-2.5 h-2.5" />
        真实API
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <AlertCircle className="w-2.5 h-2.5" />
      模拟数据
    </span>
  );
}

// ─── Platform card ────────────────────────────────────────────
interface PlatformCardProps {
  name: string;
  color: string;
  score: number;
  mentionRate: number;
  totalQueries: number;
  mentionedCount: number;
  isRealApi: boolean;
  avgQueryTime: number;
  status: "running" | "done" | "idle";
  results: MonitorResult[];
}

function PlatformCard({
  name,
  color,
  score,
  mentionRate,
  totalQueries,
  mentionedCount,
  isRealApi,
  avgQueryTime,
  status,
  results,
}: PlatformCardProps) {
  const [expanded, setExpanded] = useState(false);
  const label = getScoreLabel(score);

  const mentionedResults = results.filter((r) => r.mentioned);

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
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white truncate">{name}</p>
            {status === "done" && <DataSourceBadge isRealApi={isRealApi} />}
          </div>
          <p className="text-[10px] text-slate-400">
            {totalQueries > 0
              ? `${mentionedCount}/${totalQueries} 次提及 · ${avgQueryTime}ms`
              : "等待查询"}
          </p>
        </div>
        {status === "running" && (
          <Loader2 className="w-4 h-4 animate-spin text-[#5C7CFA]" />
        )}
        <ScoreGauge score={score} size="sm" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-2">
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

      {/* Expandable: AI Responses */}
      {mentionedResults.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-[10px] text-slate-400 hover:text-white transition-colors py-1.5 border-t border-white/[0.04]"
        >
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            查看 AI 回复 ({mentionedResults.length})
          </span>
          <ChevronDown
            className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")}
          />
        </button>
      )}

      <AnimatePresence>
        {expanded && mentionedResults.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-2">
              {mentionedResults.slice(0, 3).map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5"
                >
                  <p className="text-[10px] text-[#5C7CFA] mb-1">关键词: {r.keyword}</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {r.snippets[0] || r.response.slice(0, 200)}
                  </p>
                  {r.position && (
                    <p className="text-[9px] text-slate-500 mt-1">
                      品牌出现在第 {r.position} 句
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Query result item (expandable with full AI response) ────
interface QueryItemProps {
  queryText: string;
  keyword: string;
  platform: string;
  mentioned: boolean;
  sentiment?: string;
  isRealApi: boolean;
  queryTime: number;
  position: number | null;
  response: string;
  snippets: string[];
  competitors: string[];
}

function QueryItem({
  queryText,
  keyword,
  platform,
  mentioned,
  sentiment,
  isRealApi,
  queryTime,
  position,
  response,
  snippets,
  competitors,
}: QueryItemProps) {
  const platformInfo = PLATFORMS[platform as PlatformKey];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Query text */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-white truncate">
              &ldquo;{keyword}&rdquo;
            </p>
            <DataSourceBadge isRealApi={isRealApi} />
          </div>

          {/* Snippet preview */}
          {snippets.length > 0 ? (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {snippets[0]}
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-1 italic">
              品牌未被提及
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {queryTime}ms
            </span>
            {mentioned ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                已提及
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                未提及
              </span>
            )}
            {position && (
              <span className="text-[10px] text-slate-400">
                第 {position} 句
              </span>
            )}
            {sentiment && sentiment !== "none" && (
              <span className="text-[10px] text-slate-400">
                {sentiment === "positive" ? "正面" : sentiment === "negative" ? "负面" : "中性"}
              </span>
            )}
            {competitors.length > 0 && (
              <span className="text-[10px] text-slate-400">
                竞品: {competitors.slice(0, 3).join("、")}
              </span>
            )}
          </div>

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-[#5C7CFA] hover:text-[#5C7CFA]/80 transition-colors mt-1.5 flex items-center gap-1"
          >
            <Eye className="w-2.5 h-2.5" />
            {expanded ? "收起" : "查看"} AI 完整回复
            <ChevronDown
              className={cn("w-2.5 h-2.5 transition-transform", expanded && "rotate-180")}
            />
          </button>

          {/* Full AI response */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="text-[10px] text-slate-500 mb-1.5">
                    发送给 AI 的查询: &ldquo;{queryText}&rdquo;
                  </p>
                  <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {response}
                  </div>
                  {snippets.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/[0.04]">
                      <p className="text-[9px] text-emerald-400 mb-1">
                        品牌提及片段:
                      </p>
                      {snippets.map((s, i) => (
                        <p
                          key={i}
                          className="text-[11px] text-emerald-300/70 leading-relaxed mb-1"
                        >
                          &ldquo;{s}&rdquo;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Platform dot */}
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-white/20"
          style={{
            backgroundColor: platformInfo?.color || "#6b7280",
          }}
          title={platformInfo?.name}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
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
  const platformScores: PlatformCardProps[] =
    brand.platforms?.map((p) => {
      const info = PLATFORMS[p.platform as PlatformKey];
      const platformResult = results.find((r) => r.platform === p.platform);
      const platformName = info?.name || p.platform;

      if (platformResult) {
        const platformResults = platformResult.results;
        const mentionedCount = platformResults.filter((r) => r.mentioned).length;
        const realApiCount = platformResults.filter((r) => r.isRealApi).length;
        const avgQueryTime = platformResults.length > 0
          ? Math.round(
              platformResults.reduce((acc, r) => acc + r.queryTime, 0) /
                platformResults.length
            )
          : 0;

        return {
          name: platformName,
          color: info?.color || "#6b7280",
          score: platformResult.score.total,
          mentionRate: platformResult.score.mentionRate / 100,
          totalQueries: platformResults.length,
          mentionedCount,
          isRealApi: realApiCount > 0,
          avgQueryTime,
          status: "done" as const,
          results: platformResults,
        };
      }

      // Not yet run
      return {
        name: platformName,
        color: info?.color || "#6b7280",
        score: 0,
        mentionRate: 0,
        totalQueries: 0,
        mentionedCount: 0,
        isRealApi: false,
        avgQueryTime: 0,
        status: (status === "running" ? "running" : "idle") as "running" | "idle",
        results: [],
      };
    }) || [];

  const donePlatforms = platformScores.filter((p) => p.status === "done");
  const overallScore =
    donePlatforms.length > 0
      ? Math.round(
          donePlatforms.reduce((acc, p) => acc + p.score, 0) /
            donePlatforms.length
        )
      : 0;

  // Build query items from real results — include full response data
  const queryItems: QueryItemProps[] = results.flatMap((pr) =>
    pr.results.map((r) => ({
      queryText: r.query,
      keyword: r.keyword,
      platform: pr.platform,
      mentioned: r.mentioned,
      sentiment: r.sentiment,
      isRealApi: r.isRealApi ?? false,
      queryTime: r.queryTime,
      position: r.position,
      response: r.response,
      snippets: r.snippets,
      competitors: r.competitors,
    }))
  );

  // Data source summary
  const realApiCount = queryItems.filter((q) => q.isRealApi).length;
  const mockCount = queryItems.length - realApiCount;
  const realPlatformCount = donePlatforms.filter((p) => p.isRealApi).length;
  const mockPlatformCount = donePlatforms.length - realPlatformCount;

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

      {/* Data Source Summary */}
      {donePlatforms.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300">
                <span className="text-emerald-400 font-medium">{realPlatformCount}</span> 个平台使用真实 API
              </span>
            </div>
            {mockPlatformCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">
                  <span className="text-amber-400 font-medium">{mockPlatformCount}</span> 个平台使用模拟数据
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400">
                共 {queryItems.length} 条查询 · {realApiCount} 条真实 / {mockCount} 条模拟
              </span>
            </div>
          </div>
        </div>
      )}

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
            <p className="text-xs text-slate-400">正在 {brand.platforms?.length || 0} 个平台执行 AI 搜索查询</p>
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
              <PlatformCard key={ps.name} {...ps} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Queries — with full AI responses */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            AI 搜索查询详情
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
            {queryItems.map((q, i) => (
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
