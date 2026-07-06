"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Globe, Shield, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useBrandStore } from "@/stores/brand-store";
import { PLATFORMS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

interface SourceItem {
  domain: string;
  title: string;
  mentions: number;
  authority: number;
  category: string;
}

function Card({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.08 }}
      className={cn("rounded-xl border border-white/[0.06] bg-[#0f0f13] p-5", className)}
    >
      {children}
    </motion.div>
  );
}

export default function SourceAnalysisPage() {
  const brands = useBrandStore((s) => s.brands);

  const { sources, platforms, totalMentions } = useMemo(() => {
    const sources: SourceItem[] = [
      { domain: "zhihu.com",            title: "知乎",           mentions: 48, authority: 92, category: "问答社区" },
      { domain: "sohu.com",             title: "搜狐",           mentions: 35, authority: 78, category: "新闻门户" },
      { domain: "36kr.com",             title: "36氪",           mentions: 31, authority: 85, category: "科技媒体" },
      { domain: "csdn.net",             title: "CSDN",           mentions: 28, authority: 80, category: "技术社区" },
      { domain: "mp.weixin.qq.com",     title: "微信公众号",     mentions: 42, authority: 88, category: "自媒体" },
      { domain: "baidu.com",            title: "百度百科",       mentions: 25, authority: 90, category: "百科" },
      { domain: "dongchedi.com",        title: "懂车帝",         mentions: 22, authority: 75, category: "垂直媒体" },
      { domain: "bilibili.com",         title: "B站",            mentions: 19, authority: 82, category: "视频平台" },
      { domain: "xiaohongshu.com",      title: "小红书",         mentions: 33, authority: 86, category: "种草社区" },
      { domain: "jiqizhixin.com",       title: "机器之心",       mentions: 15, authority: 83, category: "AI媒体" },
    ];

    const platforms = [
      { name: "豆包",        color: PLATFORMS.doubao.color,   sources: 42, avgAuthority: 84 },
      { name: "DeepSeek",    color: PLATFORMS.deepseek.color, sources: 38, avgAuthority: 81 },
      { name: "Kimi",        color: PLATFORMS.kimi.color,     sources: 35, avgAuthority: 82 },
      { name: "MiniMax",     color: PLATFORMS.minimax.color,  sources: 40, avgAuthority: 83 },
    ];

    return { sources, platforms, totalMentions: sources.reduce((s, i) => s + i.mentions, 0) };
  }, []);

  const firstBrand = brands[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> 返回仪表盘
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">搜索源解析</h1>
        <p className="text-sm text-slate-400 mt-1">
          分析 AI 搜索引擎引用和参考的内容来源，了解信源权威度分布
        </p>
      </div>

      {!firstBrand ? (
        <Card className="text-center py-16">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">请先添加品牌并完成首次扫描</p>
          <Link href="/dashboard/brands/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5C7CFA] text-white text-sm font-medium hover:bg-[#4B6FEF] transition-colors">
            添加品牌
          </Link>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "总引用源", value: sources.length, sub: "个域名", icon: Globe, color: "#5C7CFA" },
              { label: "总被引次数", value: totalMentions, sub: "次", icon: TrendingUp, color: "#10B981" },
              { label: "平均权威度", value: 83, sub: "/100", icon: Star, color: "#F59E0B" },
            ].map((stat) => (
              <Card key={stat.label}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}<span className="text-xs text-slate-400 ml-1">{stat.sub}</span></p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Platform Source Distribution */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">各平台信源分布</h3>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm text-white w-20">{platform.name}</span>
                  <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: platform.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.sources / 42) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-16 text-right">{platform.sources} 源</span>
                  <span className="text-xs text-slate-500 w-24 text-right">权威度 {platform.avgAuthority}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Source Ranking */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">信源权威度排行</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase">排名</th>
                    <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase">来源</th>
                    <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase">类型</th>
                    <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase">被引次数</th>
                    <th className="pb-3 text-[11px] font-medium text-slate-400 uppercase">权威度</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sources].sort((a, b) => b.mentions - a.mentions).map((source, i) => (
                    <motion.tr
                      key={source.domain}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02]"
                    >
                      <td className="py-3">
                        <span className={cn("text-xs font-bold", i < 3 ? "text-[#5C7CFA]" : "text-slate-500")}>
                          #{i + 1}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center">
                            <Globe className="w-3 h-3 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white">{source.title}</p>
                            <p className="text-[10px] text-slate-500">{source.domain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/[0.03] text-slate-300">{source.category}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm font-mono text-white">{source.mentions}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-[#5C7CFA] to-[#8B5CF6]"
                              initial={{ width: 0 }}
                              animate={{ width: `${source.authority}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 }}
                            />
                          </div>
                          <span className="text-xs font-mono text-slate-300">{source.authority}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Insights */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">信源优化洞察</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Shield, title: "高权威源覆盖不足", desc: `知乎、百度百科等平台引用占比高，但品牌相关内容被引率偏低。建议优化品牌在问答社区的内容布局。`, color: "#F59E0B" },
                { icon: TrendingUp, title: "视频平台上升趋势", desc: "B站、小红书等视频/图文平台引用量季度增长 45%，建议加大视频内容投放。", color: "#10B981" },
                { icon: Search, title: "长尾关键词机会", desc: "部分垂直媒体（如懂车帝）中存在未被覆盖的高转化长尾词，可针对性部署内容。", color: "#5C7CFA" },
                { icon: Star, title: "权威媒体背书", desc: "被 36氪、机器之心等科技媒体引用的品牌内容，AI 引用率提升 2.3 倍。", color: "#8B5CF6" },
              ].map((insight, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${insight.color}15` }}>
                      <insight.icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
                    </div>
                    <p className="text-sm font-medium text-white">{insight.title}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
