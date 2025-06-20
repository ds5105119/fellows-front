"use client";

import { useState } from "react";
import type { ERPNextProject } from "@/@types/service/project";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DownloadIcon, XIcon } from "lucide-react";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import ProjectEstimator from "./projectestimator";

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

interface ProjectStatusProps {
  project: ERPNextProject;
}

export function ProjectStatus({ project }: ProjectStatusProps) {
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
          <SheetContent side="left" className="w-full sm:max-w-full md:w-[45%] md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
            <SheetHeader className="sr-only">
              <SheetTitle>AI 견적서</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
              <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4 bg-background z-20">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
                    이용 가이드
                  </Button>
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
              <div className="p-8">
                <ProjectEstimator project={project} />
              </div>
            </div>
            <SheetDescription className="sr-only" />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
