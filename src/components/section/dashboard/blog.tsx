"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/motion-primitives/carousel";
import { usePosts } from "@/hooks/fetch/blog";

export function Blog() {
  const postSwr = usePosts(5);
  const posts = postSwr.data?.flatMap((i) => i.items) ?? [];

  return (
    <div className="relative h-full w-full">
      <Carousel className="w-full h-full" innerClassName="w-full h-full">
        <CarouselContent className="relative w-full h-full">
          {posts.map((item) => {
            return (
              <CarouselItem key={item.id} className="h-full">
                <div className="relative flex w-full h-full items-center justify-center select-none">
                  <Image src={item.title_image} alt={item.summary} fill draggable={false} className="object-cover select-none" priority />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
