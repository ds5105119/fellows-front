"use client";

import { FileText } from "lucide-react";
import dayjs from "dayjs";
import type { UserERPNextProject } from "@/@types/service/project";

interface ProjectHeaderProps {
  project: UserERPNextProject;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="w-full flex items-center space-x-3">
      <div className="flex items-center justify-center size-8 md:size-9 rounded-sm bg-blue-500/15">
        <FileText className="!size-5 md:!size-6 text-blue-500" strokeWidth={2.2} />
      </div>
      <span className="text-base font-bold text-blue-500">프로젝트</span>
      <span className="text-xs font-normal text-muted-foreground">{dayjs(project.creation).format("YY.MM.DD HH시 mm분")} 생성</span>
    </div>
  );
}
