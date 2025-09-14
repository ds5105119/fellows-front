import Link from "next/link";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import { ArrowUpRight, Zap } from "lucide-react";

export default async function MainSection7() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="col-span-full pb-8 md:pb-10">
          <div className="px-4 flex flex-col space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal">단순한 개발 작업을 넘어</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
              <h4 className="text-base md:text-lg font-semibold">
                Fellows에서는 귀사의 요구사항에 부합하여,
                <br />
                끊임없이 더 나은 경험을 제공할 수 있도록 노력합니다.
              </h4>
              <Link
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center md:px-3 md:py-1.5 md:rounded-sm md:hover:bg-muted select-none"
              >
                <ArrowUpRight className="!size-7 text-blue-500" />
                <p className="text-lg md:text-xl font-semibold text-blue-500">더 많이 알아보기</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-1 md:pr-4 aspect-[7/9] md:aspect-[11/9] mb-10 md:mb-0">
          <div className="w-full h-full bg-muted rounded-3xl flex items-end justify-center overflow-hidden">
            <video
              width="100"
              height="100"
              preload="none"
              className="w-1/2 md:w-1/3 rounded-t-2xl drop-shadow-2xl drop-shadow-gray-300"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/hero-description-2.mp4" />
            </video>
          </div>
          <div className="pt-6 px-4 flex flex-col space-y-1.5">
            <div className="flex space-x-2 items-center">
              <BreathingSparkles />
              <p className="text-lg font-extrabold tracking-normal">AI 프로젝트 견적</p>
            </div>
            <p className="text-base font-normal">프로젝트를 분석해 기능을 추천하고 예상 견적가를 확인해 드립니다.</p>
          </div>
        </div>
        <div className="col-span-1 md:pl-4 aspect-[7/9] md:aspect-[11/9]">
          <div className="w-full h-full bg-muted rounded-3xl flex items-start justify-center overflow-hidden">
            <video
              width="100"
              height="100"
              preload="none"
              className="w-1/2 md:w-1/3 rounded-b-2xl drop-shadow-2xl drop-shadow-gray-300"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/hero-description-1.mp4" />
            </video>
          </div>
          <div className="pt-6 px-4 flex flex-col space-y-1.5">
            <div className="flex space-x-2 items-center">
              <Zap size={24} className="text-blue-500" fill="currentColor" />
              <p className="text-lg font-extrabold tracking-normal">SaaS로 제공되는 프로젝트 개발 현황 관리</p>
            </div>
            <p className="text-base font-normal">간편하게 프로젝트의 이슈, 상태, 소요시간을 관리해 보세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
