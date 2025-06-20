"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ERPNextProject } from "@/@types/service/project";
import { cancelSubmitProject, submitProject } from "@/hooks/fetch/project";

interface ProjectActionsProps {
  project: ERPNextProject;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  if (project.custom_project_status !== "draft" && project.custom_project_status !== "process:1") {
    return null;
  }

  const handleSubmitProject = async () => {
    try {
      await submitProject(project.project_name);
      window.location.reload();
    } catch (error) {
      console.error("Project submission failed:", error);
    }
  };

  const handleCancelSubmitProject = async () => {
    try {
      await cancelSubmitProject(project.project_name);
      window.location.reload();
    } catch (error) {
      console.error("Project submission cancellation failed:", error);
    }
  };

  return (
    <div className="sticky bottom-0 flex flex-col z-50 px-4">
      <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
      <div className="w-full flex pb-4 pt-3 bg-background">
        {project.custom_project_status === "draft" && project.custom_ai_estimate ? (
          <Button
            size="lg"
            className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
            onClick={handleSubmitProject}
          >
            계약 문의하기
          </Button>
        ) : project.custom_project_status === "process:1" ? (
          <Button
            size="lg"
            className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
            onClick={handleCancelSubmitProject}
          >
            계약 문의 취소하기
          </Button>
        ) : (
          <Button size="lg" className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold" asChild>
            <Link href={`./${project.project_name}/detail`}>AI가 예상 견적을 작성중이에요 ✨</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
