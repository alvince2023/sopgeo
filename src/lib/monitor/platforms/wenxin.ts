/**
 * Wenxin Yiyan (文心一言/ERNIE Bot) Platform Adapter
 * Baidu AI
 */

import { BasePlatformAdapter, MonitorQuery, MonitorResult } from "./base";

export class WenxinAdapter extends BasePlatformAdapter {
  platformKey = "wenxin";
  platformName = "文心一言";

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async query(q: MonitorQuery): Promise<MonitorResult> {
    const start = Date.now();
    const queryText = `在${q.keyword}方面，哪个品牌服务最好？`;
    const response = this.generateMockResponse(q.brandName, q.keyword, 0.5);
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
      isRealApi: false,
    };
  }
}
