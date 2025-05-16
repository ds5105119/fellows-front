"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import { ProjectInfoSchemaType } from "@/@types/service/project";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "@/components/form/datepickerwithrange";
import { TagInput } from "../../../../form/taginput";
import FileInput from "../../../../form/fileinput";

interface CreateProjectFormStep3Props {
  form: UseFormReturn<ProjectInfoSchemaType>;
  dateRange: DateRange | undefined;
  handleDateSelect: (range: DateRange) => void;
}

export default function CreateProjectFormStep3({ form, dateRange, handleDateSelect }: CreateProjectFormStep3Props) {
  const {
    control,
    getValues,
    formState: { errors },
  } = form;

  return (
    <>
      <FormField
        control={control}
        name="content_pages"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">콘텐츠 페이지 수</FormLabel>
            <FormControl>
              <Input
                className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 h-12"
                type="number"
                min="0"
                placeholder="예상 페이지 수를 적어주세요."
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : parseInt(val, 10));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="design_requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">디자인 요구사항</FormLabel>
            <FormControl>
              <Textarea
                placeholder="디자인 관련 요구사항을 입력해주세요. (예: Figma 시안 보유, 특정 스타일 선호 등)"
                className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 py-4 min-h-36"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="preferred_tech_stack"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">선호 기술 스택</FormLabel>
            <FormControl>
              <TagInput
                value={field.value || []}
                onChange={field.onChange}
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
          name="start_date"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium">희망 일정 및 유지보수</FormLabel>
              <FormControl>
                <div className="rounded-t-2xl overflow-hidden">
                  <DatePickerWithRange
                    value={
                      dateRange || {
                        from: getValues("start_date") ? new Date(getValues("start_date")!) : undefined,
                        to: getValues("desired_deadline") ? new Date(getValues("desired_deadline")!) : undefined,
                      }
                    }
                    onSelect={handleDateSelect}
                  />
                </div>
              </FormControl>
              <FormMessage>{errors.start_date?.message || errors.desired_deadline?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="maintenance_required"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <button
                  type="button"
                  className="h-20 w-full flex flex-row items-center justify-between rounded-b-2xl px-6 bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => field.onChange(!field.value)}
                >
                  <div className="text-sm font-semibold whitespace-pre-wrap text-left">
                    {field.value ? (
                      <div className="flex flex-col space-y-0.5">
                        <span>출시 후 정기적인 유지보수가 필요해요.</span>
                        <span className="font-normal text-neutral-500">유지보수 비용은 프로젝트의 크기에 따라 달라집니다.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-0.5">
                        <span>출시 후 유지보수가 필요하지 않아요.</span>
                        <span className="font-normal text-neutral-500">1개월동안만 무상 유지보수가 지원됩니다.</span>
                      </div>
                    )}
                  </div>
                  <SwitchIndicator checked={field.value} />
                </button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="files"
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
