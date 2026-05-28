"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Plus,
  Zap,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useBrandStore } from "@/stores/brand-store";
import { PLATFORMS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

// ============================================================
// Seeded random for stable mock data
// ============================================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
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
          {/* Track */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress */}
          <motion.path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5C7CFA" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Score text */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white tracking-tight leading-none"
          >
            {score}
          </motion.span>
          <span className="text-[11px] text-slate-400 mt-0.5">/ 100</span>
        </div>
      </div>
      {/* Change indicator */}
      <div className="flex items-center gap-1.5 mt-1">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-medium">
          <TrendingUp className="w-3 h-3" />
          +{change}%
        </div>
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

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = pad + ((maxV - v) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${w},${height}`;

  return (
    <div style={{ width: "100%", height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill={`url(#spark-${color.replace("#", "")})`} points={areaPoints} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

// ============================================================
// Card shell
// ============================================================
function Card({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.08 }}
      className={cn(
        "rounded-xl border border-white/10 bg-slate-900/80 p-5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// Stat Card
// ============================================================
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: { direction: "up" | "down"; pct: number };
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-white tracking-tight leading-none">
              {value}
            </span>
            {sub && <span className="text-xs text-slate-400">{sub}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.direction === "up" ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span
                className={
                  trend.direction === "up" ? "text-xs font-medium text-emerald-400" : "text-xs font-medium text-red-400"
                }
              >
                {trend.direction === "up" ? "+" : "-"}
                {trend.pct}%
              </span>
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
// Platform Mini Card
// ============================================================
function PlatformMiniCard({
  name,
  color,
  score,
  trend,
  trendPercent,
  sparkData,
  queries,
}: {
  name: string;
  color: string;
  score: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  sparkData: number[];
  queries: number;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendClr =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400";
  const trendSign = trend === "up" ? "+" : trend === "down" ? "" : "";
  const absPct = Math.abs(trendPercent);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-white">{name}</span>
        <span className="text-[11px] text-slate-400 ml-auto">
          {queries} 次查询
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl font-bold text-white tracking-tight">{score}</span>
        <span className="text-xs text-slate-400">分</span>
        <div className={`flex items-center gap-0.5 ml-2 text-xs font-medium ${trendClr}`}>
          <TrendIcon className="w-3 h-3" />
          {trendSign}{absPct}%
        </div>
      </div>
      <Sparkline data={sparkData} color={color} height={32} />
    </Card>
  );
}

// ============================================================
// Activity Row
// ============================================================
function ActivityRow({
  brand,
  platform,
  action,
  time,
}: {
  brand: string;
  platform: string;
  action: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/90 truncate">
          <span className="font-medium">{brand}</span>
          <span className="text-slate-400"> · {platform}</span>
        </p>
        <p className="text-xs text-slate-400">{action}</p>
      </div>
      <span className="text-[11px] text-slate-400 flex-shrink-0">{time}</span>
    </div>
  );
}

// ============================================================
// Quick Action Button
// ============================================================
function QuickBtn({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// ============================================================
// Main Dashboard
// ============================================================
export default function DashboardPage() {
  const brands = useBrandStore((s) => s.brands);

  // Stable mock data
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
          <p className="text-sm text-slate-400 mt-0.5">
            品牌 AI 可见度总览 · 数据更新于 5 分钟前
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all">
            <RefreshCw className="w-4 h-4" />
            刷新数据
          </button>
          <Link
            href="/dashboard/brands/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5C7CFA] text-white text-sm font-medium hover:bg-[#4B6FEF] transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加品牌
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="监控品牌"
          value={brands.length || 2}
          sub="个品牌"
          icon={Building2}
          iconBg="bg-[#5C7CFA]"
        />
        <StatCard
          label="本月扫描"
          value={totalQueries.toLocaleString()}
          sub="次查询"
          icon={Eye}
          iconBg="bg-cyan-500"
          trend={{ direction: "up", pct: 12 }}
        />
        <StatCard
          label="平均可见度"
          value={avgScore}
          sub="分"
          icon={BarChart3}
          iconBg="bg-emerald-500"
          trend={{ direction: "up", pct: 5.8 }}
        />
        <StatCard
          label="待处理提醒"
          value={alertCount}
          sub="条"
          icon={AlertTriangle}
          iconBg="bg-amber-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Score Gauge */}
        <Card className="flex flex-col items-center justify-center py-7">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            综合可见度
          </p>
          <ScoreGauge score={avgScore} change={5.8} />
        </Card>

        {/* Platform Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <PlatformMiniCard
            name="豆包"
            color={PLATFORMS.doubao.color}
            score={72}
            trend="up"
            trendPercent={8.2}
            sparkData={sparkData.doubao}
            queries={340}
          />
          <PlatformMiniCard
            name="DeepSeek"
            color={PLATFORMS.deepseek.color}
            score={58}
            trend="up"
            trendPercent={3.5}
            sparkData={sparkData.deepseek}
            queries={290}
          />
          <PlatformMiniCard
            name="Kimi"
            color={PLATFORMS.kimi.color}
            score={63}
            trend="stable"
            trendPercent={0.3}
            sparkData={sparkData.kimi}
            queries={310}
          />
          <PlatformMiniCard
            name="文心一言"
            color={PLATFORMS.wenxin.color}
            score={51}
            trend="down"
            trendPercent={2.1}
            sparkData={sparkData.wenxin}
            queries={308}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">实时动态</h3>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                在线
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {activities.map((a, i) => (
                <ActivityRow key={i} {...a} />
              ))}
            </div>
            <Link
              href="/dashboard/monitor"
              className="flex items-center justify-center gap-1.5 mt-2 pt-3 border-t border-white/5 text-xs text-slate-400 hover:text-white transition-colors"
            >
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
          <Link
            href="/dashboard/brands"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            管理品牌 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {brands.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#5C7CFA]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-[#5C7CFA]" />
            </div>
            <p className="text-sm font-medium text-white mb-1">还没有添加品牌</p>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">
              添加你的第一个品牌，开始追踪在 AI 平台的可见度
            </p>
            <Link
              href="/dashboard/brands/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5C7CFA] text-white text-sm font-medium hover:bg-[#4B6FEF] transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加品牌
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
                    <tr
                      key={brand.id}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3">
                        <Link
                          href={`/dashboard/brands/${brand.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#5C7CFA]/15 flex items-center justify-center ring-1 ring-white/10">
                            <span className="text-xs font-bold text-[#5C7CFA]">
                              {brand.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-[#5C7CFA] transition-colors">
                              {brand.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {brand.keywords?.length || 0} 个关键词
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3">
                        <span className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                          {brand.industry || "未分类"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#5C7CFA] to-[#8B5CF6]"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-medium text-white">{score}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center -space-x-1">
                          {(brand.platforms || []).slice(0, 3).map((bp) => {
                            const key = (typeof bp === "string" ? bp : bp.platform) as keyof typeof PLATFORMS;
                            const info = PLATFORMS[key];
                            return info ? (
                              <div
                                key={key}
                                className="w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900"
                                style={{ backgroundColor: info.color }}
                                title={info.name}
                              >
                                <span className="text-[8px] font-bold text-white">
                                  {info.name.charAt(0)}
                                </span>
                              </div>
                            ) : null;
                          })}
                          {(brand.platforms || []).length > 3 && (
                            <div className="w-5 h-5 rounded-full bg-white/5 ring-2 ring-slate-900 flex items-center justify-center">
                              <span className="text-[8px] text-slate-400">
                                +{(brand.platforms || []).length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                            trend === "up"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : trend === "down"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-white/5 text-slate-400"
                          )}
                        >
                          <TrendIcon className="w-3 h-3" />
                          {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                          {trendPct}%
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
