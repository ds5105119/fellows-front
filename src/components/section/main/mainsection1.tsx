import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default async function MainSection1() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 mt-16">
      <div className="col-span-full">
        <div className="relative w-full hidden md:block">
          {/* Base image */}
          <AspectRatio ratio={3146 / 1332}>
            <Image src="/hero-desktop.jpg" fill alt="Image" className="object-cover" priority />
          </AspectRatio>

          {/* Filter image layered above */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <AspectRatio ratio={3146 / 1332} className="hidden md:block">
              <img src="/hero-desktop-filter.svg" alt="Filter" className="object-cover w-full h-full" />
            </AspectRatio>
          </div>

          {/* CTA */}
          <div className="absolute inset-0 flex z-20 items-center justify-center">
            <div className="w-[87%] h-[80%] flex flex-col gap-3 text-end items-end justify-end">
              <h2 className="text-4xl xl:text-7xl font-extrabold tracking-normal text-background">
                <span className="font-black">Fellows℠</span>
              </h2>
              <h2 className="text-4xl xl:text-7xl font-extrabold tracking-normal text-background">
                <span className="font-black">가장 합리적인 개발 외주 파트너</span>
              </h2>

              <h4 className="scroll-m-20 text-lg font-semibold leading-normal text-muted ml-1 md:mt-1.5">
                AI 견적, 쇼피파이, React, 앱 개발까지
                <br />
                최소 25% 더 적은 비용으로 외주를 진행하세요.<span className="text-[#e64646] font-black">*</span>
              </h4>

              <div className="space-x-4 mt-3 flex">
                <Button size="lg" className="px-16 h-16 text-lg rounded-xl bg-black hover:bg-black/80" asChild>
                  <Link href="#inquery">무료 견적받기</Link>
                </Button>
                <Button size="lg" variant="secondary" className="px-16 h-16 text-lg rounded-xl" asChild>
                  <Link href="/service/dashboard">대시보드</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full block md:hidden">
          {/* Base image */}
          <AspectRatio ratio={987 / 1040}>
            <Image src="/hero-desktop.jpg" fill alt="Image" className="object-cover" priority />
            <div className="absolute inset-0 flex z-10 items-center justify-center">
              <div className="w-[85%] h-[100%] flex flex-col gap-3 text-end items-end justify-end">
                <div className="flex flex-col w-full mb-7">
                  <h1 className="text-3xl font-extrabold tracking-normal text-background hidden">
                    <span className="font-black">Fellows℠</span>
                  </h1>
                  <h1 className="text-3xl font-extrabold tracking-normal text-background">가장 합리적인 개발 외주 파트너</h1>

                  <h4 className="scroll-m-20 text-sm font-semibold leading-tight text-muted ml-1 mt-2">
                    AI 견적, 쇼피파이, React, 앱 개발까지,
                    <br />
                    최소 25% 더 적은 비용으로 외주를 진행하세요.<span className="text-[#e64646] font-black">*</span>
                  </h4>
                </div>
              </div>
            </div>
          </AspectRatio>
          {/* Filter image layered above */}
          <div className="absolute -inset-[1px] z-20 pointer-events-none">
            <AspectRatio ratio={987 / 1040} className="block md:hidden">
              <img src="/hero-mobile-filter.svg" alt="Filter" className="object-cover w-full h-full" />
            </AspectRatio>
          </div>
        </div>
      </div>

      <div className="col-span-full flex flex-col space-y-2 pt-4 px-6 md:px-12 text-xs md:text-sm text-right text-muted-foreground font-light">
        <div>
          <span className="text-[#e64646] font-black">*</span> 글로벌 웹 에이전시를 통해 낮은 개발 가격 제공
        </div>
      </div>

      <div className="col-span-full w-full flex z-20 md:hidden pt-10">
        <Link
          href="/#inquery"
          className="w-full px-16 h-[3.5rem] text-lg font-semibold rounded-2xl flex items-center justify-center bg-black text-white active:bg-black"
        >
          무료 견적받기
        </Link>
      </div>

      <div className="col-span-full grid grid-cols-2 md:grid-cols-5 px-8 max-w-3xl w-full mx-auto justify-items-center items-center mt-20 md:mt-24 gap-y-6">
        <Image src="/logo-section-1.png" alt="인도네시아 국장" width="64" height="64" className="" />
        <Image src="/logo-section-3.png" alt="Nose 로고" width="64" height="64" className="" />
        <Image src="/logo-section-2.svg" alt="하이네켄 로고" width="100" height="100" className="" />
        <Image src="/logo-section-4.png" alt="100 Plus 로고" width="64" height="64" className="" />
        <Image src="/logo-section-5.png" alt="Korea Wallpaper 로고" width="64" height="64" className="hidden md:block" />
      </div>
    </div>
  );
}
