import { PLATFORMS, INDUSTRIES } from "@/lib/utils/constants";

// ---- Brand ----
export interface Brand {
  id: string;
  userId: string;
  name: string;
  website?: string;
  industry?: string;
  description?: string;
  logo?: string;
  status: "active" | "inactive" | "archived";
  keywords?: BrandKeyword[];
  platforms?: BrandPlatform[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandKeyword {
  id: string;
  brandId: string;
  word: string;
  category: string;
  priority: number;
}

export interface BrandPlatform {
  platform: PlatformKey;
  enabled: boolean;
}

export type PlatformKey = keyof typeof PLATFORMS;
export type IndustryName = (typeof INDUSTRIES)[number];

export interface BrandFormData {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
  keywords: string[];
  platforms: string[];
}

// ---- Monitoring ----
export interface MonitorSnapshot {
  id: string;
  brandId: string;
  platform: PlatformKey;
  keyword: string;
  query: string;
  response?: string;
  mentioned: boolean;
  mentionContext?: string;
  sentiment?: "positive" | "negative" | "neutral";
  position?: number;
  citationCount: number;
  visibilityScore?: number;
  queriedAt: string;
}

export interface VisibilityScore {
  id: string;
  brandId: string;
  platform: PlatformKey;
  period: "daily" | "weekly" | "monthly";
  periodDate: string;
  overallScore: number;
  mentionRate: number;
  recommendationRate: number;
  citationRate: number;
  totalQueries: number;
  mentionedQueries: number;
}

export interface PlatformVisibility {
  platform: PlatformKey;
  platformName: string;
  color: string;
  score: number;
  mentionRate: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  totalQueries: number;
}

// ---- Competitors ----
export interface Competitor {
  id: string;
  brandId: string;
  competitorName: string;
  competitorWebsite?: string;
  competitorDescription?: string;
  score?: number;
}

export interface CompetitorScore {
  id: string;
  competitorId: string;
  platform: PlatformKey;
  overallScore: number;
  mentionRate: number;
  shareOfVoice: number;
}

// Dashboard
export interface DashboardStats {
  totalBrands: number;
  totalQueries: number;
  avgVisibilityScore: number;
  scoreChange: number;
  platformCount: number;
  alertCount: number;
  topPlatform?: {
    platform: PlatformKey;
    name: string;
    score: number;
  };
}

export interface Alert {
  id: string;
  brandId: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description?: string;
  read: boolean;
  createdAt: string;
}

// Reports
export interface Report {
  id: string;
  brandId: string;
  type: "weekly" | "monthly" | "quarterly" | "custom";
  title: string;
  summary?: string;
  data?: Record<string, unknown>;
  pdfUrl?: string;
  status: "draft" | "generating" | "completed" | "failed";
  periodStart: string;
  periodEnd: string;
  generatedAt?: string;
  createdAt: string;
}
