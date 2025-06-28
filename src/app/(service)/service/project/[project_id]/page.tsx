import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProjectTab from "@/components/section/service/project/main/project-tab";
import ProjectMainSection from "@/components/section/service/project/main/projectmainsection";

export const metadata: Metadata = {
  title: "프로젝트 - Fellows",
  description: "Fellows에서 프로젝트를 탐색하세요.",
};

export default async function Page({ params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const project_id = (await params).project_id;
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/${project_id}` });

  return (
    <SessionProvider session={session}>
      <div className="shrink-0 w-full h-full flex flex-col">
        <ProjectTab />
        <ProjectMainSection project_id={project_id} session={session} />
      </div>
    </SessionProvider>
  );
}
