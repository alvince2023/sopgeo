"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  RefreshCw,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Clock,
  MessageSquare,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORMS } from "@/lib/utils/constants";
import { calculateVisibilityScore, getScoreLabel } from "@/lib/monitor/score";
import type { MonitorResult } from "@/lib/monitor/platforms";
import type { PlatformKey } from "@/types";

// ---- Demo config ----
const DEMO_BRAND = "SopGeo";
const DEMO_KEYWORDS = ["AI搜索优化", "品牌曝光", "内容营销", "GEO优化", "品牌推广"];

// P0 platforms — real API enabled
const P0_PLATFORMS: PlatformKey[] = ["minimax", "deepseek"];
// P1 platforms — shown but mock only
const P1_PLATFORMS: PlatformKey[] = ["kimi", "wenxin"];

// ---- Mock fallback for P1 platforms ----
function generateMockResults(
  brandName: string,
  keywords: string[],
  platform: PlatformKey,
  mentionProb: number
): MonitorResult[] {
  return keywords.map((keyword) => {
    const mentioned = Math.random() < mentionProb;
    const mockResponse = mentioned
      ? `在${keyword}领域，市场上有多个优秀的选择。${brandName}凭借其专业的AI搜索优化能力，在该领域积累了不少口碑，尤其在品牌可见度提升方面表现突出。此外，也有一些传统SEO工具在向GEO方向转型，但整体成熟度和专业度参差不齐。建议根据自身需求，重点考察各平台的实际案例和效果数据。`
      : `${keyword}是当前数字营销领域的重要议题。随着AI搜索的普及，越来越多的品牌开始关注如何在大模型中提升曝光度。目前市面上有一些工具可以帮助分析品牌在AI回答中的出现频率，但整体行业尚处于早期阶段，缺乏成熟的评估标准。`;
    return {
      platform,
      keyword,
      query: `在${keyword}领域，哪些品牌或工具做得比较好？`,
      response: mockResponse,
      mentioned,
      mentionType: mentioned ? (Math.random() > 0.4 ? "direct" : "indirect") : "none",
      sentiment: mentioned ? (Math.random() > 0.3 ? "positive" : "neutral") : "none",
      position: mentioned ? Math.ceil(Math.random() * 3) : null,
      snippets: mentioned ? [`${brandName}凭借专业服务获得了市场认可`] : [],
      competitors: [],
      queryTime: Math.floor(Math.random() * 800) + 600,
      timestamp: new Date(),
    };
  });
}

// ---- Highlight brand name in text ----
function HighlightText({ text, brand }: { text: string; brand: string }) {
  if (!brand || !text.toLowerCase().includes(brand.toLowerCase())) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary font-semibold rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ---- Score ring ----
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const label = getScoreLabel(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={6} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="url(#scoreGrad)" strokeWidth={6} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5C7CFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-foreground leading-none">{score}</p>
        <p className={cn("text-[10px] font-medium mt-0.5", label.color)}>{label.label}</p>
      </div>
    </div>
  );
}

// ---- Platform summary card ----
function PlatformCard({
  platformKey,
  results,
  isReal,
}: {
  platformKey: string;
  results: MonitorResult[];
  isReal: boolean;
}) {
  const platform = PLATFORMS[platformKey as PlatformKey];
  const score = calculateVisibilityScore(results);
  const mentionCount = results.filter((r) => r.mentioned).length;
  const avgQueryTime = results.length
    ? Math.round(results.reduce((s, r) => s + r.queryTime, 0) / results.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.06] bg-card p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: platform?.color ?? "#666" }}
          >
            {platform?.name?.[0] ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{platform?.name ?? platformKey}</p>
              {isReal ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  真实API
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-muted-foreground">
                  模拟数据
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-muted-foreground">{results.length} 次查询</p>
              {avgQueryTime > 0 && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <Clock className="w-3 h-3 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground/60">{(avgQueryTime / 1000).toFixed(1)}s</p>
                </>
              )}
            </div>
          </div>
        </div>
        <ScoreRing score={score.total} size={60} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-white/[0.02] p-3 text-center">
          <p className="text-lg font-bold text-foreground">{mentionCount}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">提及次数</p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            {results.length > 0 ? Math.round((mentionCount / results.length) * 100) : 0}%
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">提及率</p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-3 text-center">
          <p className={cn("text-lg font-bold", score.total >= 60 ? "text-emerald-400" : score.total >= 40 ? "text-amber-400" : "text-red-400")}>
            {score.total}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">可见度分</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {results.slice(0, 3).map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-xs py-1 px-2 rounded-md hover:bg-white/[0.02] transition-colors">
            {r.mentioned ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0" />
            )}
            <span className="text-muted-foreground truncate flex-1">{r.keyword}</span>
            {r.mentioned && r.position && (
              <span className="text-[10px] text-muted-foreground/60">第{r.position}句</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---- Full AI response row ----
function QueryResultRow({
  result,
  brandName,
  index,
}: {
  result: MonitorResult;
  brandName: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const platform = PLATFORMS[result.platform as PlatformKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "rounded-xl border transition-all",
        result.mentioned
          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
          : "border-white/[0.06] bg-white/[0.01]"
      )}
    >
      {/* Header row */}
      <div
        className="flex items-start gap-4 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Platform badge */}
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
          style={{ background: platform?.color ?? "#666" }}
        >
          {platform?.name?.[0] ?? "?"}
        </div>

        <div className="flex-1 min-w-0">
          {/* Keyword + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-foreground">{result.keyword}</span>
            <span className="text-xs text-muted-foreground/60">{platform?.name}</span>
            {result.mentioned ? (
              <>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✓ 已提及
                </span>
                {result.mentionType === "direct" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                    推荐提及
                  </span>
                )}
                {result.sentiment === "positive" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400">
                    正面评价
                  </span>
                )}
              </>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-muted-foreground">
                未提及
              </span>
            )}
          </div>

          {/* Query text */}
          <div className="flex items-center gap-1.5 mb-2">
            <Search className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
            <p className="text-xs text-muted-foreground italic">{result.query}</p>
          </div>

          {/* Response preview or full */}
          <AnimatePresence initial={false}>
            {!expanded ? (
              <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                <HighlightText text={result.response} brand={brandName} />
              </p>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">AI 完整回复</span>
                    <span className="text-[10px] text-muted-foreground/50 ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(result.queryTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    <HighlightText text={result.response} brand={brandName} />
                  </p>

                  {/* Snippets where brand was mentioned */}
                  {result.snippets && result.snippets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        品牌提及片段
                      </p>
                      {result.snippets.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-foreground/70 italic">「{s}」</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Competitors */}
                  {result.competitors && result.competitors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        同时提及的竞品
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.competitors.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-muted-foreground border border-white/[0.06]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expand toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {result.position && (
            <span className="text-[10px] text-muted-foreground/50">第{result.position}句提及</span>
          )}
          <ChevronDown
            className={cn("w-4 h-4 text-muted-foreground/40 transition-transform", expanded && "rotate-180")}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ---- API response type ----
interface MonitorAPIResponse {
  success: boolean;
  data: {
    brandId: string;
    brandName: string;
    overallScore: number;
    platformResults: Array<{
      brandId: string;
      brandName: string;
      platform: string;
      platformName: string;
      results: MonitorResult[];
      score: { total: number };
    }>;
    totalQueries: number;
    mentionCount: number;
    lastRunAt: string;
  };
  error?: string;
}

// ---- Main Page ----
export default function MonitorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "queries">("queries");
  const [platformResults, setPlatformResults] = useState<Record<string, MonitorResult[]>>({});
  const [realPlatforms, setRealPlatforms] = useState<string[]>([]);
  const [runningPlatforms, setRunningPlatforms] = useState<string[]>([]);
  const [completedPlatforms, setCompletedPlatforms] = useState<string[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterMentioned, setFilterMentioned] = useState<"all" | "mentioned" | "not">("all");

  const allResults = Object.values(platformResults).flat();
  const overallScore = calculateVisibilityScore(allResults);
  const overallLabel = getScoreLabel(overallScore.total);

  // Check which platforms have real API keys
  useEffect(() => {
    fetch("/api/monitor")
      .then((r) => r.json())
      .then((d: { platforms?: Array<{ platform: string; available: boolean }> }) => {
        const real = (d.platforms ?? [])
          .filter((p) => p.available)
          .map((p) => p.platform);
        setRealPlatforms(real);
      })
      .catch(() => setRealPlatforms([]));
  }, []);

  const handleRunMonitor = useCallback(async () => {
    setIsRunning(true);
    setPlatformResults({});
    setHasData(false);
    setCompletedPlatforms([]);

    const allPlatforms = [...P0_PLATFORMS, ...P1_PLATFORMS];
    setRunningPlatforms(allPlatforms);

    // Run real API platforms (DeepSeek + MiniMax) via server route
    const realPlatformsToRun = P0_PLATFORMS.filter((p) => realPlatforms.includes(p));
    const mockPlatformsToRun = [
      ...P0_PLATFORMS.filter((p) => !realPlatforms.includes(p)),
      ...P1_PLATFORMS,
    ];

    // Real API call
    if (realPlatformsToRun.length > 0) {
      try {
        const res = await fetch("/api/monitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandId: "demo-brand",
            brandName: DEMO_BRAND,
            keywords: DEMO_KEYWORDS,
            platforms: realPlatformsToRun,
          }),
        });
        const data = (await res.json()) as MonitorAPIResponse;
        if (data.success && data.data.platformResults) {
          for (const pr of data.data.platformResults) {
            setPlatformResults((prev) => ({ ...prev, [pr.platform]: pr.results }));
            setCompletedPlatforms((prev) => [...prev, pr.platform]);
          }
        }
      } catch (e) {
        console.warn("[Monitor] Real API failed, falling back to mock for P0:", e);
        // fallback P0 to mock
        for (const p of realPlatformsToRun) {
          mockPlatformsToRun.push(p);
        }
      }
    }

    // Mock platforms — run sequentially with delay for visual effect
    const mockProbs: Record<string, number> = {
      minimax: 0.7,
      deepseek: 0.6,
      kimi: 0.58,
      wenxin: 0.48,
    };
    for (const p of mockPlatformsToRun) {
      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 500));
      const results = generateMockResults(DEMO_BRAND, DEMO_KEYWORDS, p, mockProbs[p] ?? 0.5);
      setPlatformResults((prev) => ({ ...prev, [p]: results }));
      setCompletedPlatforms((prev) => [...prev, p]);
    }

    setIsRunning(false);
    setHasData(true);
    setRunningPlatforms([]);
  }, [realPlatforms]);

  // Auto-run on mount
  useEffect(() => {
    handleRunMonitor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered results for query tab
  const filteredResults = allResults.filter((r) => {
    if (filterPlatform !== "all" && r.platform !== filterPlatform) return false;
    if (filterMentioned === "mentioned" && !r.mentioned) return false;
    if (filterMentioned === "not" && r.mentioned) return false;
    return true;
  });

  const mentionedCount = allResults.filter((r) => r.mentioned).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI 可见度监控</h1>
          <p className="text-sm text-muted-foreground mt-1">
            实时向 DeepSeek / MiniMax 发起真实查询，追踪品牌曝光
          </p>
        </div>
        <div className="flex items-center gap-3">
          {realPlatforms.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              {realPlatforms.length} 个真实 API 已接入
            </div>
          )}
          <button
            onClick={handleRunMonitor}
            disabled={isRunning}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              isRunning
                ? "bg-white/[0.04] text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", isRunning && "animate-spin")} />
            {isRunning ? "监控中..." : "立即刷新"}
          </button>
        </div>
      </div>

      {/* Loading progress */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/[0.06] bg-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <p className="text-sm font-medium text-foreground">
              正在向 AI 平台发起查询...
            </p>
            <span className="text-xs text-muted-foreground">
              {completedPlatforms.length}/{runningPlatforms.length} 完成
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...P0_PLATFORMS, ...P1_PLATFORMS].map((p) => {
              const platform = PLATFORMS[p];
              const done = completedPlatforms.includes(p);
              const isReal = realPlatforms.includes(p);
              return (
                <div
                  key={p}
                  className={cn(
                    "rounded-lg p-3 flex items-center gap-2 transition-all",
                    done
                      ? "bg-emerald-500/[0.06] border border-emerald-500/20"
                      : "bg-white/[0.02] border border-white/[0.04]"
                  )}
                >
                  <div
                    className="h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: platform?.color }}
                  >
                    {platform?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{platform?.name}</p>
                    {isReal && (
                      <p className="text-[10px] text-emerald-400">真实API</p>
                    )}
                  </div>
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto animate-pulse flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Overall score banner */}
      <AnimatePresence>
        {hasData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-white/[0.06] bg-card p-6"
          >
            <div className="flex items-center gap-6">
              <ScoreRing score={overallScore.total} size={88} />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  综合AI可见度评分 · {DEMO_BRAND}
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-foreground">{overallScore.total}</span>
                  <span className={cn("text-lg font-semibold", overallLabel.color)}>
                    {overallLabel.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{overallLabel.description}</p>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {[
                  { label: "提及率", value: overallScore.mentionRate, weight: "35%" },
                  { label: "位置评分", value: overallScore.positionScore, weight: "25%" },
                  { label: "推荐度", value: overallScore.recommendationScore, weight: "20%" },
                  { label: "情感分析", value: overallScore.sentimentScore, weight: "15%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          {item.label}
                          <span className="ml-1 opacity-50">{item.weight}</span>
                        </span>
                        <span className="text-xs font-medium text-foreground">{item.value}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden w-24">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right space-y-1">
                <div>
                  <p className="text-xs text-muted-foreground">查询总量</p>
                  <p className="text-2xl font-bold text-foreground">{allResults.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">提及次数</p>
                  <p className="text-lg font-bold text-emerald-400">{mentionedCount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform results */}
      {completedPlatforms.length > 0 && (
        <>
          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] w-fit">
            {(["overview", "queries"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-white/[0.06] text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "overview" ? (
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5" />
                    平台概览
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" />
                    AI 回复明细
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/[0.06]">
                      {allResults.length}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedPlatforms.map((p) => (
                <PlatformCard
                  key={p}
                  platformKey={p}
                  results={platformResults[p]}
                  isReal={realPlatforms.includes(p)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03]">
                  <button
                    onClick={() => setFilterPlatform("all")}
                    className={cn(
                      "px-3 py-1.5 rounded text-xs font-medium transition-all",
                      filterPlatform === "all" ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"
                    )}
                  >
                    全部平台
                  </button>
                  {completedPlatforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilterPlatform(p)}
                      className={cn(
                        "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                        filterPlatform === p ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: PLATFORMS[p as PlatformKey]?.color }}
                      />
                      {PLATFORMS[p as PlatformKey]?.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03]">
                  {(["all", "mentioned", "not"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterMentioned(f)}
                      className={cn(
                        "px-3 py-1.5 rounded text-xs font-medium transition-all",
                        filterMentioned === f ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {f === "all" ? "全部" : f === "mentioned" ? "✓ 已提及" : "✗ 未提及"}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-muted-foreground ml-auto">
                  显示 {filteredResults.length} / {allResults.length} 条
                </span>
              </div>

              {/* Result cards */}
              <div className="space-y-3">
                {filteredResults.map((result, i) => (
                  <QueryResultRow
                    key={`${result.platform}-${result.keyword}-${i}`}
                    result={result}
                    brandName={DEMO_BRAND}
                    index={i}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!isRunning && !hasData && (
        <div className="rounded-xl border border-white/[0.06] bg-card p-12 text-center">
          <Eye className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-base font-medium text-foreground mb-2">尚未运行监控</p>
          <p className="text-sm text-muted-foreground mb-6">
            点击「立即刷新」，向 DeepSeek 和 MiniMax 发起真实查询
          </p>
          <button
            onClick={handleRunMonitor}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            开始监控
          </button>
        </div>
      )}

      {/* Upgrade hint */}
      {hasData && (
        <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">开启历史追踪，查看可见度趋势</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              升级到专业版，自动定期运行监控并生成趋势报告
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            升级方案
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
