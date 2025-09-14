"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { FeatureItemWithTooltip } from "@/components/form/featureitemwithtooltip";
import { categorizedFeatures } from "@/components/resource/project";
import { CreateProjectStep2MaintenanceField } from "./createprojectstep2maintenancefield";
import { CreateERPNextProject, NoCodePlatform } from "@/@types/service/project";
import { motion, AnimatePresence } from "framer-motion";
import TagInput from "@/components/form/taginput";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import DatePicker from "@/components/section/service/new/datepicker";
import dayjs from "@/lib/dayjs";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import { cn } from "@/lib/utils";

interface CreateProjectFormStep2Props {
  form: UseFormReturn<CreateERPNextProject>;
}

export default function CreateProjectFormStep2({ form }: CreateProjectFormStep2Props) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const project_method = getValues("custom_project_method");
  const nocode_platform = getValues("custom_nocode_platform");

  return (
    <>
      <FormField
        control={control}
        name="custom_features"
        render={({ field }) => (
          <FormItem>
            <div className="w-full flex flex-col gap-2">
              {categorizedFeatures.map((category) => {
                const visibleItems = category.items.filter((item) => {
                  if (project_method === "code" && !item.view.code) return false;
                  if ((project_method === "nocode" || project_method === "shop") && !item.view[nocode_platform as NoCodePlatform]) return false;
                  return true;
                });

                if (visibleItems.length === 0) return null;

                const [open, setOpen] = useState(category.items.some((item) => field.value?.map((val) => val.feature).includes(item.title)));

                return (
                  <div key={category.title} className="w-full">
                    {/* Title Row */}
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-between text-sm font-medium py-3 mb-2 rounded-md bg-gray-100 px-3 pl-4.5",
                        open ? "bg-blue-100" : "bg-gray-100"
                      )}
                      onClick={() => {
                        if (open) {
                          setOpen(false);
                          field.onChange(field.value?.filter((val) => !category.items.map((item) => item.title).includes(val.feature)));
                        } else {
                          setOpen(true);
                          if (project_method === "code") {
                            field.onChange([
                              ...(field.value ?? []),
                              ...category.items.filter((item) => item.default["code"]).map((item) => ({ doctype: "Features", feature: item.title })),
                            ]);
                          } else {
                            field.onChange([
                              ...(field.value ?? []),
                              ...category.items
                                .filter((item) => item.default[nocode_platform as NoCodePlatform])
                                .map((item) => ({ doctype: "Features", feature: item.title })),
                            ]);
                          }
                        }
                      }}
                    >
                      {category.icon} {category.title}
                      <SwitchIndicator checked={open} />
                    </button>

                    {/* AnimatePresence로 높이/opacity 애니메이션 */}
                    <AnimatePresence initial={false}>
                      {open && (
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
                                const current = field.value || [];
                                const include = current.some((f) => f.feature == item.title);
                                field.onChange(
                                  include ? current.filter((p) => p.feature !== item.title) : [...current, { doctype: "Features", feature: item.title }]
                                );
                              }}
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
      <FormField
        control={control}
        name="expected_end_date"
        render={({}) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">희망 일정</FormLabel>
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
    </>
  );
}
