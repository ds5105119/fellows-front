"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { platformEnum, readinessLevelEnum, UserERPNextProject } from "@/@types/service/project";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import AnimatedUnderlineTextarea from "@/components/ui/animatedunderlinetextarea";

interface CreateProjectFormStep1Props {
  form: UseFormReturn<UserERPNextProject>;
}

const getEnumValues = <T extends z.ZodEnum<[string, ...string[]]>>(enumType: T): z.infer<typeof enumType>[] => {
  return Object.values(enumType.Values) as z.infer<typeof enumType>[];
};

export default function CreateProjectFormStep1({ form }: CreateProjectFormStep1Props) {
  const { control } = form;

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
        name="custom_platforms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">플랫폼</FormLabel>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {getEnumValues(platformEnum).map((platform) => (
                <Button
                  className={cn(
                    "col-span-1 h-11 font-semibold shadow-none transition-colors duration-200 ease-in-out rounded-md",
                    (field.value || []).some((p) => p.platform == platform) ? "bg-blue-500 text-background hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-300"
                  )}
                  type="button"
                  key={platform as string}
                  variant="secondary"
                  onClick={() => {
                    const current = field.value || [];
                    const include = current.some((p) => p.platform === platform);
                    field.onChange(include ? current.filter((p) => p.platform !== platform) : [...current, { platform }]);
                  }}
                >
                  {platform === "web" ? "웹" : platform === "android" ? "Android" : "iOS"}
                </Button>
              ))}
            </div>
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
                    <div className="text-sm font-semibold">{level}</div>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col space-y-2"></div>
    </>
  );
}
