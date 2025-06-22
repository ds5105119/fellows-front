"use client";

import { useProject } from "@/hooks/fetch/project";
import { ProjectHeader } from "@/components/section/service/project/main/project-header";
import { ProjectBasicInfo } from "@/components/section/service/project/main/project-basic-info";
import { ProjectNotices } from "@/components/section/service/project/main/project-notices";
import { ProjectActions } from "@/components/section/service/project/main/project-actions";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProjectDetailSide from "@/components/section/service/project/main/project-detail-side";

export default function DetailMain({ project_id }: { project_id: string }) {
  const project = useProject(project_id);

  if (!project.data) {
    return null;
  }

  return (
    <div>
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup direction="horizontal" className="flex w-full h-full">
          <ResizablePanel defaultSize={45} minSize={35} className="flex flex-col h-full w-full">
            <div className="flex flex-col h-full w-full">
              <div className="pt-12 pb-5 px-8">
                <ProjectHeader project={project.data} />
              </div>

              <div className="px-8 py-6">
                <ProjectBasicInfo project={project.data} />
              </div>

              <ProjectActions project={project.data} />

              <div className="px-8 pt-1 pb-5">
                <ProjectNotices />
              </div>
            </div>
          </ResizablePanel>

          <ResizablePanel defaultSize={55} minSize={40} className="flex flex-col h-full w-full">
            <ProjectDetailSide project={project.data} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="block lg:hidden">
        <ProjectDetailSide project={project.data} />
      </div>
    </div>
  );
}
