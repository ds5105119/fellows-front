import { auth, signIn } from "@/auth";
import ReportSidebar from "@/components/section/service/project/report/report-sidebar";
import TaskNavigation from "@/components/section/service/project/task/task-navigation";

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/report` });

  return (
    <div className="shrink-0 w-full h-full flex flex-col">
      <TaskNavigation />
      <div className="w-full h-full flex">
        <ReportSidebar session={session} />
      </div>
    </div>
  );
}
