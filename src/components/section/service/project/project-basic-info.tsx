"use client";

import { Copy } from "lucide-react";
import type { UserERPNextProject } from "@/@types/service/project";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ProjectBasicInfo({ project, setEditedProject }: { project: UserERPNextProject; setEditedProject: (project: UserERPNextProject) => void }) {
  const [titleEdit, setTitleEdit] = useState<boolean>(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("프로젝트 링크가 복사되었습니다.");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("프로젝트 링크 복사에 실패했습니다.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"; // 먼저 줄여주고
    e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 맞게 늘림
    setEditedProject({ ...project, custom_project_title: e.target.value });
  };

  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="w-full">
        {titleEdit ? (
          <div className="w-full flex flex-col space-y-2">
            <textarea
              name="project name"
              rows={1}
              className="w-full text-3xl font-bold break-keep rounded-md border bg-zinc-50 resize-none h-fit p-3 focus:outline-0"
              value={project.custom_project_title ?? ""}
              onChange={handleChange}
            />
            <Button size="sm" onClick={() => setTitleEdit(false)} className="w-fit self-end">
              완료
            </Button>
          </div>
        ) : (
          <h2 className="text-4xl font-bold break-keep" onClick={() => setTitleEdit(true)}>
            {project.custom_emoji} {project.custom_project_title}
          </h2>
        )}
      </div>
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
