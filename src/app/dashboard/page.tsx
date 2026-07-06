"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, Building2, BarChart3, AlertTriangle,
  ArrowRight, Plus, Zap, Eye, RefreshCw, Sparkles, Check, Loader2,
  Search, Lightbulb, Rocket, ChevronRight,
  X, Wand2,
} from "lucide-react";
import { useBrandStore } from "@/stores/brand-store";
import { PLATFORMS, PlatformKey, INDUSTRIES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import type { BrandFormData } from "@/types";

// ============================================================
// Seeded random for mock data
// ============================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ============================================================
// Score Gauge
// ============================================================
function ScoreGauge({ score, change }: { score: number; change: number }) {
  const r = 70;
  const circumference = Math.PI * r;
  const progress = Math.min(score / 100, 1);
  const offset = circumference * (1 - progress);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] h-[110px]">
        <svg width="200" height="110" viewBox="0 0 200 110">
          <path d="M 30 100 A 70 70 0 0 1 170 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
          <motion.path d="M 30 100 A 70 70 0 0 1 170 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: "easeOut" }} />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5C7CFA" /><stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white tracking-tight leading-none">{score}</motion.span>
          <span className="text-[11px] text-slate-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-medium">
          <TrendingUp className="w-3 h-3" />+{change}%</div>
        <span className="text-[11px] text-slate-400">较上周</span>
      </div>
    </div>
  );
}

// ============================================================
// Sparkline
// ============================================================
function Sparkline({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  const w = 100;
  const maxV = Math.max(...data, 1);
  const minV = Math.min(...data, 0);
  const range = maxV - minV || 1;
  const pad = 2;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${pad + ((maxV - v) / range) * (height - pad * 2)}`).join(" ");
  const areaPoints = `0,${height} ${points} ${w},${height}`;
  return (
    <div style={{ width: "100%", height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill={`url(#spark-${color.replace("#", "")})`} points={areaPoints} />
        <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    </div>
  );
}

// ============================================================
// Card Shell
// ============================================================
function Card({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.08 }}
      className={cn("rounded-xl border border-white/10 bg-slate-900/80 p-5", className)}>
      {children}
    </motion.div>
  );
}

// ============================================================
// StatCard
// ============================================================
function StatCard({ label, value, sub, icon: Icon, iconBg, trend }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; iconBg: string;
  trend?: { direction: "up" | "down"; pct: number };
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-white tracking-tight leading-none">{value}</span>
            {sub && <span className="text-xs text-slate-400">{sub}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.direction === "up" ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
              <span className={trend.direction === "up" ? "text-xs font-medium text-emerald-400" : "text-xs font-medium text-red-400"}>
                {trend.direction === "up" ? "+" : "-"}{trend.pct}%</span>
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// PlatformMiniCard
// ============================================================
function PlatformMiniCard({ name, color, score, trend, trendPercent, sparkData, queries }: {
  name: string; color: string; score: number; trend: "up" | "down" | "stable"; trendPercent: number; sparkData: number[]; queries: number;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendClr = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400";
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-white">{name}</span>
        <span className="text-[11px] text-slate-400 ml-auto">{queries} 次查询</span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl font-bold text-white tracking-tight">{score}</span>
        <span className="text-xs text-slate-400">分</span>
        <div className={`flex items-center gap-0.5 ml-2 text-xs font-medium ${trendClr}`}>
          <TrendIcon className="w-3 h-3" />{trend === "up" ? "+" : trend === "down" ? "" : ""}{Math.abs(trendPercent)}%
        </div>
      </div>
      <Sparkline data={sparkData} color={color} height={32} />
    </Card>
  );
}

// ============================================================
// QuickBtn
// ============================================================
function QuickBtn({ icon: Icon, label, href, color }: { icon: React.ElementType; label: string; href: string; color: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: color }}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// ============================================================
// ONBOARDING WIZARD
// ============================================================
const ONBOARDING_STEPS = ["品牌信息", "智能推荐关键词", "选择平台", "启动扫描"] as const;

interface OnboardingData {
  name: string;
  website: string;
  industry: string;
  description: string;
  keywords: string[];
  platforms: string[];
}

function OnboardingWizard({ onComplete }: { onComplete: (brandId: string) => void }) {
  const createBrand = useBrandStore((s) => s.createBrand);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<OnboardingData>({
    name: "",
    website: "",
    industry: "",
    description: "",
    keywords: [""],
    platforms: Object.keys(PLATFORMS).filter(k => PLATFORMS[k as PlatformKey].priority === 0),
  });

  const updateField = (field: keyof OnboardingData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  // Fetch keyword recommendations from API
  const fetchRecommendations = async () => {
    const brandName = data.name.trim();
    const website = data.website.trim();
    if (!brandName) {
      setError("请先填写品牌名称");
      return;
    }
    setIsLoadingKeywords(true);
    try {
      const res = await fetch("/api/keyword-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: website || undefined,
          brandName: brandName,
          industry: data.industry || undefined,
        }),
      });
      if (res.ok) {
        const { data: rd } = await res.json();
        setData(prev => ({ ...prev, keywords: rd.keywords }));
      } else {
        // Fallback to generic keywords
        const kw = [
          `${brandName}怎么样`, `${brandName}推荐吗`, `${brandName}和竞品对比`,
          `${brandName}性价比`, `${brandName}用户评价`, `${brandName}口碑`,
          `${brandName}优缺点`, `${brandName}靠谱吗`, `${brandName}选购指南`,
          `${brandName}哪个系列好`, `${brandName}值得买吗`, `${brandName}使用体验`,
          `${brandName}售后服务`, `${brandName}最新消息`, `${brandName}品牌排行`,
          `${brandName}新品`, `${brandName}质量如何`, `${brandName}价格贵吗`,
          `${brandName}适合新手吗`, `${brandName}评测`,
        ];
        setData(prev => ({ ...prev, keywords: kw }));
      }
    } catch {
      // Fallback
      const kw = [
        `${brandName}怎么样`, `${brandName}推荐吗`, `${brandName}和竞品对比`,
        `${brandName}性价比`, `${brandName}用户评价`, `${brandName}口碑`,
        `${brandName}优缺点`, `${brandName}靠谱吗`, `${brandName}选购指南`,
        `${brandName}哪个系列好`, `${brandName}值得买吗`, `${brandName}使用体验`,
        `${brandName}售后服务`, `${brandName}最新消息`, `${brandName}品牌排行`,
        `${brandName}新品`, `${brandName}质量如何`, `${brandName}价格贵吗`,
        `${brandName}适合新手吗`, `${brandName}评测`,
      ];
      setData(prev => ({ ...prev, keywords: kw }));
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  const addKeyword = () => {
    if (data.keywords.length < 20) {
      setData(prev => ({ ...prev, keywords: [...prev.keywords, ""] }));
    }
  };

  const updateKeyword = (idx: number, value: string) => {
    const newKw = [...data.keywords];
    newKw[idx] = value;
    setData(prev => ({ ...prev, keywords: newKw }));
  };

  const removeKeyword = (idx: number) => {
    if (data.keywords.length > 1) {
      setData(prev => ({ ...prev, keywords: data.keywords.filter((_, i) => i !== idx) }));
    }
  };

  const togglePlatform = (key: string) => {
    const platforms = [...data.platforms];
    if (platforms.includes(key)) {
      if (platforms.length > 1) {
        setData(prev => ({ ...prev, platforms: platforms.filter(p => p !== key) }));
      }
    } else {
      setData(prev => ({ ...prev, platforms: [...platforms, key] }));
    }
  };

  const nextStep = () => {
    if (step === 0) {
      if (!data.name.trim() || data.name.trim().length < 2) {
        setError("品牌名称至少需要 2 个字符");
        return;
      }
      // Auto-fetch recommendations when going to keyword step
      setStep(1);
      if (data.keywords.length <= 1 || data.keywords[0] === "") {
        fetchRecommendations();
      }
      return;
    }
    if (step === 1) {
      const validKw = data.keywords.filter(k => k.trim());
      if (validKw.length === 0) {
        setError("请至少输入一个监控关键词");
        return;
      }
      setData(prev => ({ ...prev, keywords: validKw }));
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setError("");
    setStep(s => Math.max(s - 1, 0));
  };

  const handleCreate = async () => {
    const validKw = data.keywords.filter(k => k.trim());
    if (validKw.length === 0) {
      setError("请至少输入一个监控关键词");
      setStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      const formData: BrandFormData = {
        name: data.name.trim(),
        website: data.website.trim() || undefined,
        industry: data.industry || undefined,
        description: data.description.trim() || undefined,
        keywords: validKw,
        platforms: data.platforms,
      };
      const brand = await createBrand(formData);
      setStep(3); // Go to scanning step
      // After brief delay to show scanning anim, complete
      setTimeout(() => {
        onComplete(brand.id);
      }, 2000);
    } catch (err) {
      setError(`创建失败: ${err instanceof Error ? err.message : "未知错误"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5C7CFA]/10 text-[#5C7CFA] text-xs font-medium mb-4">
          <Rocket className="w-3.5 h-3.5" />
          快速开始
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">开启 AI 可见度监控</h2>
        <p className="text-sm text-slate-400 mt-2">只需 4 步，让品牌在 AI 搜索中被看见</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {ONBOARDING_STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              i === step ? "bg-[#5C7CFA]/10 text-[#5C7CFA]" :
              i < step ? "bg-emerald-500/10 text-emerald-400" :
              "bg-white/[0.03] text-slate-400"
            )}>
              {i < step ? <Check className="w-3.5 h-3.5" /> :
               <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
              {label}
            </div>
            {i < 3 && <div className={cn("w-6 h-px", i < step ? "bg-emerald-500/30" : "bg-white/[0.06]")} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Brand Info */}
        {step === 0 && (
          <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">品牌名称 <span className="text-red-400">*</span></label>
                <input value={data.name} onChange={e => updateField("name", e.target.value)}
                  placeholder="例如：蔚来汽车" className={cn(
                    "w-full px-4 py-2.5 bg-white/[0.03] border rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all",
                    error && !data.name.trim() ? "border-red-500/50" : "border-white/[0.06]"
                  )} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">官网域名</label>
                <input value={data.website} onChange={e => updateField("website", e.target.value)}
                  placeholder="https://example.com" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all" />
                <p className="text-[10px] text-slate-500 mt-1">填写域名后，系统将基于网站内容智能推荐监控关键词</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">所属行业</label>
                <select value={data.industry} onChange={e => updateField("industry", e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all appearance-none cursor-pointer">
                  <option value="">请选择行业</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">品牌描述（选填）</label>
                <textarea value={data.description} onChange={e => updateField("description", e.target.value)}
                  placeholder="简要描述品牌定位和核心业务..." rows={2}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all resize-none" />
              </div>
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <div className="flex justify-end">
              <button onClick={nextStep} className="px-6 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#4B6FEF] transition-colors">
                下一步：智能推荐关键词
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: AI-recommended Keywords */}
        {step === 1 && (
          <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">监控关键词 ({data.keywords.filter(k => k.trim()).length}/20)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isLoadingKeywords ? "AI 正在分析品牌，生成推荐关键词..." : "系统基于品牌信息推荐了以下关键词，您可以编辑、删除或添加"}
                    </p>
                  </div>
                  <button onClick={fetchRecommendations} disabled={isLoadingKeywords}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5C7CFA]/10 text-[#5C7CFA] text-xs font-medium hover:bg-[#5C7CFA]/20 disabled:opacity-50 transition-colors">
                    {isLoadingKeywords ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    {isLoadingKeywords ? "生成中..." : "重新生成"}
                  </button>
                </div>

                {isLoadingKeywords ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#5C7CFA] mb-4" />
                    <p className="text-sm text-white font-medium">AI 正在分析 &ldquo;{data.name}&rdquo;</p>
                    <p className="text-xs text-slate-400 mt-1">基于品牌名称、官网和行业信息，智能生成监控关键词...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.keywords.map((kw, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <input value={kw} onChange={e => updateKeyword(idx, e.target.value)}
                          placeholder={`关键词 ${idx + 1}`}
                          className={cn("flex-1 px-3 py-2 bg-white/[0.03] border rounded-lg text-xs text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-1 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all",
                            "border-white/[0.06]")} />
                        {data.keywords.length > 1 && (
                          <button onClick={() => removeKeyword(idx)}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {data.keywords.length < 20 && (
                      <button onClick={addKeyword}
                        className="flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-white/[0.08] rounded-lg text-xs text-slate-400 hover:text-[#5C7CFA] hover:border-[#5C7CFA]/20 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> 添加关键词
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">上一步</button>
              <button onClick={nextStep} className="px-6 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#4B6FEF] transition-colors">
                下一步：选择平台
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Platform Selection */}
        {step === 2 && (
          <motion.div key="step-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">选择 AI 搜索平台 <span className="text-red-400">*</span></h3>
                <p className="text-xs text-slate-400 mb-4">默认选择主流平台，覆盖 {data.platforms.length > 3 ? "超过" : ""}{data.platforms.length} 个 AI 搜索引擎</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(PLATFORMS).map(([key, platform]) => {
                    const isSelected = data.platforms.includes(key);
                    return (
                      <button key={key} type="button" onClick={() => togglePlatform(key)}
                        className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                          isSelected ? "border-[#5C7CFA]/50 bg-[#5C7CFA]/5" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]")}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${platform.color}15`, color: platform.color }}>
                          <span className="text-sm font-bold">{platform.name.charAt(0)}</span>
                        </div>
                        <p className={cn("text-xs font-medium", isSelected ? "text-white" : "text-slate-400")}>{platform.name}</p>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#5C7CFA]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-lg bg-[#5C7CFA]/5 border border-[#5C7CFA]/10">
                <p className="text-xs text-slate-300">
                  <span className="text-[#5C7CFA] font-medium">预览：</span>
                  将对 &ldquo;<span className="text-white">{data.name || "品牌"}</span>&rdquo; 的{" "}
                  <span className="text-white">{data.keywords.filter(k => k.trim()).length}</span> 个关键词，
                  在 <span className="text-white">{data.platforms.length}</span> 个 AI 平台上进行首次扫描，
                  预计耗时 <span className="text-white">3-5 分钟</span>
                </p>
              </div>
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">上一步</button>
              <button onClick={handleCreate} disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#4B6FEF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "创建中..." : "启动扫描"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Scanning Animation */}
        {step === 3 && (
          <motion.div key="step-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-[#5C7CFA]/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 animate-spin text-[#5C7CFA]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">正在启动 AI 扫描...</h3>
            <p className="text-sm text-slate-400 mb-6">
              正在对 &ldquo;{data.name}&rdquo; 在 {data.platforms.length} 个 AI 平台进行首次数据扫描
            </p>
            <div className="max-w-sm mx-auto space-y-2">
              {[
                { label: "创建品牌配置", done: true },
                { label: "初始化监控引擎", done: true },
                { label: "发送 AI 搜索查询", done: false },
                { label: "分析搜索结果", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-[#5C7CFA] flex-shrink-0" />
                  )}
                  <span className={cn("text-sm", item.done ? "text-slate-300" : "text-white")}>{item.label}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">{item.done ? "完成" : "进行中..."}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-6">扫描完成后将自动跳转到仪表盘</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Post-Onboarding Guidance (brand exists, just created)
// ============================================================
function PostOnboardingGuidance({ brandId }: { brandId: string }) {
  const brands = useBrandStore((s) => s.brands);
  const monitorStatus = useBrandStore((s) => s.monitorStatus);
  const monitorResults = useBrandStore((s) => s.monitorResults);
  const brand = brands.find(b => b.id === brandId);
  const status = monitorStatus[brandId] || "idle";

  if (!brand) return null;

  const results = monitorResults[brandId] || [];
  const hasResults = results.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-[#5C7CFA]/10 to-[#8B5CF6]/10 border border-[#5C7CFA]/20 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">品牌创建成功！</h3>
        <p className="text-sm text-slate-300">
          &ldquo;{brand.name}&rdquo; 已在 {brand.platforms?.length || 0} 个 AI 平台
          {status === "running" ? "启动监控扫描" : hasResults ? "完成首次扫描" : "等待首次扫描"}
        </p>
      </motion.div>

      {/* Next Steps Guide */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6">
        <h3 className="text-sm font-semibold text-white mb-4">接下来做什么？</h3>
        <div className="space-y-3">
          {/* Step 1 */}
          <Link href={`/dashboard/brands/${brandId}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-[#5C7CFA]/20 hover:bg-[#5C7CFA]/[0.03] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#5C7CFA]/10 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-[#5C7CFA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-[#5C7CFA] transition-colors">查看品牌监控详情</p>
              <p className="text-xs text-slate-400">查看各平台 AI 可见度评分、排名变化和查询记录</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#5C7CFA] transition-colors flex-shrink-0" />
          </Link>

          {/* Step 2 */}
          <Link href="/dashboard/source-analysis"
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">搜索源解析</p>
              <p className="text-xs text-slate-400">分析 AI 搜索结果引用来源，了解哪些网站影响你的品牌可见度</p>
            </div>
            <div className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">推荐</div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
          </Link>

          {/* Step 3 */}
          <Link href="/dashboard/content-optimization"
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">内容优化工作台</p>
              <p className="text-xs text-slate-400">获取基于 AI 搜索分析的 GEO 内容优化建议，提升可见度排名</p>
            </div>
            <div className="flex-shrink-0 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-medium">推荐</div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD PAGE
// ============================================================
export default function DashboardPage() {
  const brands = useBrandStore((s) => s.brands);
  const [onboardingState, setOnboardingState] = useState<"idle" | "onboarding" | "guidance">("idle");
  const [guidedBrandId, setGuidedBrandId] = useState<string | null>(null);

  // Determine mode based on brands
  useEffect(() => {
    if (brands.length === 0) {
      setOnboardingState("onboarding");
    } else if (!guidedBrandId) {
      // Check if any brand was just created (within last 30 seconds)
      const recentBrand = brands.find(b => {
        const created = new Date(b.createdAt).getTime();
        return Date.now() - created < 60000; // 1 minute
      });
      if (recentBrand) {
        setGuidedBrandId(recentBrand.id);
        setOnboardingState("guidance");
      } else {
        setOnboardingState("idle");
      }
    }
  }, [brands, guidedBrandId]);

  const handleOnboardingComplete = useCallback((brandId: string) => {
    setGuidedBrandId(brandId);
    setOnboardingState("guidance");
  }, []);

  const dismissGuidance = () => {
    setOnboardingState("idle");
  };

  // If showing post-onboarding guidance
  if (onboardingState === "guidance" && guidedBrandId) {
    return (
      <div className="space-y-4">
        <PostOnboardingGuidance brandId={guidedBrandId} />
        <div className="text-center">
          <button onClick={dismissGuidance}
            className="text-xs text-slate-500 hover:text-white transition-colors">
            完成引导，查看完整仪表盘
          </button>
        </div>
      </div>
    );
  }

  // If onboarding (no brands)
  if (onboardingState === "onboarding") {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // ========== NORMAL DASHBOARD MODE ==========
  return <NormalDashboard brands={brands} />;
}

// ============================================================
// NORMAL DASHBOARD (always renders hooks unconditionally)
// ============================================================
function NormalDashboard({ brands }: { brands: ReturnType<typeof useBrandStore.getState>["brands"] }) {
  const { sparkData, brandScores, activities } = useMemo(() => {
    const rng1 = seededRandom(42);
    const rng2 = seededRandom(137);
    const rng3 = seededRandom(256);
    const sparkData = {
      doubao: Array.from({ length: 12 }, () => 55 + rng1() * 35),
      deepseek: Array.from({ length: 12 }, () => 40 + rng2() * 35),
      kimi: Array.from({ length: 12 }, () => 48 + rng3() * 30),
      wenxin: Array.from({ length: 12 }, () => 38 + rng1() * 28),
    };
    const brandScores = [78, 62, 55, 71, 49];
    const activities = [
      { brand: "蔚来汽车", platform: "豆包", action: "可见度 +3.2%", time: "10 分钟前" },
      { brand: "元气森林", platform: "DeepSeek", action: "新提及检测", time: "28 分钟前" },
      { brand: "蔚来汽车", platform: "Kimi", action: "排名下降告警", time: "1 小时前" },
      { brand: "元气森林", platform: "文心一言", action: "全量扫描完成", time: "2 小时前" },
      { brand: "蔚来汽车", platform: "豆包", action: "新增 3 个关键词", time: "3 小时前" },
      { brand: "元气森林", platform: "DeepSeek", action: "月度报告已生成", time: "5 小时前" },
    ];
    return { sparkData, brandScores, activities };
  }, []);

  const avgScore = 62;
  const totalQueries = 1248;
  const alertCount = 2;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">仪表盘</h1>
          <p className="text-sm text-slate-400 mt-0.5">品牌 AI 可见度总览 · 数据更新于 5 分钟前</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all">
            <RefreshCw className="w-4 h-4" /> 刷新数据
          </button>
          <Link href="/dashboard/brands/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5C7CFA] text-white text-sm font-medium hover:bg-[#4B6FEF] transition-colors">
            <Plus className="w-4 h-4" /> 添加品牌
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="监控品牌" value={brands.length || 2} sub="个品牌" icon={Building2} iconBg="bg-[#5C7CFA]" />
        <StatCard label="本月扫描" value={totalQueries.toLocaleString()} sub="次查询" icon={Eye} iconBg="bg-cyan-500" trend={{ direction: "up", pct: 12 }} />
        <StatCard label="平均可见度" value={avgScore} sub="分" icon={BarChart3} iconBg="bg-emerald-500" trend={{ direction: "up", pct: 5.8 }} />
        <StatCard label="待处理提醒" value={alertCount} sub="条" icon={AlertTriangle} iconBg="bg-amber-500" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center py-7">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">综合可见度</p>
          <ScoreGauge score={avgScore} change={5.8} />
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <PlatformMiniCard name="豆包" color={PLATFORMS.doubao.color} score={72} trend="up" trendPercent={8.2} sparkData={sparkData.doubao} queries={340} />
          <PlatformMiniCard name="DeepSeek" color={PLATFORMS.deepseek.color} score={58} trend="up" trendPercent={3.5} sparkData={sparkData.deepseek} queries={290} />
          <PlatformMiniCard name="Kimi" color={PLATFORMS.kimi.color} score={63} trend="stable" trendPercent={0.3} sparkData={sparkData.kimi} queries={310} />
          <PlatformMiniCard name="文心一言" color={PLATFORMS.wenxin.color} score={51} trend="down" trendPercent={2.1} sparkData={sparkData.wenxin} queries={308} />
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">实时动态</h3>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 在线
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate"><span className="font-medium">{a.brand}</span><span className="text-slate-400"> · {a.platform}</span></p>
                    <p className="text-xs text-slate-400">{a.action}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/monitor" className="flex items-center justify-center gap-1.5 mt-2 pt-3 border-t border-white/5 text-xs text-slate-400 hover:text-white transition-colors">
              查看全部 <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">快捷操作</h3>
            <div className="space-y-1.5">
              <QuickBtn icon={Plus} label="新建品牌" href="/dashboard/brands/new" color="#5C7CFA" />
              <QuickBtn icon={Zap} label="立即扫描" href="/dashboard/monitor" color="#F59E0B" />
              <QuickBtn icon={BarChart3} label="生成报告" href="/dashboard/reports" color="#10B981" />
              <QuickBtn icon={TrendingUp} label="竞品分析" href="/dashboard/competitors" color="#06B6D4" />
            </div>
          </Card>
        </div>
      </div>

      {/* Brand Table */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">我的品牌</h3>
          <Link href="/dashboard/brands" className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
            管理品牌 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {brands.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#5C7CFA]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-[#5C7CFA]" />
            </div>
            <p className="text-sm font-medium text-white mb-1">还没有添加品牌</p>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">添加你的第一个品牌，开始追踪在 AI 平台的可见度</p>
            <Link href="/dashboard/brands/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5C7CFA] text-white text-sm font-medium hover:bg-[#4B6FEF] transition-colors">
              <Plus className="w-4 h-4" /> 添加品牌
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">品牌</th>
                  <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">行业</th>
                  <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">可见度</th>
                  <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">监控平台</th>
                  <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">趋势</th>
                </tr>
              </thead>
              <tbody>
                {brands.slice(0, 6).map((brand, i) => {
                  const score = brandScores[i % brandScores.length];
                  const trends: Array<"up" | "down" | "stable"> = ["up", "up", "down", "stable", "up", "down"];
                  const trend = trends[i % trends.length];
                  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
                  const trendPct = 3 + Math.floor(i * 2.7);
                  return (
                    <tr key={brand.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <Link href={`/dashboard/brands/${brand.id}`} className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-lg bg-[#5C7CFA]/15 flex items-center justify-center ring-1 ring-white/10">
                            <span className="text-xs font-bold text-[#5C7CFA]">{brand.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-[#5C7CFA] transition-colors">{brand.name}</p>
                            <p className="text-[11px] text-slate-400">{brand.keywords?.length || 0} 个关键词</p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3"><span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded">{brand.industry || "未分类"}</span></td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#5C7CFA] to-[#8B5CF6]" style={{ width: `${score}%` }} />
                          </div>
                          <span className="text-xs font-mono font-medium text-white">{score}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center -space-x-1">
                          {(brand.platforms || []).slice(0, 3).map((bp) => {
                            const key = (typeof bp === "string" ? bp : bp.platform) as PlatformKey;
                            const info = PLATFORMS[key];
                            return info ? (
                              <div key={key} className="w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900" style={{ backgroundColor: info.color }} title={info.name}>
                                <span className="text-[8px] font-bold text-white">{info.name.charAt(0)}</span>
                              </div>
                            ) : null;
                          })}
                          {(brand.platforms || []).length > 3 && (
                            <div className="w-5 h-5 rounded-full bg-white/5 ring-2 ring-slate-900 flex items-center justify-center">
                              <span className="text-[8px] text-slate-400">+{(brand.platforms || []).length - 3}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                          trend === "up" ? "bg-emerald-400/10 text-emerald-400" : trend === "down" ? "bg-red-400/10 text-red-400" : "bg-white/5 text-slate-400")}>
                          <TrendIcon className="w-3 h-3" />{trend === "up" ? "+" : trend === "down" ? "-" : ""}{trendPct}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
