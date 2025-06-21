"use client";

import { useState } from "react";
import { Session } from "next-auth";
import type { ERPNextProject } from "@/@types/service/project";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DownloadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import ProjectEstimator from "./projectestimator";
import SelectLogo from "@/components/resource/selectlogo";

const STATUS_MAPPING: Record<string, string> = {
  draft: "초안",
  "process:1": "견적 확인중",
  "process:2": "계약 진행중",
  "process:3": "진행중",
  maintenance: "유지보수",
  complete: "완료",
};

const PLATFORM_MAPPING: Record<string, string> = {
  web: "웹",
  android: "안드로이드 앱",
  ios: "iOS 앱",
};

export function ProjectStatus({ project, session }: { project: ERPNextProject; session: Session }) {
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between min-h-13 max-h-13 px-5 md:px-8 border-b-1 border-b-sidebar-border hover:bg-muted active:bg-muted transition-colors duration-200">
        <h3 className="text-sm font-bold">의뢰 상태</h3>
        <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">
          {project.custom_project_status ? STATUS_MAPPING[project.custom_project_status] : "상태 없음"}
        </div>
      </div>
      <div className="w-full flex items-center justify-between min-h-13 max-h-13 px-5 md:px-8 border-b-1 border-b-sidebar-border hover:bg-muted active:bg-muted transition-colors duration-200">
        <h3 className="text-sm font-bold">플랫폼</h3>
        <div className="flex space-x-2">
          {project.custom_platforms?.map((val, i) => (
            <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
              {PLATFORM_MAPPING[val.platform]}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex items-center justify-between min-h-13 max-h-13 px-5 md:px-8 border-b-1 border-b-sidebar-border hover:bg-muted active:bg-muted transition-colors duration-200">
        <h3 className="text-sm font-bold">AI 견적</h3>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild>
            <button className="flex items-center space-x-2 text-white text-xs font-medium bg-black hover:bg-neutral-700 transition-colors rounded-md duration-200 h-7 px-3">
              <BreathingSparkles size={14} />
              <p>AI 견적서 보기</p>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full h-full sm:max-w-full md:w-[45%] md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
            <SheetHeader className="sr-only">
              <SheetTitle>AI 견적서</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
              <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4 bg-background z-20">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
                    <DownloadIcon className="h-4 w-4" />
                    내보내기
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
                    <DownloadIcon className="!size-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 border-0 focus-visible:ring-0" onClick={() => setOpenSheet(false)}>
                    <XIcon className="!size-5" />
                  </Button>
                </div>
              </div>
              <div className="p-5 md:p-8">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col">
                    <SelectLogo />
                    <div className="text-2xl md:text-4xl font-extrabold mt-2">{project.custom_project_title} 예상 견적서</div>
                    <div className="mt-3">
                      <span className="text-sm font-bold">계약번호. </span>
                      <span className="text-sm font-medium">{project.project_name}</span>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 w-full md:justify-between mb-1 md:mb-0">
                    <div className="relative flex md:w-1/2 flex-col space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground">공급자</div>
                      <div className="text-base font-bold text-black">Fellows</div>
                      <div className="text-xs font-semibold text-muted-foreground">회사명: IIH</div>
                      <div className="text-xs font-semibold text-muted-foreground">주소: 서울특별시 강남구 역삼동 123-456</div>
                      <div className="flex w-full items-center justify-between pr-4 md:pr-12">
                        <div className="text-xs font-semibold text-muted-foreground">대표자: 김동현</div>
                        <div className="relative text-xs font-bold text-muted-foreground">
                          (인)
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                            <Image
                              src="/fellows/stamp.png"
                              alt="Fellows Stamp"
                              width={50}
                              height={50}
                              className="shrink-0"
                              unoptimized
                              style={{ maxWidth: "none" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="block md:hidden border-gray-200" />

                    <div className="flex md:w-1/2 flex-col space-y-2 mt-1 md:mt-0">
                      <div className="text-xs font-semibold text-muted-foreground">수신자</div>
                      <div className="text-base font-bold text-black">{session.user.name}</div>
                      <div className="text-xs font-semibold text-muted-foreground">이메일: {session.user.email}</div>
                      <div className="text-xs font-semibold text-muted-foreground">주소: {session.user.address.formatted}</div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <ProjectEstimator project={project} />
                </div>
              </div>
            </div>
            <SheetDescription className="sr-only" />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
