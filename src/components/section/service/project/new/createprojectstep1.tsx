"use client";

import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProjectInfoSchemaType, Platform, ReadinessLevel } from "@/@types/service/project";
import { readinessLevelLabels } from "@/components/resource/project";
import { getEnumValues } from "@/components/section/service/project/new/createproject";
interface CreateProjectFormStep1Props {
  form: UseFormReturn<ProjectInfoSchemaType>;
}

export default function CreateProjectFormStep1({ form }: CreateProjectFormStep1Props) {
  const { control } = form;

  return (
    <>
      <FormField
        control={control}
        name="project_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">프로젝트 이름</FormLabel>
            <FormControl>
              <Input
                placeholder="프로젝트의 이름을 입력해주세요. (얘: 쇼핑몰 구축)"
                className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 h-12"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="project_summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">프로젝트 개요</FormLabel>
            <FormControl>
              <Textarea
                placeholder="프로젝트의 주요 구현 목표에 대해 설명해주세요."
                className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 py-4 min-h-36"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="platforms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">플랫폼</FormLabel>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {getEnumValues(Platform).map((platformValue) => (
                <Button
                  className={cn(
                    "col-span-1 h-12 hover:bg-gray-300 font-semibold transition-colors duration-200 ease-in-out rounded-2xl",
                    (field.value || []).includes(platformValue as Platform) ? "!bg-primary text-white" : "bg-gray-100"
                  )}
                  type="button"
                  key={platformValue as string}
                  variant="secondary"
                  onClick={() => {
                    const currentPlatforms = field.value || [];
                    const typedPlatformValue = platformValue as Platform;
                    const newPlatforms = currentPlatforms.includes(typedPlatformValue)
                      ? currentPlatforms.filter((p) => p !== typedPlatformValue)
                      : [...currentPlatforms, typedPlatformValue];
                    field.onChange(newPlatforms);
                  }}
                >
                  {platformValue === "web" ? "웹" : platformValue === "android" ? "Android" : "iOS"}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="readiness_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">사전 준비도</FormLabel>
            <FormControl>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                {getEnumValues(ReadinessLevel).map((level) => (
                  <button
                    type="button"
                    key={level as string}
                    className={cn(
                      "col-span-1 border-none shadow-none bg-gray-100 p-2.5 rounded-2xl h-12",
                      level === field.value ? "bg-primary text-white" : "bg-gray-100"
                    )}
                    onClick={() => field.onChange(level as ReadinessLevel)}
                  >
                    <div className="text-sm font-semibold">
                      {readinessLevelLabels[level as ReadinessLevel]?.icon} {readinessLevelLabels[level as ReadinessLevel]?.title || level}
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
