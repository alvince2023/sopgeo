"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useBrandStore } from "@/stores/brand-store";
import { brandFormSchema, type BrandFormValues } from "@/lib/validators/brand";
import { PLATFORMS, INDUSTRIES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

const STEPS = ["品牌信息", "关键词配置", "平台选择"] as const;

export default function NewBrandPage() {
  const router = useRouter();
  const createBrand = useBrandStore((s) => s.createBrand);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      website: "",
      industry: "",
      description: "",
      keywords: [""],
      platforms: ["doubao"],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const keywords = watch("keywords");
  const selectedPlatforms = watch("platforms");

  const addKeyword = () => {
    const current = watch("keywords");
    if (current.length < 20) {
      setValue("keywords", [...current, ""]);
    }
  };

  const removeKeyword = (idx: number) => {
    const current = watch("keywords");
    if (current.length > 1) {
      setValue(
        "keywords",
        current.filter((_, i) => i !== idx)
      );
    }
  };

  const togglePlatform = (platform: string) => {
    const current = watch("platforms");
    if (current.includes(platform)) {
      if (current.length > 1) {
        setValue(
          "platforms",
          current.filter((p) => p !== platform)
        );
      }
    } else {
      setValue("platforms", [...current, platform]);
    }
  };

  const onSubmit = async (data: BrandFormValues) => {
    setIsSubmitting(true);
    try {
      const brand = await createBrand(data);
      // Navigate to brand detail page — monitor will auto-run there
      router.push(`/dashboard/brands/${brand.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 0) {
      const name = form.getValues("name");
      if (!name || name.length < 2) {
        form.trigger("name");
        return;
      }
    }
    if (step === 1) {
      const kws = form.getValues("keywords");
      if (!kws.some((k) => k.trim())) {
        form.trigger("keywords");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/brands"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回品牌列表
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          添加新品牌
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          配置品牌信息，开始 AI 可见度监控
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                i === step
                  ? "bg-[#5C7CFA]/10 text-[#5C7CFA]"
                  : i < step
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-white/[0.03] text-slate-400"
              )}
            >
              {i < step ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  {i + 1}
                </span>
              )}
              {label}
            </div>
            {i < 2 && (
              <div
                className={cn(
                  "w-8 h-px",
                  i < step ? "bg-emerald-500/30" : "bg-white/[0.06]"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 0: Brand Info */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    品牌名称 <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="例如：蔚来汽车"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1.5">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    官网网址
                  </label>
                  <input
                    {...register("website")}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all"
                  />
                  {errors.website && (
                    <p className="text-xs text-red-400 mt-1.5">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    所属行业
                  </label>
                  <select
                    {...register("industry")}
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">请选择行业</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    品牌描述
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="简要描述品牌定位和核心业务..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 mt-1.5">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-5 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#5C7CFA]/90 transition-colors"
                >
                  下一步：配置关键词
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Keywords */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    监控关键词 <span className="text-red-400">*</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    添加用户在 AI 搜索中可能使用的查询词，例如品牌词、产品词、行业词
                  </p>

                  <div className="space-y-2">
                    {keywords.map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          {...register(`keywords.${idx}`)}
                          placeholder={`关键词 ${idx + 1}`}
                          className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-slate-400/50 focus:outline-none focus:ring-2 focus:ring-[#5C7CFA]/30 focus:border-[#5C7CFA]/30 transition-all"
                        />
                        {keywords.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeyword(idx)}
                            className="p-2.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.keywords && (
                    <p className="text-xs text-red-400 mt-1.5">
                      {errors.keywords.message || errors.keywords.root?.message}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={addKeyword}
                    className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#5C7CFA] hover:text-[#5C7CFA]/80 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加更多关键词
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-5 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#5C7CFA]/90 transition-colors"
                >
                  下一步：选择平台
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Platforms */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    选择监控平台 <span className="text-red-400">*</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    选择要监控的 AI 搜索平台，不同平台的可见度独立计算
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(PLATFORMS).map(([key, platform]) => {
                      const isSelected = selectedPlatforms.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => togglePlatform(key)}
                          className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                            isSelected
                              ? "border-[#5C7CFA]/50 bg-[#5C7CFA]/5"
                              : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                          )}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${platform.color}15`,
                              color: platform.color,
                            }}
                          >
                            <span className="text-lg font-bold">
                              {platform.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-center">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isSelected
                                  ? "text-white"
                                  : "text-slate-400"
                              )}
                            >
                              {platform.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {key === "doubao"
                                ? "字节跳动"
                                : key === "deepseek"
                                ? "深度求索"
                                : key === "kimi"
                                ? "月之暗面"
                                : key === "wenxin"
                                ? "百度"
                                : key === "tongyi"
                                ? "阿里"
                                : key === "zhipu"
                                ? "智谱AI"
                                : "腾讯"}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#5C7CFA] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.platforms && (
                    <p className="text-xs text-red-400 mt-2">
                      {errors.platforms.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  上一步
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5C7CFA] text-white rounded-lg text-sm font-medium hover:bg-[#5C7CFA]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "创建并启动监控..." : "完成创建"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
