/**
 * Visibility Score Calculator
 * Computes the SopGeo 0-100 visibility score from monitor results
 *
 * Scoring Dimensions (weighted):
 *  - Mention Rate (35%): % of queries where brand is mentioned
 *  - Position Score (25%): how early in response the brand appears
 *  - Recommendation Score (20%): % of direct/positive recommendations
 *  - Sentiment Score (15%): positivity of surrounding context
 *  - Coverage Score (5%): consistency across different query types
 */

import type { MonitorResult } from "./platforms";

export interface VisibilityScoreBreakdown {
  total: number; // 0-100
  mentionRate: number; // 0-100
  positionScore: number; // 0-100
  recommendationScore: number; // 0-100
  sentimentScore: number; // 0-100
  coverageScore: number; // 0-100
  sampleSize: number;
}

export function calculateVisibilityScore(
  results: MonitorResult[]
): VisibilityScoreBreakdown {
  if (results.length === 0) {
    return {
      total: 0,
      mentionRate: 0,
      positionScore: 0,
      recommendationScore: 0,
      sentimentScore: 0,
      coverageScore: 0,
      sampleSize: 0,
    };
  }

  const total = results.length;
  const mentioned = results.filter((r) => r.mentioned);

  // 1. Mention Rate (35%)
  const mentionRateRaw = mentioned.length / total;
  const mentionRate = Math.round(mentionRateRaw * 100);

  // 2. Position Score (25%) — earlier position = higher score
  const positionResults = mentioned.filter((r) => r.position !== null);
  let positionScore = 0;
  if (positionResults.length > 0) {
    const avgPosition =
      positionResults.reduce((sum, r) => sum + (r.position ?? 0), 0) /
      positionResults.length;
    // Position 1 = 100, Position 5+ = 20
    positionScore = Math.max(20, Math.round(100 - (avgPosition - 1) * 16));
  }

  // 3. Recommendation Score (20%) — direct recommendations count more
  const directMentions = mentioned.filter(
    (r) => r.mentionType === "direct"
  ).length;
  const recommendationScore =
    mentioned.length > 0
      ? Math.round((directMentions / mentioned.length) * 100)
      : 0;

  // 4. Sentiment Score (15%)
  const positiveCount = mentioned.filter((r) => r.sentiment === "positive").length;
  const neutralCount = mentioned.filter((r) => r.sentiment === "neutral").length;
  const negativeCount = mentioned.filter((r) => r.sentiment === "negative").length;
  const sentimentScore =
    mentioned.length > 0
      ? Math.round(
          ((positiveCount * 100 + neutralCount * 60 + negativeCount * 20) /
            mentioned.length)
        )
      : 0;

  // 5. Coverage Score (5%) — keyword diversity
  const uniqueKeywords = new Set(results.map((r) => r.keyword)).size;
  const totalKeywords = Math.max(1, results.length / 4);
  const coverageScore = Math.min(100, Math.round((uniqueKeywords / totalKeywords) * 100));

  // Weighted total
  const totalScore = Math.round(
    mentionRate * 0.35 +
      positionScore * 0.25 +
      recommendationScore * 0.2 +
      sentimentScore * 0.15 +
      coverageScore * 0.05
  );

  return {
    total: Math.min(100, totalScore),
    mentionRate,
    positionScore,
    recommendationScore,
    sentimentScore,
    coverageScore,
    sampleSize: total,
  };
}

export function getScoreLabel(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 80)
    return {
      label: "优秀",
      color: "text-emerald-400",
      description: "品牌在AI搜索中具有极高可见度",
    };
  if (score >= 60)
    return {
      label: "良好",
      color: "text-blue-400",
      description: "品牌在AI搜索中被较多提及",
    };
  if (score >= 40)
    return {
      label: "一般",
      color: "text-amber-400",
      description: "品牌可见度有提升空间",
    };
  if (score >= 20)
    return {
      label: "较弱",
      color: "text-orange-400",
      description: "品牌在AI搜索中曝光不足",
    };
  return {
    label: "待建立",
    color: "text-red-400",
    description: "品牌几乎未出现在AI搜索结果中",
  };
}
