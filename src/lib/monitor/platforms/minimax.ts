/**
 * MiniMax Platform Adapter
 * 使用 MiniMax ChatCompletion API 进行真实 AI 搜索查询
 * API 文档: https://www.minimaxi.com/document/guides/chat-model/V2
 */

import { BasePlatformAdapter, MonitorQuery, MonitorResult } from "./base";

interface MinimaxMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface MinimaxResponse {
  id: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export class MinimaxAdapter extends BasePlatformAdapter {
  platformKey = "minimax";
  platformName = "MiniMax";

  private apiKey: string;
  private groupId: string;
  private baseUrl = "https://api.minimaxi.chat/v1/text/chatcompletion_v2";

  constructor(apiKey?: string, groupId?: string) {
    super();
    this.apiKey = apiKey || process.env.MINIMAX_API_KEY || "";
    this.groupId = groupId || process.env.MINIMAX_GROUP_ID || "";
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.apiKey !== "your_minimax_api_key_here");
  }

  async query(q: MonitorQuery): Promise<MonitorResult> {
    const start = Date.now();

    // Build the search query — simulate real user questions in AI search
    const queryText = this.buildQueryText(q);

    let response: string;

    if (await this.isAvailable()) {
      try {
        response = await this.callMinimax(queryText);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[MinimaxAdapter] API call failed, falling back to mock:", msg);
        response = this.generateMockResponse(q.brandName, q.keyword, 0.65);
      }
    } else {
      // Fallback to mock if no API key
      console.warn("[MinimaxAdapter] No API key, using mock response");
      response = this.generateMockResponse(q.brandName, q.keyword, 0.65);
    }

    const analysis = this.analyzeMention(response, q.brandName);

    return {
      platform: this.platformKey,
      keyword: q.keyword,
      query: queryText,
      response,
      ...analysis,
      competitors: this.extractCompetitors(response, q.brandName),
      queryTime: Date.now() - start,
      timestamp: new Date(),
    };
  }

  /**
   * Build realistic user query text for GEO monitoring
   */
  private buildQueryText(q: MonitorQuery): string {
    const templates = [
      `在${q.keyword}领域，哪些品牌做得比较好？请推荐几个。`,
      `我想了解${q.keyword}，有什么值得信赖的品牌或产品推荐？`,
      `${q.keyword}市场上有哪些主流品牌？各有什么特点？`,
      `请帮我对比一下${q.keyword}方面比较知名的品牌。`,
      `${q.keyword}哪个品牌性价比最高？`,
    ];
    // Use keyword hash to get stable query template per keyword
    const idx =
      q.keyword.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) %
      templates.length;
    return templates[idx];
  }

  /**
   * Call MiniMax ChatCompletion API
   */
  private async callMinimax(userMessage: string): Promise<string> {
    const messages: MinimaxMessage[] = [
      {
        role: "system",
        content:
          "你是一个专业的消费顾问和市场分析师。请基于你的知识库，客观、详细地回答用户关于品牌和产品的问题。回答时请列举具体品牌名称，并说明各品牌的主要特点和优势。",
      },
      {
        role: "user",
        content: userMessage,
      },
    ];

    const requestBody = {
      model: "MiniMax-Text-01",
      messages,
      temperature: 0.3, // Low temperature for more consistent, factual responses
      max_tokens: 800,
      top_p: 0.9,
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `MiniMax API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = (await response.json()) as MinimaxResponse;

    if (!data.choices || data.choices.length === 0) {
      throw new Error("MiniMax API returned empty choices");
    }

    return data.choices[0].message.content;
  }

  /**
   * Extract competitor brands from AI response using simple heuristics
   */
  private extractCompetitors(response: string, brandName: string): string[] {
    // Common Chinese brand patterns — look for brand-like entities
    // In production, use NLP/NER for better extraction
    const brandPattern = /[\u4e00-\u9fa5A-Za-z]+(?:科技|汽车|品牌|软件|云|智能|集团)?/g;
    const matches = response.match(brandPattern) || [];
    const lowerBrand = brandName.toLowerCase();

    // Filter out common words, keep proper nouns that aren't the target brand
    const stopWords = new Set([
      "品牌", "市场", "用户", "产品", "服务", "技术", "领域",
      "选择", "推荐", "建议", "特点", "优势", "方面", "需求",
      "the", "and", "for", "with", "that", "this", "from",
    ]);

    return Array.from(
      new Set(
        matches.filter(
          (m: string) =>
            m.length >= 2 &&
            m.length <= 10 &&
            !stopWords.has(m) &&
            m.toLowerCase() !== lowerBrand
        )
      )
    ).slice(0, 5);
  }
}
