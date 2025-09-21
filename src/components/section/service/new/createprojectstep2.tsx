"use client";

import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { FeatureItemWithTooltip } from "@/components/form/featureitemwithtooltip";
import { categorizedFeatures } from "@/components/resource/project";
import { CreateProjectStep2MaintenanceField } from "./createprojectstep2maintenancefield";
import { CreateERPNextProject } from "@/@types/service/project";
import { motion, AnimatePresence } from "framer-motion";
import TagInput from "@/components/form/taginput";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import DatePicker from "@/components/section/service/new/datepicker";
import dayjs from "@/lib/dayjs";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface CreateProjectFormStep2Props {
  form: UseFormReturn<CreateERPNextProject>;
}

const areFeaturesEqual = (
  a: { doctype: string | null; feature: string }[] | null | undefined,
  b: { doctype: string | null; feature: string }[] | null | undefined
) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const setB = new Set(b.map((f) => f.feature));
  return a.every((f) => setB.has(f.feature));
};

export default function CreateProjectFormStep2({ form }: CreateProjectFormStep2Props) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const projectMethod = useWatch({ name: "custom_project_method", control });
  const customFeatures = useWatch({ name: "custom_features", control });

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  // 1. 사용자 인터랙션: UI 상태인 openMap만 직접 변경
  const toggleCategory = (categoryTitle: string) => {
    setOpenMap((prev) => ({ ...prev, [categoryTitle]: !prev[categoryTitle] }));
  };

  // 2. UI 변경 -> 데이터 동기화 (사용자 토글 결과 반영)
  useEffect(() => {
    const currentFeatures = getValues("custom_features") || [];

    // openMap을 기반으로 custom_features가 가져야 할 목표 상태를 계산
    const targetFeatures = categorizedFeatures.flatMap((category) => {
      if (!openMap[category.title]) {
        return []; // 카테고리가 닫혀있으면 모든 관련 피처를 제외
      }

      // 카테고리가 열려있으면, 기존의 사용자 선택 피처와 default 피처를 합침
      const existingUserFeatures = currentFeatures.filter((feature) => category.items.some((item) => item.title === feature.feature && !item.default));
      const defaultFeatures = category.items.filter((item) => item.default).map((item) => ({ doctype: "Features", feature: item.title }));

      // Map을 사용해 중복을 제거하며 두 배열을 합침
      const combined = new Map();
      existingUserFeatures.forEach((f) => combined.set(f.feature, f));
      defaultFeatures.forEach((f) => combined.set(f.feature, f));

      return Array.from(combined.values());
    });

    // 계산된 목표 상태가 현재 상태와 다를 경우에만 업데이트하여 루프 방지
    if (!areFeaturesEqual(currentFeatures, targetFeatures)) {
      setValue("custom_features", targetFeatures, { shouldDirty: true });
    }
  }, [openMap, setValue]);

  // 3. 데이터 변경 -> UI 동기화 (외부 데이터 주입 반영)
  useEffect(() => {
    const features = customFeatures || [];

    // custom_features를 기반으로 openMap이 가져야 할 이상적인 상태를 계산
    const idealOpenMap = categorizedFeatures.reduce((acc, category) => {
      const isOpen = category.items.some((item) => features.some((f) => f.feature === item.title));
      return { ...acc, [category.title]: isOpen };
    }, {} as Record<string, boolean>);

    // 계산된 이상적인 상태가 현재 UI 상태와 다를 경우에만 업데이트하여 루프 방지
    if (JSON.stringify(openMap) !== JSON.stringify(idealOpenMap)) {
      setOpenMap(idealOpenMap);
    }
  }, [customFeatures]);

  return (
    <>
      {projectMethod === "code" && (
        <FormField
          control={control}
          name="custom_features"
          render={({ field }) => (
            <FormItem>
              <div className="w-full flex flex-col gap-1">
                {categorizedFeatures.map((category) => {
                  const isOpen = openMap[category.title] ?? false;
                  const visibleItems = category.items.filter((item) => item.view);

                  if (visibleItems.length === 0) return null;

                  return (
                    <div key={category.title} className="w-full">
                      {/* Title Row */}
                      <button
                        type="button"
                        className={cn(
                          "w-full flex items-center justify-between space-x-2 py-3 mb-2 rounded-md bg-gray-100 px-3 pl-4.5",
                          isOpen ? "bg-blue-100" : "bg-gray-100"
                        )}
                        onClick={() => {
                          toggleCategory(category.title);
                        }}
                      >
                        <div className="flex flex-col text-sm font-semibold text-start">
                          <p>
                            {category.icon} {category.title}
                          </p>
                          <div className="w-full text-xs font-medium mt-1">{category.description}</div>
                        </div>
                        <div className="shrink-0">
                          <SwitchIndicator checked={isOpen} />
                        </div>
                      </button>

                      {/* AnimatePresence로 높이/opacity 애니메이션 */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2"
                          >
                            {visibleItems.map((item) => (
                              <FeatureItemWithTooltip
                                key={item.title}
                                item={item}
                                isChecked={field.value?.some((f) => f.feature == item.title) || false}
                                onButtonClick={() => {
                                  if (item.default) return;

                                  const current = field.value || [];
                                  const include = current.some((f) => f.feature == item.title);
                                  field.onChange(
                                    include ? current.filter((p) => p.feature !== item.title) : [...current, { doctype: "Features", feature: item.title }]
                                  );
                                }}
                                isDefault={item.default}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="custom_content_pages"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">콘텐츠 페이지 수</FormLabel>
            <FormControl>
              <AnimatedUnderlineInput
                type="number"
                min="0"
                max="200"
                placeholder="예상 페이지 수를 적어주세요."
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(!val ? undefined : parseInt(val, 10));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {projectMethod === "code" && (
        <FormField
          control={control}
          name="custom_preferred_tech_stacks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">선호 기술 스택</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value ? field.value.map((item) => item.stack) : []}
                  onChange={(val) => field.onChange(val.map((v) => ({ stack: v })))}
                  placeholder={field.value && field.value.length > 0 ? "⌫ 키로 지울 수 있어요." : "쉼표(,)로 구분하여 입력해주세요. (얘시: Next.js)"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="expected_end_date"
        render={({}) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">희망 마감일</FormLabel>
            <FormControl>
              <div className="rounded-2xl overflow-hidden">
                <DatePicker
                  value={getValues("expected_end_date") ? new Date(getValues("expected_end_date")!) : undefined}
                  onSelect={(date) =>
                    setValue("expected_end_date", dayjs(date).format("YYYY-MM-DD"), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </FormControl>
            <FormMessage>{errors.expected_start_date?.message || errors.expected_end_date?.message}</FormMessage>
          </FormItem>
        )}
      />

      <CreateProjectStep2MaintenanceField form={form} />

      <div className="w-full flex flex-col space-y-4">
        <div className="flex space-x-1 text-muted-foreground">
          <div className="pt-[1.4px]">
            <Info className="!size-3.5" />
          </div>
          <p className="text-xs break-keep">파일 첨부는 프로젝트를 만든 뒤 부터 가능해요.</p>
        </div>
      </div>
    </>
  );
}
