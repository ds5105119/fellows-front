"use client";

import { CheckIcon, FileText, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserERPNextProject } from "@/@types/service/project";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { categorizedFeatures } from "@/components/resource/project";
import { Input } from "@/components/ui/input";
import DragScrollContainer from "@/components/ui/dragscrollcontainer";
import { cn } from "@/lib/utils";

export function ProjectDetails({ project, setEditedProject }: { project: UserERPNextProject; setEditedProject: (project: UserERPNextProject) => void }) {
  const [toggle, setToggle] = useState(false);
  const [featureCategory, setFeatureCategory] = useState("");
  const [featureKeyword, setFeatureKeyword] = useState("");

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
        {project.custom_project_status == "draft" && (
          <Textarea
            value={project.custom_project_summary ?? ""}
            onChange={(e) => setEditedProject({ ...project, custom_project_summary: e.target.value })}
            className="rounded-xs min-h-44 shadow-none"
          />
        )}
        {project.custom_project_status != "draft" && (
          <div className="rounded-xs bg-zinc-50 border px-2.5 py-2 text-sm">{project.custom_project_summary ?? ""}</div>
        )}
      </div>

      <Dialog>
        <div className="w-full flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">기능</div>
            <DialogTrigger asChild>
              <button
                disabled={project.custom_project_status != "draft"}
                className={cn(
                  project.custom_project_status != "draft" && "hidden sr-only",
                  "cursor-pointer select-none px-2 py-1 rounded-sm bg-muted text-xs font-bold flex items-center hover:bg-zinc-200 transition-colors duration-300"
                )}
              >
                <p>기능 추가하기</p>
                <PlusIcon className="!size-4 ml-1" />
              </button>
            </DialogTrigger>
          </div>
          <div className="w-full flex flex-wrap gap-2 p-2 rounded-xs bg-zinc-50 border">
            {project.custom_features?.map((val, i) => {
              const feature = categorizedFeatures.flatMap((category) => category.items).find((item) => item.title === val.feature);

              return (
                feature && (
                  <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold border border-zinc-200">
                    {feature.icon}&nbsp;&nbsp;{feature.title}
                  </div>
                )
              );
            })}
          </div>
        </div>
        <DialogContent showCloseButton={false} className="drop-shadow-white/10 drop-shadow-2xl p-0 h-3/4 overflow-y-auto scrollbar-hide focus-visible:ring-0">
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only">기능 선택 창</DialogTitle>
            <DialogDescription className="sr-only" />
          </DialogHeader>
          <div className="w-full h-full flex flex-col">
            <div className="sticky top-0 w-full px-2 py-2 border-b border-b-muted bg-white">
              <Input
                className="border-none focus:ring-0 focus-visible:ring-0 md:text-base shadow-none"
                placeholder="검색어 입력"
                value={featureKeyword}
                onChange={(e) => setFeatureKeyword(e.target.value)}
              />
            </div>

            <div className="Flex flex-col grow space-y-2 py-5 px-3">
              <div className="text-xs font-bold text-muted-foreground px-2">
                선택된 기능들 (
                {project.custom_features?.filter((f) =>
                  categorizedFeatures
                    .flatMap((c) => c.items)
                    .flatMap((c) => c.title)
                    .includes(f.feature)
                ).length || 0}
                )
              </div>
              <div className="w-full flex flex-wrap gap-2 px-2">
                {project.custom_features?.map((val, i) => {
                  const feature = categorizedFeatures.flatMap((category) => category.items).find((item) => item.title === val.feature);

                  return (
                    feature && (
                      <div
                        key={i}
                        className="relative pl-2 pr-2 py-1 bg-muted text-xs font-bold flex space-x-1 shrink-0 items-center rounded-sm overflow-hidden"
                      >
                        <p>
                          {feature.icon}&nbsp;&nbsp;{feature.title}
                        </p>
                        <div className="group flex items-center">
                          <button
                            onClick={() => {
                              const updatedFeatures = [...(project.custom_features ?? [])];
                              const idx = updatedFeatures.findIndex((f) => f.feature === feature.title);
                              if (idx !== -1) updatedFeatures.splice(idx, 1);

                              setEditedProject({
                                ...project,
                                custom_features: updatedFeatures,
                              });
                            }}
                          >
                            <XIcon className="!size-3 hover:cursor-pointer" />
                          </button>
                          <div className="absolute inset-0 transition-colors group-hover:bg-black/5 pointer-events-none" />
                        </div>
                      </div>
                    )
                  );
                })}
              </div>

              <div className="text-xs font-bold text-muted-foreground pt-4 px-2">
                {featureCategory == ""
                  ? `모든 기능들 (${categorizedFeatures.flatMap((c) => c.items)?.length || 0})`
                  : `${featureCategory} (${categorizedFeatures.filter((c) => c.title == featureCategory)[0].items.length})`}
              </div>
              <DragScrollContainer className="flex space-x-2 px-2">
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
              <div className="w-full flex flex-col space-y-1 mt-4">
                {categorizedFeatures.map((category) => {
                  const featuredItems = featureCategory === "" ? category.items : category.title === featureCategory ? category.items : [];
                  const items = featureKeyword === "" ? featuredItems : featuredItems.filter((item) => item.title.includes(featureKeyword));

                  return items.map((val, i) => {
                    const active = project.custom_features?.flatMap((f) => f.feature).includes(val.title);

                    return (
                      <button
                        key={category.title + i}
                        className="group flex space-x-3 px-2 py-2 items-center rounded-sm text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => {
                          const updatedFeatures = [...(project.custom_features ?? [])];

                          if (active) {
                            const idx = updatedFeatures.findIndex((f) => f.feature === val.title);
                            if (idx !== -1) {
                              updatedFeatures.splice(idx, 1);
                            }
                          } else {
                            updatedFeatures.push({ feature: val.title, doctype: null });
                          }

                          setEditedProject({
                            ...project,
                            custom_features: updatedFeatures,
                          });
                        }}
                      >
                        <div className="size-10 shrink-0 flex items-center justify-center rounded-2xl border bodrer-gray-200 text-xl">{val.icon}</div>
                        <div className="flex flex-col grow space-y-0.5 text-left">
                          <div className="text-sm font-medium">{val.title}</div>
                          {val.description && <div className="text-xs font-normal text-muted-foreground">{val.description}</div>}
                        </div>
                        {active ? (
                          <div className="shrink-0 relative">
                            <CheckIcon className="size-5 text-blue-400 group-hover:text-transparent transition-colors duration-300" strokeWidth={3} />
                            <XIcon
                              className="absolute top-1/2 left-1/2 -translate-1/2 size-5 group-hover:text-red-400 text-transparent transition-colors duration-300"
                              strokeWidth={3}
                            />
                          </div>
                        ) : (
                          <div className="shrink-0">
                            <PlusIcon
                              className="size-5 text-transparent group-hover:text-zinc-400 group-active:text-zinc-400 transition-colors duration-300"
                              strokeWidth={2.5}
                            />
                          </div>
                        )}
                      </button>
                    );
                  });
                })}
              </div>
            </div>
          </div>
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
