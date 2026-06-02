/**
 * Doubao (豆包) Platform Adapter
 * 接入火山引擎 Ark API (OpenAI-compatible endpoint)
 * 文档: https://www.volcengine.com/docs/ark/API-reference/open-api/stable-preview
 */

import { BasePlatformAdapter, MonitorQuery, MonitorResult } from "./base";

interface DoubaoResponse {
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

export class DoubaoAdapter extends BasePlatformAdapter {
  platformKey = "doubao";
  platformName = "豆包";

  private apiKey: string;
  private baseUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

  // 火山引擎 Ark 接入点 ID（ep-xxxxxxxx 格式），在控制台「在线推理」页创建
  // 若未配置 Endpoint，则 fallback 到 mock
  private endpoint: string;

  constructor(apiKey?: string, endpoint?: string) {
    super();
    this.apiKey = apiKey || process.env.DOUBAO_API_KEY || "";
    this.endpoint =
      endpoint || process.env.DOUBAO_ENDPOINT || "";
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.apiKey.length > 10 && this.endpoint);
  }

  async query(q: MonitorQuery): Promise<MonitorResult> {
    const start = Date.now();

    const queryText = this.buildQueryText(q);

    let response: string;

    if (await this.isAvailable()) {
      try {
        response = await this.callDoubao(queryText);
      } catch (e) {
        console.warn("[DoubaoAdapter] API call failed, falling back to mock:", e);
        response = this.generateMockResponse(q.brandName, q.keyword, 0.62);
      }
    } else {
      response = this.generateMockResponse(q.brandName, q.keyword, 0.62);
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
    const idx =
      q.keyword.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) %
      templates.length;
    return templates[idx];
  }

  /**
   * Call Doubao via 火山引擎 Ark API (OpenAI-compatible)
   */
  private async callDoubao(userMessage: string): Promise<string> {
    const requestBody = {
      model: this.endpoint, // Ark API 中 model 字段填接入点 ID（ep-xxxxxxxx）
      messages: [
        {
          role: "system" as const,
          content:
            "你是一个专业的消费顾问和市场分析师。请基于你的知识库，客观、详细地回答用户关于品牌和产品的问题。回答时请列举具体品牌名称，并说明各品牌的主要特点和优势。",
        },
        {
          role: "user" as const,
          content: userMessage,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
      top_p: 0.9,
    };

    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Doubao API error: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const data = (await res.json()) as DoubaoResponse;

    if (!data.choices || data.choices.length === 0) {
      throw new Error("Doubao API returned empty choices");
    }

    return data.choices[0].message.content;
  }

  /**
   * Extract competitor brands from AI response
   */
  private extractCompetitors(response: string, brandName: string): string[] {
    const brandPattern = /[\u4e00-\u9fa5A-Za-z]+(?:科技|汽车|品牌|软件|云|智能|集团)?/g;
    const matches = response.match(brandPattern) || [];
    const lowerBrand = brandName.toLowerCase();

    const stopWords = new Set([
      "品牌", "市场", "用户", "产品", "服务", "技术", "领域",
      "选择", "推荐", "建议", "特点", "优势", "方面", "需求",
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
