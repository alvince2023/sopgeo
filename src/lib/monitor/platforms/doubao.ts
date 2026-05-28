/**
 * Doubao (豆包) Platform Adapter
 * ByteDance AI assistant
 */

import {
  BasePlatformAdapter,
  MonitorQuery,
  MonitorResult,
} from "./base";

export class DoubaoAdapter extends BasePlatformAdapter {
  platformKey = "doubao";
  platformName = "豆包";

  async isAvailable(): Promise<boolean> {
    // Real implementation would check Doubao API availability
    return false; // Simulation mode until official API is available
  }

  async query(q: MonitorQuery): Promise<MonitorResult> {
    const start = Date.now();

    // Simulation: generate mock response
    const queryText = `在${q.keyword}领域，哪些品牌做得比较好？`;
    const response = this.generateMockResponse(
      q.brandName,
      q.keyword,
      0.62 // 62% mention probability for Doubao
    );

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

  private extractCompetitors(response: string, brandName: string): string[] {
    // In a real implementation, use NLP to extract competitor names
    // For now, return empty array
    void response;
    void brandName;
    return [];
  }
}
