import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { erpNextProjectSchema, ERPNextProject } from "@/@types/service/project";
import { ProjectHeader } from "@/components/section/service/project/main/project-detail/project-header";
import { ProjectBasicInfo } from "@/components/section/service/project/main/project-detail/project-basic-info";
import { ProjectStatus } from "@/components/section/service/project/main/project-detail/project-status";
import { ProjectDetails } from "@/components/section/service/project/main/project-detail/project-details";
import { ProjectNotices } from "@/components/section/service/project/main/project-detail/project-notices";
import { ProjectActions } from "@/components/section/service/project/main/project-detail/project-actions";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProjectDetailSide from "@/components/section/service/project/main/project-detail/project-detail-side";

const getProject = async ({ project_id, session }: { project_id: string; session: Session }): Promise<ERPNextProject> => {
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const parsedData = erpNextProjectSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};

export default async function Page({ params }: { params: Promise<{ project_id: string }> }) {
  const project_id = (await params).project_id;
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/${project_id}` });

  const project = await getProject({ project_id, session });

  return (
    <SessionProvider session={session}>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={45} minSize={25} className="flex flex-col h-full w-full">
          <ProjectHeader project={project} />
          <ProjectBasicInfo project={project} />
          <ProjectStatus project={project} />
          <ProjectDetails project={project} />
          <ProjectActions project={project} />
          <ProjectNotices />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55} minSize={25} className="flex flex-col h-full w-full">
          <ProjectDetailSide project={project} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </SessionProvider>
  );
}
