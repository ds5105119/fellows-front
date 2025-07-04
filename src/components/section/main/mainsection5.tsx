import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MeshGradientComponent } from "@/components/resource/meshgradient";

export default async function MainSection1() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12">
      <div className="col-span-full">
        <div className="relative w-full hidden md:block">
          {/* Base image */}
          <AspectRatio ratio={3146 / 1332} className="relative">
            <MeshGradientComponent colors={["rgb(255, 255, 255)", "rgb(66, 39, 188)", "rgb(184, 168, 255)", "rgb(71, 42, 198)"]} />
          </AspectRatio>

          {/* Filter image layered above */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <AspectRatio ratio={3146 / 1332} className="hidden md:block">
              <img src="/hero-desktop-filter.svg" alt="Filter" className="object-cover w-full h-full" />
            </AspectRatio>
          </div>

          {/* CTA */}
          <div className="absolute inset-0 flex z-20 items-center justify-center">
            <div className="w-[100%] h-[100%] flex flex-col gap-3 text-end items-center justify-center">
              <h1 className="text-4xl xl:text-7xl font-extrabold tracking-normal text-background">Web, App 개발</h1>
              <h1 className="text-4xl xl:text-7xl font-extrabold tracking-normal text-background">
                <span className="font-black">Fellows℠</span>에서 앞서나가세요
              </h1>

              <h4 className="scroll-m-20 text-lg font-semibold leading-tight text-muted ml-1 md:mt-2">
                최대 40% 더 적은 비용으로 주목받는 페이지를 만들어보세요.<span className="text-[#e64646] font-black">*</span>
              </h4>

              <div className="space-x-4 mt-3 flex">
                <Button size="lg" className="px-16 h-16 text-lg rounded-xl bg-black" asChild>
                  <Link href="/service/dashboard">시작하기</Link>
                </Button>
                <Button size="lg" variant="secondary" className="px-16 h-16 text-lg rounded-xl">
                  가격 및 플랜
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full block md:hidden">
          {/* Base image */}
          <AspectRatio ratio={987 / 1040} className="relative">
            <MeshGradientComponent colors={["rgb(255, 255, 255)", "rgb(66, 39, 188)", "rgb(184, 168, 255)", "rgb(71, 42, 198)"]} />
          </AspectRatio>

          {/* Filter image layered above */}
          <div className="absolute -inset-[1px] z-20 pointer-events-none">
            <AspectRatio ratio={987 / 1040} className="block md:hidden">
              <img src="/hero-mobile-filter.svg" alt="Filter" className="object-cover w-full h-full" />
            </AspectRatio>
          </div>

          {/* CTA */}
          <div className="absolute inset-0 flex z-10 items-center justify-center">
            <div className="w-[85%] h-[100%] flex flex-col gap-3 text-end items-end justify-end">
              <div className="flex flex-col w-full mb-7">
                <h1 className="text-3xl font-extrabold tracking-normal text-background hidden">Web, App 개발</h1>
                <h1 className="text-3xl font-extrabold tracking-normal text-background">
                  <span className="font-black">Fellows℠</span>에서 앞서나가세요
                </h1>

                <h4 className="scroll-m-20 text-sm font-semibold leading-tight text-muted ml-1 mt-2">
                  제작부터 관리까지 최대 40% 더 적은 비용으로
                  <br />
                  주목받는 페이지를 만들어보세요.<span className="text-[#e64646] font-black">*</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full flex flex-col space-y-2 pt-4 px-6 md:px-12 text-xs md:text-sm text-right text-muted-foreground font-light">
        <div>
          <span className="text-[#e64646] font-black">*</span> 글로벌 웹 에이전시를 통해 낮은 개발 가격 제공
        </div>
        <div>
          <span className="text-[#e64646] font-black">**</span> 서비스는 7월 22일부터 정식 제공됩니다
        </div>
      </div>

      <div className="col-span-full w-full flex z-20 md:hidden pt-4">
        <Button size="lg" className="w-full px-16 h-[3.5rem] text-lg font-semibold rounded-2xl bg-black active:bg-black" asChild>
          <Link href="/service/dashboard">시작하기</Link>
        </Button>
      </div>
    </div>
  );
}
