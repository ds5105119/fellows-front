import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BoxReveal } from "@/components/magicui/box-reveal";
import AccentButton from "@/components/button/accentbutton";
import SplitText from "@/components/animation/splittext";
import HeroCardSection from "@/components/animation/herocardsection";

export default function MainSection1() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 col-span-full lg:col-span-12 pt-64 pb-20">
      <div className="col-span-full px-12 lg:col-span-10 lg:col-start-2 lg:px-0 flex flex-col gap-6">
        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
            Web, App 개발
            <br />
            펠로우즈로 시작하세요<span className="text-[#5046e6]">.</span>
          </h1>
        </BoxReveal>

        <h4 className="scroll-m-20 text-lg font-medium leading-tight text-muted-foreground ml-1">
          최대 40% 더 적은 비용으로 맞춤형 개발 팀을 구독할 수 있습니다.*
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

        <HeroCardSection />
      </div>
    </div>
  );
}
