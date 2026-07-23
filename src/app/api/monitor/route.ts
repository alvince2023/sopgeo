/**
 * POST /api/monitor
 * 服务端监控 API — 保护 MiniMax/DeepSeek 等 API Key 不暴露到客户端
 *
 * Request Body:
 * {
 *   brandId: string
 *   brandName: string
 *   keywords: string[]
 *   platforms?: string[]  // ['minimax', 'deepseek', 'kimi', 'wenxin', 'doubao']
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { getP0Adapters, getAdapter } from "@/lib/monitor/platforms";
import { calculateVisibilityScore } from "@/lib/monitor/score";
import type { MonitorJobResult } from "@/lib/monitor/engine";

export const runtime = "nodejs";
export const maxDuration = 60; // 60s timeout for multi-platform queries

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, brandName, keywords, platforms } = body;

    if (!brandId || !brandName || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: brandId, brandName, keywords" },
        { status: 400 }
      );
    }

    // Get adapters — filter by requested platforms if specified
    const allAdapters = getP0Adapters();
    const selectedAdapters =
      platforms && platforms.length > 0
        ? platforms.map((p: string) => getAdapter(p)).filter(Boolean)
        : allAdapters;

    if (selectedAdapters.length === 0) {
      return NextResponse.json(
        { error: "No valid platform adapters found" },
        { status: 400 }
      );
    }

    const platformResults: MonitorJobResult[] = [];
    const apiCallLog: Array<{
      platform: string;
      apiKeyConfigured: boolean;
      apiCallSuccess: boolean;
      errorMessage?: string;
      resultCount: number;
      realApiCount: number;
    }> = [];

    // Run platforms in parallel (with concurrency limit)
    await Promise.allSettled(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedAdapters.map(async (adapter: any) => {
        const platformStart = new Date();

        try {
          // Check API key availability before calling
          const apiKeyConfigured = await adapter.isAvailable();
          console.log(`[Monitor API] ${adapter.platformKey}: API key configured = ${apiKeyConfigured}`);

          const queries = keywords.map((keyword: string) => ({
            keyword,
            brandName,
          }));

          let results;
          let apiCallSuccess = false;
          let errorMessage: string | undefined;

          try {
            results = await adapter.batchQuery(queries);
            apiCallSuccess = true;
            console.log(`[Monitor API] ${adapter.platformKey}: batchQuery succeeded, ${results.length} results`);
          } catch (apiErr) {
            errorMessage = apiErr instanceof Error ? apiErr.message : String(apiErr);
            console.error(`[Monitor API] ${adapter.platformKey}: batchQuery failed:`, errorMessage);
            // Fallback: still try to get results (adapter may have returned mock data)
            results = await adapter.batchQuery(queries).catch(() => []);
          }

          const score = calculateVisibilityScore(results);
          const realApiCount = results.filter((r: { isRealApi?: boolean }) => r.isRealApi).length;

          apiCallLog.push({
            platform: adapter.platformKey,
            apiKeyConfigured,
            apiCallSuccess,
            errorMessage,
            resultCount: results.length,
            realApiCount,
          });

          platformResults.push({
            brandId,
            brandName,
            platform: adapter.platformKey,
            platformName: adapter.platformName,
            results,
            score,
            startedAt: platformStart,
            completedAt: new Date(),
          });
        } catch (err) {
          console.error(`[Monitor API] Platform ${adapter.platformKey} failed:`, err);
          apiCallLog.push({
            platform: adapter.platformKey,
            apiKeyConfigured: false,
            apiCallSuccess: false,
            errorMessage: err instanceof Error ? err.message : String(err),
            resultCount: 0,
            realApiCount: 0,
          });
          // Don't fail the entire request if one platform errors
        }
      })
    );

    if (platformResults.length === 0) {
      return NextResponse.json(
        { error: "All platform queries failed" },
        { status: 503 }
      );
    }

    // Calculate overall aggregated score
    const allResults = platformResults.flatMap((pr) => pr.results);
    const overallScore = calculateVisibilityScore(allResults);
    const mentionCount = allResults.filter((r) => r.mentioned).length;

    const summary = {
      brandId,
      brandName,
      overallScore: overallScore.total,
      platformResults,
      totalQueries: allResults.length,
      mentionCount,
      lastRunAt: new Date().toISOString(),
      apiCallLog, // Detailed log for frontend diagnostics
    };

    return NextResponse.json({ success: true, data: summary });
  } catch (err) {
    console.error("[Monitor API] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/monitor?platform=minimax
 * Check platform availability (API key configured?)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platformKey = searchParams.get("platform");

  if (platformKey) {
    const adapter = getAdapter(platformKey);
    if (!adapter) {
      return NextResponse.json({ error: "Platform not found" }, { status: 404 });
    }
    const available = await adapter.isAvailable();
    return NextResponse.json({ platform: platformKey, available });
  }

  // Return all platforms availability
  const adapters = getP0Adapters();
  const availability = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapters.map(async (a: any) => ({
      platform: a.platformKey,
      name: a.platformName,
      available: await a.isAvailable(),
    }))
  );

  return NextResponse.json({ platforms: availability });
}
