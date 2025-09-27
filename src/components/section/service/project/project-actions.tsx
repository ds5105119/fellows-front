"use client";
import { Button } from "@/components/ui/button";
import type { UserERPNextProject } from "@/@types/service/project";
import { cancelSubmitProject, submitProject, useProjectCustomer } from "@/hooks/fetch/project";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "./datepicker";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useQuoteSlots } from "@/hooks/fetch/project";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProjectActionsProps {
  project: UserERPNextProject;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [inbound, setInbound] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const swr = useQuoteSlots();
  const availabilityData = swr.data || [];
  const availabilityMap = new Map(availabilityData.map((item) => [item.date, item.remaining]));
  const unAvailable = availabilityData.filter((data) => data.remaining !== 0).length == 0;

  const customerSwr = useProjectCustomer(project?.project_name ?? null);
  const customer = customerSwr.data;

  const getAvailability = (date: Date) => {
    const dateString = dayjs(date).format("YYYY-MM-DD");
    return Number(
      project.expected_end_date
        ? dayjs(dateString).isBefore(project.expected_end_date)
          ? availabilityMap.get(dateString) || 0
          : 0
        : availabilityMap.get(dateString) || 0
    );
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

  const refreshAllData = async () => {
    window.location.reload();
  };

  const handleSubmitProject = async () => {
    try {
      setIsSubmitting(true);
      await submitProject(project.project_name, { date: date, inbound: inbound });

      // 성공 상태로 변경
      setIsSubmitted(true);

      // 약간의 딜레이 후 성공 화면 표시
      setTimeout(() => {
        setShowSuccess(true);
      }, 300);
    } catch (error) {
      console.error("Project submission failed:", error);
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmitProject = async () => {
    try {
      await cancelSubmitProject(project.project_name);
      await refreshAllData();
    } catch (error) {
      console.error("Project submission cancellation failed:", error);
    }
  };

  const handleCloseSuccess = async () => {
    setShowSuccess(false);
    setTimeout(async () => {
      setIsDialogOpen(false);
      setIsSubmitted(false);
      setIsSubmitting(false);
      await refreshAllData();
    }, 300);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setIsSubmitted(false);
      setIsSubmitting(false);
      setShowSuccess(false);
    }
  };

  if (!customer) return null;

  if (project.custom_project_status !== "draft" && project.custom_project_status !== "process:1") return null;

  if (!(customer.name && customer.birthdate && customer.email && customer.street && customer.sub_locality && customer.gender && customer.phoneNumber)) {
    return (
      <div className="sticky bottom-0 flex flex-col z-30 w-full">
        <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
        <div className="w-full flex pb-4 pt-3 px-4 bg-background">
          <Button size="lg" className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500" asChild>
            <Link href="/service/settings/profile">의뢰 전 필수 정보 추가하러 가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 flex flex-col z-30 w-full">
      <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
      <div className="w-full flex pb-4 pt-3 px-4 bg-background">
        {project.custom_project_status === "draft" ? (
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
                disabled={unAvailable}
              >
                {unAvailable ? "지금은 의뢰할 수 있는 날짜가 없어요" : "견적 의뢰하기"}
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

              {/* 성공 상태 오버레이 */}
              {isSubmitted ? (
                <div
                  className={cn(
                    "absolute inset-0 bg-white/98 backdrop-blur-md z-50 flex items-center justify-center transition-all duration-500 ease-out",
                    showSuccess ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                >
                  <div className="text-center space-y-8 px-8 max-w-md">
                    {/* 텍스트 */}
                    <div className="space-y-4">
                      <h3
                        className={`text-2xl font-bold text-gray-900 transition-all duration-500 delay-300 ease-out ${
                          showSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                      >
                        견적 문의가 접수되었습니다!
                      </h3>
                      <p
                        className={`text-gray-600 leading-relaxed transition-all duration-500 delay-500 ease-out ${
                          showSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                      >
                        Fellows 매니저가 빠른 시일 안에
                        <br />
                        연락드리겠습니다.
                      </p>
                    </div>

                    {/* 닫기 버튼 */}
                    <div className={`transition-all duration-500 delay-700 ease-out ${showSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                      <Button
                        onClick={handleCloseSuccess}
                        className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                      >
                        확인
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <div className="sticky top-0 w-full px-3.5 py-3.5 border-b border-b-muted bg-white font-bold flex justify-between">
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon" disabled={isSubmitting}>
                        <XIcon />
                      </Button>
                    </DialogClose>
                    <Button
                      variant="default"
                      onClick={handleSubmitProject}
                      disabled={isSubmitting || isSubmitted || unAvailable}
                      className="relative overflow-hidden transition-all duration-200 ease-out"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>접수 중...</span>
                        </div>
                      ) : (
                        "견적 문의하기"
                      )}
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
                              <input
                                id="inbound"
                                type="checkbox"
                                checked={inbound}
                                onChange={() => setInbound(!inbound)}
                                disabled={isSubmitting || isSubmitted}
                              />
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
                        <DatePicker
                          value={date}
                          onSelect={handleSelect}
                          modifiers={modifiers}
                          disabled={(date) => getAvailability(date) === 0 || isSubmitting || isSubmitted}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            size="lg"
            className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
            onClick={handleCancelSubmitProject}
          >
            견적 의뢰 취소하기
          </Button>
        )}
      </div>
    </div>
  );
}
