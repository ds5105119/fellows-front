"use client";

import GridDistortion from "@/components/resource/griddistortion";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function WorkMain2() {
  return (
    <div className="relative w-full h-full flex flex-col mt-[calc(100dvh-28px)]">
      <div className="relative mx-4 w-full aspect-[23/9] overflow-hidden hidden md:block">
        <GridDistortion imageSrc="/workmain.avif" pixelsPerGridPoint={80} mouse={0.25} strength={0.15} className="object-cover" />
      </div>
      <div className="mx-4 aspect-[9/16] overflow-hidden relative block md:hidden">
        <GridDistortion imageSrc="/workmain.avif" pixelsPerGridPoint={80} mouse={0.25} strength={0.15} className="object-cover" />
      </div>
      <div className="mx-4 my-4">
        <VelocityScroll numRows={1}>Working Globally • </VelocityScroll>
        <VelocityScroll numRows={1}>12+ years of experience • </VelocityScroll>
      </div>
    </div>
  );
}
