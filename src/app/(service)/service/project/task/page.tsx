import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { GanttChart } from "@/components/section/service/project/task/gantt-chart";
import ProjectTab from "@/components/section/service/project/main/project-tab";

export const metadata: Metadata = {
  title: "프로젝트 - Fellows",
  description: "Fellows에서 프로젝트를 탐색하세요.",
};

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: "/service/project" });

  return (
    <SessionProvider session={session}>
      <div className="shrink-0 w-full h-full flex flex-col">
        <ProjectTab />
        <GanttChart />
      </div>
    </SessionProvider>
  );
}
