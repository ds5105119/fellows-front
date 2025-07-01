import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProjectTab from "@/components/section/service/project/main/project-tab";
import ProjectMainSection from "@/components/section/service/project/main/projectmainsection";
import { getUser, updateUser } from "@/hooks/fetch/server/user";
import { userData } from "@/@types/accounts/userdata";

export const metadata: Metadata = {
  title: "프로젝트 - Fellows",
  description: "Fellows에서 프로젝트를 탐색하세요.",
};

async function setOnBoarding() {
  const user = await getUser();
  if (user.userData) {
    const rawUserData = JSON.parse(user.userData[0] || "{}");
    const user_data = userData.parse(rawUserData);
    if (!user_data.dashboard_1_2_end) {
      updateUser({ userData: [JSON.stringify({ ...user_data, dashboard_1_2_end: true })] });
    }
  }
}

export default async function Page({ params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const project_id = (await params).project_id;
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/${project_id}` });

  await setOnBoarding();

  return (
    <SessionProvider session={session}>
      <div className="shrink-0 w-full h-full flex flex-col">
        <ProjectTab />
        <ProjectMainSection project_id={project_id} session={session} />
      </div>
    </SessionProvider>
  );
}
