import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import { BadgeCheckIcon, ChevronRight, CopyPlus, ZapIcon } from "lucide-react";
import BreathingSparkles from "@/components/resource/breathingsparkles";

const date = new Date();
date.setDate(2);

const files = [
  {
    name: "가상화폐 거래소",
    body: "비트코인 기반의 가상화폐 거래소 웹사이트를 만들어주세요 💰 실시간 시세 조회 📊, 시세 차트 📈, 회원가입 📝과 보안 중심의 로그인 시스템 🔐까지 포함되면 좋겠어요.",
  },
  {
    name: "쥬얼리 브랜드 쇼핑몰 💍",
    body: "쥬얼리 브랜드✨의 감성을 살릴 수 있는 쇼핑몰 사이트를 만들어주세요 💖 우아한 디자인 🎨과 함께 카드💳·간편결제 기능 💸도 넣어줄 수 있을까요?",
  },
  {
    name: "랜딩 페이지 🚀",
    body: "브랜드 홍보를 위한 세련된 랜딩 페이지를 만들어주세요 ✨ 반응형 디자인 📱에 스크롤 애니메이션 🎞️과 인터랙티브한 구성 🎯도 부탁드려요!",
  },
  {
    name: "산업용 앱 개발",
    body: "산업 현장에서 사용할 수 있는 내부 전용 앱을 개발해주세요 ⚙️ GPG 키 기반의 보안 기능 🔑과 파일 업로드 📂, 사용자 권한 관리 👤도 필요해요.",
  },
  {
    name: "AI SaaS 서비스 페이지",
    body: "AI 기반 SaaS 🤖 서비스를 소개하는 웹페이지를 만들어주세요 🌐 핵심 기능 소개 🧠, 요금제 💵, 가입 흐름 📋까지 깔끔하게 정리되면 좋겠어요!",
  },
];
const features = [
  {
    name: "높은 수준의 결과물을\n합리적인 가격에",
    description: (
      <div className="flex items-center space-x-2">
        <BadgeCheckIcon className="size-5 text-emerald-500" strokeWidth={3} />
        <div>다양한 개발 영역</div>
        <ChevronRight className="size-5 text-gray-700 md:hidden" />
      </div>
    ),
    href: "#",
    cta: "더 알아보기",
    className: "col-span-3 md:col-span-1 ![box-shadow:0_12px_24px_rgba(0,0,0,.0)] bg-emerald-50 transition-colors duration-300 ease-in-out",
    background: (
      <Marquee pauseOnHover className="absolute -bottom-24 md:-bottom-12 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[0.5px] transition-all duration-300 ease-out hover:blur-none bg-white z-20"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">{f.name}</figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    name: "SaaS로 한눈에 체계적인 프로젝트 관리 가능",
    description: (
      <div className="flex items-center space-x-2">
        <ZapIcon className="size-5 text-blue-500" strokeWidth={3} fill="currentColor" />
        <div>모든 기능이 무료</div>
        <ChevronRight className="size-5 text-gray-700 md:hidden" />
      </div>
    ),
    href: "#",
    cta: "더 알아보기",
    className: "col-span-3 md:col-span-2 bg-gradient-to-b to-cyan-400/10 via-cyan-500/10 from-blue-400/10 transition-colors duration-300 ease-in-out",
    background: (
      <div className="absolute top-10 md:top-0 w-full h-full transition-all duration-300 ease-out group-hover:scale-110 [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)]">
        <Image src="/bento3.png" alt="Image" className="rounded-md object-cover object-[40%_30%] md:object-[10%_20%]" fill priority />
      </div>
    ),
  },
  {
    name: `6000↑ 데이터를 학습한 AI로\n3분만에 AI 견적서 작성`,
    description: (
      <div className="flex items-center space-x-2">
        <BreathingSparkles />
        <div>AI 예상 견적 확인하기</div>
        <ChevronRight className="size-5 text-gray-700 md:hidden" />
      </div>
    ),
    href: "#",
    cta: "더 알아보기",
    className: "col-span-3 md:col-span-2 bg-amber-400/10 transition-colors duration-300 ease-in-out",
    background: (
      <div className="absolute top-10 md:top-0 w-full h-full transition-all duration-300 ease-out group-hover:scale-110 [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)]">
        <Image src="/bento2.png" alt="Image" className="rounded-md object-cover object-[80%_30%] md:object-[10%_20%]" fill priority />
      </div>
    ),
  },
  {
    name: "지원사업 탐색부터\n팀원 관리까지 한눈에",
    description: (
      <div className="flex items-center space-x-2">
        <CopyPlus className="size-5 text-orange-500" strokeWidth={3} />
        <div>필수 부가 기능</div>
        <ChevronRight className="size-5 text-gray-700 md:hidden" />
      </div>
    ),
    className: "col-span-3 md:col-span-1 bg-muted transition-colors duration-300 ease-in-out",
    href: "#",
    cta: "더 알아보기",
    background: (
      <div className="absolute -right-48 md:-right-30 -bottom-20 md:-bottom-5 origin-top-right rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)] group-hover:scale-110">
        <Image src="/funnel.png" alt="Image" className="rounded-md object-cover" width={500} height={500} priority />
      </div>
    ),
  },
];

export default function MainSection2() {
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
        </div>
      </div>

      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
