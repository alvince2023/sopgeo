"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useBrandStore } from "@/stores/brand-store";
import { PLATFORMS } from "@/lib/utils/constants";
import type { Brand } from "@/types";

// Seeded random for stable mock data
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// Generate stable visibility data per brand
function getBrandVisData(brand: Brand) {
  const seed = brand.id + brand.name;
  const r = seededRandom(seed);
  const score = Math.floor(r * 40) + 45; // 45-85
  const trend = Math.floor((r - 0.3) * 20) / 2; // -3 to +7
  return { score, trend };
}

function BrandCard({ brand }: { brand: Brand }) {
  const removeBrand = useBrandStore((s) => s.removeBrand);
  const [menuOpen, setMenuOpen] = useState(false);
  const vis = useMemo(() => getBrandVisData(brand), [brand]);
  const isTrendUp = vis.trend > 0;
  const isTrendDown = vis.trend < 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-xl border border-white/[0.06] bg-[#0f0f13] hover:border-white/[0.1] transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C7CFA]/20 to-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 ring-1 ring-[#5C7CFA]/10">
              <span className="text-sm font-bold text-[#5C7CFA]">
                {brand.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <Link
                href={`/dashboard/brands/${brand.id}`}
                className="text-sm font-semibold text-white hover:text-[#5C7CFA] transition-colors truncate block"
              >
                {brand.name}
              </Link>
              <p className="text-xs text-slate-400 mt-0.5">
                {brand.industry || "未分类"}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute right-0 top-8 z-50 w-40 rounded-lg border border-white/[0.06] bg-[#0f0f13] shadow-xl p-1.5"
                >
                  <Link
                    href={`/dashboard/brands/${brand.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> 查看详情
                  </Link>
                  <Link
                    href={`/dashboard/brands/${brand.id}?edit=true`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> 编辑
                  </Link>
                  <button
                    onClick={() => {
                      removeBrand(brand.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 删除
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Description */}
        {brand.description && (
          <p className="text-xs text-slate-400 mt-3 line-clamp-2">
            {brand.description}
          </p>
        )}

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {brand.keywords?.slice(0, 4).map((kw) => (
            <span
              key={kw.id}
              className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-[11px] text-slate-400"
            >
              {kw.word}
            </span>
          ))}
          {brand.keywords && brand.keywords.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] text-slate-400/50">
              +{brand.keywords.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-5 py-3 bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Score */}
          <div>
            <span className="text-[11px] text-slate-400">可见度</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-white">
                {vis.score}
              </span>
              {isTrendUp ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : isTrendDown ? (
                <TrendingDown className="w-3 h-3 text-red-400" />
              ) : (
                <Minus className="w-3 h-3 text-slate-400" />
              )}
            </div>
          </div>
          {/* Platforms */}
          <div>
            <span className="text-[11px] text-slate-400">平台</span>
            <div className="flex items-center gap-1 mt-0.5">
              {brand.platforms?.slice(0, 4).map((p) => (
                <div
                  key={p.platform}
                  className="w-4 h-4 rounded-full ring-1 ring-white/20"
                  style={{
                    backgroundColor:
                      PLATFORMS[p.platform as keyof typeof PLATFORMS]?.color ||
                      "#6b7280",
                  }}
                  title={
                    PLATFORMS[p.platform as keyof typeof PLATFORMS]?.name
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <Link
          href={`/dashboard/brands/${brand.id}`}
          className="text-xs text-[#5C7CFA] hover:text-[#5C7CFA]/80 transition-colors"
        >
          详情
        </Link>
      </div>
    </motion.div>
  );
}

export default function BrandsPage() {
  const brands = useBrandStore((s) => s.brands);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.industry || "").toLowerCase().includes(q) ||
        b.keywords?.some((k) => k.word.toLowerCase().includes(q))
    );
  }, [brands, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            品牌管理
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            管理所有监控品牌，共 {brands.length} 个
          </p>
        </div>
        <Link
          href="/dashboard/brands/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#5C7CFA]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加品牌
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索品牌名称、行业、关键词..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/[0.06] text-xs text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
          <Filter className="w-3.5 h-3.5" />
          筛选
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/[0.06] text-xs text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5" />
          排序
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-white mb-1">
              未找到匹配的品牌
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              尝试调整搜索条件或添加新品牌
            </p>
            <Link
              href="/dashboard/brands/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#5C7CFA]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加品牌
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
