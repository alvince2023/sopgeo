/**
 * POST /api/geo-strategy
 * 基于监控结果生成 GEO 优化策略报告
 *
 * Request Body: BrandMonitorSummary
 * Response: GeoStrategyReport
 */

import { NextRequest, NextResponse } from "next/server";
import { geoStrategyAnalyzer } from "@/lib/monitor/geo-strategy";
import type { BrandMonitorSummary } from "@/lib/monitor/engine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BrandMonitorSummary;

    if (!body.brandId || !body.brandName) {
      return NextResponse.json(
        { error: "Missing brandId or brandName in request body" },
        { status: 400 }
      );
    }

    const report = geoStrategyAnalyzer.analyze(body);

    return NextResponse.json({ success: true, data: report });
  } catch (err) {
    console.error("[GEO Strategy API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
