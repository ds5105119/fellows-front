import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import AccentButton from "@/components/button/accentbutton";
import SplitText from "@/components/animation/splittext";
import StackedImage from "@/components/animation/stackedimage";

export default function MainSection1() {
  return (
    <div className="flex flex-col w-full gap-6 row-start-2 items-center mt-20">
      <StackedImage>
        <Image src="/imagestack-logo1.svg" width={90} height={90} alt="fellows" className="rounded-3xl" />
        <Image src="/imagestack-logo2.svg" width={90} height={90} alt="fellows" className="rounded-3xl" />
        <Image src="/imagestack-logo3.svg" width={90} height={90} alt="fellows" className="rounded-3xl" />
        <Image src="/imagestack-logo4.svg" width={90} height={90} alt="fellows" className="rounded-3xl" />
        <Image src="/imagestack-logo5.svg" width={90} height={90} alt="fellows" className="rounded-3xl" />
      </StackedImage>

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-center mt-6">
        막막했던 정부지원사업
        <br />
        펠로우즈와 함께 탄탄하게 시작하세요
      </h1>

      <h4 className="scroll-m-20 text-lg font-medium leading-tight text-center text-muted-foreground">더 적은 비용으로 맞춤형 개발 팀을 구독할 수 있습니다</h4>

      <div className="flex space-x-4">
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

      <div className="text-muted-foreground text-sm mt-12">Trusted by design teams at</div>

      <div className="flex space-x-4">
        <span className="text-muted-foreground font-medium">Apple</span>
        <span className="text-muted-foreground font-medium">Meta</span>
        <span className="text-muted-foreground font-medium">Microsoft</span>
        <span className="text-muted-foreground font-medium">Google</span>
        <span className="text-muted-foreground font-medium">General Electric</span>
        <span className="text-muted-foreground font-medium">OpenAI</span>
        <span className="text-muted-foreground font-medium">Tesla</span>
      </div>

      <div className="bg-neutral-900 rounded-4xl mt-20 h-96 w-[1280px]" />
    </div>
  );
}
