"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MeshGradientComponent } from "@/components/resource/meshgradient";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

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
        <p className="text-emerald-500">/Team</p>
        <p className="text-foreground leading-normal">
          각 분야 전문가로 구성된 팀이
          <br />
          프로젝트 완수를 위해
        </p>
      </>
    ),
    background: "bg-gradient-to-t from-cyan-300/80 via-cyan-300/70 to-blue-300/80",
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
        <p className="text-emerald-500">/Team</p>
        <p className="text-foreground leading-normal">
          각 분야 전문가로 구성된 팀이
          <br />
          프로젝트 완수를 위해
        </p>
      </>
    ),
    background: (
      <div className="absolute inset-0">
        <MeshGradientComponent className="opacity-100" colors={["#be73ff", "rgb(255, 90, 214)", "#ff2323", "#ff9849"]} />
      </div>
    ),
  },
  {
    header: (
      <>
        <p className="text-emerald-500">/Team</p>
        <p className="text-foreground leading-normal">
          각 분야 전문가로 구성된 팀이
          <br />
          프로젝트 완수를 위해
        </p>
      </>
    ),
    background: "bg-gradient-to-t from-cyan-500/80 via-cyan-500/70 to-blue-500/80 brightness-80",
  },
];

const Cell = ({ header, children, background }: { header?: ReactNode; children?: ReactNode; background?: ReactNode | string }) => {
  return (
    <CarouselItem className="basis-[96%] md:basis-[54%] lg:basis-[32%] xl:basis-[26%]">
      <div
        className={cn(
          "aspect-[9/16] relative w-full rounded-3xl overflow-hidden",
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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">SaaS를 통한 간편한 외주 상태 관리</h1>
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
            delay: 10000,
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
