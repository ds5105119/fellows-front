"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
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
import { Info, Paperclip, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CreateProjectFormStep2Props {
  form: UseFormReturn<CreateERPNextProject>;
  pendingFiles: File[];
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
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

export default function CreateProjectFormStep2({ form, pendingFiles, setPendingFiles }: CreateProjectFormStep2Props) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const projectMethod = useWatch({ name: "custom_project_method", control });
  const customFeatures = useWatch({ name: "custom_features", control });

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const MAX_FILES = 20;
  const MAX_SIZE = 30 * 1024 * 1024;

  const remainingSlots = useMemo(() => Math.max(0, MAX_FILES - pendingFiles.length), [pendingFiles.length]);

  const fileKey = useCallback((file: File) => `${file.name}-${file.size}-${file.lastModified}`, []);

  const formatSize = useCallback((size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${size} B`;
  }, []);

  const handleFilesSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      const existingKeys = new Set(pendingFiles.map(fileKey));
      const addedKeys = new Set<string>();
      const accepted: File[] = [];
      const oversized: string[] = [];
      const duplicated: string[] = [];

      for (const file of files) {
        const key = fileKey(file);
        if (file.size > MAX_SIZE) {
          oversized.push(file.name);
          continue;
        }
        if (existingKeys.has(key) || addedKeys.has(key)) {
          duplicated.push(file.name);
          continue;
        }
        if (accepted.length + pendingFiles.length >= MAX_FILES) {
          toast.warning(`파일은 최대 ${MAX_FILES}개까지 첨부할 수 있어요.`);
          break;
        }
        accepted.push(file);
        addedKeys.add(key);
      }

      if (accepted.length) {
        setPendingFiles((prev) => [...prev, ...accepted]);
      }

      if (oversized.length) {
        toast.error(`${oversized.join(", ")} (은)는 30MB를 초과해요.`);
      }
      if (duplicated.length) {
        toast.info(`${duplicated.join(", ")} (은)는 이미 추가된 파일이에요.`);
      }

      e.target.value = "";
    },
    [MAX_FILES, MAX_SIZE, fileKey, pendingFiles, setPendingFiles]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    },
    [setPendingFiles]
  );

  const totalSize = useMemo(() => pendingFiles.reduce((acc, file) => acc + file.size, 0), [pendingFiles]);

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="!size-4 text-blue-500" />
            <p className="text-sm font-semibold">프로젝트 파일 첨부</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {pendingFiles.length}/{MAX_FILES} • 총 {formatSize(totalSize)}
          </span>
        </div>

        <div className="rounded-2xl px-6 py-5 bg-gray-100 hover:bg-gray-200">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">30MB 이하 파일을 최대 {MAX_FILES}개까지 추가할 수 있어요.</p>
              <p className="text-xs text-muted-foreground">디자인 시안, 참고 문서 등을 먼저 전달하면 더 빠르게 도와드릴 수 있어요.</p>
            </div>
            <Button type="button" className="rounded-2xl px-4" onClick={() => fileInputRef.current?.click()} disabled={remainingSlots <= 0}>
              파일 선택하기
            </Button>
          </div>
          <input ref={fileInputRef} type="file" multiple className="sr-only" onChange={handleFilesSelected} />
        </div>

        {pendingFiles.length > 0 ? (
          <div className="space-y-2">
            {pendingFiles.map((file, index) => (
              <div key={fileKey(file)} className="flex items-center justify-between rounded-2xl bg-gray-100 px-6 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
                </div>
                <Button type="button" variant="ghost" size="icon" className="rounded-xl" onClick={() => handleRemoveFile(index)}>
                  <Trash2 className="!size-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
            <Info className="!size-3.5" />
            <p>추가할 파일이 없다면 이 단계는 건너뛰어도 괜찮아요.</p>
          </div>
        )}
      </div>
    </>
  );
}
