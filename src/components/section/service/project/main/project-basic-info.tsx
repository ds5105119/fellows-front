"use client";

import { Copy } from "lucide-react";
import type { ERPNextProject } from "@/@types/service/project";
import { useCallback } from "react";
import { toast } from "sonner";

interface ProjectBasicInfoProps {
  project: ERPNextProject;
}

export function ProjectBasicInfo({ project }: ProjectBasicInfoProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("프로젝트 링크가 복사되었습니다.");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("프로젝트 링크 복사에 실패했습니다.");
    }
  }, []);

  return (
    <div className="w-full flex flex-col space-y-5">
      <h2 className="text-4xl font-bold break-keep">
        {project.custom_emoji} {project.custom_project_title}
      </h2>
      <div className="w-full flex items-center space-x-2">
        <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">계약 번호</div>
        <div className="ml-1 flex-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">{project.project_name}</div>
        <button onClick={handleCopy} className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colors duration-200">
          <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
        </button>
      </div>
    </div>
  );
}
