"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateERPNextProject } from "@/@types/service/project";
import { SwitchIndicator } from "@/components/ui/switch-indicator";
import dayjs from "@/lib/dayjs";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateProjectStep2MaintenanceField({ form }: { form: UseFormReturn<CreateERPNextProject> }) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();
  const { control, getValues, setValue } = form;
  const mainteanceRequired = getValues("custom_maintenance_required");

  const handleSubscribe = () => {
    setValue("custom_maintenance_required", true);
    setOpen(false);
  };

  const handleCancel = () => {
    setValue("custom_maintenance_required", false);
    setOpen(false);
  };

  if (!isMobile) {
    return (
      <FormField
        control={control}
        name="custom_maintenance_required"
        render={({}) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">유지보수 구독</FormLabel>
            <FormControl>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="h-20 w-full flex flex-row items-center justify-between rounded-2xl px-6 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <div className="text-sm font-semibold whitespace-pre-wrap text-left">
                      <div className="flex flex-col space-y-0.5">
                        <span>유지보수</span>
                        <span className="font-normal text-neutral-500">비용은 프로젝트의 크기에 따라 달라집니다.</span>
                      </div>
                    </div>
                    <SwitchIndicator checked={mainteanceRequired || false} />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader className="sr-only">
                    <DialogTitle />
                    <DialogDescription />
                  </DialogHeader>
                  <MaintenanceForm form={form} onSubscribe={handleSubscribe} onCancel={handleCancel} />
                </DialogContent>
              </Dialog>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name="custom_maintenance_required"
      render={({}) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">유지보수 구독</FormLabel>
          <FormControl>
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="h-20 w-full flex flex-row items-center justify-between rounded-2xl px-6 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="text-sm font-semibold whitespace-pre-wrap text-left">
                    <div className="flex flex-col space-y-0.5">
                      <span>유지보수</span>
                      <span className="font-normal text-neutral-500">비용은 프로젝트의 크기에 따라 달라집니다.</span>
                    </div>
                  </div>
                  <SwitchIndicator checked={mainteanceRequired || false} />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="sr-only">
                  <DrawerTitle />
                  <DrawerDescription />
                </DrawerHeader>
                <MaintenanceForm form={form} onSubscribe={handleSubscribe} onCancel={handleCancel} />
              </DrawerContent>
            </Drawer>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function MaintenanceForm({ form, onSubscribe, onCancel }: { form: UseFormReturn<CreateERPNextProject>; onSubscribe: () => void; onCancel: () => void }) {
  const expected_end_date = form.getValues("expected_end_date");

  return (
    <div className={cn("grid items-start gap-2 p-4 md:p-0")}>
      <div className="grid gap-2 pb-6">
        <div className="text-2xl font-bold">유지보수 구독권</div>
        <div className="flex space-x-1">
          <InfoIcon className="shrink-0 size-3.5 text-muted-foreground mt-[1px]" />
          <p className="text-xs text-muted-foreground">첫 한 달간은 기본 유지보수 혜택이 제공됩니다.</p>
        </div>
      </div>
      <div className="grid gap-4 rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">첫 결제 예정일</div>
          <div className="text-sm font-semibold">{expected_end_date ? dayjs(expected_end_date).add(1, "month").format("LL") : "프로젝트 종료일 한달 뒤"}</div>
        </div>

        <hr />

        <div className="space-y-1.5 pb-2">
          <div className="flex items-center space-x-2 text-base font-semibold pb-1">
            <span>이용 조건</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span>Fellows에서 개발 이후 유지보수가 필요한 경우</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>주말, 공휴일 제외 영업일</span>
          </div>
        </div>

        <div className="space-y-1.5 pb-2">
          <div className="flex items-center space-x-2 text-base font-semibold pb-1">
            <span>제공 서비스</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span>Fellows SaaS를 통한 WBS를 통한 개발 상황 추적</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>Fellows SaaS를 통한 일별, 월별 보고서 생성 가능</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>Fellows SaaS를 통한 프로젝트 문의 가능</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>다국어 지원 (한국어, 영어)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>24시간 이내 SW 1차 장애 대응 진행</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>서버 운영 및 관리</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>월 30시간 개발 크레딧 제공(익월까지 유효)</span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between gap-0 space-x-4 pt-3">
        <Button onClick={onSubscribe} className="flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold">
          구독하기
        </Button>
        <Button onClick={onCancel} className="flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold" variant="secondary">
          구독하지 않기
        </Button>
      </div>
    </div>
  );
}
