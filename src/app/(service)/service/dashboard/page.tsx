import { auth, signIn } from "@/auth";
import FAQ from "@/components/section/dashboard/faq";
import Onboarding from "@/components/section/dashboard/onboarding";
import { ProjectOverviewChart } from "@/components/section/dashboard/projectoverview";
import { TaskOverviewChart } from "@/components/section/dashboard/taskoverview";
import { ContractOverview } from "@/components/section/dashboard/contractoverview";
import { Blog } from "@/components/section/dashboard/blog";

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: "/service/dashboard" });

  return (
    <div className="w-full grid grid-cols-4 md:grid-cols-12 md:py-16 md:gap-6 bg-muted">
      <Onboarding />

      <div className="col-span-full md:col-span-10 md:col-start-2 px-6 py-12 md:p-8 gap-6 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2 pb-4">
          <h2 className="text-2xl font-bold">작업 현황</h2>
          <p className="text-sm text-muted-foreground">기간 작업양을 확인해보세요.</p>
        </div>

        <TaskOverviewChart />
      </div>

      <div className="col-span-full md:col-span-10 md:col-start-2 px-6 py-12 md:p-8 gap-6 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2 pb-4">
          <h2 className="text-2xl font-bold">프로젝트 진행 현황</h2>
        </div>

        <ProjectOverviewChart />
      </div>

      <div className="col-span-full md:col-span-10 md:col-start-2 px-6 py-12 md:p-8 gap-6 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2 pb-4">
          <h2 className="text-2xl font-bold">결제 예정인 계약서</h2>
        </div>

        <ContractOverview session={session} />
      </div>

      <div className="col-span-full md:col-span-3 md:col-start-2 flex flex-col gap-6 bg-white md:rounded-3xl overflow-hidden">
        <Blog />
      </div>

      <div className="col-span-full p-8 md:col-span-7 md:col-start-5 flex flex-col gap-6 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <p className="text-sm text-muted-foreground">자주 묻는 질문을 확인해보세요.</p>
        </div>

        <FAQ />
      </div>
    </div>
  );
}
