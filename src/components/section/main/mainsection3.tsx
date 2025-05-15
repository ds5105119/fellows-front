"use client";

import ScrollSizeDownBox from "@/components/animation/scrollsizedownbox";
import GravityBox from "@/components/animation/gravitybox";
import HeroCardSection from "@/components/section/main/herocardsection";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export default function MainSection3() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="col-span-full pb-16">
          <div className="text-center flex flex-col space-y-3">
            <h4 className="text-lg md:text-xl font-semibold text-foreground">예상 견적 이후 담당 매니저의 밀착 관리</h4>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-normal text-foreground">Fellows에는 믿고 맡길 수 있으니깐!</h1>
          </div>
        </div>
        <div className="col-span-1 pr-8 pl-4">
          <AspectRatio ratio={1 / 0.85}>
            <Image src="/hero-description-1.gif" fill alt="Image" className="rounded-2xl object-cover" priority />
          </AspectRatio>
          <div className="pt-6 flex flex-col space-y-1.5">
            <p className="text-lg font-extrabold tracking-normal text-foreground">프로젝트에 필요한 기능을 추천해드려요.</p>
            <p className="text-base font-normal text-foreground">프로젝트 이름과 설명만 넣으면 끝! AI가 알아서 프로젝트를 분석할거에요.</p>
          </div>
        </div>
        <div className="col-span-1 pl-8 pr-4">
          <AspectRatio ratio={1 / 0.85}>
            <Image src="/hero-description-2.gif" fill alt="Image" className="rounded-2xl object-cover" priority />
          </AspectRatio>
          <div className="pt-6 flex flex-col space-y-1.5">
            <p className="text-lg font-extrabold tracking-normal text-foreground">프로젝트에 필요한 기능을 추천해드려요.</p>
            <p className="text-base font-normal text-foreground">프로젝트 이름과 설명만 넣으면 끝! AI가 알아서 프로젝트를 분석할거에요.</p>
          </div>
        </div>
      </div>

      <GravityBox className="w-full pt-96">
        <ScrollSizeDownBox className="relative h-[700px] bg-[#faf8f5]">
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
        </ScrollSizeDownBox>
      </GravityBox>

      <div className="col-span-full">
        <HeroCardSection />
      </div>
    </div>
  );
}
