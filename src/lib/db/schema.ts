import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  company: text("company"),
  phone: text("phone"),
  plan: text("plan").default("free"),
  planExpiresAt: timestamp("plan_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brands
export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  website: text("website"),
  industry: text("industry"),
  description: text("description"),
  logo: text("logo"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Keywords
export const keywords = pgTable("keywords", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  word: text("word").notNull(),
  category: text("category").default("brand"),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Brand AI Platform Config
export const brandPlatforms = pgTable("brand_platforms", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  platform: text("platform").notNull(),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Competitors
export const competitors = pgTable("competitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  competitorName: text("competitor_name").notNull(),
  competitorWebsite: text("competitor_website"),
  competitorDescription: text("competitor_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Monitor Snapshots
export const monitorSnapshots = pgTable(
  "monitor_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .references(() => brands.id, { onDelete: "cascade" })
      .notNull(),
    platform: text("platform").notNull(),
    keyword: text("keyword").notNull(),
    query: text("query").notNull(),
    response: text("response"),
    mentioned: boolean("mentioned").default(false),
    mentionContext: text("mention_context"),
    sentiment: text("sentiment"),
    position: integer("position"),
    citationCount: integer("citation_count").default(0),
    visibilityScore: decimal("visibility_score", {
      precision: 5,
      scale: 2,
    }),
    rawData: jsonb("raw_data"),
    queriedAt: timestamp("queried_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    brandPlatformIdx: index("brand_platform_queried_idx").on(
      table.brandId,
      table.platform,
      table.queriedAt
    ),
    keywordIdx: index("keyword_idx").on(table.brandId, table.keyword),
  })
);

// Visibility Scores (aggregated)
export const visibilityScores = pgTable(
  "visibility_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .references(() => brands.id, { onDelete: "cascade" })
      .notNull(),
    platform: text("platform").notNull(),
    period: text("period").notNull(),
    periodDate: text("period_date").notNull(),
    overallScore: decimal("overall_score", { precision: 5, scale: 2 }),
    mentionRate: decimal("mention_rate", { precision: 5, scale: 2 }),
    recommendationRate: decimal("recommendation_rate", {
      precision: 5,
      scale: 2,
    }),
    citationRate: decimal("citation_rate", { precision: 5, scale: 2 }),
    totalQueries: integer("total_queries").default(0),
    mentionedQueries: integer("mentioned_queries").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniquePeriod: uniqueIndex("brand_platform_period_idx").on(
      table.brandId,
      table.platform,
      table.period,
      table.periodDate
    ),
  })
);

// Competitor Scores
export const competitorScores = pgTable("competitor_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  competitorId: uuid("competitor_id")
    .references(() => competitors.id, { onDelete: "cascade" })
    .notNull(),
  platform: text("platform").notNull(),
  period: text("period").notNull(),
  periodDate: text("period_date").notNull(),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }),
  mentionRate: decimal("mention_rate", { precision: 5, scale: 2 }),
  shareOfVoice: decimal("share_of_voice", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  data: jsonb("data"),
  pdfUrl: text("pdf_url"),
  status: text("status").default("draft"),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Usage Records
export const usageRecords = pgTable(
  "usage_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    brandId: uuid("brand_id").references(() => brands.id),
    type: text("type").notNull(),
    quantity: integer("quantity").default(1),
    consumedAt: timestamp("consumed_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userDateIdx: index("user_date_consumed_idx").on(
      table.userId,
      table.consumedAt
    ),
  })
);

// Alerts
export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  severity: text("severity").default("warning"),
  title: text("title").notNull(),
  description: text("description"),
  data: jsonb("data"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
