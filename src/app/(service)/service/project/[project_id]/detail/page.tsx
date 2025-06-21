import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { erpNextProjectSchema, ERPNextProject } from "@/@types/service/project";
import { ProjectHeader } from "@/components/section/service/project/detail/project-header";
import { ProjectBasicInfo } from "@/components/section/service/project/detail/project-basic-info";
import { ProjectStatus } from "@/components/section/service/project/detail/project-status";
import { ProjectDetails } from "@/components/section/service/project/detail/project-details";
import { ProjectNotices } from "@/components/section/service/project/detail/project-notices";
import { ProjectActions } from "@/components/section/service/project/detail/project-actions";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProjectDetailSide from "@/components/section/service/project/detail/project-detail-side";

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
  const session = await auth();
  const project_id = (await params).project_id;
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/${project_id}` });

  const cookieStore = await cookies();
  const onboardingDone = cookieStore.get("onboarding_2_done");

  // 쿠키가 설정되지 않았고, 쿠키 설정 요청이 아닌 경우 리다이렉트
  if (!onboardingDone) {
    const currentUrl = `/service/project/${project_id}/detail`;
    redirect(`/api/service/onboarding/dashboard/2?redirect=${encodeURIComponent(currentUrl)}`);
  }

  const project = await getProject({ project_id, session });

  return (
    <SessionProvider session={session}>
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup direction="horizontal" className="flex w-full h-full">
          <ResizablePanel defaultSize={45} minSize={35} className="flex flex-col h-full w-full">
            <div className="flex flex-col h-full w-full">
              <div className="pt-12 pb-5 px-8">
                <ProjectHeader project={project} />
              </div>

              <div className="px-8 py-6">
                <ProjectBasicInfo project={project} />
              </div>

              <ProjectStatus project={project} session={session} setEditedProject={(data) => console.log(data)} />

              <div className="p-8">
                <ProjectDetails project={project} setEditedProject={(data) => console.log(data)} />
              </div>

              <ProjectActions project={project} />

              <div className="px-8 pt-1 pb-5">
                <ProjectNotices />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={55} minSize={40} className="flex flex-col h-full w-full">
            <ProjectDetailSide project={project} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="block lg:hidden">
        <ProjectDetailSide project={project} />
      </div>
    </SessionProvider>
  );
}
