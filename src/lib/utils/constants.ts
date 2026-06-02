// Marketing site sections
export const SITE = {
  name: "SopGeo",
  tagline: "让你的品牌，在AI搜索结果中被看见",
  description: "首个专注中文市场的AI搜索GEO平台。监控品牌在AI引擎中的可见度，按效果付费。",
  domain: "sopgeo.cn",
  email: "hello@sopgeo.cn",
};

// AI Platforms
export const PLATFORMS = {
  minimax: { name: "MiniMax", priority: 0, color: "#5C7CFA" },
  deepseek: { name: "DeepSeek", priority: 0, color: "#4F46E5" },
  doubao: { name: "豆包", priority: 0, color: "#00D9C5" },
  kimi: { name: "Kimi", priority: 0, color: "#6366F1" },
  wenxin: { name: "文心一言", priority: 0, color: "#EC4899" },
  tongyi: { name: "通义千问", priority: 1, color: "#F97316" },
  zhipu: { name: "智谱清言", priority: 1, color: "#14B8A6" },
  yuanbao: { name: "腾讯元宝", priority: 1, color: "#06B6D4" },
} as const;

export type PlatformKey = keyof typeof PLATFORMS;

// Monitoring query types
export const QUERY_TYPES = [
  { value: "recommendation", label: "推荐类查询" },
  { value: "comparison", label: "对比类查询" },
  { value: "knowledge", label: "知识类查询" },
  { value: "solution", label: "问题解决类查询" },
] as const;

// Industries
export const INDUSTRIES = [
  "企业服务",
  "电商零售",
  "教育培训",
  "金融科技",
  "医疗健康",
  "智能硬件",
  "游戏娱乐",
  "生活服务",
  "汽车出行",
  "房产家居",
] as const;

// Scoring weights
export const SCORING_WEIGHTS = {
  mention: 0.3,
  position: 0.25,
  sentiment: 0.2,
  citation: 0.15,
  coOccurrence: 0.1,
};
