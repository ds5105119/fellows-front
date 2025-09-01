import { Metadata } from "next";
import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import PaymentMain from "@/components/section/service/payment/payment-main";

export const metadata: Metadata = {
  title: "프로젝트 - Fellows",
  description: "Fellows에서 프로젝트를 탐색하세요.",
};

export default async function Page({ params }: { params: Promise<{ project_id: string; contract_id: string }> }) {
  const session = await auth();
  const { project_id, contract_id } = await params;
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/${project_id}/payment/contract/${contract_id}` });

  return (
    <SessionProvider session={session}>
      <div className="shrink-0 w-full h-full flex flex-col">
        <PaymentMain />
      </div>
    </SessionProvider>
  );
}
