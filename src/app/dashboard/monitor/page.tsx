"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  RefreshCw,
  TrendingUp,
  Minus,
  ChevronRight,
  BarChart3,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORMS } from "@/lib/utils/constants";
import { calculateVisibilityScore, getScoreLabel } from "@/lib/monitor/score";
import type { MonitorResult } from "@/lib/monitor/platforms";
import type { PlatformKey } from "@/types";

// ---- Mock data generator for demo ----
function generateMockResults(
  brandName: string,
  keywords: string[],
  platform: PlatformKey,
  mentionProb: number
): MonitorResult[] {
  return keywords.map((keyword) => {
    const mentioned = Math.random() < mentionProb;
    return {
      platform,
      keyword,
      query: `在${keyword}领域哪些品牌做得好？`,
      response: mentioned
        ? `在${keyword}领域，${brandName}凭借专业服务获得了市场认可，是值得信赖的选择之一。`
        : `${keyword}是个竞争激烈的领域，市场上有多个选择，建议根据需求比较。`,
      mentioned,
      mentionType: mentioned ? (Math.random() > 0.4 ? "direct" : "indirect") : "none",
      sentiment: mentioned
        ? Math.random() > 0.3
          ? "positive"
          : "neutral"
        : "none",
      position: mentioned ? Math.ceil(Math.random() * 4) : null,
      snippets: mentioned
        ? [`${brandName}凭借专业服务获得了市场认可`]
        : [],
      competitors: [],
      queryTime: Math.floor(Math.random() * 800) + 200,
      timestamp: new Date(),
    };
  });
}

const DEMO_BRAND = "SopGeo";
const DEMO_KEYWORDS = ["AI搜索优化", "品牌曝光", "内容营销", "搜索引擎", "品牌推广"];
const PLATFORM_PROBS: Record<string, number> = {
  doubao: 0.65,
  deepseek: 0.52,
  kimi: 0.58,
  wenxin: 0.48,
};

// ---- Sub-components ----
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const label = getScoreLabel(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={6}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGrad)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
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
        <p className={cn("text-[10px] font-medium mt-0.5", label.color)}>
          {label.label}
        </p>
      </div>
    </div>
  );
}

function PlatformCard({
  platformKey,
  results,
  isLoading,
}: {
  platformKey: string;
  results: MonitorResult[];
  isLoading: boolean;
}) {
  const platform = PLATFORMS[platformKey as PlatformKey];
  const score = calculateVisibilityScore(results);
  const mentionCount = results.filter((r) => r.mentioned).length;

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
            <p className="text-sm font-semibold text-foreground">
              {platform?.name ?? platformKey}
            </p>
            <p className="text-xs text-muted-foreground">{results.length} 次查询</p>
          </div>
        </div>
        {isLoading ? (
          <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
        ) : (
          <ScoreRing score={score.total} size={60} />
        )}
      </div>

      {/* Mention breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-white/[0.02] p-3 text-center">
          <p className="text-lg font-bold text-foreground">{mentionCount}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">提及次数</p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            {results.length > 0
              ? Math.round((mentionCount / results.length) * 100)
              : 0}%
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">提及率</p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-3 text-center">
          <p
            className={cn(
              "text-lg font-bold",
              score.total >= 60
                ? "text-emerald-400"
                : score.total >= 40
                ? "text-amber-400"
                : "text-red-400"
            )}
          >
            {score.total}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">可见度分</p>
        </div>
      </div>

      {/* Recent queries */}
      <div className="space-y-1.5">
        {results.slice(0, 3).map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs py-1 px-2 rounded-md hover:bg-white/[0.02] transition-colors"
          >
            {r.mentioned ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0" />
            )}
            <span className="text-muted-foreground truncate flex-1">
              {r.keyword}
            </span>
            {r.mentioned && (
              <span className="text-[10px] text-muted-foreground/60">
                第{r.position}位
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function QueryResultRow({ result }: { result: MonitorResult }) {
  const platform = PLATFORMS[result.platform as PlatformKey];
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div
        className="h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
        style={{ background: platform?.color ?? "#666" }}
      >
        {platform?.name?.[0] ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-foreground">{result.keyword}</span>
          {result.mentioned ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
              已提及
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-muted-foreground">
              未提及
            </span>
          )}
          {result.mentionType === "direct" && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
              推荐
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{result.response}</p>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function MonitorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "queries">("overview");
  const [platformResults, setPlatformResults] = useState<
    Record<string, MonitorResult[]>
  >({});

  const allResults = Object.values(platformResults).flat();
  const overallScore = calculateVisibilityScore(allResults);
  const overallLabel = getScoreLabel(overallScore.total);

  const handleRunMonitor = async () => {
    setIsRunning(true);
    setPlatformResults({});
    setHasData(false);

    // Simulate running each platform sequentially with delay
    const platforms = ["doubao", "deepseek", "kimi", "wenxin"];
    for (const platform of platforms) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));
      const results = generateMockResults(
        DEMO_BRAND,
        DEMO_KEYWORDS,
        platform as PlatformKey,
        PLATFORM_PROBS[platform]
      );
      setPlatformResults((prev) => ({ ...prev, [platform]: results }));
    }

    setIsRunning(false);
    setHasData(true);
  };

  // Auto-run on mount
  useEffect(() => {
    handleRunMonitor();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedPlatforms = Object.keys(platformResults);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            AI 可见度监控
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            实时追踪品牌在各 AI 平台的曝光情况
          </p>
        </div>
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
          <RefreshCw
            className={cn("w-4 h-4", isRunning && "animate-spin")}
          />
          {isRunning ? "监控中..." : "立即刷新"}
        </button>
      </div>

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
                  <span className="text-4xl font-bold text-foreground">
                    {overallScore.total}
                  </span>
                  <span className={cn("text-lg font-semibold", overallLabel.color)}>
                    {overallLabel.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {overallLabel.description}
                </p>
              </div>

              {/* Score breakdown */}
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
                        <span className="text-xs font-medium text-foreground">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden w-24">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">查询总量</p>
                <p className="text-2xl font-bold text-foreground">
                  {allResults.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  提及 {allResults.filter((r) => r.mentioned).length} 次
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress when loading */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-white/[0.06] bg-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <p className="text-sm font-medium text-foreground">
              正在查询各 AI 平台...
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["doubao", "deepseek", "kimi", "wenxin"].map((p) => {
              const platform = PLATFORMS[p as PlatformKey];
              const done = completedPlatforms.includes(p);
              const isActive =
                !done &&
                completedPlatforms.length ===
                  ["doubao", "deepseek", "kimi", "wenxin"].indexOf(p);
              return (
                <div
                  key={p}
                  className={cn(
                    "rounded-lg p-3 flex items-center gap-2 transition-all",
                    done
                      ? "bg-emerald-500/[0.06] border border-emerald-500/20"
                      : isActive
                      ? "bg-primary/[0.06] border border-primary/20"
                      : "bg-white/[0.02] border border-white/[0.04]"
                  )}
                >
                  <div
                    className="h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: platform?.color }}
                  >
                    {platform?.name?.[0]}
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {platform?.name}
                  </span>
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                  ) : isActive ? (
                    <AlertCircle className="w-3.5 h-3.5 text-primary ml-auto animate-pulse" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

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
                    查询明细
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
                  isLoading={false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-card">
              <div className="p-5 border-b border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                      查询明细
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.04] text-muted-foreground">
                      {allResults.length} 条
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="w-3 h-3" />
                    实时数据
                  </div>
                </div>
              </div>
              <div className="p-5 divide-y divide-white/[0.04]">
                {allResults.map((result, i) => (
                  <QueryResultRow key={i} result={result} />
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
          <p className="text-base font-medium text-foreground mb-2">
            尚未运行监控
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            点击「立即刷新」开始追踪品牌在 AI 平台中的可见度
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
            <p className="text-sm font-medium text-foreground">
              开启历史追踪，查看可见度趋势
            </p>
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
