"use client";

import { type ReactNode, useEffect, useState, useRef } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MeshGradientComponent } from "@/components/resource/meshgradient";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { AlertTriangle, CalendarIcon, CheckCircle2, Clock, SettingsIcon, TrendingUp, UserIcon, Crown, Shield, Edit3, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion";

const features = [
  {
    header: (
      <>
        <p className="text-foreground text-base font-bold">차트와 대시보드</p>
        <p className="text-foreground leading-normal">
          프로젝트 진행 상황을
          <br />한 곳에서 관리하세요
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
          할당된 업무를 한눈에
          <br />
          우선순위별로 정리하세요
        </p>
      </>
    ),
    background: "bg-gradient-to-t from-blue-400/80 via-blue-400/70 to-indigo-400/80",
    children: (
      <div className="absolute inset-0">
        {/* 진행률 표시 */}
        <div className="absolute top-36 xl:top-40 left-6 right-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">전체 진행률</span>
              <span className="text-white text-sm font-bold">68%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: "68%" }}></div>
            </div>
          </div>
        </div>

        {/* 태스크 카드들 */}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-800">UI 디자인 완료</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserIcon className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">김디자인</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">12월 15일 완료</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-800">API 개발 진행중</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserIcon className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">박개발</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">12월 20일 마감</span>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-800">QA 테스트 대기</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">열림</span>
            </div>
          </div>
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
        <p className="text-background text-base font-bold">팀원 관리</p>
        <p className="text-background leading-normal">
          팀원과 함께 업무 과정,
          <br />
          권한을 체계적으로 관리하세요
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
  {
    header: (
      <>
        <p className="text-background text-base font-bold">이슈 트래킹</p>
        <p className="text-background leading-normal">
          문제 발생부터 해결까지
          <br />
          모든 과정을 투명하게
        </p>
      </>
    ),
    background: "bg-gradient-to-t from-emerald-500/80 via-emerald-500/70 to-teal-500/80",
    children: (
      <div className="absolute inset-0">
        {/* 이슈 통계 */}
        <div className="absolute top-36 xl:top-40 left-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-white text-lg font-bold">3</div>
                <div className="text-white/80 text-xs">긴급</div>
              </div>
              <div>
                <div className="text-white text-lg font-bold">7</div>
                <div className="text-white/80 text-xs">진행중</div>
              </div>
              <div>
                <div className="text-white text-lg font-bold">12</div>
                <div className="text-white/80 text-xs">해결됨</div>
              </div>
            </div>
          </div>
        </div>

        {/* 이슈 카드들 */}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">긴급</span>
              </div>
              <span className="text-xs text-gray-500">#ISS-001</span>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-2">로그인 시스템 오류 발생</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">김</span>
                </div>
                <span className="text-xs text-gray-600">김개발 담당</span>
              </div>
              <span className="text-xs text-gray-500">2시간 전</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">보통</span>
              </div>
              <span className="text-xs text-gray-500">#ISS-002</span>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-2">UI 개선 요청사항</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">이</span>
                </div>
                <span className="text-xs text-gray-600">이디자인 담당</span>
              </div>
              <span className="text-xs text-gray-500">1일 전</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">해결됨</span>
              </div>
              <span className="text-xs text-gray-500">#ISS-003</span>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-2">데이터베이스 최적화 완료</p>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">성능 30% 향상</span>
            </div>
          </div>
        </div>
      </div>
    ),
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

const Cell = ({ header, children, background }: { header?: ReactNode; children?: ReactNode; background?: ReactNode | string }) => {
  return (
    <CarouselItem className="basis-[96%] md:basis-[54%] lg:basis-[32%] xl:basis-[27%]">
      <div
        className={cn(
          "aspect-[9/16] relative w-full rounded-3xl overflow-hidden select-none",
          typeof background === "string" && background,
          typeof background === "undefined" && "bg-muted"
        )}
      >
        <div className="w-full h-full flex items-end justify-center"></div>
        <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-2 text-xl xl:text-2xl font-extrabold tracking-normal">{header}</div>
        </div>
        {children}
        {typeof background !== "string" && typeof background !== "undefined" && background}
      </div>
    </CarouselItem>
  );
};

export default function MainSection3() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // 스와이프 관련 상태
  const [isDragging, setIsDragging] = useState(false); // 마우스 드래그 상태
  const [isTouching, setIsTouching] = useState(false); // 터치 상태
  const [startX, setStartX] = useState(0);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [accumulatedSteps, setAccumulatedSteps] = useState(0); // 누적된 스텝 수
  const indicatorRef = useRef<HTMLDivElement>(null);

  const threshold = 30;

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
    } else {
      // 스크롤 복원
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isTouching]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full flex flex-col space-y-4 md:space-y-6 px-8 lg:px-16 xl:px-36 w-full pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">SaaS를 통한 실시간 외주 상태 관리</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            진행 상황, 대시보드, 웹훅 연동, Open API
            <br />
            Fellows에서 전부 무료로 이용하고 추적하세요.
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
            <Cell key={index} {...feature} />
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
    </div>
  );
}
