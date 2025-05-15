import { Metadata } from "next";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";

export const metadata: Metadata = {
  title: "서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 px-6 lg:px-12 pt-28 md:pt-40 space-y-20 lg:space-y-36">
      <div className="col-span-full">
        <MainSection1 />
      </div>
      <div className="col-span-full lg:col-span-8 lg:col-start-3">
        <MainSection2 />
      </div>
      <div className="col-span-full lg:col-span-10 lg:col-start-2">
        <MainSection3 />
      </div>
      <div className="col-span-full sticky flex flex-col bottom-0 z-20 md:hidden">
        <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
        <div className="w-full flex pb-4 pt-3 bg-background">
          <Button size="lg" className="w-full px-16 h-[3.75rem] rounded-2xl text-lg font-semibold bg-black" asChild>
            <Link href="/service/dashboard">시작하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
