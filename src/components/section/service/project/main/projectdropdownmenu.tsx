"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EllipsisVertical, Edit2, UserPlus, Trash2 } from "lucide-react";
import { SWRMeta } from "./projectmainsection";

const ProjectDropdownMenu = ({
  openMenu,
  setOpenMenu,
  meta,
  idx,
}: {
  openMenu: string | null;
  setOpenMenu: (val: string | null) => void;
  meta: SWRMeta;
  idx: number;
}) => {
  const project = meta.data.items[idx];

  const removeProject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (window.confirm("프로젝트를 삭제하면 모든 정보가 삭제됩니다. 계속 진행하시겠습니까?")) {
      await fetch(`/api/service/project/${project.project_id}`, {
        method: "DELETE",
      });

      meta.swr.mutate(
        (pages) => pages && pages.map((page) => ({ total: page.total - 1, items: page.items.filter((item) => item.project_id !== project.project_id) })),
        false
      );
    }
  };

  return (
    <DropdownMenu
      open={openMenu === project.project_id}
      onOpenChange={(isOpen) => {
        setOpenMenu(isOpen ? project.project_id : null);
      }}
    >
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "rounded-sm z-20 h-6 w-6 flex items-center justify-center pointer-events-auto hover:bg-neutral-200",
            openMenu === project.project_id && "bg-neutral-100 hover:bg-neutral-200"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <EllipsisVertical className="!size-5" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="z-30">
        <DropdownMenuLabel className="font-semibold">{project.project_info.project_name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center space-x-2 font-medium" asChild>
          <Link href={`/service/project/${project.project_id}?p=edit`}>
            <Edit2 className="size-4" />
            <span>수정</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center space-x-2 font-medium" asChild>
          <Link href={`/service/project/${project.project_id}?p=edit`}>
            <UserPlus className="size-4" />
            <span>팀원 추가</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center space-x-2 font-medium " asChild>
          {project.deletable ? (
            <button onClick={(e) => removeProject(e)} className="w-full">
              <Trash2 className="size-4 !text-red-600" />
              <span className="!text-red-600">삭제</span>
            </button>
          ) : (
            <button
              onClick={() => toast.info("진행 중인 프로젝트는 삭제할 수 없어요.", { description: "프로젝트 상세의 문의를 통해 상담을 신청할 수 있어요." })}
              className="w-full"
            >
              <Trash2 className={cn("size-4", project.deletable ? "!text-red-600" : "!text-red-200")} />
              <span className={cn(project.deletable ? "!text-red-600" : "!text-red-200")}>삭제</span>
            </button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectDropdownMenu;
