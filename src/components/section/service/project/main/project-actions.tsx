"use client";

import { Button } from "@/components/ui/button";
import type { UserERPNextProject } from "@/@types/service/project";
import { cancelSubmitProject, submitProject } from "@/hooks/fetch/project";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "./datepicker";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useQuoteSlots } from "@/hooks/fetch/project";
import dayjs from "@/lib/dayjs";
interface ProjectActionsProps {
  project: UserERPNextProject;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [inbound, setInbound] = useState<boolean>(false);

  const swr = useQuoteSlots();
  const availabilityData = swr.data || [];
  const availabilityMap = new Map(availabilityData.map((item) => [item.date, item.remaining]));

  const getAvailability = (date: Date) => {
    const dateString = dayjs(date).format("YYYY-MM-DD");
    return Number(availabilityMap.get(dateString)) || 0;
  };

  const modifiers = {
    saturday: (date: Date) => date.getDay() === 6,
    sunday: (date: Date) => date.getDay() === 0,
    available: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 0;
    },
    lowAvailability: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 0 && availability <= 33;
    },
    mediumAvailability: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 33 && availability <= 66;
    },
    highAvailability: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 66;
    },
  };

  const handleSelect = (date: Date | undefined) => {
    if (date && getAvailability(date) > 0) {
      setDate(date);
    } else if (typeof date === "undefined") {
      setDate(date);
    }
  };

  const handleSubmitProject = async () => {
    try {
      await submitProject(project.project_name, { date: date, inbound: inbound });
      window.location.reload();
    } catch (error) {
      console.error("Project submission failed:", error);
    }
  };

  const handleCancelSubmitProject = async () => {
    try {
      await cancelSubmitProject(project.project_name);
      window.location.reload();
    } catch (error) {
      console.error("Project submission cancellation failed:", error);
    }
  };

  if (project.custom_project_status !== "draft" && project.custom_project_status !== "process:1") return null;

  return (
    <div className="sticky bottom-0 flex flex-col z-30 px-4 w-full">
      <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
      <div className="w-full flex pb-4 pt-3 bg-background">
        {project.custom_project_status === "draft" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500">
                계약 문의하기
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="drop-shadow-white/10 drop-shadow-2xl p-0 w-full max-w-full h-full sm:w-full min-w-full lg:min-w-4xl lg:h-fit rounded-none lg:rounded-2xl overflow-y-auto scrollbar-hide focus-visible:ring-0"
            >
              <DialogHeader className="sr-only">
                <DialogTitle className="sr-only">계약 창</DialogTitle>
                <DialogDescription className="sr-only" />
              </DialogHeader>
              <div className="w-full h-full flex flex-col">
                <div className="sticky top-0 w-full px-3.5 py-3.5 border-b border-b-muted bg-white font-bold flex justify-between">
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon">
                      <XIcon />
                    </Button>
                  </DialogClose>
                  <Button variant="outline" onClick={handleSubmitProject}>
                    계약 확정하기
                  </Button>
                </div>
                <div className="w-full h-fit flex flex-col lg:flex-row lg:items-center lg:justify-center p-6 lg:p-8 space-y-6 lg:space-y-0">
                  <div className="lg:grow lg:h-full lg:pr-6">
                    <div className="flex flex-col space-y-2">
                      <Image src="/fellows/logo.svg" alt="펠로우즈 로고" width={120} height={120} className="select-none pb-4" priority />
                      <div className="text-lg font-bold">견적 문의</div>
                      <div className="flex flex-col space-y-1.5">
                        <div className="text-sm flex space-x-3 items-center text-zinc-800">
                          <ClockIcon className="size-4" />
                          <p>{inbound ? "8시간" : "4시간"}</p>
                        </div>
                        <div className="text-sm flex space-x-3 items-center text-zinc-800">
                          <CalendarIcon className="size-4" />
                          <p>처리 기간: 3일</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 pt-6">
                        <div className="text-lg font-bold">상담이 필요하신가요?</div>
                        <div className="text-sm whitespace-pre-wrap">
                          시작 전에 펠로우즈 매니저와 상담을 진행해보세요.
                          <br />
                          개발 방향 및 디자인 등 준비되지 않은 상태에서 적합합니다.
                        </div>
                        <div className="flex space-x-2 items-center">
                          <div className="flex space-x-2 text-xs md:text-sm font-semibold">
                            <input id="inbound" type="checkbox" checked={inbound} onChange={() => setInbound(!inbound)} />
                            <label htmlFor="inbound">상담 필요</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="hidden lg:block" />
                  <div className="lg:pl-6 flex flex-col space-y-4 w-full lg:w-fit">
                    <div className="flex flex-col space-y-2">
                      <div className="text-lg font-bold">희망 시작일이 있으신가요?</div>
                      <div className="text-sm">프로젝트 시작일을 결정할 수 있습니다.</div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-sm">지연 확률</p>
                        <div className="px-2 py-1 text-xs font-bold text-black rounded-sm bg-emerald-200">낮음</div>
                        <div className="px-2 py-1 text-xs font-bold text-black rounded-sm bg-amber-200">보통</div>
                        <div className="px-2 py-1 text-xs font-bold text-black rounded-sm bg-red-200">높음</div>
                      </div>
                    </div>
                    <div className="mx-auto lg:mx-0 pt-2">
                      <DatePicker value={date} onSelect={handleSelect} modifiers={modifiers} disabled={(date) => getAvailability(date) === 0} />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            size="lg"
            className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
            onClick={handleCancelSubmitProject}
          >
            계약 문의 취소하기
          </Button>
        )}
      </div>
    </div>
  );
}
