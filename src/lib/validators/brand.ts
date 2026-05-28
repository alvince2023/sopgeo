import { z } from "zod";

export const brandFormSchema = z.object({
  name: z
    .string()
    .min(2, "品牌名称至少2个字符")
    .max(50, "品牌名称不能超过50个字符"),
  website: z
    .string()
    .url("请输入有效的网址")
    .optional()
    .or(z.literal("")),
  industry: z.string().optional(),
  description: z
    .string()
    .max(500, "描述不能超过500个字符")
    .optional()
    .or(z.literal("")),
  keywords: z
    .array(z.string().min(1, "关键词不能为空"))
    .min(1, "至少添加1个关键词")
    .max(20, "最多添加20个关键词"),
  platforms: z
    .array(z.string())
    .min(1, "至少选择1个监控平台"),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;
