"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { readinessLevelLabels } from "@/components/resource/project";
import { PlatformEnumZod, ReadinessLevelEnumZod, UserERPNextProjectType } from "@/@types/service/erpnext";
interface CreateProjectFormStep1Props {
  form: UseFormReturn<UserERPNextProjectType>;
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
              <Input
                placeholder="프로젝트의 이름을 입력해주세요. (예: 쇼핑몰 구축)"
                className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 h-12"
                {...field}
                value={field.value ?? ""}
              />
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
              <Textarea
                placeholder="프로젝트의 주요 구현 목표에 대해 설명해주세요."
                className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 py-4 min-h-36"
                {...field}
                value={field.value ?? ""}
              />
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
              {getEnumValues(PlatformEnumZod).map((platform) => (
                <Button
                  className={cn(
                    "col-span-1 h-12 hover:bg-gray-300 font-semibold transition-colors duration-200 ease-in-out rounded-2xl",
                    (field.value || []).some((p) => p.platform == platform) ? "!bg-blue-100 text-blue-600" : "bg-gray-100"
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
                {getEnumValues(ReadinessLevelEnumZod).map((level) => (
                  <button
                    type="button"
                    key={level as string}
                    className={cn(
                      "col-span-1 border-none shadow-none bg-gray-100 p-2.5 rounded-2xl h-12",
                      level === field.value ? "!bg-blue-100 text-blue-600" : "bg-gray-100"
                    )}
                    onClick={() => field.onChange(level)}
                  >
                    <div className="text-sm font-semibold">
                      {readinessLevelLabels[level]?.icon} {readinessLevelLabels[level]?.title || level}
                    </div>
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
