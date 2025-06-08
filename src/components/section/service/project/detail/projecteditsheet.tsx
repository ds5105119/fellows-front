"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectInfoSchema, ProjectInfoSchemaType, ProjectSchemaType, Platform, ReadinessLevel } from "@/@types/service/project";
import { Sheet, SheetContent, SheetFooter, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import DatePickerWithRange from "@/components/form/datepickerwithrange";

const featureList = [
  "💳 PG 연동",
  "👥 소셜",
  "📝 게시물",
  "🙍 기본 회원",
  "🔐 회원가입 및 로그인",
  "📱 마이페이지",
  "🛠️ 관리자 페이지",
  "🔔 알림",
  "📞 고객센터",
  "📁 파일 관리",
  "🚀 온보딩",
  "📊 광고(GA 등)",
  "🛒 상품관리",
  "📦 배송",
  "📱 네이티브 앱",
  "🗺️ 지도",
];

// --- Helper Functions ---
// Zod enum에서 값 목록을 가져오는 함수 (Select, Checkbox 등에서 사용)
const getEnumValues = <T extends z.ZodEnum<[string, ...string[]]>>(enumType: T): z.infer<typeof enumType>[] => {
  return Object.values(enumType.Values) as z.infer<typeof enumType>[];
};

// 날짜 객체 또는 문자열을 YYYY-MM-DD 형식의 문자열로 변환 (Input type="date" 용)
const formatDateForInput = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
};

interface ProjectEditFormProps {
  project: ProjectSchemaType;
  opened?: boolean;
}

export default function ProjectEditForm({ project, opened }: ProjectEditFormProps) {
  const router = useRouter();
  const [initalProject, setInitialProject] = useState<ProjectSchemaType>(project);
  const [open, setOpen] = useState(opened || false);
  const [isLoading, setIsLoading] = useState(false);
  const [feature, setFeature] = useState<string[]>(project.project_info.feature_list ?? []);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: project.project_info.start_date ? new Date(project.project_info.start_date) : undefined,
    to: project.project_info.desired_deadline ? new Date(project.project_info.desired_deadline) : undefined,
  });
  const form = useForm<ProjectInfoSchemaType>({
    resolver: zodResolver(ProjectInfoSchema),
    defaultValues: {
      project_name: project.project_info.project_name || "",
      project_summary: project.project_info.project_summary || "",
      platforms: project.project_info.platforms || [],
      readiness_level: project.project_info.readiness_level,
      design_requirements: project.project_info.design_requirements || null,
      feature_list: project.project_info.feature_list || null,
      content_pages: project.project_info.content_pages === null ? undefined : project.project_info.content_pages,
      preferred_tech_stack: project.project_info.preferred_tech_stack || null,
      start_date: formatDateForInput(project.project_info.start_date),
      desired_deadline: formatDateForInput(project.project_info.desired_deadline),
      maintenance_required: project.project_info.maintenance_required || false,
    },
  });
  const {
    setValue,
    resetField,
    reset,
    formState: { isDirty },
  } = form;

  const handleDateSelect = (range: DateRange | undefined) => {
    const start = range?.from ? format(range.from, "yyyy-MM-dd") : "";
    const end = range?.to ? format(range.to, "yyyy-MM-dd") : "";
    if (start === initalProject.project_info.start_date || "") resetField("start_date", { defaultValue: initalProject.project_info.start_date });
    else setValue("start_date", start, { shouldDirty: true });
    if (end === initalProject.project_info.desired_deadline || "")
      resetField("desired_deadline", { defaultValue: initalProject.project_info.desired_deadline });
    else setValue("desired_deadline", end, { shouldDirty: true });
    setDateRange(range);
  };

  const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const index = feature.findIndex((item) => item.startsWith("기타:"));
    const updatedFeature = [...feature];

    if (index !== -1)
      if (event.target.value) {
        updatedFeature[index] = `기타: ${event.target.value}`;
      } else {
        updatedFeature.splice(index, 1);
      }

    const initFeature = initalProject.project_info.feature_list || [];
    const areEqual = updatedFeature.length === initFeature.length && updatedFeature.every((item) => initFeature.includes(item));

    setFeature(updatedFeature);
    if (areEqual) resetField("feature_list", { defaultValue: updatedFeature });
    else setValue("feature_list", updatedFeature, { shouldDirty: true });
  };

  const handleFeatureButtonClick = (value: string) => {
    const updatedFeature = feature.find((item) => item == value) ? feature.filter((item) => item !== value) : [...feature, value];
    const initFeature = initalProject.project_info.feature_list || [];
    const areEqual = updatedFeature.length === initFeature.length && updatedFeature.every((item) => initFeature.includes(item));

    setFeature(updatedFeature);
    if (areEqual) resetField("feature_list", { defaultValue: updatedFeature });
    else setValue("feature_list", updatedFeature, { shouldDirty: true });
  };

  async function onSubmit(values: ProjectInfoSchemaType) {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.");
      return;
    }

    setIsLoading(true);

    const payload = {
      ...values,
      content_pages:
        values.content_pages === undefined || values.content_pages === null || isNaN(Number(values.content_pages)) ? null : Number(values.content_pages),
      design_requirements: values.design_requirements || null,
      feature_list: values.feature_list?.length ? values.feature_list : null,
      preferred_tech_stack: values.preferred_tech_stack?.length ? values.preferred_tech_stack : null,
    };

    try {
      const response = await fetch(`/api/service/project/${project.project_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
      toast.success("프로젝트 정보가 성공적으로 업데이트되었습니다.");
      router.push(`/service/project/${project.project_id}`);
      router.refresh();
    } catch (error) {
      toast.error("프로젝트 업데이트 중 오류 발생", {
        description: "서버와 통신 중 문제가 발생했습니다.",
      });
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
      setInitialProject({ ...project, project_info: { ...project.project_info, ...values } });
      reset();
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-24">
          수정
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-6 pb-4 min-w-full md:min-w-[540px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full h-full">
            <SheetHeader className="px-8">
              <SheetTitle>프로젝트 정보 수정</SheetTitle>
              <SheetDescription>프로젝트 정보를 수정합니다.</SheetDescription>
            </SheetHeader>
            <div className="w-full flex flex-col space-y-6 px-8 overflow-y-auto">
              {/* --- 필수 항목 --- */}
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      프로젝트 이름<p className="text-red-600">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="예: ABC 쇼핑몰 구축" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      프로젝트 개요<p className="text-red-600">*</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="프로젝트의 주요 목표 및 기능 설명 (2-3 문장)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platforms"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      플랫폼<p className="text-red-600">*</p>
                    </FormLabel>
                    <div className="flex flex-wrap gap-4 pt-1">
                      {getEnumValues(Platform).map((platformValue) => (
                        <FormField
                          key={platformValue}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl>
                                  <Button
                                    variant={field.value?.includes(platformValue) ? "default" : "outline"}
                                    onClick={() => {
                                      return field.value?.includes(platformValue)
                                        ? field.onChange((field.value || []).filter((value) => value !== platformValue))
                                        : field.onChange([...(field.value || []), platformValue]);
                                    }}
                                    type="button"
                                  >
                                    {platformValue === "web" ? "웹" : platformValue === "android" ? "Android" : "iOS"}
                                  </Button>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="readiness_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      사전 준비도<p className="text-red-600">*</p>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="준비 단계를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getEnumValues(ReadinessLevel).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 디자인 요구사항 --- */}
              <FormField
                control={form.control}
                name="design_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디자인 요구사항</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="구체적인 디자인 관련 요구사항 입력 (예: Figma 시안 기반 개발)"
                        {...field}
                        // Pydantic에서 nullable이므로 Zod도 nullable().optional() 처리
                        value={field.value ?? ""} // null일 경우 빈 문자열로 표시
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 기능 요구사항 --- */}
              <FormField
                control={form.control}
                name="feature_list"
                render={() => (
                  <FormItem>
                    <FormLabel>주요 기능 목록</FormLabel>
                    <div className="w-full grid grid-cols-2 gap-2">
                      {featureList.map((val) => {
                        const isChecked = feature.find((item) => item == val);

                        return (
                          <button
                            type="button"
                            key={val}
                            className={cn(
                              "flex items-center justify-between not-odd:col-span-1 py-2.5 px-3 rounded-md border-[1.5px] font-semibold text-sm cursor-pointer",
                              isChecked ? "border-blue-300 bg-blue-50" : "border-neutral-300 bg-gray-50"
                            )}
                            onClick={() => {
                              handleFeatureButtonClick(val);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleFeatureButtonClick(val)}
                          >
                            <p className="pl-1.5">{val}</p>
                            <SwitchIndicator checked={!!isChecked} />
                          </button>
                        );
                      })}
                    </div>
                    <FormControl>
                      <Input placeholder="더 필요한 기능이 있다면 적어주세요" onChange={handleFeatureChange} />
                    </FormControl>
                    <FormDescription>쉼표(,)로 구분하여 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>콘텐츠 페이지 수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="예: 10"
                        {...field}
                        value={field.value ?? ""} // null이면 빈 문자열
                        onChange={(e) => {
                          const value = e.target.value;
                          // 숫자로 변환하거나, 비어있으면 null로 설정
                          field.onChange(value === "" ? null : parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 기술 및 환경 --- */}
              <FormField
                control={form.control}
                name="preferred_tech_stack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>선호 기술 스택</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="필요한 기술 스택을 쉼표(,)로 구분하여 입력 (예: React, Node.js, PostgreSQL)"
                        value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                        onChange={(e) => {
                          const features = e.target.value
                            .split(",")
                            .map((f) => f.trim())
                            .filter((f) => f.length > 0);
                          field.onChange(features.length > 0 ? features : null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>쉼표(,)로 구분하여 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 일정 및 기타 --- */}
              <FormField
                control={form.control}
                name="start_date" // required but hidden
                render={() => (
                  <FormItem>
                    <FormLabel>희망 기간</FormLabel>
                    <FormDescription>시작일과 완료일을 한 번에 선택하세요.</FormDescription>
                    <FormControl>
                      <DatePickerWithRange value={dateRange} onSelect={handleDateSelect} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <input type="hidden" {...form.register("start_date")} />
              <input type="hidden" {...form.register("desired_deadline")} />

              <FormField
                control={form.control}
                name="maintenance_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>유지보수 필요</FormLabel>
                      <FormDescription>{field.value ? "출시 후 유지보수가 필요합니다." : "출시 후 유지보수가 필요하지 않습니다."}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="px-8">
              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading || !isDirty}>
                  {isLoading ? "저장 중..." : "변경사항 저장"}
                </Button>
                <Button variant="secondary" type="button" onClick={() => reset()}>
                  초기화
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
