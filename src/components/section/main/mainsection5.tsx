"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

export default function MainSection5() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">다른 업체와는 비교 불허</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            글로벌 개발 파트너사의 AI 전문가 등
            <br />
            100명 이상의 전문가들과 협력하고 있어요.
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
          {[...Array(5).keys()].map((index) => (
            <CarouselItem key={index} className="basis-[96%] md:basis-[54%] lg:basis-[32%] xl:basis-[26%]">
              <div className="aspect-[9/16] relative w-full">
                <div className="w-full h-full bg-muted rounded-3xl flex items-end justify-center"></div>
                <div className="absolute top-10 left-10 flex flex-col space-y-1.5">
                  <div className="flex flex-col space-y-2">
                    <p className="text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
                    <p className="text-2xl font-extrabold tracking-normal text-foreground leading-normal">
                      각 분야 전문가로 구성된 팀이
                      <br />
                      프로젝트 완수를 위해
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="pl-2 pr-8 flex justify-between items-center mt-5">
          <div className="flex space-x-3.5">
            {[...Array(count + 1).keys()].map((index) => (
              <div key={index} className={cn("w-2 h-2 rounded-full", index === current ? "bg-slate-500" : "bg-slate-300")} />
            ))}
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
