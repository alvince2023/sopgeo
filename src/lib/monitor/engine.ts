/**
 * Monitor Engine — orchestrates multi-platform brand monitoring
 */

import { getP0Adapters } from "./platforms";
import { calculateVisibilityScore, VisibilityScoreBreakdown } from "./score";
import type { MonitorResult } from "./platforms";

export interface MonitorJob {
  brandId: string;
  brandName: string;
  keywords: string[];
  platforms?: string[]; // if empty, use all P0 platforms
}

export interface MonitorJobResult {
  brandId: string;
  brandName: string;
  platform: string;
  platformName: string;
  results: MonitorResult[];
  score: VisibilityScoreBreakdown;
  startedAt: Date;
  completedAt: Date;
}

export interface BrandMonitorSummary {
  brandId: string;
  brandName: string;
  overallScore: number;
  platformResults: MonitorJobResult[];
  totalQueries: number;
  mentionCount: number;
  lastRunAt: Date;
}

export class MonitorEngine {
  private isRunning = false;

  async runMonitor(job: MonitorJob): Promise<BrandMonitorSummary> {
    if (this.isRunning) {
      throw new Error("Monitor engine is already running a job");
    }

    this.isRunning = true;
    const startTime = new Date();

    try {
      const adapters = getP0Adapters().filter(
        (a) =>
          !job.platforms ||
          job.platforms.length === 0 ||
          job.platforms.includes(a.platformKey)
      );

      const platformResults: MonitorJobResult[] = [];

      // Run each platform in parallel
      await Promise.all(
        adapters.map(async (adapter) => {
          const platformStart = new Date();
          const queries = job.keywords.map((keyword) => ({
            keyword,
            brandName: job.brandName,
          }));

          const results = await adapter.batchQuery(queries);
          const score = calculateVisibilityScore(results);

          platformResults.push({
            brandId: job.brandId,
            brandName: job.brandName,
            platform: adapter.platformKey,
            platformName: adapter.platformName,
            results,
            score,
            startedAt: platformStart,
            completedAt: new Date(),
          });
        })
      );

      // Calculate overall score (average of platform scores)
      const allResults = platformResults.flatMap((pr) => pr.results);
      const overallScoreData = calculateVisibilityScore(allResults);
      const mentionCount = allResults.filter((r) => r.mentioned).length;

      return {
        brandId: job.brandId,
        brandName: job.brandName,
        overallScore: overallScoreData.total,
        platformResults,
        totalQueries: allResults.length,
        mentionCount,
        lastRunAt: startTime,
      };
    } finally {
      this.isRunning = false;
    }
  }

  async quickCheck(
    brandName: string,
    keyword: string
  ): Promise<MonitorResult[]> {
    const adapters = getP0Adapters();
    const results = await Promise.all(
      adapters.map((a) =>
        a.query({ keyword, brandName }).catch(() => null)
      )
    );
    return results.filter((r): r is MonitorResult => r !== null);
  }
}

// Singleton instance
export const monitorEngine = new MonitorEngine();
