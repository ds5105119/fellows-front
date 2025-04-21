"use client";

import Image from "next/image";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const carousel = [{ path: "/onezip/carousel1.png" }, { path: "/onezip/carousel2.png" }, { path: "/onezip/carousel3.png" }] as const;

export default function MainCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 3000 }));

  return (
    <Carousel className="w-full" plugins={[plugin.current]} opts={{ loop: true }} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
      <CarouselContent>
        {carousel.map((value) => (
          <CarouselItem key={value.path}>
            <div className="p-1 w-full">
              <Image className="object-cover" src={value.path} alt={value.path} width={1376} height={372} priority />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
