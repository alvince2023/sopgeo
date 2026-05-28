/**
 * GEO Strategy Analyzer
 * 基于 AI 搜索监控结果，生成针对每个关键词的 GEO 优化策略
 *
 * GEO = Generative Engine Optimization
 * 核心思路：AI 搜索引擎基于训练数据和实时知识库生成回答，
 * GEO 优化就是让品牌内容进入这些知识源，提升被引用概率。
 */

import type { MonitorResult } from "./platforms/base";
import type { BrandMonitorSummary } from "./engine";

// ── Types ─────────────────────────────────────────────────────────────

export interface GeoStrategyItem {
  id: string;
  category: GeoStrategyCategory;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  actions: GeoAction[];
  expectedImpact: string;
  timeframe: "immediate" | "1-4weeks" | "1-3months" | "3-6months";
  difficulty: "easy" | "medium" | "hard";
  relatedKeywords: string[];
}

export type GeoStrategyCategory =
  | "content"        // 内容创作与优化
  | "knowledge"      // 知识图谱与结构化数据
  | "authority"      // 权威性建设
  | "citation"       // 引用链与外链
  | "qa"             // 问答内容优化
  | "comparison"     // 竞品对比策略
  | "technical";     // 技术 SEO 与结构化标记

export interface GeoAction {
  step: number;
  action: string;
  detail: string;
  tool?: string; // recommended tool
}

export interface GeoStrategyReport {
  brandId: string;
  brandName: string;
  overallScore: number;
  generatedAt: string;
  summary: GeoStrategySummary;
  strategies: GeoStrategyItem[];
  keywordInsights: KeywordInsight[];
  priorityMatrix: PriorityMatrixItem[];
}

export interface GeoStrategySummary {
  currentStatus: string;
  topOpportunity: string;
  quickWin: string;
  estimatedImprovementWeeks: number;
}

export interface KeywordInsight {
  keyword: string;
  mentionRate: number; // % across platforms
  avgPosition: number | null;
  sentiment: "positive" | "neutral" | "negative" | "mixed" | "none";
  gap: "high" | "medium" | "low"; // opportunity gap
  recommendation: string;
}

export interface PriorityMatrixItem {
  title: string;
  impact: number; // 1-10
  effort: number; // 1-10
  category: GeoStrategyCategory;
}

// ── Main Analyzer ─────────────────────────────────────────────────────

export class GeoStrategyAnalyzer {

  /**
   * Generate full GEO strategy report from monitor results
   */
  analyze(summary: BrandMonitorSummary): GeoStrategyReport {
    const allResults = summary.platformResults.flatMap((pr) => pr.results);
    const keywordInsights = this.analyzeKeywords(allResults, summary.brandName);
    const strategies = this.generateStrategies(summary, keywordInsights);
    const priorityMatrix = this.buildPriorityMatrix(strategies);

    return {
      brandId: summary.brandId,
      brandName: summary.brandName,
      overallScore: summary.overallScore,
      generatedAt: new Date().toISOString(),
      summary: this.buildSummary(summary, keywordInsights, strategies),
      strategies,
      keywordInsights,
      priorityMatrix,
    };
  }

  /**
   * Analyze each keyword's performance across platforms
   */
  private analyzeKeywords(
    results: MonitorResult[],
    brandName: string
  ): KeywordInsight[] {
    const keywordMap = new Map<string, MonitorResult[]>();

    for (const r of results) {
      if (!keywordMap.has(r.keyword)) keywordMap.set(r.keyword, []);
      keywordMap.get(r.keyword)!.push(r);
    }

    const insights: KeywordInsight[] = [];

    for (const entry of Array.from(keywordMap.entries())) {
      const [keyword, kResults] = entry as [string, MonitorResult[]];
      const mentionedResults = kResults.filter((r: MonitorResult) => r.mentioned);
      const mentionRate = kResults.length > 0
        ? Math.round((mentionedResults.length / kResults.length) * 100)
        : 0;

      const positionsWithValues: number[] = mentionedResults
        .filter((r: MonitorResult) => r.position !== null)
        .map((r: MonitorResult) => r.position as number);
      const avgPosition = positionsWithValues.length > 0
        ? Math.round(positionsWithValues.reduce((a: number, b: number) => a + b, 0) / positionsWithValues.length * 10) / 10
        : null;

      const sentiments = mentionedResults.map((r: MonitorResult) => r.sentiment);
      const positiveCount = sentiments.filter((s) => s === "positive").length;
      const negativeCount = sentiments.filter((s) => s === "negative").length;
      let sentiment: KeywordInsight["sentiment"] = "none";
      if (mentionedResults.length > 0) {
        if (positiveCount > negativeCount && positiveCount > mentionedResults.length * 0.4) {
          sentiment = "positive";
        } else if (negativeCount > positiveCount && negativeCount > mentionedResults.length * 0.4) {
          sentiment = "negative";
        } else if (positiveCount > 0 || negativeCount > 0) {
          sentiment = "mixed";
        } else {
          sentiment = "neutral";
        }
      }

      const gap: KeywordInsight["gap"] =
        mentionRate < 30 ? "high" :
        mentionRate < 60 ? "medium" : "low";

      const recommendation = this.generateKeywordRecommendation(
        keyword, mentionRate, avgPosition, sentiment, brandName
      );

      insights.push({
        keyword,
        mentionRate,
        avgPosition,
        sentiment,
        gap,
        recommendation,
      });
    }

    // Sort by gap (high priority first), then by mention rate (ascending)
    return insights.sort((a, b) => {
      const gapOrder = { high: 0, medium: 1, low: 2 };
      return gapOrder[a.gap] - gapOrder[b.gap] || a.mentionRate - b.mentionRate;
    });
  }

  private generateKeywordRecommendation(
    keyword: string,
    mentionRate: number,
    avgPosition: number | null,
    sentiment: string,
    brandName: string
  ): string {
    if (mentionRate === 0) {
      return `"${keyword}"查询中完全未提及${brandName}。优先创建以此关键词为核心的权威内容，在知乎、行业媒体发布深度文章，建立该关键词下的内容存在感。`;
    }
    if (mentionRate < 30) {
      return `提及率偏低(${mentionRate}%)，AI模型知识库中关于${brandName}在"${keyword}"方面的内容较少。需要扩大内容覆盖，增加相关领域的品牌曝光。`;
    }
    if (avgPosition && avgPosition > 3) {
      return `虽然有提及(${mentionRate}%)，但出现位置靠后(平均第${avgPosition}位)。需优化内容权威性，争取在AI回答中被优先推荐。`;
    }
    if (sentiment === "negative") {
      return `提及率${mentionRate}%，但情绪偏负面。需要重点建设正向案例内容，通过用户好评、成功案例提升品牌形象。`;
    }
    return `表现良好(${mentionRate}%，情绪${sentiment === "positive" ? "正面" : "中性"})。保持内容更新频率，巩固并持续扩大"${keyword}"领域的AI可见度。`;
  }

  /**
   * Generate GEO strategy items based on analysis
   */
  private generateStrategies(
    summary: BrandMonitorSummary,
    insights: KeywordInsight[]
  ): GeoStrategyItem[] {
    const strategies: GeoStrategyItem[] = [];
    const { brandName } = summary;
    const highGapKeywords = insights.filter((k) => k.gap === "high").map((k) => k.keyword);
    const zeroKeywords = insights.filter((k) => k.mentionRate === 0).map((k) => k.keyword);
    const negKeywords = insights.filter((k) => k.sentiment === "negative").map((k) => k.keyword);

    // 1. Content Strategy — always needed
    strategies.push({
      id: "s-content-authority",
      category: "content",
      priority: summary.overallScore < 40 ? "critical" : "high",
      title: "建立 AI 可检索的权威内容体系",
      description: "AI 搜索引擎优先引用结构清晰、来源权威、被广泛链接的内容。需要在多个高权重平台上系统发布关于品牌的深度内容。",
      actions: [
        {
          step: 1,
          action: "创建品牌核心内容页面",
          detail: `在官网建立「${brandName}是什么」「${brandName}的优势」「${brandName}使用场景」等核心 FAQ 页面，每页 800-1500 字，采用问答式结构`,
          tool: "Notion / WordPress",
        },
        {
          step: 2,
          action: "在知乎发布深度回答",
          detail: `针对 ${highGapKeywords.slice(0, 3).join("、") || "核心关键词"} 等问题，在知乎发布专业回答，自然融入${brandName}的解决方案，目标 1000+ 赞同`,
          tool: "知乎创作中心",
        },
        {
          step: 3,
          action: "行业媒体软文投放",
          detail: "在36氪、虎嗅、钛媒体等发布品牌案例、行业洞察文章，建立媒体报道记录",
          tool: "36氪/虎嗅/IT之家",
        },
        {
          step: 4,
          action: "建立内容发布日历",
          detail: "每周至少 2 篇高质量内容，覆盖不同关键词场景，持续建立内容密度",
          tool: "飞书多维表格",
        },
      ],
      expectedImpact: "3-4个月内 AI 提及率提升 20-35%",
      timeframe: "1-3months",
      difficulty: "medium",
      relatedKeywords: highGapKeywords.slice(0, 5),
    });

    // 2. Structured Data / Knowledge Graph
    strategies.push({
      id: "s-knowledge-schema",
      category: "knowledge",
      priority: "high",
      title: "结构化数据标记 + 知识图谱建设",
      description: "AI 搜索引擎通过结构化数据理解品牌实体。Schema.org 标记能显著提升 AI 对品牌信息的识别准确度，降低被错误描述的概率。",
      actions: [
        {
          step: 1,
          action: "添加 Organization Schema 标记",
          detail: `在官网 <head> 中添加 JSON-LD Schema.org/Organization，包含品牌名"${brandName}"、描述、网址、社交媒体链接、联系方式等完整信息`,
          tool: "Google 结构化数据测试工具",
        },
        {
          step: 2,
          action: "创建品牌百科词条",
          detail: "在百度百科、维基百科（如有）创建或完善品牌词条，确保核心事实描述准确，建立品牌实体的权威记录",
          tool: "百度百科",
        },
        {
          step: 3,
          action: "完善企业图谱信息",
          detail: "更新天眼查、企查查等企业信息平台的品牌资料，AI 模型会抓取这些数据源",
          tool: "天眼查/企查查",
        },
        {
          step: 4,
          action: "建立产品/服务 Schema",
          detail: "对每个核心产品/服务页面添加 Product/Service Schema，包含价格区间、特性描述、适用场景",
          tool: "Schema App",
        },
      ],
      expectedImpact: "提升 AI 对品牌描述的准确性，减少错误引用，潜在提升 15% 可见度",
      timeframe: "immediate",
      difficulty: "easy",
      relatedKeywords: insights.slice(0, 4).map((k) => k.keyword),
    });

    // 3. Q&A Content Strategy
    if (zeroKeywords.length > 0 || summary.overallScore < 50) {
      strategies.push({
        id: "s-qa-coverage",
        category: "qa",
        priority: zeroKeywords.length > 2 ? "critical" : "high",
        title: "针对零提及关键词的问答内容覆盖",
        description: `以下关键词在 AI 搜索中完全没有提及${brandName}：${zeroKeywords.slice(0, 5).join("、")}。需要专门创建这些场景下的问答内容。`,
        actions: [
          {
            step: 1,
            action: "构建关键词问题矩阵",
            detail: `将 ${zeroKeywords.slice(0, 3).join("、")} 等关键词扩展为用户真实问题，如「${zeroKeywords[0]}哪个好」「${zeroKeywords[0]}推荐」「${zeroKeywords[0]}怎么选」等`,
            tool: "5118/百度指数",
          },
          {
            step: 2,
            action: "发布专题对比文章",
            detail: "创建「${brandName} vs 竞品」「${brandName}完整使用指南」等内容，直接回答 AI 会被问到的问题",
            tool: "官网博客/知乎/公众号",
          },
          {
            step: 3,
            action: "优化品牌官网 FAQ 页面",
            detail: "将最常见的用户问题和品牌优势融入 FAQ，采用自然语言而非关键词堆砌，符合 AI 的检索偏好",
            tool: "官网 CMS",
          },
        ],
        expectedImpact: "覆盖空白关键词，预计 2 个月内新增 2-3 个关键词的 AI 提及",
        timeframe: "1-4weeks",
        difficulty: "medium",
        relatedKeywords: zeroKeywords.slice(0, 5),
      });
    }

    // 4. Authority Building
    strategies.push({
      id: "s-authority-citation",
      category: "authority",
      priority: "high",
      title: "权威引用链建设（AI 信任信号）",
      description: "AI 模型优先引用被其他权威来源引用的品牌信息。需要建立从媒体报道、行业报告到用户评价的多维度引用网络。",
      actions: [
        {
          step: 1,
          action: "争取媒体报道与收录",
          detail: `联系行业媒体记者，提供${brandName}的独家数据、案例或专家观点，争取被报道收录`,
          tool: "PR Newswire / 媒体人脉",
        },
        {
          step: 2,
          action: "行业报告/榜单上榜",
          detail: "申请或提交信息到行业机构排名（如艾瑞、易观等），被报告引用是强力的 AI 信任信号",
          tool: "艾瑞咨询/易观分析",
        },
        {
          step: 3,
          action: "用户评价体系建设",
          detail: "在 G2、Trustpilot（国内可用点评平台）积累真实用户评价，AI 模型会综合评价数据",
          tool: "小红书/大众点评/IT橘子",
        },
        {
          step: 4,
          action: "行业合作与联名背书",
          detail: `与行业知名品牌/机构建立合作关系，通过合作方官网的提及增加${brandName}的权威背书`,
          tool: "行业协会/头部平台",
        },
      ],
      expectedImpact: "建立品牌权威信号，4-6个月内推荐率提升 25-40%",
      timeframe: "3-6months",
      difficulty: "hard",
      relatedKeywords: insights.slice(0, 3).map((k) => k.keyword),
    });

    // 5. Competitor Gap Strategy
    strategies.push({
      id: "s-comparison",
      category: "comparison",
      priority: "medium",
      title: "竞品对比内容策略",
      description: "AI 搜索在回答「哪个品牌好」时，会综合对比信息。通过主动创建有利于品牌的对比内容，影响 AI 对品牌的综合判断。",
      actions: [
        {
          step: 1,
          action: "竞品关键词分析",
          detail: `调研与${brandName}竞争的品牌，分析它们在 AI 搜索中被提及的原因和优势描述方式`,
          tool: "SopGeo 监控 + 手动调研",
        },
        {
          step: 2,
          action: "创建对比落地页",
          detail: `建立「${brandName} vs [竞品A]」专题页面，客观列举优劣势，突出差异化价值主张`,
          tool: "官网落地页",
        },
        {
          step: 3,
          action: "差异化 Claim 提炼",
          detail: "提炼3-5个独特的品牌 Claim（如「唯一支持XXX的品牌」），在所有内容渠道一致传达",
          tool: "品牌 MasterBrief",
        },
      ],
      expectedImpact: "在竞品对比查询中提升品牌被选中率 15-20%",
      timeframe: "1-4weeks",
      difficulty: "medium",
      relatedKeywords: insights.filter((k) => k.mentionRate > 0).slice(0, 3).map((k) => k.keyword),
    });

    // 6. Sentiment Recovery (if needed)
    if (negKeywords.length > 0) {
      strategies.push({
        id: "s-sentiment-repair",
        category: "content",
        priority: "critical",
        title: "负面情绪关键词紧急修复",
        description: `在 ${negKeywords.join("、")} 等关键词场景下，AI 回答中涉及${brandName}的情绪偏负面，需要紧急干预。`,
        actions: [
          {
            step: 1,
            action: "定位负面内容源",
            detail: "追溯 AI 回答中负面信息的来源，通常来自投诉平台、负面新闻或差评聚合页",
            tool: "舆情监控工具",
          },
          {
            step: 2,
            action: "发布正向案例内容",
            detail: "大量发布客户成功案例、用户好评截图（脱敏）、官方问题解决方案",
            tool: "官方渠道 + 知乎/小红书",
          },
          {
            step: 3,
            action: "官方声明与澄清",
            detail: "若有具体负面事件，发布官方说明，在多个平台同步澄清",
            tool: "官微/官网公告",
          },
        ],
        expectedImpact: "2-4周内将负面情绪向中性/正面转变",
        timeframe: "immediate",
        difficulty: "medium",
        relatedKeywords: negKeywords,
      });
    }

    // 7. Technical — structured markup
    strategies.push({
      id: "s-technical",
      category: "technical",
      priority: "medium",
      title: "技术层面 AI 可读性优化",
      description: "AI 爬虫偏好语义清晰、加载速度快、内容结构化的网页。技术优化可提升内容被 AI 训练数据收录的概率。",
      actions: [
        {
          step: 1,
          action: "语义化 HTML 结构",
          detail: "使用 <article>、<section>、<h1-h3> 等语义标签，确保页面结构清晰，AI 爬虫能正确理解内容层次",
          tool: "开发工具",
        },
        {
          step: 2,
          action: "Open Graph / Twitter Card 标记",
          detail: "完善所有核心页面的 og:title、og:description、og:image，提升在社交平台和 AI 内容摘要中的呈现质量",
          tool: "Next.js metadata API",
        },
        {
          step: 3,
          action: "提交 Sitemap 到各搜索引擎",
          detail: "向百度、必应、Google 提交 XML Sitemap，确保核心内容页面被及时收录",
          tool: "百度搜索资源平台",
        },
        {
          step: 4,
          action: "页面加载速度优化",
          detail: "AI 爬虫有时间限制，确保核心页面 LCP < 2.5s，减少 AI 爬取超时导致的内容遗漏",
          tool: "PageSpeed Insights",
        },
      ],
      expectedImpact: "提升内容被 AI 训练数据收录概率 10-20%",
      timeframe: "1-4weeks",
      difficulty: "easy",
      relatedKeywords: [],
    });

    return strategies;
  }

  private buildSummary(
    summary: BrandMonitorSummary,
    insights: KeywordInsight[],
    strategies: GeoStrategyItem[]
  ): GeoStrategySummary {
    const criticalCount = strategies.filter((s) => s.priority === "critical").length;
    const highGapCount = insights.filter((k) => k.gap === "high").length;
    const bestKeyword = insights
      .filter((k) => k.mentionRate > 0)
      .sort((a, b) => b.mentionRate - a.mentionRate)[0];

    const statusText =
      summary.overallScore >= 70
        ? "品牌在 AI 搜索中已具备较强可见度，重点维护并扩大覆盖"
        : summary.overallScore >= 40
        ? "品牌有一定 AI 可见度，但仍有显著提升空间"
        : "品牌在 AI 搜索中的曝光严重不足，需要全面建设内容体系";

    const topOpportunity =
      highGapCount > 0
        ? `${highGapCount} 个关键词提及率低于 30%，通过内容覆盖可快速提升整体得分`
        : "扩大现有提及关键词的内容深度，争取更靠前的推荐位置";

    const quickWin = criticalCount > 0
      ? "优先完成官网 Schema.org 标记和品牌百科词条，可在 1-2 周内见效"
      : bestKeyword
      ? `"${bestKeyword.keyword}" 已有${bestKeyword.mentionRate}%提及率，重点强化该关键词内容，可快速突破 80%`
      : "先完成基础 Schema 标记，再针对零提及关键词创建问答内容";

    const weeksEstimate =
      summary.overallScore >= 60 ? 8 : summary.overallScore >= 40 ? 12 : 16;

    return {
      currentStatus: statusText,
      topOpportunity,
      quickWin,
      estimatedImprovementWeeks: weeksEstimate,
    };
  }

  private buildPriorityMatrix(strategies: GeoStrategyItem[]): PriorityMatrixItem[] {
    const impactMap: Record<GeoStrategyItem["priority"], number> = {
      critical: 9,
      high: 7,
      medium: 5,
      low: 3,
    };
    const effortMap: Record<GeoStrategyItem["difficulty"], number> = {
      easy: 2,
      medium: 5,
      hard: 8,
    };

    return strategies.map((s) => ({
      title: s.title,
      impact: impactMap[s.priority],
      effort: effortMap[s.difficulty],
      category: s.category,
    }));
  }
}

// Singleton
export const geoStrategyAnalyzer = new GeoStrategyAnalyzer();
