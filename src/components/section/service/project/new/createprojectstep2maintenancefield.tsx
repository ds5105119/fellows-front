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
import { CheckIcon, InfoIcon } from "lucide-react";
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
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
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
                  <DrawerTitle>Edit profile</DrawerTitle>
                  <DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
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
    <div className={cn("grid items-start gap-6 p-4 md:p-0")}>
      <div className="grid gap-2">
        <div className="text-2xl font-bold">유지보수 구독권</div>
        <div className="flex space-x-1">
          <InfoIcon className="shrink-0 size-3.5 text-muted-foreground mt-[1px]" />
          <p className="text-xs text-muted-foreground">첫 한 달간은 무료 유지보수 혜택이 제공됩니다.</p>
        </div>
      </div>
      <div className="grid gap-4 rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">첫 결제 예정일</div>
          <div className="text-sm font-semibold">{expected_end_date ? dayjs(expected_end_date).add(1, "month").format("LL") : "프로젝트 종료일 한달 뒤"}</div>
        </div>
        <hr />
        {/* 서비스 특징 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span>24시간 글로벌 기술 지원</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span>다국어 지원 (한국어, 영어, 중국어)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span>검증된 해외 개발자 팀</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span>첫 달 무료 체험</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-white hover:bg-gray-50">
          구독하지 않기
        </Button>
        <Button onClick={onSubscribe} className="flex-1 bg-blue-600 hover:bg-blue-700">
          구독하기
        </Button>
      </div>
    </div>
  );
}
