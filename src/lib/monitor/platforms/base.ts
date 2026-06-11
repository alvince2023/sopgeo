/**
 * Base adapter interface for AI platform monitoring
 * Each platform adapter implements this contract
 */

export interface MonitorQuery {
  keyword: string;
  brandName: string;
  context?: string;
}

export interface MonitorResult {
  platform: string;
  keyword: string;
  query: string;
  response: string;
  mentioned: boolean;
  mentionType: "direct" | "indirect" | "competitor_mention" | "none";
  sentiment: "positive" | "neutral" | "negative" | "none";
  position: number | null; // position in response (1-based), null if not mentioned
  snippets: string[]; // text snippets where brand is mentioned
  competitors: string[]; // competitor brands also mentioned
  queryTime: number; // ms
  timestamp: Date;
  isRealApi?: boolean; // whether this result came from a real API call
}

export interface PlatformAdapter {
  platformKey: string;
  platformName: string;
  isAvailable(): Promise<boolean>;
  query(query: MonitorQuery): Promise<MonitorResult>;
  batchQuery(queries: MonitorQuery[]): Promise<MonitorResult[]>;
}

export abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract platformKey: string;
  abstract platformName: string;

  async isAvailable(): Promise<boolean> {
    return false; // Default: simulation mode
  }

  abstract query(query: MonitorQuery): Promise<MonitorResult>;

  async batchQuery(queries: MonitorQuery[]): Promise<MonitorResult[]> {
    const results: MonitorResult[] = [];
    for (const q of queries) {
      const result = await this.query(q);
      results.push(result);
      // Rate limiting between queries
      await new Promise((r) => setTimeout(r, 500));
    }
    return results;
  }

  /**
   * Analyze if brand is mentioned in response text
   */
  protected analyzeMention(
    response: string,
    brandName: string
  ): {
    mentioned: boolean;
    mentionType: MonitorResult["mentionType"];
    position: number | null;
    snippets: string[];
    sentiment: MonitorResult["sentiment"];
  } {
    const lowerResponse = response.toLowerCase();
    const lowerBrand = brandName.toLowerCase();

    const mentioned = lowerResponse.includes(lowerBrand);

    if (!mentioned) {
      return {
        mentioned: false,
        mentionType: "none",
        position: null,
        snippets: [],
        sentiment: "none",
      };
    }

    // Find position (sentence index)
    const sentences = response.split(/[。！？.!?]/);
    let firstPosition: number | null = null;
    const snippets: string[] = [];

    for (let idx = 0; idx < sentences.length; idx++) {
      const sentence = sentences[idx];
      if (sentence.toLowerCase().includes(lowerBrand)) {
        if (firstPosition === null) firstPosition = idx + 1;
        snippets.push(sentence.trim());
      }
    }

    // Determine mention type
    const recommendWords = [
      "推荐",
      "建议",
      "首选",
      "最好",
      "优秀",
      "recommend",
      "suggest",
      "best",
    ];
    const isRecommendation = recommendWords.some((w) =>
      lowerResponse.includes(w)
    );
    const mentionType: MonitorResult["mentionType"] = isRecommendation
      ? "direct"
      : "indirect";

    // Simple sentiment analysis
    const positiveWords = ["好", "优", "强", "棒", "excellent", "great", "best", "top"];
    const negativeWords = ["差", "坏", "弱", "糟", "poor", "bad", "worst"];
    const nearBrand = snippets.join(" ").toLowerCase();
    const positiveCount = positiveWords.filter((w) => nearBrand.includes(w)).length;
    const negativeCount = negativeWords.filter((w) => nearBrand.includes(w)).length;

    const sentiment: MonitorResult["sentiment"] =
      positiveCount > negativeCount
        ? "positive"
        : negativeCount > positiveCount
        ? "negative"
        : "neutral";

    return { mentioned: true, mentionType, position: firstPosition, snippets, sentiment };
  }

  /**
   * Generate mock response for development/testing
   */
  protected generateMockResponse(
    brandName: string,
    keyword: string,
    mentionProbability = 0.6
  ): string {
    const shouldMention = Math.random() < mentionProbability;
    const templates = [
      `在${keyword}领域，有几个值得关注的品牌：${shouldMention ? brandName + "是其中的佼佼者，其产品" : "市场上"}提供了完善的解决方案。建议根据您的具体需求进行选择。`,
      `关于${keyword}，${shouldMention ? brandName + "凭借其专业的服务获得了良好口碑。" : "市场上存在多个选择，"}您可以参考用户评价进行决策。`,
      `${keyword}是一个快速发展的领域。${shouldMention ? brandName + "在这一领域具有较强的竞争力，" : ""}目前市场上的主要玩家都在积极布局。`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}
