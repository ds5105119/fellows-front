import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import AnimatedBeamSection from "./animatedbeamsection";

const date = new Date();
date.setDate(2);

const files = [
  {
    name: "가상화폐 거래소",
    body: "비트코인 기반의 가상화폐 거래소 웹사이트를 만들어주세요 실시간 시세 조회, 시세 차트, 회원가입과 보안 중심의 로그인 시스템까지 포함되면 좋겠어요.",
  },
  {
    name: "쥬얼리 브랜드 쇼핑몰",
    body: "쥬얼리 브랜드✨ 의 감성을 살릴 수 있는 쇼핑몰 사이트를 만들어주세요 우아한 디자인과 함께 카드·간편결제 기능도 넣어줄 수 있을까요?",
  },
  {
    name: "랜딩 페이지",
    body: "브랜드 홍보를 위한 세련된 랜딩 페이지를 만들어주세요 반응형 디자인에 스크롤 애니메이션과 인터랙티브한 구성도 부탁드려요!",
  },
  {
    name: "산업용 앱 개발",
    body: "산업 현장에서 사용할 수 있는 내부 전용 앱을 개발해주세요 ⚙️ GPG 키 기반의 보안 기능과 파일 업로드, 사용자 권한 관리도 필요해요.",
  },
  {
    name: "AI Saas 서비스 페이지",
    body: "AI 기반 SaaS 🤖 서비스를 소개하는 웹페이지를 만들어주세요 핵심 기능 소개, 요금제, 가입 흐름까지 깔끔하게 정리되면 좋겠어요!",
  },
];

const features = [
  {
    emoji: "✨",
    Icon: FileTextIcon,
    name: "단 10분!",
    description: "프로젝트 예상 견적서를 받아보세요.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1 ![box-shadow:0_12px_24px_rgba(0,0,0,.05)] bg-gray-100/50",
    background: (
      <Marquee pauseOnHover className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
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
    emoji: "🔔",
    Icon: BellIcon,
    name: "알림 시스템",
    description: "프로젝트 진행 상황에 대한 알림을 실시간으로 받으세요.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2 ![box-shadow:0_12px_24px_rgba(0,0,0,.05)] bg-blue-100/50",
    background: (
      <div className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    emoji: "🔗",
    Icon: Share2Icon,
    name: "통합 관리",
    description: "다양한 외부 시스템과 연동하여 모든 작업을 하나의 플랫폼에서 관리하세요.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2 ![box-shadow:0_12px_24px_rgba(0,0,0,.05)] bg-rose-100/50",
    background: (
      <AnimatedBeamSection className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    emoji: "📅",
    Icon: CalendarIcon,
    name: "프로젝트 일정 관리",
    description: "캘린더를 이용해 프로젝트 일정을 손쉽게 관리하고 필요한 파일을 날짜별로 필터링하세요.",
    className: "col-span-3 lg:col-span-1 ![box-shadow:0_12px_24px_rgba(0,0,0,.05)] bg-amber-100/50",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={date}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
];

export default function MainSection2() {
  return (
    <div>
      <div className="col-span-full pb-16">
        <div className="text-center flex flex-col space-y-3">
          <h4 className="text-lg md:text-xl font-semibold text-foreground">
            <NumberTicker value={6000} startValue={1251} className="whitespace-pre-wrap tracking-tighter" />
            개나 외주 데이터를 학습한 AI가 있으니깐요
          </h4>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-normal text-foreground">
            <span className="text-red-400">단 몇 분</span>만에 예상 견적서를 생성해보세요
          </h1>
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
