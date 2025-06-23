import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProjectMain from "@/components/section/service/project/page/main";

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
      <div className="w-full mb-8">
        <div className="w-full">
          <ProjectMain session={session} project_id={project_id} />
        </div>
      </div>
    </SessionProvider>
  );
}
