"use client";

import GridDistortion from "@/components/resource/griddistortion";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function WorkMain2() {
  return (
    <div className="relative w-full flex flex-col mt-[calc(96vh+4px)] md:mt-[calc(96vh+4px)]">
      \{" "}
      <div className="mx-4 hidden md:block">
        <div className="relative w-full aspect-[23/9] overflow-hidden">
          <GridDistortion imageSrc="/workmain.avif" mouse={0.25} strength={0.15} className="object-cover" />
        </div>
      </div>
      <div className="mx-4 block md:hidden">
        <div className="relative w-full aspect-[9/16] overflow-hidden">
          <GridDistortion imageSrc="/workmain.avif" mouse={0.25} strength={0.15} className="object-cover" />
        </div>
      </div>
      <div className="mx-4 my-2 md:my-4 leading-0">
        <VelocityScroll numRows={1}>Working Globally • </VelocityScroll>
        <VelocityScroll numRows={1}>12+ years of experience • </VelocityScroll>
      </div>
    </div>
  );
}
