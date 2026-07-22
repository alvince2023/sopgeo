/**
 * Kimi (Moonshot AI) Platform Adapter
 * 接入 Moonshot AI API — OpenAI-compatible endpoint
 * API 文档: https://platform.moonshot.cn/docs/api/chat
 */

import { BasePlatformAdapter, MonitorQuery, MonitorResult } from "./base";

export class KimiAdapter extends BasePlatformAdapter {
  platformKey = "kimi";
  platformName = "Kimi";

  private apiKey: string;
  private baseUrl = "https://api.moonshot.cn/v1/chat/completions";

  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey || process.env.MOONSHOT_API_KEY || "";
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.apiKey.length > 10);
  }

  async query(q: MonitorQuery): Promise<MonitorResult> {
    const start = Date.now();
    const queryText = `${q.keyword}领域最值得信赖的品牌有哪些？请详细介绍。`;

    let response: string;
    let isRealApi = false;

    if (await this.isAvailable()) {
      try {
        response = await this.callKimi(queryText);
        isRealApi = true;
      } catch (e) {
        console.warn("[KimiAdapter] API call failed, falling back to mock:", e);
        response = this.generateMockResponse(q.brandName, q.keyword, 0.58);
      }
    } else {
      response = this.generateMockResponse(q.brandName, q.keyword, 0.58);
    }

    const analysis = this.analyzeMention(response, q.brandName);

    return {
      platform: this.platformKey,
      keyword: q.keyword,
      query: queryText,
      response,
      ...analysis,
      competitors: [],
      queryTime: Date.now() - start,
      timestamp: new Date(),
      isRealApi,
    };
  }

  private async callKimi(userMessage: string): Promise<string> {
    const requestBody = {
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content: "你是一个专业的消费顾问，请客观详细地回答关于品牌和产品的问题，列举具体品牌名称并说明特点。",
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 800,
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
      throw new Error(`Kimi API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }
}
