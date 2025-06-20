"use client"

import type { ERPNextProject } from "@/@types/service/project"

const STATUS_MAPPING: Record<string, string> = {
  draft: "초안",
  "process:1": "견적 확인중",
  "process:2": "계약 진행중",
  "process:3": "진행중",
  maintenance: "유지보수",
  complete: "완료",
}

const PLATFORM_MAPPING: Record<string, string> = {
  web: "웹",
  android: "안드로이드 앱",
  ios: "iOS 앱",
}

interface ProjectStatusProps {
  project: ERPNextProject
}

export function ProjectStatus({ project }: ProjectStatusProps) {
  return (
    <>
      <div className="w-full flex items-center justify-between pt-6 pb-3 px-5 md:px-8 border-b-1 border-b-sidebar-border">
        <h3 className="text-sm font-bold">의뢰 상태</h3>
        <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">
          {project.custom_project_status ? STATUS_MAPPING[project.custom_project_status] : "상태 없음"}
        </div>
      </div>
      <div className="w-full flex items-center justify-between py-3 px-5 md:px-8 border-b-1 border-b-sidebar-border">
        <h3 className="text-sm font-bold">플랫폼</h3>
        <div className="flex space-x-2">
          {project.custom_platforms?.map((val, i) => (
            <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
              {PLATFORM_MAPPING[val.platform]}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
