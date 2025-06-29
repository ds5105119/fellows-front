"use client";

import { Button } from "@/components/ui/button";
import type { UserERPNextProject } from "@/@types/service/project";
import { cancelSubmitProject, submitProject } from "@/hooks/fetch/project";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "./datepicker";

interface ProjectActionsProps {
  project: UserERPNextProject;
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

  if (project.custom_project_status !== "draft" && project.custom_project_status !== "process:1") return null;

  return (
    <div className="sticky bottom-0 flex flex-col z-40 px-4 w-full">
      <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
      <div className="w-full flex pb-4 pt-3 bg-background">
        {project.custom_project_status === "draft" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500">
                계약 문의하기
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="drop-shadow-white/10 drop-shadow-2xl p-0 w-full max-w-full h-full sm:w-full md:w-fit md:h-3/4 rounded-none md:rounded-2xl overflow-y-auto scrollbar-hide focus-visible:ring-0"
            >
              <DialogHeader className="sr-only">
                <DialogTitle className="sr-only">계약 창</DialogTitle>
                <DialogDescription className="sr-only" />
              </DialogHeader>
              <div className="w-full h-full flex flex-col">
                <div className="sticky top-0 w-full px-6 py-3.5 border-b border-b-muted bg-white font-bold">계약 문의하기</div>
                <div className="w-full h-full flex flex-col p-6 space-y-6">
                  <div className="mx-auto">
                    <DatePicker />
                  </div>
                </div>
                <button onClick={handleSubmitProject} />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            size="lg"
            className="w-full px-16 h-[3.5rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
            onClick={handleCancelSubmitProject}
          >
            계약 문의 취소하기
          </Button>
        )}
      </div>
    </div>
  );
}
