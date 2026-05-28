/**
 * DeepSeek Platform Adapter
 * 接入 DeepSeek Chat API — OpenAI-compatible endpoint
 * API 文档: https://platform.deepseek.com/api-docs
 */

import { BasePlatformAdapter, MonitorQuery, MonitorResult } from "./base";

export class DeepSeekAdapter extends BasePlatformAdapter {
  platformKey = "deepseek";
  platformName = "DeepSeek";

  private apiKey: string;
  private baseUrl = "https://api.deepseek.com/chat/completions";

  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || "";
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.apiKey.length > 10);
  }

  async query(q: MonitorQuery): Promise<MonitorResult> {
    const start = Date.now();
    const queryText = `请推荐${q.keyword}方面的优秀品牌或工具，并说明各自特点。`;

    let response: string;

    if (await this.isAvailable()) {
      try {
        response = await this.callDeepSeek(queryText);
      } catch (e) {
        console.warn("[DeepSeekAdapter] API call failed, falling back to mock:", e);
        response = this.generateMockResponse(q.brandName, q.keyword, 0.55);
      }
    } else {
      response = this.generateMockResponse(q.brandName, q.keyword, 0.55);
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
    };
  }

  private async callDeepSeek(userMessage: string): Promise<string> {
    const requestBody = {
      model: "deepseek-chat",
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
      throw new Error(`DeepSeek API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }
}
