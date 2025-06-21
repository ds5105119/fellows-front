"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ERPNextProject } from "@/@types/service/project";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { categorizedFeatures } from "@/components/resource/project";
import { Input } from "@/components/ui/input";
import DragScrollContainer from "@/components/ui/dragscrollcontainer";
import { cn } from "@/lib/utils";

export function ProjectDetails({ project, setEditedProject }: { project: ERPNextProject; setEditedProject: (project: ERPNextProject) => void }) {
  const [toggle, setToggle] = useState(false);
  const [featureCategory, setFeatureCategory] = useState("");

  return (
    <div className="w-full flex flex-col space-y-6">
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
        <Textarea
          value={project.custom_project_summary ?? ""}
          onChange={(e) => setEditedProject({ ...project, custom_project_summary: e.target.value })}
          className="rounded-xs min-h-44"
        />
      </div>

      <Dialog>
        <div className="w-full flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-semibold">기능</div>
            <DialogTrigger asChild>
              <button>기능 추가하기</button>
            </DialogTrigger>
          </div>
          <div className="w-full flex flex-wrap gap-2">
            {project.custom_features?.map((val, i) => {
              const feature = categorizedFeatures.flatMap((category) => category.items).find((item) => item.title === val.feature);

              return (
                feature && (
                  <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
                    {feature.icon} {feature.title}
                  </div>
                )
              );
            })}
          </div>
        </div>
        <DialogContent showCloseButton={false} className="drop-shadow-white/20 drop-shadow-2xl p-0">
          <DialogHeader>
            <DialogTitle className="sr-only">기능 선택 창</DialogTitle>
            <DialogDescription className="sr-only" />
            <div className="w-full h-full flex flex-col">
              <div className="px-2 py-2 border-b border-b-muted">
                <Input className="border-none focus:ring-0 focus-visible:ring-0 md:text-base" placeholder="검색어 입력" />
              </div>
              <DragScrollContainer className="flex space-x-2">
                <button
                  className={cn(
                    "py-1 rounded-sm px-2 text-sm font-bold shrink-0",
                    featureCategory == "" ? "text-white bg-blue-400" : "text-black border border-gray-200"
                  )}
                  onClick={() => setFeatureCategory("")}
                >
                  전체
                </button>
                {categorizedFeatures.map((category) => (
                  <button
                    key={category.title}
                    className={cn(
                      "py-1 rounded-sm px-2 text-sm font-bold shrink-0",
                      featureCategory == category.title ? "text-white bg-blue-400" : "text-black border border-gray-200"
                    )}
                    onClick={() => setFeatureCategory(category.title)}
                  >
                    {category.title}
                  </button>
                ))}
              </DragScrollContainer>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
