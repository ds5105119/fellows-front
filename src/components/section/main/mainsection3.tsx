"use client";

import { ReactNode, useEffect, useState } from "react";
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
    background: "bg-emerald-100",
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
        <div className="pl-2 pr-8 flex justify-between items-center mt-5">
          <div className="flex space-x-3.5">
            {[...Array(count).keys()].map((index) => (
              <div className="size-3 flex items-center justify-center cursror-pointer" key={index}>
                <button
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-2 h-2 rounded-full hover:scale-130 hover:ring-2 transition-all duration-300",
                    index === current ? "bg-slate-500 ring-slate-600" : "bg-slate-300 ring-slate-400"
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex space-x-2 pr-4 lg:pr-16 xl:pr-36">
            <CarouselPrevious className="relative translate-y-0 left-0 size-11 bg-black/5 backdrop-blur-sm border-0" />
            <CarouselNext className="relative translate-y-0 right-0 size-11 bg-black/5 backdrop-blur-sm border-0" />
          </div>
        </div>
      </Carousel>
    </div>
  );
}
