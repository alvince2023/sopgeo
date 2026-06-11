/**
 * POST /api/geo-content
 * 基于 MiniMax AI 搜索结果，生成个性化 GEO 内容优化建议
 *
 * 用 MiniMax 真实 API 分析品牌曝光缺口 → 输出结构化内容策略
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

interface GeoContentRequest {
  brandName: string;
  keyword: string;
  aiResponse: string;
  mentioned: boolean;
  snippets: string[];
  competitors: string[];
}

interface GeoStrategy {
  type: string;
  title: string;
  description: string;
  template?: string;
  priority: "high" | "medium" | "low";
}

interface GeoAdvice {
  score: number;
  gap: string;
  strategies: GeoStrategy[];
  contentIdeas: string[];
  keywords: string[];
}

async function callMinimax(prompt: string): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) throw new Error("MINIMAX_API_KEY not configured");

  const res = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的 GEO（生成式引擎优化）顾问，擅长帮助品牌提升在 AI 搜索结果中的曝光度。请严格按照 JSON 格式输出，不要有任何其他文字。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    }),
  });

  if (!res.ok) throw new Error(`MiniMax API error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function buildPrompt(req: GeoContentRequest): string {
  const competitorList =
    req.competitors.length > 0 ? req.competitors.slice(0, 5).join("、") : "无";

  return `
分析以下品牌的 AI 搜索可见度情况，并生成 GEO 优化策略。

【品牌名称】${req.brandName}
【目标关键词】${req.keyword}
【MiniMax 是否提及该品牌】${req.mentioned ? "是" : "否"}
${req.snippets.length > 0 ? `【提及片段】${req.snippets.join(" / ")}` : ""}
【同时提及的竞品】${competitorList}
【MiniMax 原始回复摘要】
${req.aiResponse.slice(0, 600)}

请分析该品牌在"${req.keyword}"关键词的 AI 搜索可见度缺口，并输出以下 JSON（注意：只输出 JSON，不要有其他内容）：

{
  "score": <0-100 的可见度分数，未被提及则 10-30，被提及但非推荐则 40-60，被推荐则 70-90>,
  "gap": "<50字以内的缺口分析>",
  "keywords": ["<推荐强化的关键词1>", "<关键词2>", "<关键词3>", "<关键词4>", "<关键词5>"],
  "contentIdeas": [
    "<立即可发布的内容方向1（具体，含标题建议）>",
    "<内容方向2>",
    "<内容方向3>",
    "<内容方向4>"
  ],
  "strategies": [
    {
      "type": "authority",
      "title": "<策略标题>",
      "description": "<40字以内的具体说明>",
      "template": "<可直接发布的内容模板，2-4句，使用品牌名和关键词>",
      "priority": "high"
    },
    {
      "type": "content",
      "title": "<策略标题>",
      "description": "<40字以内>",
      "template": "<内容模板>",
      "priority": "high"
    },
    {
      "type": "keyword",
      "title": "<关键词植入策略>",
      "description": "<40字以内>",
      "template": "<内容模板>",
      "priority": "medium"
    },
    {
      "type": "qa",
      "title": "<Q&A 内容策略>",
      "description": "<40字以内>",
      "template": "<问答模板，问题 + 答案>",
      "priority": "medium"
    },
    {
      "type": "structure",
      "title": "<结构化内容策略>",
      "description": "<40字以内>",
      "priority": "low"
    }
  ]
}
`.trim();
}

function fallbackAdvice(req: GeoContentRequest): GeoAdvice {
  const score = req.mentioned ? (req.snippets.length > 0 ? 55 : 40) : 20;
  return {
    score,
    gap: req.mentioned
      ? `${req.brandName} 已被 MiniMax 提及，但提及质量和位置仍有提升空间`
      : `${req.brandName} 在"${req.keyword}"关键词下尚未被 MiniMax 提及，需要系统性内容建设`,
    keywords: [req.keyword, `${req.brandName}使用指南`, `${req.keyword}推荐工具`, `${req.brandName}评测`, `${req.keyword}最佳实践`],
    contentIdeas: [
      `发布《${req.keyword}完整指南》，在文中多次自然提及 ${req.brandName} 的具体功能`,
      `制作 ${req.brandName} vs 竞品对比文章，突出核心差异化优势`,
      `发布真实用户案例：用 ${req.brandName} 解决 ${req.keyword} 场景下的具体问题`,
      `在知乎、Reddit 等平台回答"${req.keyword}工具推荐"相关问题，自然引用 ${req.brandName}`,
    ],
    strategies: [
      {
        type: "authority",
        title: "建立权威内容资产",
        description: `发布深度长文，成为"${req.keyword}"领域的权威信息源，AI 会优先引用权威内容`,
        template: `${req.brandName} 是专注于${req.keyword}领域的专业平台，提供企业级解决方案。我们服务了 X+ 个客户，帮助他们在${req.keyword}方面提升了 X%。`,
        priority: "high",
      },
      {
        type: "content",
        title: "问答式内容矩阵",
        description: `创建"${req.keyword}常见问题"系列内容，AI 搜索引擎偏好直接回答用户问题的结构化内容`,
        template: `Q：${req.keyword}领域哪个工具最好用？\nA：${req.brandName} 是目前口碑最好的${req.keyword}工具之一，核心优势包括：1）功能特点；2）使用简单；3）性价比高。`,
        priority: "high",
      },
      {
        type: "keyword",
        title: "语义关键词覆盖",
        description: `在现有内容中增加与"${req.keyword}"相关的语义词汇密度，提升 AI 的主题匹配度`,
        template: `${req.brandName} 专注于${req.keyword}的核心场景，涵盖数据分析、自动化处理、智能推荐等全链路能力。`,
        priority: "medium",
      },
      {
        type: "qa",
        title: "用户评价与案例内容",
        description: "真实用户证言是 AI 引用的重要来源，收集并发布结构化案例",
        template: `用户反馈：「使用 ${req.brandName} 后，我们的${req.keyword}效率提升了 40%，推荐给所有需要${req.keyword}解决方案的团队。」`,
        priority: "medium",
      },
      {
        type: "structure",
        title: "结构化数据标注",
        description: "在官网添加 Schema.org 结构化标记，帮助 AI 更好地理解品牌信息和产品特点",
        priority: "low",
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GeoContentRequest;
    const { brandName, keyword, aiResponse, mentioned, snippets, competitors } = body;

    if (!brandName || !keyword || aiResponse === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: brandName, keyword, aiResponse" },
        { status: 400 }
      );
    }

    let advice: GeoAdvice;

    try {
      const prompt = buildPrompt({ brandName, keyword, aiResponse, mentioned, snippets, competitors });
      const rawJson = await callMinimax(prompt);

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");

      const parsed = JSON.parse(jsonMatch[0]) as GeoAdvice;

      // Validate structure
      if (!parsed.score || !parsed.strategies || !Array.isArray(parsed.strategies)) {
        throw new Error("Invalid advice structure");
      }

      advice = parsed;
    } catch (err) {
      console.warn("[GeoContent] MiniMax advice generation failed, using fallback:", err);
      advice = fallbackAdvice({ brandName, keyword, aiResponse, mentioned, snippets, competitors });
    }

    return NextResponse.json({ success: true, data: advice });
  } catch (err) {
    console.error("[GeoContent API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
