"use client";

import { type ReactNode, useEffect, useState, useRef } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";
import { MeshGradientComponent } from "@/components/resource/meshgradient";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Crown, Shield, Edit3, UserPlus, XIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/button";

const features = [
  {
    header: (
      <>
        <p className="text-foreground text-base font-bold">차트와 대시보드</p>
        <p className="text-foreground leading-normal">
          프로젝트 진행 상황을
          <br />한 곳에서 확인할 수 있습니다
        </p>
      </>
    ),
    children: (
      <div className="absolute inset-0">
        <div className="w-[180%] absolute top-36 xl:top-40 left-2 xl:left-4">
          <AspectRatio ratio={931 / 790} className="w-full">
            <Image src="/service_dashboard.png" alt="대시보드 케러셀 이미지" fill />
          </AspectRatio>
        </div>
      </div>
    ),
  },
  {
    header: (
      <>
        <p className="text-foreground text-base font-bold">실시간 태스크 관리</p>
        <p className="text-foreground leading-normal">
          진행 중인 작업 현황을
          <br />
          실시간으로 전달해드려요
        </p>
      </>
    ),
    background: "bg-gradient-to-t from-blue-400/80 via-blue-400/70 to-indigo-400/80",
    children: (
      <div className="absolute inset-0">
        <div className="w-[280%] absolute top-36 xl:top-40 left-6 xl:left-8">
          <AspectRatio ratio={1143 / 595} className="w-full">
            <Image src="/service-task.png" alt="대시보드 케러셀 이미지" className="rounded-md object-cover border border-zinc-300" fill />
          </AspectRatio>
        </div>
      </div>
    ),
  },
  {
    header: (
      <>
        <p className="text-foreground text-base font-bold">비즈니스 페이지도 매장 쇼핑몰도</p>
        <p className="text-foreground leading-normal">
          어떤 프로젝트든
          <br />
          부담 없이 계획하세요
        </p>
      </>
    ),
    background: (
      <div className="absolute inset-0 -z-10">
        <Image src="/service-carousel-background.jpg" alt="대시보드 케러셀 이미지" fill className="object-cover" />
      </div>
    ),
    children: (
      <div className="absolute inset-0">
        <div className="w-[100%] absolute top-36 xl:top-40 left-6 xl:left-8">
          <AspectRatio ratio={9 / 16} className="w-full">
            <Image src="/service-carousel-main.jpg" alt="대시보드 케러셀 이미지" fill className="rounded-md object-cover border border-zinc-300" />
          </AspectRatio>
        </div>
      </div>
    ),
  },
  {
    header: (
      <>
        <p className="text-background text-base font-bold">AI 보고서 작성</p>
        <p className="text-background leading-normal">
          담당 매니저 + AI 레포트까지
          <br />
          간단하게 작업 현황을 파악하세요
        </p>
      </>
    ),
    background: "bg-gradient-to-t from-emerald-500/80 via-emerald-500/70 to-teal-500/80",
    children: (
      <div className="absolute inset-0">
        <div className="w-full absolute top-36 xl:top-40 left-6 xl:left-8">
          <AspectRatio ratio={575 / 870} className="w-full">
            <Image src="/service-report.png" alt="대시보드 케러셀 이미지" className="rounded-md object-cover border border-zinc-300" fill />
          </AspectRatio>
        </div>
      </div>
    ),
  },
  {
    header: (
      <>
        <p className="text-background text-base font-bold">커다란 프로젝트라면</p>
        <p className="text-background leading-normal">
          팀원과 함께
          <br />
          체계적으로 관리하세요
        </p>
      </>
    ),
    background: (
      <div className="absolute inset-0">
        <MeshGradientComponent className="opacity-100" colors={["#be73ff", "rgb(255, 90, 214)", "#ff2323", "#ff9849"]} />
      </div>
    ),
    children: <TeamMembersSection />,
  },
];

const featureDetails = [
  {
    title: "차트와 대시보드",
    description: "프로젝트 진행 상황을 한 곳에서 확인할 수 있습니다",
    details: [
      "실시간 프로젝트 진행률 추적",
      "시각적 차트와 그래프로 데이터 분석",
      "커스터마이징 가능한 대시보드 레이아웃",
      "팀 성과 지표 및 KPI 모니터링",
      "자동 리포트 생성 및 내보내기 기능",
    ],
    children: (
      <div className="w-full flex flex-col space-y-6 md:space-y-12">
        <div className="relative w-full pt-10 md:pt-20 bg-zinc-100 rounded-3xl overflow-hidden flex flex-col space-y-6">
          <div className="text-xl lg:text-2xl xl:text-3xl font-bold px-8 sm:px-20 md:px-30 lg:px-32 xl:px-34 break-keep tracking-tight leading-tight">
            프로젝트 주제별, 유형별 체계적인 관리
            <span className="text-muted-foreground">
              도 Fellows SaaS에서. 예정, 진행중이거나 지연된 테스크 관리부터 프로젝트 유형 별 관리까지 대시보드에서 모두 한 번에 가능합니다.
            </span>
          </div>

          <div className="w-[calc(100%-2rem)] sm:w-[calc(100%-5rem)] md:w-[calc(100%-7.5rem)] lg:w-[calc(100%-8rem)] xl:w-[calc(100%-8.5rem)] ml-8 sm:ml-20 md:ml-30 lg:ml-32 xl:ml-34">
            <AspectRatio ratio={2055 / 1034}>
              <div />
            </AspectRatio>
          </div>

          <div className="absolute left-8 sm:left-20 md:left-30 lg:left-32 xl:left-34 bottom-0 w-[calc(100%-2rem)] sm:w-[calc(100%-5rem)] md:w-[calc(100%-7.5rem)] lg:w-[calc(100%-8rem)] xl:w-[calc(100%-8.5rem)]">
            <AspectRatio ratio={2055 / 1034}>
              <Image alt="케러셀 내붑 다이얼로그 이미지" src="/section-3-dialog-1-1.png" className="h-full w-auto object-contain" fill />
            </AspectRatio>
          </div>
        </div>

        <div className="relative w-full pt-10 md:pt-20 bg-zinc-100 rounded-3xl overflow-hidden flex flex-col space-y-6">
          <div className="text-xl lg:text-2xl xl:text-3xl font-bold px-8 sm:px-20 md:px-30 lg:px-32 xl:px-34 break-keep tracking-tight leading-tight">
            간단한 설정.&nbsp;
            <span className="text-muted-foreground">
              ‘튜토리얼’을 이용하면 프로젝트를 만들고 프로젝트의 진행 상황을 추적하는 방법에 대해 손쉽게 배울 수 있습니다.
            </span>
          </div>

          <div className="w-[calc(100%-4rem)] sm:w-[calc(100%-10rem)] md:w-[calc(100%-15rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-17rem)] ml-8 sm:ml-20 md:ml-30 lg:ml-32 xl:ml-34 mb-8 sm:mb-11 md:mb-14 lg:mb-17 xl:mb-20">
            <AspectRatio ratio={2055 / 1034}>
              <div />
            </AspectRatio>
          </div>

          <div className="absolute left-8 sm:left-20 md:left-30 lg:left-32 xl:left-34 bottom-8 sm:bottom-11 md:bottom-14 lg:bottom-17 xl:bottom-20 w-[calc(100%-4rem)] sm:w-[calc(100%-10rem)] md:w-[calc(100%-15rem)] lg:w-[calc(100%-16rem)] xl:w-[calc(100%-17rem)]">
            <AspectRatio ratio={2441 / 1126}>
              <Image alt="케러셀 내붑 다이얼로그 이미지" src="/section-3-dialog-1-2.png" className="h-full w-auto object-contain" fill />
            </AspectRatio>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "실시간 태스크 관리",
    description: "진행 중인 작업 현황을 실시간으로 전달해드려요",
    details: ["실시간 작업 상태 업데이트", "팀원별 작업 할당 및 추적", "우선순위 기반 태스크 정렬", "마감일 알림 및 리마인더", "작업 히스토리 및 로그 관리"],
  },
  {
    title: "비즈니스 페이지도 매장 쇼핑몰도",
    description: "어떤 프로젝트든 부담 없이 계획하세요",
    details: [
      "다양한 프로젝트 템플릿 제공",
      "비즈니스 페이지 및 쇼핑몰 구축 지원",
      "반응형 디자인 자동 적용",
      "SEO 최적화 도구 내장",
      "결제 시스템 및 주문 관리 통합",
    ],
  },
  {
    title: "AI 보고서 작성",
    description: "담당 매니저 + AI 레포트까지 간단하게 작업 현황을 파악하세요",
    details: ["AI 기반 자동 보고서 생성", "프로젝트 진행 상황 분석", "성과 예측 및 리스크 분석", "맞춤형 인사이트 제공", "다양한 형식의 보고서 출력"],
  },
  {
    title: "커다란 프로젝트라면",
    description: "팀원과 함께 체계적으로 관리하세요",
    details: ["팀원 역할 및 권한 관리", "실시간 협업 도구", "팀 커뮤니케이션 허브", "프로젝트 단계별 워크플로우", "팀 성과 분석 및 피드백"],
  },
];

function TeamMembersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
    amount: 0.2,
  });

  const [visibleMembers, setVisibleMembers] = useState(0);
  const buttonControls = useAnimation();

  // 팀원 데이터
  const teamMembers = [
    {
      id: "owner",
      name: "김재현 (나)",
      email: "kim@company.com",
      avatar: "/teams-avatar-1.png",
      fallback: "김",
      role: "소유자",
      icon: Crown,
      iconColor: "text-yellow-600",
      badgeVariant: "destructive" as const,
    },
    {
      id: "admin",
      name: "이태영",
      email: "lee@company.com",
      avatar: "/teams-avatar-2.png",
      fallback: "이",
      role: "관리자",
      icon: Shield,
      iconColor: "text-blue-600",
      badgeVariant: "secondary" as const,
    },
    {
      id: "editor",
      name: "박소희",
      email: "park@company.com",
      avatar: "/teams-avatar-3.png",
      fallback: "박",
      role: "편집/읽기",
      icon: Edit3,
      iconColor: "text-green-600",
      badgeVariant: "default" as const,
    },
    {
      id: "reader",
      name: "최민수",
      email: "choi@company.com",
      avatar: "/teams-avatar-1.png",
      fallback: "최",
      role: "읽기",
      icon: Edit3,
      iconColor: "text-gray-600",
      badgeVariant: "outline" as const,
    },
  ];

  // 팀원 추가 애니메이션 함수
  const startTeamAnimation = () => {
    // 처음에는 소유자만 표시
    setVisibleMembers(1);

    // 0.8초 후부터 0.6초 간격으로 팀원 추가
    const timers = teamMembers.slice(1).map((_, index) => {
      return setTimeout(() => {
        setVisibleMembers((prev) => prev + 1);
      }, 800 + index * 600);
    });

    return timers;
  };

  // 무한 반복 애니메이션
  useEffect(() => {
    if (isInView) {
      // 첫 번째 애니메이션 시작
      let timers = startTeamAnimation();

      // 1분(60초)마다 애니메이션 반복
      const infiniteInterval = setInterval(() => {
        // 기존 타이머들 정리
        timers.forEach((timer) => clearTimeout(timer));

        // 팀원 수를 0으로 리셋 (모든 팀원 사라짐)
        setVisibleMembers(0);

        // 0.5초 후 새로운 애니메이션 시작
        setTimeout(() => {
          timers = startTeamAnimation();
        }, 500);
      }, 20000);

      return () => {
        // 컴포넌트 언마운트 시 모든 타이머 정리
        timers.forEach((timer) => clearTimeout(timer));
        clearInterval(infiniteInterval);
      };
    }
  }, [isInView]);

  // 팀원이 추가될 때마다 버튼 누르는 애니메이션
  useEffect(() => {
    if (visibleMembers > 1) {
      // 팀원이 추가될 때마다 버튼 누르는 효과
      buttonControls.start({
        scale: [1, 0.9, 1],
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      });
    }
  }, [visibleMembers, buttonControls]);

  // 멤버 카드 애니메이션
  const memberVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  // 기존 멤버들이 위로 밀려나는 애니메이션
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="absolute inset-0" ref={ref}>
      {/* 팀원 목록 컨테이너 */}
      <div className="absolute bottom-4 left-4 right-4">
        <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence mode="sync">
            {teamMembers.slice(0, visibleMembers).map((member, index) => {
              const IconComponent = member.icon;
              return (
                <motion.div
                  key={member.id}
                  className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20"
                  variants={memberVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{
                    opacity: 0,
                    y: -50,
                    scale: 0.9,
                    transition: {
                      duration: 0.3,
                    },
                  }}
                  layout
                  layoutId={member.id}
                  style={{
                    zIndex: teamMembers.length - index,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-3 h-3 ${member.iconColor}`} />
                      <Badge variant={member.badgeVariant} className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* 팀원 초대 버튼 - 고정 위치, 팀원 추가시마다 누르는 효과 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <motion.div
              className="flex items-center justify-center space-x-2 text-emerald-700 cursor-pointer"
              animate={buttonControls}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">새 팀원 초대하기</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const Cell = ({
  header,
  children,
  background,
  onClick,
  index,
}: {
  header?: ReactNode;
  children?: ReactNode;
  background?: ReactNode | string;
  onClick?: (index: number) => void;
  index: number;
}) => {
  return (
    <CarouselItem className="basis-[96%] md:basis-[54%] lg:basis-[32%] xl:basis-[27%]">
      <div
        className={cn(
          "aspect-[9/16] relative w-full rounded-3xl overflow-hidden select-none border border-zinc-100",
          typeof background === "string" && background,
          typeof background === "undefined" && "bg-muted"
        )}
        onClick={() => onClick && index !== undefined && onClick(index)}
      >
        <div className="w-full h-full flex items-end justify-center"></div>
        <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-1.5 text-xl xl:text-2xl font-extrabold tracking-normal">{header}</div>
        </div>
        {children}
        {typeof background !== "string" && typeof background !== "undefined" && background}
        {featureDetails[index].children && (
          <Button variant="ghost" size="icon" className="absolute bottom-5 right-5 focus-visible:ring-0 rounded-full bg-zinc-800 hover:bg-zinc-700">
            <PlusIcon className="size-5 text-zinc-50" strokeWidth={3} />
          </Button>
        )}
      </div>
    </CarouselItem>
  );
};

export default function MainSection3() {
  const lenis = useLenis();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 스와이프 관련 상태
  const [isDragging, setIsDragging] = useState(false); // 마우스 드래그 상태
  const [isTouching, setIsTouching] = useState(false); // 터치 상태
  const [startX, setStartX] = useState(0);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [accumulatedSteps, setAccumulatedSteps] = useState(0); // 누적된 스텝 수
  const indicatorRef = useRef<HTMLDivElement>(null);

  const threshold = 30;

  const handleFeatureClick = (index: number) => {
    if (featureDetails[index].children) {
      setSelectedFeature(index);
      setIsDialogOpen(true);
      lenis?.stop();
    }
  };

  // 공통 시작 핸들러
  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setInitialSlideIndex(current);
    setAccumulatedSteps(0);
  };

  // 공통 이동 핸들러
  const handleMove = (clientX: number) => {
    if (!isDragging && !isTouching) return;

    const deltaX = clientX - startX;
    // 현재 드래그 거리를 기반으로 스텝 계산 (방향 포함)
    const currentSteps =
      deltaX < 0
        ? -Math.floor(Math.abs(deltaX) / threshold) // 왼쪽: 음수
        : Math.floor(deltaX / threshold); // 오른쪽: 양수

    // 스텝이 변경되었을 때만 슬라이드 이동
    if (currentSteps !== accumulatedSteps) {
      const targetIndex = initialSlideIndex + currentSteps;

      // 경계 체크
      const clampedIndex = Math.max(0, Math.min(count - 1, targetIndex));

      if (clampedIndex !== current) {
        api?.scrollTo(clampedIndex);
      }

      // 누적 스텝 업데이트
      setAccumulatedSteps(currentSteps);
    }
  };

  // 공통 종료 핸들러
  const handleEnd = () => {
    setIsDragging(false);
    setIsTouching(false);
    setStartX(0);
    setAccumulatedSteps(0);
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // 기본 터치 동작 방지
    setIsTouching(true);
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // 스크롤 방지
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // 기본 터치 동작 방지
    handleEnd();
  };

  useEffect(() => {
    if (!isDialogOpen) {
      lenis?.start();
    }
  }, [isDialogOpen, lenis]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, setCount, setCurrent]);

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };

      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX, current, count, api, initialSlideIndex, accumulatedSteps]);

  // 터치 중일 때만 body 스크롤 방지
  useEffect(() => {
    if (isTouching) {
      // 스크롤 방지
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      lenis?.stop();
    } else {
      // 스크롤 복원
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      lenis?.start();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      lenis?.start();
    };
  }, [isTouching]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full flex flex-col space-y-4 md:space-y-6 px-8 lg:px-16 xl:px-36 w-full pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Fellows SaaS를 사용하면 외주가 쉬워집니다.</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            무료로 제공되는 Fellows SaaS를 사용하여
            <br />
            정확하게 일이 이루어지고 있는지 파악해보세요.
          </h4>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="col-span-full w-full pl-4 lg:pl-16 xl:pl-36"
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 60000,
          }),
        ]}
      >
        <CarouselContent className="w-full !overflow-visible" style={{ overflow: "visible" }}>
          {features.map((feature, index) => (
            <Cell key={index} onClick={handleFeatureClick} index={index} {...feature} />
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="pl-2 pr-6 lg:pr-18 xl:pr-38 flex justify-between items-center mt-5">
          <div
            ref={indicatorRef}
            className={cn(
              "flex p-1.5 rounded-full group h-fit w-fit relative overflow-hidden select-none",
              isDragging || isTouching ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{ touchAction: "pan-x" }} // X축 터치만 허용
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {[...Array(count).keys()].map((index) => (
              <div className="h-3 w-6 flex items-center justify-center cursor-pointer" key={index}>
                <button
                  onClick={() => api?.scrollTo(index)}
                  className={cn("w-2 h-2 rounded-full hover:scale-130 transition-all duration-300", index === current ? "bg-zinc-500" : "bg-zinc-300")}
                />
              </div>
            ))}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-300 -z-10",
                isDragging || isTouching ? "bg-zinc-300/50" : "group-hover:bg-zinc-300/50"
              )}
            />
          </div>

          <div className="flex space-x-2">
            <CarouselPrevious className="relative translate-y-0 left-0 size-11 bg-black/5 backdrop-blur-sm border-0" />
            <CarouselNext className="relative translate-y-0 right-0 size-11 bg-black/5 backdrop-blur-sm border-0" />
          </div>
        </div>
      </Carousel>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          data-lenis-prevent
          className="bg-white !w-full md:!w-[calc(100%-2rem)] !max-w-7xl !top-full !translate-y-[-100%] md:!top-1/2 md:!translate-y-[-50%] h-[calc(100%-2.5rem)] md:h-[calc(100%-3rem)] !rounded-b-none !rounded-t-2xl md:!rounded-2xl !overflow-y-auto !border-0 !shadow-3xl p-0"
          overlayClassName="backdrop-blur-sm"
          showCloseButton={false}
        >
          {selectedFeature !== null && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle className="text-xl font-bold">{featureDetails[selectedFeature].title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">{featureDetails[selectedFeature].description}</DialogDescription>
              </DialogHeader>
              <div className="h-full w-full">
                <div className="sticky top-0 w-full px-5 py-5 font-bold grid grid-cols-2 items-center">
                  <div className="h-full flex items-center justify-start"></div>
                  <div className="h-full flex items-center justify-end">
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon" className="focus-visible:ring-0 rounded-full bg-zinc-800 hover:bg-zinc-700">
                        <XIcon className="size-5 text-zinc-50" strokeWidth={3} />
                      </Button>
                    </DialogClose>
                  </div>
                </div>

                <div className="h-full px-4 md:px-18">
                  <div className="flex flex-col space-y-3 text-2xl xl:text-5xl font-extrabold w-3/4">
                    <p className="text-foreground text-base font-bold break-keep">{featureDetails[selectedFeature].title}</p>
                    <p className="text-foreground leading-tight break-keep">{featureDetails[selectedFeature].description}</p>
                  </div>
                  <div className="flex mt-12 md:mt-18">{featureDetails[selectedFeature].children}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
