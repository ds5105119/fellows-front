"use client";

import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import { ProjectInfoSchemaType, ProjectFileRecordsSchemaType } from "@/@types/service/project";
import { DateRange } from "react-day-picker";
import { useRef, useState, useCallback } from "react";
import { FcFile } from "react-icons/fc";
import { motion } from "framer-motion";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import DatePickerWithRange from "@/components/form/datepickerwithrange";

interface CreateProjectFormStep3Props {
  form: UseFormReturn<ProjectInfoSchemaType>;
  dateRange: DateRange | undefined;
  files: { record: ProjectFileRecordsSchemaType; name: string; size: number; progress: number }[];
  handleDateSelect: (range: DateRange) => void;
  handleChangeUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDropupload: (e: React.DragEvent<HTMLElement>) => Promise<void>;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}Bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)}MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)}GB`;
};

export default function CreateProjectFormStep3({
  form,
  dateRange,
  files,
  handleDateSelect,
  handleChangeUpload,
  handleDropupload,
}: CreateProjectFormStep3Props) {
  const {
    control,
    getValues,
    formState: { errors },
  } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLLabelElement>) => {
    setDragOver(false);
    await handleDropupload(e);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

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
                className="text-base font-semibold focus-visible:ring-0 rounded-3xl bg-gray-100 border-0 px-6 py-4 min-h-36"
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
              <Textarea
                placeholder="선호하는 기술 스택이 있다면 쉼표로 구분해 입력해주세요. (예: React, Node.js, PostgreSQL)"
                className="text-base font-semibold focus-visible:ring-0 rounded-3xl bg-gray-100 border-0 px-6 py-4 min-h-36"
                value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                onChange={(e) => {
                  const stacks = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
                  field.onChange(stacks.length > 0 ? stacks : null);
                }}
              />
            </FormControl>
            <FormDescription>쉼표(,)로 구분하여 입력해주세요.</FormDescription>
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
                <div className="rounded-t-3xl overflow-hidden">
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
                  className="h-20 w-full flex flex-row items-center justify-between rounded-b-3xl px-6 bg-gray-100 hover:bg-gray-200 transition-colors"
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
                <div className="w-full rounded-3xl bg-gray-100 px-6 pt-5 pb-2 space-y-4 mt-6">
                  <div className="flex flex-col space-y-1 justify-center px-1">
                    <div className="font-semibold">추가로 전달해주고 싶은 파일이 있다면 첨부해주세요.</div>
                    <div className="text-sm font-medium text-muted-foreground">올린 파일은 암호화되어 안전하게 보호됩니다.</div>
                  </div>
                  <label
                    className={cn(
                      "flex flex-col rounded-xl px-3 py-3 min-h-40 md:min-h-30 space-y-2.5",
                      files.length === 0 && "justify-center items-center",
                      dragOver ? "bg-blue-100 border-blue-400" : "bg-white"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {files.length > 0 ? (
                      files.map((f, idx) => (
                        <div
                          className="relative w-full flex items-center space-x-3 rounded-sm bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                          key={idx}
                        >
                          {/* 아이콘 */}
                          <FcFile className="!size-7" />

                          {/* 파일 정보 */}
                          <div className="w-full">
                            <div className="truncate">{f.name}</div>
                            <div className="text-xs font-normal">{formatFileSize(f.size)}</div>
                          </div>

                          {/* 프로그레스 바 */}
                          <div className={cn("absolute inset-y-0 left-0 w-full rounded-sm", f.progress > 9 && "hidden")}>
                            <motion.div
                              className="h-full rounded-sm"
                              animate={{
                                backgroundColor: ["#ffffff40", "#cecece40", "#ffffff40"],
                              }}
                              transition={{
                                duration: 2.0,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                          </div>

                          <AnimatedCircularProgressBar
                            className="!size-8 overflow-clip text-transparent"
                            max={100}
                            min={0}
                            value={f.progress}
                            gaugePrimaryColor="rgb(50, 125, 255)"
                            gaugeSecondaryColor="rgba(0, 0, 0, 0.3)"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center space-y-1.5">
                        <div className="text-4xl font-bold select-none pointer-events-none">📎</div>
                        <div className="flex flex-col space-y-1 items-center justify-center select-none pointer-events-none">
                          <div className="font-semibold">파일을 선택하거나 올려주세요</div>
                          <div className="text-xs font-medium text-muted-foreground">30MB 이하</div>
                        </div>
                      </div>
                    )}
                  </label>
                  <Button type="button" onClick={() => fileInputRef.current?.click()}>
                    업로드
                  </Button>
                  <Input id="fileInput" ref={fileInputRef} type="file" onChange={handleChangeUpload} style={{ display: "none" }} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
