import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import AccentButton from "@/components/button/accentbutton";
import HeroCardSection from "@/components/animation/herocardsection";
import { Safari } from "@/components/magicui/safari";

export default function MainSection1() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 col-span-full lg:col-span-12 pt-30 md:pt-40 pb-20">
      <div className="col-span-full px-12 lg:col-span-10 lg:col-start-2 lg:px-0 flex flex-col items-center gap-6">
        <Link
          href="/service/project/new"
          className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] "
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
        </Link>

        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-normal text-foreground text-center">
            Web, App 개발
            <br />
            <AuroraText>펠로우즈</AuroraText>로 시작하세요
          </h1>
        </BoxReveal>

        <h4 className="scroll-m-20 text-lg font-medium leading-tight text-muted-foreground ml-1 text-center">
          최대 40% 더 적은 비용으로 맞춤형 개발 팀을 구독할 수 있습니다.<span className="text-[#5046e6]">*</span>
          신뢰성 있는 외주 업체를 사용해보세요.
        </h4>

        <div className="flex space-x-4 mt-2">
          <AccentButton size="lg" className="h-11 text-base">
            시작하기
          </AccentButton>
          <Button size="lg" variant="outline" className="rounded-full px-0 pl-4 pr-2 h-11 text-base">
            가격 및 플랜
            <div className="p-1.5 rounded-full bg-neutral-200">
              <ArrowRight className="!size-4" strokeWidth="3" />
            </div>
          </Button>
        </div>

        <div
          className="relative w-full mt-24 rounded-xl overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.5) 55%, transparent 70%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.5) 55%, transparent 70%)",
          }}
        >
          <Safari url="fellows.com" className="w-full h-full" imageSrc="/main_screenshot.png" />
        </div>

        <HeroCardSection />
      </div>
    </div>
  );
}
