import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import AnimatedBeamSection from "./animatedbeamsection";
import Image from "next/image";

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
    emoji: "✨",
    Icon: FileTextIcon,
    name: "AI 견적서 작성",
    description: "6000개나 외주 데이터를 학습한 AI 모델로 예상 견적가를 확인해보세요.",
    href: "#",
    cta: "더 알아보기",
    className: "col-span-3 lg:col-span-1 ![box-shadow:0_12px_24px_rgba(0,0,0,.0)] bg-zinc-100 hover:bg-blue-100 transition-colors duration-300 ease-in-out",
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
    emoji: "💫",
    Icon: BellIcon,
    name: "간편한 프로젝트 관리",
    description: "SaaS 관리 시스템으로 프로젝트 상태를 쉽게 관리해보세요.",
    href: "#",
    cta: "더 알아보기",
    className: "col-span-3 lg:col-span-2 bg-zinc-100 hover:bg-blue-100 transition-colors duration-300 ease-in-out",
    background: (
      <div className="absolute right-10 top-10 origin-top-right rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)] group-hover:scale-110">
        <Image src="/funnel.png" alt="Image" className="rounded-md object-cover" width={500} height={500} priority />
      </div>
    ),
  },
  {
    emoji: "🔗",
    Icon: Share2Icon,
    name: "통합 관리",
    description: "다양한 외부 시스템과 연동하여 모든 작업을 하나의 플랫폼에서 관리하세요.",
    href: "#",
    cta: "더 알아보기",
    className: "col-span-3 lg:col-span-2 bg-zinc-100 hover:bg-blue-100 transition-colors duration-300 ease-in-out",
    background: (
      <AnimatedBeamSection className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    emoji: "📅",
    Icon: CalendarIcon,
    name: "프로젝트 일정 관리",
    description: "캘린더를 이용해 프로젝트 일정을 손쉽게 관리하고 필요한 파일을 날짜별로 필터링하세요.",
    className: "col-span-3 lg:col-span-1 bg-zinc-100 hover:bg-blue-100 transition-colors duration-300 ease-in-out",
    href: "#",
    cta: "더 알아보기",
    background: (
      <div className="absolute right-10 top-10 origin-top-right rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_30%)] group-hover:scale-110">
        <Image src="/funnel.png" alt="Image" className="rounded-md object-cover" width={500} height={500} priority />
      </div>
    ),
  },
];

export default function MainSection2() {
  return (
    <div className="w-full">
      <div className="px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">
          <span className="text-red-400">개발 외주</span> Fellows에서 시작하면 좋은 이유
        </h1>
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
