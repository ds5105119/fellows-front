"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { categorizedFeatures } from "@/components/resource/project";
import { FeatureItemWithTooltip } from "@/components/form/featureitemwithtooltip";
import { UserERPNextProject } from "@/@types/service/project";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import FileInput from "@/components/form/fileinput";
import TagInput from "@/components/form/taginput";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import DatePicker from "@/components/form/datepicker";
dayjs.extend(relativeTime);
dayjs.locale("ko");

interface CreateProjectFormStep2Props {
  form: UseFormReturn<UserERPNextProject>;
}

export default function CreateProjectFormStep2({ form }: CreateProjectFormStep2Props) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  return (
    <>
      <FormField
        control={control}
        name="custom_features"
        render={({ field }) => (
          <FormItem>
            <div className="w-full flex flex-col gap-5">
              {categorizedFeatures.map((category) => (
                <div key={category.title} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="col-span-full text-sm font-medium mb-1">{category.title}</div>
                  {category.items.map((item) => (
                    <FeatureItemWithTooltip
                      key={item.title}
                      item={item}
                      isChecked={field.value?.some((f) => f.feature == item.title) || false}
                      onButtonClick={() => {
                        const current = field.value || [];
                        const include = current.some((f) => f.feature == item.title);
                        field.onChange(include ? current.filter((p) => p.feature !== item.title) : [...current, { doctype: "Features", feature: item.title }]);
                      }}
                    />
                  ))}
                </div>
              ))}
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
      <div className="w-full flex flex-col space-y-1">
        <FormField
          control={control}
          name="expected_end_date"
          render={({}) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">희망 일정 및 유지보수</FormLabel>
              <FormControl>
                <div className="rounded-t-2xl overflow-hidden">
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

        <FormField
          control={control}
          name="custom_maintenance_required"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <button
                  type="button"
                  className="h-20 w-full flex flex-row items-center justify-between rounded-b-2xl px-6 bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => field.onChange(!field.value)}
                >
                  <div className="text-sm font-semibold whitespace-pre-wrap text-left">
                    <div className="flex flex-col space-y-0.5">
                      <span>유지보수</span>
                      <span className="font-normal text-neutral-500">유지보수 비용은 프로젝트의 크기에 따라 달라집니다.</span>
                    </div>
                  </div>
                  <SwitchIndicator checked={field.value || false} />
                </button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="custom_files"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileInput onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
