import { auth } from "@/auth";
import Navbar from "@/components/section/work/navbar";
import WorkMain2 from "@/components/section/work/workmain2";
import WorkMain3 from "@/components/section/work/workmain3";
import WorkMain4 from "@/components/section/work/workmain4";

import Link from "next/link";
import MainHeader from "@/components/header/mainheader";
import { MeshGradientComponent } from "@/components/resource/meshgradient";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.groups?.includes("/manager")) {
    return (
      <>
        <MainHeader />
        <div className="h-dvh overflow-x-hidden">
          <div className="absolute -inset-1">
            <MeshGradientComponent className="opacity-100" colors={["#ADF6BD", "#0D50BB"]} />
          </div>

          <Link href="/" className="absolute -inset-1 cursor-wait" />

          <div className="flex flex-col w-full h-full items-center justify-between py-10 md:py-16">
            <div />
            <div className="text-xl md:text-2xl text-white font-bold mt-2.5 md:mt-5">Works 페이지는 현재 공사중이에요</div>
            <div className="text-sm md:text-base text-white font-normal">아무 곳이나 눌러 홈 화면으로 돌아갈 수 있습니다.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-4 lg:grid-cols-12 bg-[#FFFFFF]">
        <div className="col-span-full w-full">
          <WorkMain2 />
        </div>
        <div className="col-span-full w-full">
          <WorkMain3 />
        </div>
        <div className="col-span-full w-full">
          <WorkMain4 />
        </div>
      </div>
    </>
  );
}
