"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowDownToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Types ----
interface Report {
  id: string;
  title: string;
  brandName: string;
  period: string;
  generatedAt: string;
  overallScore: number;
  scoreChange: number;
  summary: string;
  highlights: string[];
  warnings: string[];
  status: "ready" | "generating";
}

const MOCK_REPORTS: Report[] = [
  {
    id: "rpt-001",
    title: "AI可见度周报 · 5月第3周",
    brandName: "SopGeo",
    period: "2026-05-18 ~ 2026-05-24",
    generatedAt: "2026-05-25 08:30",
    overallScore: 62,
    scoreChange: 5.8,
    summary:
      "本周SopGeo在4个AI平台上的综合可见度为62分（良好），较上周提升5.8分。豆包平台表现突出（72分），文心一言仍有较大提升空间（51分）。",
    highlights: [
      "豆包平台可见度达到72分，保持领先优势",
      "DeepSeek获得3.5分增长，提及率提升至48%",
      "共被AI搜索结果中提及87次，其中直接推荐23次",
    ],
    warnings: [
      "文心一言平台得分下降2.3分，建议检查内容相关性",
      "竞品AI优品牌在Kimi平台表现优于你8分",
    ],
    status: "ready",
  },
  {
    id: "rpt-002",
    title: "AI可见度月报 · 2026年5月",
    brandName: "SopGeo",
    period: "2026-05-01 ~ 2026-05-25",
    generatedAt: "2026-05-25 09:15",
    overallScore: 59,
    scoreChange: 4.2,
    summary:
      "5月整体可见度呈上升趋势，月底综合评分为59分。各平台表现分化，豆包平台显著优于其他平台，建议加强多平台均衡布局。",
    highlights: [
      "本月可见度总分环比提升4.2分",
      "豆包平台持续领先，本月平均得分68分",
      "关键词覆盖率从45%提升至58%",
    ],
    warnings: [
      "文心一言连续3周评分低于55分，需要专项优化",
      "竞品整体评分提升速度快于我司（+4.2 vs +5.1）",
    ],
    status: "ready",
  },
];

export default function ReportsPage() {
  const [reports] = useState(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleDownload = (report: Report) => {
    alert(`模拟下载: ${report.title}.pdf`);
  };

  const handleGenerate = () => {
    alert("模拟生成新报告...");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            分析报告
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI 可见度趋势分析与品牌优化建议
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <FileText className="w-4 h-4" />
          生成新报告
        </button>
      </div>

      {/* Report list or detail */}
      {selectedReport ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            ← 返回报告列表
          </button>

          {/* Report detail */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title card */}
            <div className="rounded-xl border border-white/[0.06] bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {selectedReport.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedReport.period}
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <Clock className="w-3.5 h-3.5" />
                    生成于 {selectedReport.generatedAt}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(selectedReport)}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] transition-colors"
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedReport.overallScore}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    综合AI可见度评分
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedReport.scoreChange > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        selectedReport.scoreChange > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      )}
                    >
                      {selectedReport.scoreChange > 0 ? "+" : ""}
                      {selectedReport.scoreChange} vs 上期
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="rounded-lg bg-white/[0.02] p-4 border border-white/[0.04]">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  AI 摘要
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>
            </div>

            {/* Highlights & Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  亮点表现
                </h3>
                <ul className="space-y-2">
                  {selectedReport.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-emerald-400 mt-1.5">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  需关注
                </h3>
                <ul className="space-y-2">
                  {selectedReport.warnings.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-amber-400 mt-1.5">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(selectedReport)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ArrowDownToLine className="w-4 h-4" />
                下载 PDF 报告
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] text-foreground rounded-lg text-sm font-medium hover:bg-white/[0.06] transition-colors">
                <Eye className="w-4 h-4" />
                在线预览
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Report List */
        <div className="space-y-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-white/[0.06] bg-card p-5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <FileText className="w-6 h-6 text-primary/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{report.brandName}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{report.period}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{report.generatedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {report.overallScore}
                    </p>
                    <div className="flex items-center gap-1">
                      {report.scoreChange > 0 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          report.scoreChange > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        )}
                      >
                        {report.scoreChange > 0 ? "+" : ""}
                        {report.scoreChange}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(report);
                      }}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report templates */}
      {!selectedReport && (
        <div className="rounded-xl border border-white/[0.06] bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            报告模板
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "周报模板",
                desc: "每周AI可见度变化概览",
                icon: Calendar,
              },
              {
                title: "月报模板",
                desc: "月度趋势分析与竞品对比",
                icon: TrendingUp,
              },
              {
                title: "专项报告",
                desc: "针对特定平台或关键词的深度分析",
                icon: AlertCircle,
              },
            ].map((tpl) => (
              <div
                key={tpl.title}
                className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 hover:border-white/[0.08] transition-all cursor-pointer"
              >
                <tpl.icon className="w-5 h-5 text-primary/60 mb-3" />
                <h3 className="text-sm font-medium text-foreground">
                  {tpl.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{tpl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
