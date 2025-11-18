"use client";

import ScrollAndSwapText from "@/components/fancy/text/scroll-and-swap-text";

export default function WorkMain5() {
  const names = ["Logo Animation", "Logo Design", "Visual Identity", "Web Design", "Web Development"];

  return (
    <div className="relative w-full flex flex-col items-center pb-64">
      <div className="text-sm md:text-base pt-48" style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}>
        Fellows Service
      </div>

      <div className="pt-16 flex justify-center items-start uppercase relative">
        <div className="flex md:text-5xl sm:text-3xl text-4xl lg:text-6xl xl:text-7xl justify-center items-center flex-col leading-none -space-y-0">
          {names.map((name, index) => (
            <ScrollAndSwapText key={index} offset={[`0 0.2`, `0 0.8`]} className="font-bold leading-tighter">
              {name}
            </ScrollAndSwapText>
          ))}
        </div>
      </div>
    </div>
  );
}
