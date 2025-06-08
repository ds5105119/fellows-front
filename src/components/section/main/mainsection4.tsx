"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

export default function MainSection4() {
  return (
    <div>
      <div className="relative w-full hidden md:block">
        {/* Base image */}
        <AspectRatio ratio={926 / 426}>
          <Image src="/footer-back-ground.png" fill alt="Image" className="rounded-md object-cover" priority />
          <div className="absolute inset-0 flex flex-col z-10 items-center justify-center">
            <div className="p-12 flex flex-col gap-3 text-end items-center justify-center rounded-[3rem]">
              <h1 className="text-4xl xl:text-7xl font-extrabold tracking-normal text-background">Web, App 개발</h1>
              <h1 className="text-4xl xl:text-7xl font-extrabold tracking-normal text-background">
                <span className="font-black">Fellows℠</span>와 함께 앞서나가세요
              </h1>
            </div>

            <Button className="h-18 px-36 bg-black hover:bg-zinc-800 text-xl rounded-2xl font-semibold">시작하기</Button>
          </div>
        </AspectRatio>
      </div>
      <div className="relative w-full block md:hidden">
        {/* Base image */}
        <AspectRatio ratio={480 / 715}>
          <Image src="/mobile-footer-back-ground.png" fill alt="Image" className="rounded-md object-cover" priority />
          <div className="absolute inset-0 flex z-10 items-center justify-center">
            <div className="p-12 flex flex-col gap-3 text-center items-center justify-center rounded-[3rem]">
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-normal text-background">Web, App 개발</h1>
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-normal text-background">
                <span className="font-black">Fellows℠</span>와 함께 앞서나가세요
              </h1>
            </div>
          </div>
        </AspectRatio>
      </div>
    </div>
  );
}
