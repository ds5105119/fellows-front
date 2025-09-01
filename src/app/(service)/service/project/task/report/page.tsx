import { auth, signIn } from "@/auth";
import TaskNavigation from "@/components/section/service/task/task-navigation";
import ReportMain from "@/components/section/service/report/report-main";

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/report` });

  return (
    <div className="shrink-0 w-full h-full flex flex-col">
      <TaskNavigation />
      <ReportMain session={session} />
    </div>
  );
}
