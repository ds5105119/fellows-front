import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import IssuesPage from "@/components/section/service/project/issue/issue-main";
import IssueNavigation from "@/components/section/service/project/issue/issue-navigation";

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
        <IssueNavigation />
        <IssuesPage session={session} />
      </div>
    </SessionProvider>
  );
}
