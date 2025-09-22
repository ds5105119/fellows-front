import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import { BadgeCheckIcon, ChevronRight, CopyPlus, ZapIcon, Globe, Users, Rocket, Shield, Workflow } from "lucide-react";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import MainSection2Dialog from "./mainsection2dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const marqueeContents = [
  {
    icon: <Globe className="size-6 text-green-500" />,
    name: "글로벌 개발 인력",
    body: "글로벌 수준의 개발 인력을 활용해 최대 25% 이상 비용 절감 효과를 경험해보세요.",
  },
  {
    icon: <Users className="size-6 text-sky-500" />,
    name: "전문 협업 시스템",
    body: "Fellows SaaS를 통해 프로젝트 진행 상황을 투명하게 공유하고 긴밀히 협업합니다.",
  },
  {
    icon: <Rocket className="size-6 text-purple-500" />,
    name: "빠른 개발 사이클",
    body: "애자일 프로세스를 기반으로 MVP에서 상용 서비스까지 빠르고 유연하게 개발합니다.",
  },
  {
    icon: <Shield className="size-6 text-red-500" />,
    name: "보안 중심 설계",
    body: "엔터프라이즈 보안 기준에 맞춘 인증, 권한 관리, 데이터 보호로 안심할 수 있습니다.",
  },
  {
    icon: <Workflow className="size-6 text-yellow-500" />,
    name: "엔드투엔드 지원",
    body: "기획부터 디자인, 개발, 배포, 유지보수까지 원스톱으로 지원합니다.",
  },
];

const features = [
  {
    name: "한눈에 체계적인 프로젝트 관리 가능",
    description: (
      <div className="flex items-center space-x-2">
        <ZapIcon className="size-4 md:size-5 text-blue-500" strokeWidth={3} fill="currentColor" />
        <div>Fellows SaaS</div>
        <ChevronRight className="size-4 md:size-5 text-gray-700 md:hidden" />
      </div>
    ),
    href: "#secondary",
    cta: "더 알아보기",
    className: "col-span-full md:col-span-4 bg-sky-50 transition-colors duration-300 ease-in-out",
    background: (
      <div className="grow w-full relative flex items-center justify-center px-6 md:px-10 [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)]">
        <div className="w-full h-fit">
          <AspectRatio ratio={2 / 1}>
            <Image src="/bento3.png" alt="Image" fill className="object-contain" />
          </AspectRatio>
        </div>
      </div>
    ),
  },
  {
    name: "글로벌 개발 협업으로\n25% 이상 저렴한 가격",
    description: (
      <div className="flex items-center space-x-2">
        <BadgeCheckIcon className="size-4 md:size-5 text-emerald-500" strokeWidth={3} />
        <div>더 적은 예산, 높은 퀄리티</div>
        <ChevronRight className="size-4 md:size-5 text-gray-700 md:hidden" />
      </div>
    ),
    href: "#primary",
    cta: "더 알아보기",
    className: "col-span-full md:col-span-2 bg-sky-50 transition-colors duration-300 ease-in-out",
    background: (
      <div className="w-full h-full flex flex-col justify-end pb-10 md:pb-16 [mask-image:linear-gradient(to_top,transparent_0%,#000_40%)]">
        <Marquee pauseOnHover className="[--duration:40s]">
          {marqueeContents.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-64 md:w-80 h-36 md:h-44 cursor-pointer overflow-hidden rounded-xl p-6",
                "transform-gpu transition-all duration-300 ease-out hover:blur-none bg-white z-20",
                "flex flex-col justify-between"
              )}
            >
              <div>{f.icon}</div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm md:text-lg font-bold dark:text-white ">{f.name}</figcaption>
                  <blockquote className="mt-2 text-[11px] md:text-sm line-clamp-4">{f.body}</blockquote>
                </div>
              </div>
            </figure>
          ))}
        </Marquee>
      </div>
    ),
  },
  {
    name: "견적서부터 보고서까지\n자유로운 전자 문서 생성",
    description: (
      <div className="flex items-center space-x-2">
        <CopyPlus className="size-4 md:size-5 text-orange-500" strokeWidth={3} />
        <div>필수 부가 기능</div>
        <ChevronRight className="size-4 md:size-5 text-gray-700 md:hidden" />
      </div>
    ),
    className: "col-span-full md:col-span-2 bg-sky-50 transition-colors duration-300 ease-in-out",
    href: "#quaternary",
    cta: "더 알아보기",
    background: (
      <div className="grow w-full relative flex items-center justify-center px-6 md:px-10 [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)]">
        <div className="w-full h-fit">
          <AspectRatio ratio={727 / 888}>
            <Image src="/bento4.png" alt="Image" fill className="object-contain" />
          </AspectRatio>
        </div>
      </div>
    ),
  },
  {
    name: `6000↑ 데이터를 학습한 AI로\n3분만에 AI 견적서 작성`,
    description: (
      <div className="flex items-center">
        <div className="md:block hidden">
          <BreathingSparkles />
        </div>
        <div className="md:hidden block">
          <BreathingSparkles size={20} />
        </div>
        <div className="ml-2">AI 예상 견적 확인하기</div>
        <ChevronRight className="size-4 md:size-5 ml-2 text-gray-700 md:hidden" />
      </div>
    ),
    href: "#",
    cta: "더 알아보기",
    className: "col-span-full md:col-span-4 bg-sky-50 transition-colors duration-300 ease-in-out",
    background: (
      <div className="grow w-full relative flex items-center justify-center px-6 md:px-10 [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)]">
        <div className="w-full h-fit">
          <AspectRatio ratio={2 / 1}>
            <Image src="/bento2.png" alt="Image" fill className="object-contain" />
          </AspectRatio>
        </div>
      </div>
    ),
  },
];

export default async function MainSection2() {
  return (
    <div className="w-full">
      <div className="px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Fellows에서 시작하면 가장 좋은 이유</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            이제 아무 곳에 외주 개발 문의는 그만,
            <br />
            귀사를 위한 전문 개발 팀을 합리적인 가격에 만나보세요.
          </h4>
          <MainSection2Dialog />
        </div>
      </div>

      <BentoGrid className="grid-cols-6">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
