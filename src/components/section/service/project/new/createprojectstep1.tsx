"use client";

import type { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { platformEnum, readinessLevelEnum, type CreateERPNextProject } from "@/@types/service/project";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import AnimatedUnderlineTextarea from "@/components/ui/animatedunderlinetextarea";
import { PLATFORM_MAPPING, READYNISS_MAPPING, PROJECT_METHOD_MAPPING, NOCODE_PLATFORM_MAPPING } from "@/components/resource/project";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface CreateProjectFormStep1Props {
  form: UseFormReturn<CreateERPNextProject>;
}

const getEnumValues = <T extends z.ZodEnum<[string, ...string[]]>>(enumType: T): z.infer<typeof enumType>[] => {
  return Object.values(enumType.Values) as z.infer<typeof enumType>[];
};

export default function CreateProjectFormStep1({ form }: CreateProjectFormStep1Props) {
  const { control, getValues, setValue } = form;
  const platforms = getValues("custom_platforms");
  const readiness = getValues("custom_readiness_level");
  const projectMethod = getValues("custom_project_method");

  const filteredPlatforms = useMemo(() => {
    let allowedKeys: string[] = [];

    if (projectMethod === "nocode") {
      allowedKeys = ["cafe24", "godo", "imweb", "shopify", "framer"];
    } else if (projectMethod === "shop") {
      allowedKeys = ["cafe24", "godo", "imweb", "shopify"];
    }

    return (Object.entries(NOCODE_PLATFORM_MAPPING) as [keyof typeof NOCODE_PLATFORM_MAPPING, { title: string; description: string }][]).filter(([key]) =>
      allowedKeys.includes(key)
    );
  }, [projectMethod]);

  return (
    <>
      <FormField
        control={control}
        name="custom_project_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">프로젝트 이름</FormLabel>
            <FormControl>
              <AnimatedUnderlineInput placeholder="이름을 입력해주세요. (예: 쇼핑몰 구축)" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="custom_project_summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">프로젝트 개요</FormLabel>
            <FormControl>
              <AnimatedUnderlineTextarea placeholder="주요 구현 목표에 대해 설명해주세요." {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="custom_readiness_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">사전 준비도</FormLabel>
            <FormControl>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                {getEnumValues(readinessLevelEnum).map((level) => (
                  <button
                    type="button"
                    key={level as string}
                    className={cn(
                      "col-span-1 h-11 font-semibold shadow-none transition-colors duration-200 ease-in-out rounded-md",
                      level === field.value ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                    )}
                    onClick={() => field.onChange(level)}
                  >
                    <div className="text-sm font-semibold">{READYNISS_MAPPING[level].title}</div>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="custom_platforms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">플랫폼</FormLabel>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {getEnumValues(platformEnum).map((platform) => (
                <button
                  className={cn(
                    "col-span-1 h-11 font-semibold shadow-none transition-colors duration-200 ease-in-out rounded-md text-sm",
                    (field.value || []).some((p) => p.platform == platform) ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                  )}
                  type="button"
                  key={platform as string}
                  onClick={() => {
                    const current = field.value || [];
                    const include = current.some((p) => p.platform === platform);
                    field.onChange(include ? current.filter((p) => p.platform !== platform) : [...current, { platform }]);
                    setValue("custom_project_method", undefined);
                  }}
                >
                  {PLATFORM_MAPPING[platform]}
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <AnimatePresence>
        {platforms && platforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <FormField
              control={control}
              name="custom_project_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">개발 방식</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-3">
                      {platforms.length > 0 && (
                        <button
                          type="button"
                          className={cn(
                            "flex flex-col space-y-1.5 shadow-none transition-colors duration-200 ease-in-out rounded-md text-start p-4",
                            "code" === field.value ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                          )}
                          onClick={() => {
                            if (field.value !== "code") {
                              field.onChange("code");
                            } else {
                              field.onChange(undefined);
                            }
                            setValue("custom_nocode_platform", undefined);
                          }}
                        >
                          <p className="w-full font-bold">{PROJECT_METHOD_MAPPING["code"].title}</p>
                          <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2 bg-foreground text-background")}>특징</div>
                          <p className="w-full text-sm font-medium">{PROJECT_METHOD_MAPPING["code"].description}</p>
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2",
                              "shadow-[inset_0_0_0_1px] shadow-foreground/70 text-foreground",
                              "transform-gpu backface-hidden will-change-transform"
                            )}
                          >
                            가격
                          </div>
                          <p className="w-full text-sm font-medium">
                            {readiness == "idea" ? "2000만 원~" : readiness == "requirements" ? "1800만 원~" : "1000만 원~"}
                          </p>
                        </button>
                      )}
                      {platforms.length && !platforms.some((i) => i.platform == "android") && !platforms.some((i) => i.platform == "ios") && (
                        <button
                          type="button"
                          className={cn(
                            "flex flex-col space-y-1.5 shadow-none transition-colors duration-200 ease-in-out rounded-md text-start p-4",
                            "nocode" === field.value ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                          )}
                          onClick={() => {
                            if (field.value !== "nocode") {
                              field.onChange("nocode");
                            } else {
                              field.onChange(undefined);
                            }
                            setValue("custom_nocode_platform", undefined);
                          }}
                        >
                          <p className="w-full font-bold">{PROJECT_METHOD_MAPPING["nocode"].title}</p>
                          <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2 bg-foreground text-background")}>특징</div>
                          <p className="w-full text-sm font-medium">{PROJECT_METHOD_MAPPING["nocode"].description}</p>
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2",
                              "shadow-[inset_0_0_0_1px] shadow-foreground/70 text-foreground",
                              "transform-gpu backface-hidden will-change-transform"
                            )}
                          >
                            가격
                          </div>
                          <p className="w-full text-sm font-medium">
                            {readiness == "idea" ? "1100만 원~" : readiness == "requirements" ? "300만 원~" : "100만 원~"}
                          </p>
                        </button>
                      )}
                      {platforms.length && !platforms.some((i) => i.platform == "android") && !platforms.some((i) => i.platform == "ios") && (
                        <button
                          type="button"
                          className={cn(
                            "flex flex-col space-y-1.5 shadow-none transition-colors duration-200 ease-in-out rounded-md text-start p-4",
                            "shop" === field.value ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                          )}
                          onClick={() => {
                            if (field.value !== "shop") {
                              field.onChange("shop");
                            } else {
                              field.onChange(undefined);
                            }
                            setValue("custom_nocode_platform", undefined);
                          }}
                        >
                          <p className="w-full font-bold">{PROJECT_METHOD_MAPPING["shop"].title}</p>
                          <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2 bg-foreground text-background")}>특징</div>
                          <p className="w-full text-sm font-medium">{PROJECT_METHOD_MAPPING["shop"].description}</p>
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2",
                              "shadow-[inset_0_0_0_1px] shadow-foreground/70 text-foreground",
                              "transform-gpu backface-hidden will-change-transform"
                            )}
                          >
                            가격
                          </div>
                          <p className="w-full text-sm font-medium">
                            {readiness == "idea" ? "1300만 원~" : readiness == "requirements" ? "500만 원~" : "300만 원~"}
                          </p>
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {projectMethod !== "code" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <FormField
              control={control}
              name="custom_nocode_platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">노코드 플랫폼</FormLabel>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredPlatforms.map(([key, value]) => (
                      <button
                        className={cn(
                          "col-span-1 h-11 font-semibold shadow-none transition-colors duration-200 ease-in-out rounded-md text-sm",
                          field.value === key ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                        )}
                        type="button"
                        key={key}
                        onClick={() => {
                          field.onChange(key);
                        }}
                      >
                        {value.title}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
