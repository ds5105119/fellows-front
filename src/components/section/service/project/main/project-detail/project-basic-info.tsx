"use client"

import { Copy } from "lucide-react"
import type { ERPNextProject } from "@/@types/service/project"

interface ProjectBasicInfoProps {
  project: ERPNextProject
  onCopy: () => void
}

export function ProjectBasicInfo({ project, onCopy }: ProjectBasicInfoProps) {
  return (
    <div className="w-full flex flex-col pt-6 px-5 md:px-8 space-y-5">
      <h2 className="text-4xl font-bold break-keep">
        {project.custom_emoji} {project.custom_project_title}
      </h2>
      <div className="w-full flex items-center space-x-2">
        <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">계약 번호</div>
        <div className="ml-1 flex-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">
          {project.project_name}
        </div>
        <button
          onClick={onCopy}
          className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colors duration-200"
        >
          <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
        </button>
      </div>
    </div>
  )
}
