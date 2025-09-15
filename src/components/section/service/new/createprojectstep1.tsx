"use client";

import type { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { platformEnum, readinessLevelEnum, type CreateERPNextProject, type ProjectMethod } from "@/@types/service/project";
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

function ProjectMethodButton({
  value,
  selected,
  readiness,
  onChange,
}: {
  value: ProjectMethod;
  selected: CreateERPNextProject["custom_project_method"];
  readiness: string | undefined;
  onChange: (value: CreateERPNextProject["custom_project_method"]) => void;
}) {
  const method = PROJECT_METHOD_MAPPING[value as keyof typeof PROJECT_METHOD_MAPPING];

  return (
    <button
      type="button"
      className={cn(
        "flex flex-col space-y-1.5 shadow-none transition-colors duration-200 ease-in-out rounded-md text-start p-4",
        value === selected ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
      )}
      onClick={() => onChange(value)}
    >
      <p className="w-full font-bold">{method.title}</p>
      <div className="px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2 bg-foreground text-background">특징</div>
      <p className="w-full text-sm font-medium">{method.description}</p>
      <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold w-fit mt-2", "shadow-[inset_0_0_0_1px] shadow-foreground/70 text-foreground")}>
        예상 비용
      </div>
      <p className="w-full text-sm font-medium">{method.price[readiness as keyof typeof method.price]}만 원~</p>
    </button>
  );
}

export default function CreateProjectFormStep1({ form }: CreateProjectFormStep1Props) {
  const { control, getValues, setValue, watch } = form;
  const platforms = getValues("custom_platforms");
  const readiness = getValues("custom_readiness_level");
  const projectMethod = watch("custom_project_method");

  const filteredPlatforms = useMemo(() => {
    let allowedKeys: string[] = [];

    if (projectMethod === "nocode") {
      allowedKeys = ["imweb", "framer", "wordpress", "webflow", "bubble", "other"];
    } else if (projectMethod === "shop") {
      allowedKeys = ["shopify", "imweb", "cafe24", "other"];
    }

    return (Object.entries(NOCODE_PLATFORM_MAPPING) as [keyof typeof NOCODE_PLATFORM_MAPPING, { title: string; description: string }][]).filter(([key]) =>
      allowedKeys.includes(key)
    );
  }, [projectMethod]);

  const availableMethods = useMemo(() => {
    const methods: string[] = [];

    if (platforms.length > 0) methods.push("code");
    if (platforms.length > 0 && !platforms.some((i) => ["android", "ios"].includes(i.platform))) {
      methods.push("nocode", "shop");
    }

    return methods as ProjectMethod[];
  }, [platforms]);

  return (
    <>
      <FormField
        control={control}
        name="custom_project_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="project_name" className="text-sm font-medium">
              프로젝트 이름
            </FormLabel>
            <FormControl>
              <AnimatedUnderlineInput placeholder="이름을 입력해주세요. (예: 쇼핑몰 구축)" {...field} value={field.value ?? ""} id="project_name" />
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
                      {availableMethods.map((method) => (
                        <ProjectMethodButton
                          key={method}
                          value={method}
                          selected={field.value}
                          readiness={readiness}
                          onChange={(val) => {
                            field.onChange(val);
                            setValue("custom_nocode_platform", undefined);
                          }}
                        />
                      ))}
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
        {projectMethod !== "code" && projectMethod && (
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
                          "col-span-1 font-semibold shadow-none transition-colors duration-200 ease-in-out rounded-md text-start text-sm p-4",
                          field.value === key ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                        )}
                        type="button"
                        key={key}
                        onClick={() => {
                          field.onChange(key);
                        }}
                      >
                        <p className="w-full font-bold">{value.title}</p>
                        <p className="w-full text-sm font-medium mt-1">{value.description}</p>
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
