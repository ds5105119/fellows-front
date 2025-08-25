import { auth } from "@/auth";
import { cookies } from "next/headers";
import { ChevronDown } from "lucide-react";
import MainSection1Form from "./mainsection1form";

export default async function MainSection1() {
  const session = await auth();
  const cookieStore = await cookies();

  const pendingDescription = cookieStore.get("pendingDescription")?.value || "";

  return (
    <div className="relative w-full h-full px-4">
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full">
        <div className="flex w-full flex-col z-20 items-center justify-center rounded-2xl">
          <div className="w-full pt-6 md:pt-2 flex flex-col gap-2 md:gap-3 items-center justify-center">
            <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2.5 items-center justify-center text-foreground text-center">
              <h1 className="text-2xl xl:text-5xl font-bold tracking-normal">Web, App 개발</h1>
              <h1 className="text-2xl xl:text-5xl font-bold tracking-normal">Fellows℠에 문의하세요</h1>
            </div>

            <div className="w-full flex flex-col items-center justify-center text-foreground text-center pt-1 md:pt-4.5">
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1">
                <h3 className="text-sm xl:text-lg font-semibold tracking-normal text-muted-foreground w-fit">글로벌 전문 외주 인력을 통해</h3>
                <h3 className="text-sm xl:text-lg font-semibold tracking-normal text-muted-foreground w-fit">최소 30%의 비용을 절감해보세요.</h3>
              </div>
              <h3 className="text-sm xl:text-lg font-semibold tracking-normal text-muted-foreground hidden md:block w-full">
                개발 비용은 더 낮아지고 높은 퀄리티는 유지할 수 있어요.
              </h3>
            </div>
            <MainSection1Form session={session} initialDescription={decodeURIComponent(pendingDescription)} />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2" style={{ animation: "bounce 2s infinite" }}>
          <ChevronDown className="text-foreground" />
        </div>
      </div>
    </div>
  );
}
