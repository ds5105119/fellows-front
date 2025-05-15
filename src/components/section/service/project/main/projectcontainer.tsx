"use client";

import Link from "next/link";
import ProjectDropdownMenu from "./projectdropdownmenu";
import ProjectDetailSheet from "./projectdetailsheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SWRMeta } from "./projectmainsection";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, PencilLine, Receipt, Calendar, ArrowRight, Clock5, SquareCode } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
dayjs.extend(relativeTime);
dayjs.locale("ko");

export default function ProjectContainer({
  meta,
  name,
  status,
  bg,
  text,
  border,
  className,
}: {
  meta: SWRMeta;
  name: string;
  status: string;
  bg: string;
  text: string;
  border: string;
  className?: string;
}) {
  const projects = meta.data.items;
  const total = meta.data.total;
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <div className={cn("w-full flex text-sm font-light rounded-sm p-6", bg, border)}>
        <div className="grow">
          <h2 className={cn("text-2xl font-bold", text)}>{name}</h2>
        </div>
        <div>
          <button className={cn("p-1.5 rounded-sm border-[1.2px] text-sm font-semibold", border, text)}>{total ?? 0}</button>
        </div>
      </div>
      <div className={cn("w-full flex flex-col rounded-sm space-y-2 p-2", bg, text)}>
        {/* 신규 프로젝트 생성*/}
        {status === "draft" && (
          <Link
            href="./project/new"
            className="cursor-pointer flex items-center justify-center w-full rounded-sm bg-white border-[1.5px] border-dashed py-3 hover:bg-muted transition-colors duration-200"
          >
            <Plus className="!size-7" strokeWidth={2.5} />
          </Link>
        )}

        {/* 프로젝트 정보 박스 */}
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="cursor-pointer w-full text-gray-900"
            onClick={() => {
              setSelectedProject(project);
              setOpenSheet(true);
            }}
          >
            <div className="relative flex flex-col space-y-1.5 rounded-xs bg-white items-center p-4 hover:bg-muted transition-colors duration-200">
              <div className="w-full flex justify-between">
                <div className="w-[83%] flex space-x-2 items-center">
                  {project.emoji ? (
                    <div className="size-4 flex items-center justify-center">
                      <span className="text-center">{project.emoji}</span>
                    </div>
                  ) : (
                    <PencilLine className="!size-4" />
                  )}
                  <div className="truncate break-all font-bold">{project.project_info.project_name}</div>
                </div>
                <div className="w-6 flex items-center justify-center">
                  <ProjectDropdownMenu openMenu={openMenu} setOpenMenu={setOpenMenu} project={project} />
                </div>
              </div>

              <div className="w-full flex mt-2 space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <Receipt className="!size-3.5" />
                </div>

                <div className="truncate text-sm">
                  {project.total_amount ? (
                    <p>
                      <span className="font-bold">{project.total_amount.toLocaleString()}</span> 원
                    </p>
                  ) : (
                    "AI 견적을 생성하여 확인해보세요."
                  )}
                </div>
              </div>

              <div className="w-full flex space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <Calendar className="!size-3.5" />
                </div>
                <div className="truncate text-sm">{project.project_info.start_date ?? "정해지지 않았어요"}</div>
                <ArrowRight className="!size-3" />
                <div className="truncate text-sm">{project.project_info.desired_deadline ?? "정해지지 않았어요"}</div>
              </div>

              <div className="w-full flex space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <Clock5 className="!size-3.5" />
                </div>

                <div className="truncate text-sm">{dayjs(project.created_at).fromNow()}</div>
              </div>

              <div className="w-full flex space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <SquareCode className="!size-3.5" />
                </div>

                {project.project_info.platforms.map((val, i) => (
                  <Badge key={i} variant="outline" className={cn("rounded-sm", bg, border, text)}>
                    {val}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* 프로젝트 선택 시 팝업 */}
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent className="w-full md:min-w-[800px] [&>button:first-of-type]:hidden">
            <ProjectDetailSheet project={selectedProject} onClose={() => setOpenSheet(false)} />
            <SheetHeader className="sr-only h-0">
              <SheetTitle>{selectedProject?.project_info?.project_name ?? "프로젝트가 선택되지 않았습니다."}</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
