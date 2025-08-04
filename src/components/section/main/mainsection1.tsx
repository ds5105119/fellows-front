import { Session } from "next-auth";
import { cookies } from "next/headers";
import { ChevronDown } from "lucide-react";
import MainSection1Form from "./mainsection1form";

export default async function MainSection1({ session }: { session: Session | null }) {
  // 서버에서 직접 쿠키를 읽어옵니다.
  const cookieStore = await cookies();
  const pendingDescription = cookieStore.get("pendingDescription")?.value || "";

  return (
    <div className="relative w-full h-full px-4">
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full">
        <div className="flex w-full flex-col z-20 items-center justify-center rounded-2xl">
          <div className="w-full pt-6 md:pt-2 flex flex-col gap-3 items-center justify-center">
            <div className="w-full flex flex-col col gap-1 md:gap-2.5 items-center justify-center text-foreground text-center">
              <h1 className="text-3xl xl:text-5xl font-bold tracking-normal">Web, App 개발</h1>
              <h1 className="text-3xl xl:text-5xl font-bold tracking-normal">Fellows℠에 문의하세요</h1>
            </div>

            {/* 클라이언트 컴포넌트에 session과 쿠키에서 읽은 초기값을 전달합니다. */}
            <MainSection1Form session={session} initialDescription={decodeURIComponent(pendingDescription)} />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2" style={{ animation: "bounce 2s infinite" }}>
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}
