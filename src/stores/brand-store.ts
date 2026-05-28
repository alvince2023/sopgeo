"use client";

import { create } from "zustand";
import type { Brand, BrandFormData, PlatformKey } from "@/types";
import type { MonitorJobResult } from "@/lib/monitor/engine";
import type { GeoStrategyReport } from "@/lib/monitor/geo-strategy";

interface BrandStore {
  // State
  brands: Brand[];
  selectedBrand: Brand | null;
  isLoading: boolean;
  error: string | null;
  // Monitor results: brandId → results per platform
  monitorResults: Record<string, MonitorJobResult[]>;
  monitorStatus: Record<string, "idle" | "running" | "done" | "error">;
  // GEO strategy reports: brandId → GeoStrategyReport
  geoReports: Record<string, GeoStrategyReport>;

  // Actions
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, data: Partial<Brand>) => void;
  removeBrand: (id: string) => void;
  selectBrand: (brand: Brand | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Monitor actions
  runMonitorForBrand: (brandId: string) => Promise<void>;
  setMonitorResults: (brandId: string, results: MonitorJobResult[]) => void;
  setMonitorStatus: (
    brandId: string,
    status: "idle" | "running" | "done" | "error"
  ) => void;
  setGeoReport: (brandId: string, report: GeoStrategyReport) => void;

  // Mock CRUD (will be replaced with Supabase calls)
  createBrand: (data: BrandFormData) => Promise<Brand>;
  deleteBrand: (id: string) => Promise<void>;
}

// Mock data for development
const mockBrands: Brand[] = [
  {
    id: "brand-001",
    userId: "user-001",
    name: "蔚来汽车",
    website: "https://nio.com",
    industry: "汽车出行",
    description: "中国高端智能电动汽车品牌",
    status: "active",
    keywords: [
      { id: "kw-1", brandId: "brand-001", word: "电动车推荐", category: "recommendation", priority: 10 },
      { id: "kw-2", brandId: "brand-001", word: "智能驾驶", category: "knowledge", priority: 8 },
      { id: "kw-3", brandId: "brand-001", word: "蔚来换电", category: "brand", priority: 9 },
    ],
    platforms: [
      { platform: "doubao", enabled: true },
      { platform: "deepseek", enabled: true },
      { platform: "kimi", enabled: true },
      { platform: "wenxin", enabled: true },
    ],
    createdAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-05-24T10:00:00Z",
  },
  {
    id: "brand-002",
    userId: "user-001",
    name: "元气森林",
    website: "https://genkiforest.com",
    industry: "电商零售",
    description: "新式健康饮品品牌",
    status: "active",
    keywords: [
      { id: "kw-4", brandId: "brand-002", word: "健康饮料推荐", category: "recommendation", priority: 10 },
      { id: "kw-5", brandId: "brand-002", word: "无糖饮料哪个好", category: "comparison", priority: 8 },
    ],
    platforms: [
      { platform: "doubao", enabled: true },
      { platform: "kimi", enabled: true },
    ],
    createdAt: "2026-05-22T09:00:00Z",
    updatedAt: "2026-05-23T14:00:00Z",
  },
];

let idCounter = 3;

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: mockBrands,
  selectedBrand: null,
  isLoading: false,
  error: null,
  monitorResults: {},
  monitorStatus: {},
  geoReports: {},

  setBrands: (brands) => set({ brands }),
  addBrand: (brand) => set((s) => ({ brands: [...s.brands, brand] })),
  updateBrand: (id, data) =>
    set((s) => ({
      brands: s.brands.map((b) => (b.id === id ? { ...b, ...data } : b)),
    })),
  removeBrand: (id) =>
    set((s) => ({ brands: s.brands.filter((b) => b.id !== id) })),
  selectBrand: (brand) => set({ selectedBrand: brand }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setMonitorResults: (brandId, results) =>
    set((s) => ({
      monitorResults: { ...s.monitorResults, [brandId]: results },
    })),
  setMonitorStatus: (brandId, status) =>
    set((s) => ({
      monitorStatus: { ...s.monitorStatus, [brandId]: status },
    })),
  setGeoReport: (brandId, report) =>
    set((s) => ({
      geoReports: { ...s.geoReports, [brandId]: report },
    })),

  // Run monitor via server API (API key protected on server side)
  runMonitorForBrand: async (brandId) => {
    const state = get();
    const brand = state.brands.find((b) => b.id === brandId);
    if (!brand) return;

    set((s) => ({
      monitorStatus: { ...s.monitorStatus, [brandId]: "running" },
    }));

    try {
      const job = {
        brandId: brand.id,
        brandName: brand.name,
        keywords: brand.keywords?.map((k) => k.word) || [],
        platforms: brand.platforms?.map((p) => p.platform) || [],
      };

      // Call server-side API route (protects API keys)
      const res = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (!res.ok) {
        throw new Error(`Monitor API error: ${res.status}`);
      }

      const { data: summary } = await res.json();

      set((s) => ({
        monitorResults: {
          ...s.monitorResults,
          [brandId]: summary.platformResults,
        },
        monitorStatus: { ...s.monitorStatus, [brandId]: "done" },
      }));

      // Auto-generate GEO strategy after monitor completes
      try {
        const geoRes = await fetch("/api/geo-strategy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(summary),
        });
        if (geoRes.ok) {
          const { data: geoReport } = await geoRes.json();
          set((s) => ({
            geoReports: { ...s.geoReports, [brandId]: geoReport },
          }));
        }
      } catch (geoErr) {
        console.warn("[BrandStore] GEO strategy generation failed:", geoErr);
      }
    } catch (err) {
      console.error("Monitor failed:", err);
      set((s) => ({
        monitorStatus: { ...s.monitorStatus, [brandId]: "error" },
      }));
    }
  },

  createBrand: async (data) => {
    const now = new Date().toISOString();
    const newId = `brand-${String(idCounter++).padStart(3, "0")}`;
    const newBrand: Brand = {
      id: newId,
      userId: "user-001",
      name: data.name,
      website: data.website || undefined,
      industry: data.industry || undefined,
      description: data.description || undefined,
      status: "active",
      keywords: data.keywords.map((w, i) => ({
        id: `kw-${Date.now()}-${i}`,
        brandId: newId,
        word: w,
        category: "brand" as const,
        priority: 5,
      })),
      platforms: data.platforms.map((p) => ({
        platform: p as PlatformKey,
        enabled: true,
      })),
      createdAt: now,
      updatedAt: now,
    };

    set((s) => ({ brands: [...s.brands, newBrand] }));

    // Trigger monitor after brand creation (async, non-blocking)
    setTimeout(() => {
      get().runMonitorForBrand(newId);
    }, 500);

    return newBrand;
  },

  deleteBrand: async (id) => {
    set((s) => ({ brands: s.brands.filter((b) => b.id !== id) }));
  },
}));
