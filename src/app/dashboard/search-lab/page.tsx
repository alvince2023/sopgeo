"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  BookOpen,
  TrendingUp,
  Copy,
  Check,
  AlertCircle,
  MessageSquare,
  Target,
  Lightbulb,
  FileText,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  platform: string;
  platformName: string;
  platformColor: string;
  query: string;
  response: string;
  mentioned: boolean;
  mentionType: "direct" | "indirect" | "none";
  sentiment: "positive" | "neutral" | "negative" | "none";
  position: number | null;
  snippets: string[];
  competitors: string[];
  queryTime: number;
  isReal: boolean;
}

interface GeoAdvice {
  score: number;
  gap: string;
  strategies: Array<{
    type: string;
    title: string;
    description: string;
    template?: string;
    priority: "high" | "medium" | "low";
  }>;
  contentIdeas: string[];
  keywords: string[];
}

// ─── Highlight brand in text ──────────────────────────────────────────────────

function HighlightText({ text, brand }: { text: string; brand: string }) {
  if (!brand || !text) return <span>{text}</span>;
  if (!text.toLowerCase().includes(brand.toLowerCase())) return <span>{text}</span>;

  const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === brand.toLowerCase() ? (
          <mark key={i} className="bg-amber-400/25 text-amber-300 font-semibold rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-all"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "已复制" : "复制"}
    </button>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────

function ResultCard({ result, brand, index }: { result: SearchResult; brand: string; index: number }) {
  const [expanded, setExpanded] = useState(true);

  const sentimentColors: Record<string, string> = {
    positive: "text-emerald-400",
    neutral: "text-amber-400",
    negative: "text-red-400",
    none: "text-muted-foreground",
  };
  const sentimentLabels: Record<string, string> = {
    positive: "正面",
    neutral: "中立",
    negative: "负面",
    none: "—",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        "rounded-xl border overflow-hidden",
        result.mentioned
          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
          : "border-white/[0.07] bg-white/[0.01]"
      )}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Platform badge */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: result.platformColor }}
        >
          {result.platformName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{result.platformName}</span>
            {result.isReal ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                真实API
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                模拟数据
              </span>
            )}
            {result.mentioned ? (
              <>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 已提及
                </span>
                {result.mentionType === "direct" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-medium">
                    推荐提及
                  </span>
                )}
                <span className={cn("text-[10px] font-medium", sentimentColors[result.sentiment])}>
                  {sentimentLabels[result.sentiment]}评价
                </span>
              </>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-muted-foreground font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" /> 未提及
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Search className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
            <p className="text-xs text-muted-foreground italic truncate">{result.query}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <Clock className="w-3 h-3" />
            {(result.queryTime / 1000).toFixed(1)}s
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/[0.05]">
              {/* AI Full Response */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">AI 完整回复</span>
                  </div>
                  <CopyBtn text={result.response} />
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4">
                  <p className="text-sm text-foreground/85 leading-7 whitespace-pre-wrap">
                    <HighlightText text={result.response} brand={brand} />
                  </p>
                </div>
              </div>

              {/* Snippets */}
              {result.snippets.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    品牌提及片段
                  </p>
                  <div className="space-y-1.5">
                    {result.snippets.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs rounded-lg bg-primary/[0.04] border border-primary/10 px-3 py-2">
                        <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-foreground/70">「{s}」</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitors */}
              {result.competitors.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    AI 同时提及的竞品
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.competitors.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-red-500/5 text-red-400/70 border border-red-500/10">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Position */}
              {result.position && (
                <p className="mt-3 text-[10px] text-muted-foreground/50">
                  首次提及位置：第 {result.position} 句
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── GEO Strategy Card ────────────────────────────────────────────────────────

function StrategyCard({
  strategy,
  index,
}: {
  strategy: GeoAdvice["strategies"][0];
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const priorityConfig = {
    high: { label: "高优", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    medium: { label: "中优", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    low: { label: "参考", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  };
  const pc = priorityConfig[strategy.priority];

  const typeIcons: Record<string, React.ReactNode> = {
    authority: <Target className="w-4 h-4" />,
    content: <FileText className="w-4 h-4" />,
    keyword: <Search className="w-4 h-4" />,
    qa: <MessageSquare className="w-4 h-4" />,
    structure: <BookOpen className="w-4 h-4" />,
    insight: <Lightbulb className="w-4 h-4" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl border border-white/[0.07] bg-card p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {typeIcons[strategy.type] ?? <Lightbulb className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-foreground">{strategy.title}</h4>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium border", pc.bg, pc.color)}>
              {pc.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{strategy.description}</p>
        </div>
      </div>

      {strategy.template && (
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              内容模板
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(strategy.template!).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? "已复制" : "复制"}
            </button>
          </div>
          <p className="text-xs text-foreground/70 leading-relaxed italic whitespace-pre-wrap">{strategy.template}</p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SearchLabPage() {
  const [brandName, setBrandName] = useState("databash");
  const [keyword, setKeyword] = useState("数据分析工具");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [geoAdvice, setGeoAdvice] = useState<GeoAdvice | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "strategy">("results");
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [apiChecking, setApiChecking] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  // ── Check API status on mount ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch("/api/monitor")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const status: Record<string, boolean> = {};
        (data.platforms || []).forEach(
          (p: { platform: string; available: boolean }) => {
            status[p.platform] = p.available;
          }
        );
        setApiStatus(status);
        setApiChecking(false);
      })
      .catch(() => {
        if (!cancelled) setApiChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isMinimaxAvailable = apiStatus.minimax ?? false;

  // ── Search via MiniMax real API ──────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    if (!brandName.trim() || !keyword.trim()) return;

    setIsSearching(true);
    setResults([]);
    setGeoAdvice(null);
    setError(null);
    setActiveTab("results");

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: `lab-${brandName.toLowerCase().replace(/\s+/g, "-")}`,
          brandName: brandName.trim(),
          keywords: [keyword.trim()],
          platforms: ["minimax"],
        }),
        signal: abortRef.current.signal,
      });

      const data = await res.json();

      if (data.success && data.data.platformResults?.length > 0) {
        const mapped: SearchResult[] = data.data.platformResults.map(
          (pr: {
            platform: string;
            platformName: string;
            results: Array<{
              keyword: string;
              query: string;
              response: string;
              mentioned: boolean;
              mentionType: string;
              sentiment: string;
              position: number | null;
              snippets: string[];
              competitors: string[];
              queryTime: number;
            }>;
          }) => {
            const r = pr.results[0];
            return {
              platform: pr.platform,
              platformName: pr.platformName,
              platformColor: "#5C7CFA",
              query: r.query,
              response: r.response,
              mentioned: r.mentioned,
              mentionType: r.mentionType,
              sentiment: r.sentiment,
              position: r.position,
              snippets: r.snippets,
              competitors: r.competitors,
              queryTime: r.queryTime,
              isReal: apiStatus[pr.platform] ?? false,
            };
          }
        );
        setResults(mapped);

        // Auto-generate GEO advice after getting results
        setIsGeneratingAdvice(true);
        try {
          const adviceRes = await fetch("/api/geo-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              brandName: brandName.trim(),
              keyword: keyword.trim(),
              aiResponse: mapped[0]?.response ?? "",
              mentioned: mapped[0]?.mentioned ?? false,
              snippets: mapped[0]?.snippets ?? [],
              competitors: mapped[0]?.competitors ?? [],
            }),
          });
          const adviceData = await adviceRes.json();
          if (adviceData.success) {
            setGeoAdvice(adviceData.data);
          }
        } catch {
          // advice generation non-critical
        } finally {
          setIsGeneratingAdvice(false);
        }
      } else {
        setError(data.error || "查询失败，请检查 API Key 配置");
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== "AbortError") {
        setError("网络请求失败，请稍后重试");
      }
    } finally {
      setIsSearching(false);
    }
  }, [brandName, keyword, apiStatus]);

  const hasResults = results.length > 0;
  const mentionedCount = results.filter((r) => r.mentioned).length;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI 搜索实验室</h1>
          {!apiChecking && (
            isMinimaxAvailable ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MiniMax 真实 API
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                模拟数据模式
              </span>
            )
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-12">
          输入品牌名 + 关键词，直接向 MiniMax 发起真实查询，查看你的品牌是否被 AI 提及，并获取内容优化策略
        </p>
      </div>

      {/* ── API Key 警告 ── */}
      {!apiChecking && !isMinimaxAvailable && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-300 mb-1">
              MiniMax API Key 无效或未配置
            </p>
            <p className="text-xs text-amber-400/70 leading-relaxed">
              当前使用<strong>模拟数据</strong>展示，搜索结果为随机生成。
              获取有效 API Key 后，在 Vercel 环境变量中配置 <code className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px]">MINIMAX_API_KEY</code> 和 <code className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px]">MINIMAX_GROUP_ID</code> 即可激活真实 AI 查询。
            </p>
          </div>
        </div>
      )}

      {/* ── Search Box ── */}
      <div className="rounded-xl border border-white/[0.08] bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              品牌 / 产品名称
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="如：databash、蔚来、元气森林"
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              搜索关键词
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="如：数据分析工具、AI搜索优化、新能源汽车"
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>

        {/* Query preview */}
        {brandName && keyword && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-primary/[0.04] border border-primary/10 px-4 py-3">
            <Search className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">即将发送给 MiniMax 的查询问题：</p>
              <p className="text-sm text-foreground/90 font-medium">
                {keyword}领域，哪些品牌做得比较好？请推荐几个。
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={isSearching || !brandName.trim() || !keyword.trim()}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-semibold transition-all",
            isSearching || !brandName.trim() || !keyword.trim()
              ? "bg-white/[0.04] text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          )}
        >
          {isSearching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              正在向 MiniMax 发起真实查询...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              立即查询
            </>
          )}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isSearching && (
        <div className="rounded-xl border border-white/[0.06] bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/[0.06] rounded animate-pulse w-1/3" />
              <div className="h-3 bg-white/[0.04] rounded animate-pulse w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/[0.04] rounded animate-pulse" />
            <div className="h-3 bg-white/[0.04] rounded animate-pulse w-4/5" />
            <div className="h-3 bg-white/[0.04] rounded animate-pulse w-3/5" />
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <AnimatePresence>
        {hasResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Summary bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold",
                    mentionedCount > 0
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  )}
                >
                  {mentionedCount > 0 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {mentionedCount > 0
                    ? `"${brandName}" 已被 MiniMax 提及`
                    : `"${brandName}" 未被 MiniMax 提及`}
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03]">
                <button
                  onClick={() => setActiveTab("results")}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                    activeTab === "results" ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  AI 回复
                </button>
                <button
                  onClick={() => setActiveTab("strategy")}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 relative",
                    activeTab === "strategy" ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  内容优化策略
                  {isGeneratingAdvice && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                  {geoAdvice && (
                    <span className="px-1 py-0.5 rounded text-[9px] bg-primary/20 text-primary font-bold ml-1">
                      {geoAdvice.strategies.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* AI Results Tab */}
            {activeTab === "results" && (
              <div className="space-y-4">
                {results.map((r, i) => (
                  <ResultCard key={`${r.platform}-${i}`} result={r} brand={brandName} index={i} />
                ))}
              </div>
            )}

            {/* Strategy Tab */}
            {activeTab === "strategy" && (
              <div>
                {isGeneratingAdvice ? (
                  <div className="rounded-xl border border-white/[0.06] bg-card p-8 text-center">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">MiniMax 正在分析并生成内容优化策略...</p>
                    <p className="text-xs text-muted-foreground mt-1">基于你的品牌名称、关键词和 AI 搜索结果进行个性化分析</p>
                  </div>
                ) : geoAdvice ? (
                  <div className="space-y-4">
                    {/* Score overview */}
                    <div className="rounded-xl border border-white/[0.07] bg-card p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-card border border-white/[0.07] flex flex-col items-center justify-center">
                          <span className={cn(
                            "text-2xl font-bold",
                            geoAdvice.score >= 60 ? "text-emerald-400" : geoAdvice.score >= 30 ? "text-amber-400" : "text-red-400"
                          )}>
                            {geoAdvice.score}
                          </span>
                          <span className="text-[10px] text-muted-foreground">/ 100</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground mb-1">GEO 可见度评估</h3>
                          <p className="text-sm text-muted-foreground">{geoAdvice.gap}</p>
                        </div>
                      </div>

                      {/* Keywords */}
                      {geoAdvice.keywords.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/[0.05]">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            推荐强化的关键词
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {geoAdvice.keywords.map((k, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content ideas */}
                    {geoAdvice.contentIdeas.length > 0 && (
                      <div className="rounded-xl border border-white/[0.07] bg-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <h3 className="text-sm font-semibold text-foreground">立即可发布的内容方向</h3>
                        </div>
                        <div className="space-y-2">
                          {geoAdvice.contentIdeas.map((idea, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm">
                              <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-foreground/80">{idea}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategies */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        GEO 优化策略（{geoAdvice.strategies.length} 条）
                      </p>
                      <div className="space-y-3">
                        {geoAdvice.strategies.map((s, i) => (
                          <StrategyCard key={i} strategy={s} index={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/[0.06] bg-card p-8 text-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">先完成查询，再查看优化策略</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {!isSearching && !hasResults && !error && (
        <div className="rounded-xl border border-white/[0.06] bg-card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">开始 AI 搜索实验</h3>
          <p className="text-sm text-muted-foreground mb-2 max-w-xs mx-auto">
            输入你的品牌名和目标关键词，实时查询 MiniMax 是否提及你的品牌
          </p>
          <p className="text-xs text-muted-foreground/60">
            ✓ 真实 API 调用 · ✓ 完整 AI 回复 · ✓ GEO 内容策略生成
          </p>
        </div>
      )}
    </div>
  );
}
