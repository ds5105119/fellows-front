"use client";

import Link from "next/link";
import ProjectDropdownMenu from "./projectdropdownmenu";
import ProjectDetailSheet from "./projectdetailsheet";
import { useState } from "react";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { SWRMeta } from "./projectmainsection";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  session,
}: {
  meta: SWRMeta;
  name: string;
  status: string;
  bg: string;
  text: string;
  border: string;
  className?: string;
  session: Session | null;
}) {
  const projects = meta.data.items;
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
          <button className={cn("p-1.5 rounded-sm border-[1.2px] text-sm font-semibold", border, text)}>{0}</button>
        </div>
      </div>
      <div className={cn("w-full flex flex-col rounded-sm space-y-1.5 p-1.5", bg, text)}>
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
                <div className="w-[83%] flex space-x-1.5 items-center text-sm">
                  {project.custom_emoji ? (
                    <div className="size-4 flex items-center justify-center">
                      <span className="text-center">{project.custom_emoji}</span>
                    </div>
                  ) : (
                    <PencilLine className="!size-4" />
                  )}
                  <div className="truncate break-all font-bold">{project.custom_project_title}</div>
                </div>
                <div className="w-6 flex items-center justify-center">
                  <ProjectDropdownMenu openMenu={openMenu} setOpenMenu={setOpenMenu} meta={meta} idx={idx} />
                </div>
              </div>

              <div className="w-full flex mt-1 space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <Receipt className="!size-3.5" />
                </div>

                <div className="truncate text-xs">
                  {project.estimated_costing ? (
                    <p>
                      <span className="font-bold">{project.estimated_costing.toLocaleString()}</span> 원
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
                <div className="truncate text-xs">{dayjs(project.expected_start_date).format("YYYY-MM-DD") ?? "정해지지 않았어요"}</div>
                <ArrowRight className="!size-3" />
                <div className="truncate text-xs">{dayjs(project.expected_end_date).format("YYYY-MM-DD") ?? "정해지지 않았어요"}</div>
              </div>

              <div className="w-full flex space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <Clock5 className="!size-3.5" />
                </div>

                <div className="truncate text-xs">{dayjs(project.creation).fromNow()}</div>
              </div>

              <div className="w-full flex space-x-2 items-center font-medium">
                <div className="size-4 flex items-center justify-center">
                  <SquareCode className="!size-3.5" />
                </div>

                {project.custom_platforms &&
                  project.custom_platforms.map((val, i) => (
                    <Badge key={i} variant="outline" className={cn("rounded-sm", bg, border, text)}>
                      {val.platform}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && <p className={cn("text-center text-sm", text)}>없음</p>}

        {/* 신규 프로젝트 생성*/}
        {status === "draft" && (
          <Link
            href="./project/new"
            className="cursor-pointer flex items-center justify-center w-full rounded-xs bg-white outline-[1px] outline-dashed py-2 hover:bg-muted transition-colors duration-200"
          >
            <Plus className="!size-6" strokeWidth={2.5} />
          </Link>
        )}

        {/* 프로젝트 선택 시 팝업 */}
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent className="w-full sm:max-w-full md:w-3/5 md:min-w-[728px] [&>button:first-of-type]:hidden">
            <ProjectDetailSheet project={selectedProject} onClose={() => setOpenSheet(false)} session={session} />
            <SheetHeader className="sr-only h-0">
              <SheetTitle>{selectedProject?.custom_project_title ?? "프로젝트가 선택되지 않았습니다."}</SheetTitle>
            </SheetHeader>
            <SheetDescription className="sr-only" />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
