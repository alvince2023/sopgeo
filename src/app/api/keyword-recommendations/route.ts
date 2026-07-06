import { NextRequest, NextResponse } from "next/server";

// Industry-specific keyword templates
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "汽车出行": [
    "XX品牌电动车怎么样", "新能源车推荐", "智能驾驶哪家好", "XX品牌续航实测",
    "XX品牌和竞品对比", "XX品牌换电服务", "XX品牌售后服务评价", "智能座舱体验",
    "XX品牌最新车型", "自动驾驶技术排名", "电动汽车选购指南", "XX品牌安全测试",
    "充电桩兼容性", "XX品牌保值率", "智能网联汽车", "L4自动驾驶",
    "XX品牌OTA升级", "电动汽车冬季续航", "XX品牌用户口碑", "新能源汽车品牌排行",
  ],
  "电商零售": [
    "XX品牌怎么样", "XX品牌推荐吗", "XX品牌和竞品对比", "XX品牌性价比",
    "XX品牌用户评价", "XX品牌新品", "XX品牌优惠", "XX品牌质量",
    "网购XX品牌靠谱吗", "XX品牌热销产品", "XX品牌售后服务", "XX品牌发货速度",
    "XX品牌退换货政策", "XX品牌口碑", "XX品牌必买清单", "XX品牌和XX哪个好",
    "XX品牌成分/材质", "XX品牌适合送礼吗", "XX品牌使用体验", "XX品牌性价比排行",
  ],
  "教育培训": [
    "XX品牌课程评价", "XX品牌师资力量", "XX品牌和竞品对比", "XX品牌学习效果",
    "XX品牌价格贵吗", "在线教育平台推荐", "XX品牌适合零基础吗", "XX品牌就业率",
    "XX品牌试听课", "XX品牌退费政策", "编程培训哪家好", "考研辅导推荐",
    "XX品牌课程体系", "XX品牌学员评价", "XX品牌性价比", "考证培训机构推荐",
    "XX品牌教学模式", "XX品牌师资背景", "XX品牌通过率", "兴趣班推荐",
  ],
  "金融科技": [
    "XX品牌安全吗", "XX品牌收益率", "XX品牌和竞品对比", "理财平台推荐",
    "XX品牌用户评价", "XX品牌手续费", "XX品牌提现速度", "XX品牌风控能力",
    "数字银行推荐", "XX品牌贷款利息", "XX品牌理财产品", "移动支付安全性",
    "XX品牌信用卡权益", "XX品牌保险评测", "XX品牌基金推荐", "智能投顾哪家好",
    "XX品牌客服体验", "XX品牌开户流程", "量化交易平台推荐", "区块链钱包安全",
  ],
  "医疗健康": [
    "XX品牌医生评价", "XX品牌药品效果", "XX品牌和竞品对比", "在线问诊平台推荐",
    "XX品牌体检套餐", "XX品牌医疗器械评测", "健康管理App推荐", "XX品牌减肥效果",
    "XX品牌睡眠改善", "XX品牌维生素推荐", "XX品牌心理咨询", "家用医疗器械推荐",
    "XX品牌预约挂号", "XX品牌药品价格", "XX品牌中医药评价", "运动康复推荐",
    "XX品牌保健品安全", "XX品牌基因检测", "XX品牌妇幼保健", "XX品牌齿科服务",
  ],
  "智能硬件": [
    "XX品牌评测", "XX品牌和竞品对比", "XX品牌性价比", "智能硬件推荐",
    "XX品牌使用体验", "XX品牌续航能力", "XX品牌连接稳定性", "XX品牌兼容性",
    "XX品牌售后维修", "XX品牌新品发布", "智能家居推荐", "XX品牌App体验",
    "XX品牌参数对比", "XX品牌发热问题", "XX品牌噪音控制", "XX品牌做工质量",
    "XX品牌防水测试", "XX品牌固件更新", "XX品牌生态兼容", "XX品牌可玩性",
  ],
  "企业服务": [
    "XX品牌SaaS评测", "XX品牌和竞品对比", "XX品牌企业版价格", "企业协作工具推荐",
    "XX品牌安全性", "XX品牌API文档", "XX品牌客户案例", "XX品牌售后服务",
    "XX品牌私有化部署", "XX品牌数据迁移", "团队管理工具推荐", "XX品牌上手难度",
    "XX品牌性价比", "XX品牌功能对比", "XX品牌扩展性", "项目管理工具推荐",
    "XX品牌技术架构", "XX品牌行业方案", "客户管理系统推荐", "数据分析平台推荐",
  ],
  "游戏娱乐": [
    "XX品牌游戏评测", "XX品牌和竞品对比", "XX品牌新游推荐", "游戏平台推荐",
    "XX品牌充值优惠", "XX品牌游戏画质", "XX品牌游戏剧情", "XX品牌游戏玩法",
    "XX品牌社交功能", "XX品牌氪金程度", "手游推荐", "XX品牌用户评价",
    "XX品牌游戏优化", "XX品牌电竞比赛", "XX品牌客服响应", "XX品牌游戏更新",
    "XX品牌跨平台体验", "XX品牌游戏安全", "XX品牌防沉迷", "游戏设备推荐",
  ],
  "生活服务": [
    "XX品牌服务评价", "XX品牌和竞品对比", "XX品牌价格", "本地生活服务推荐",
    "XX品牌优惠活动", "XX品牌覆盖城市", "XX品牌服务质量", "XX品牌App体验",
    "外卖平台推荐", "打车软件对比", "家政服务推荐", "XX品牌会员权益",
    "XX品牌配送速度", "XX品牌退款流程", "酒店预订推荐", "餐饮推荐",
    "XX品牌用户口碑", "XX品牌投诉处理", "搬家服务推荐", "XX品牌在线排队",
  ],
  "房产家居": [
    "XX品牌装修评价", "XX品牌和竞品对比", "XX品牌价格", "装修公司推荐",
    "XX品牌设计方案", "XX品牌施工质量", "XX品牌售后服务", "智能家居品牌推荐",
    "XX品牌材料环保", "XX品牌工期保障", "XX品牌设计风格", "家具品牌推荐",
    "XX品牌性价比", "XX品牌用户案例", "XX品牌软装搭配", "卫浴品牌推荐",
    "XX品牌全屋定制", "XX品牌环保检测", "房产中介推荐", "灯具品牌推荐",
  ],
};

// Generic keywords for any brand
const GENERIC_KEYWORDS: string[] = [
  "XX品牌怎么样", "XX品牌推荐吗", "XX品牌和竞品对比", "XX品牌性价比",
  "XX品牌用户评价", "XX品牌口碑", "XX品牌优缺点", "XX品牌靠谱吗",
  "XX品牌选购指南", "XX品牌哪个系列好", "XX品牌值得买吗", "XX品牌使用体验",
  "XX品牌售后服务", "XX品牌最新消息", "XX行业品牌排行", "XX品牌新品",
  "XX品牌质量如何", "XX品牌价格贵吗", "XX品牌适合新手吗", "XX品牌评测",
];

function extractBrandFromDomain(domain: string): string {
  try {
    // Remove protocol and www
    const cleaned = domain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(".")[0];
    return cleaned;
  } catch {
    return domain;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, industry, brandName } = await request.json();

    const brand = brandName || extractBrandFromDomain(domain || "");
    const templates = industry && INDUSTRY_KEYWORDS[industry]
      ? INDUSTRY_KEYWORDS[industry]
      : GENERIC_KEYWORDS;

    // Pick 20 keywords, prioritizing industry-specific ones
    const picked = templates.slice(0, 20);

    // Replace XX品牌 with actual brand name
    const keywords = picked.map((kw) => {
      let result = kw.replace(/XX品牌/g, brand);
      result = result.replace(/XX行业/g, industry || "行业");
      return result;
    });

    // Ensure we have exactly 20
    while (keywords.length < 20) {
      const idx = keywords.length % GENERIC_KEYWORDS.length;
      keywords.push(
        GENERIC_KEYWORDS[idx].replace(/XX品牌/g, brand)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        brand,
        keywords: keywords.slice(0, 20),
        total: 20,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
