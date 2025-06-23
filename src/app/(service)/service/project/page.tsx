import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProjectMain from "@/components/section/service/project/page/main";

export const metadata: Metadata = {
  title: "프로젝트 - Fellows",
  description: "Fellows에서 프로젝트를 탐색하세요.",
};

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: "/service/project" });

  return (
    <SessionProvider session={session}>
      <div className="w-full h-full">
        <ProjectMain session={session} />
      </div>
    </SessionProvider>
  );
}
