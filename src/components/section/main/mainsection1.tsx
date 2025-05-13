import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlurFade } from "@/components/magicui/blur-fade";

export default async function MainSection1() {
  const session = await auth();

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 col-span-full lg:col-span-12">
      <div className="col-span-full">
        <BlurFade className="relative w-full">
          {/* Base image */}
          <AspectRatio ratio={3146 / 1332}>
            <Image src="/hero-desktop-2.jpg" fill alt="Image" className="rounded-md object-cover" priority />
            <div className="absolute inset-0 flex z-10 items-center justify-center">
              <div className="w-[85%] h-[70%] flex flex-col gap-3 text-end items-end justify-end">
                <div className="w-fit mb-2">
                  <Link
                    href="/service/project/new"
                    className="group overflow-clip relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] "
                  >
                    <span
                      className={cn(
                        "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                      )}
                      style={{
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "destination-out",
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "subtract",
                        WebkitClipPath: "padding-box",
                      }}
                    />
                    🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                    <AnimatedGradientText className="text-sm font-semibold">정부지원사업 탐색 서비스 출시</AnimatedGradientText>
                    <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    <div className="absolute inset-0 bg-white -z-10" />
                  </Link>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-background">Web, App 개발</h1>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-background">
                  <span className="font-black">Fellows℠</span>와 함께 앞서나가세요
                </h1>

                <h4 className="scroll-m-20 text-lg font-semibold leading-tight text-muted ml-1 mt-2">
                  최대 40% 더 적은 비용으로 맞춤형 개발 팀을 구독할 수 있습니다.<span className="text-[#e64646] font-black">*</span>
                </h4>

                <div className="flex space-x-4 mt-3">
                  <Button size="lg" className="px-16 h-16 text-lg rounded-xl bg-black" asChild>
                    <Link href="/service/dashboard">시작하기</Link>
                  </Button>
                  <Button size="lg" variant="secondary" className="px-16 h-16 text-lg rounded-xl">
                    가격 및 플랜
                  </Button>
                </div>
              </div>
            </div>
          </AspectRatio>
          {/* Filter image layered above */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <AspectRatio ratio={3146 / 1332}>
              <Image src="/hero-desktop-filter.svg" fill alt="Filter" className="rounded-md object-cover" priority />
            </AspectRatio>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
