"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ERPNextProject } from "@/@types/service/project";
import { useState } from "react";

interface ProjectDetailsProps {
  project: ERPNextProject;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full flex items-center space-x-2">
        <FileText className="!size-5" strokeWidth={2.2} />
        <span className="text-lg font-semibold">계약 내용</span>
      </div>

      <div className="w-full flex flex-col space-y-2">
        <div className="text-sm font-semibold">{project.custom_project_status === "draft" ? "예상 금액" : "계약 금액"}</div>
        {project.estimated_costing ? (
          <div className="flex flex-col space-y-2">
            <div>
              <span className="text-lg font-bold">
                {toggle ? (project.estimated_costing * 1.1).toLocaleString() : project.estimated_costing.toLocaleString()}
              </span>
              <span className="text-sm font-normal"> 원 (부가세 {toggle ? "포함" : "별도"})</span>
            </div>
            <Button size="sm" variant="outline" className="w-fit text-xs h-7 shadow-none" onClick={() => setToggle((prev) => !prev)}>
              {toggle ? "부가세 미포함 금액으로 변경" : "부가세 포함된 금액으로 변경"}
            </Button>
          </div>
        ) : (
          <div className="text-lg font-bold">AI 견적으로 예상 견적을 확인해보세요</div>
        )}
      </div>

      <div className="w-full flex flex-col space-y-2">
        <div className="text-sm font-semibold">설명</div>
        <div className="text-sm font-normal whitespace-pre-wrap">{project.custom_project_summary}</div>
      </div>

      <div className="w-full flex flex-col space-y-1.5">
        <div className="text-sm font-semibold">{project.custom_project_status === "draft" ? "희망 사용기술" : "계약 사용기술"}</div>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.custom_preferred_tech_stacks && project.custom_preferred_tech_stacks.length > 0 ? (
            project.custom_preferred_tech_stacks.map((val, i) => (
              <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
                {val.stack}
              </div>
            ))
          ) : (
            <span className="text-sm font-normal">사용기술이 정해지지 않았어요</span>
          )}
        </div>
      </div>
    </div>
  );
}
