"use client";

import DecryptedText from "@/components/resource/decryptedtext";
import { useFitText } from "@/components/resource/fittext";
import GridDistortion from "@/components/resource/griddistortion";

export default function WorkMain2() {
  const { ref: fitTextRef, style: fitTextStyle } = useFitText<HTMLDivElement>({
    paddingRem: 0,
    scaleFactor: 0.98,
  });

  return (
    <div className="relative w-full h-full flex flex-col mt-[calc(100dvh-28px)]">
      <div className="mx-4 aspect-[23/9] overflow-hidden relative">
        <GridDistortion imageSrc="/workmain.avif" mouse={0.25} strength={0.15} className="object-cover" />
      </div>
      <div ref={fitTextRef} style={fitTextStyle} className="absolute bottom-0 font-black text-black leading-none">
        <DecryptedText text={`Fellows`} animateOn="view" revealDirection="start" speed={150} maxIterations={100} sequential={true} />
      </div>
    </div>
  );
}
