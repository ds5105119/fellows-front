import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default async function MainCTASection() {
  return (
    <div className="relative w-full hidden md:block">
      {/* Base image */}
      <AspectRatio ratio={926 / 295} className="w-full">
        <Image src="/footer-back-ground.png" fill alt="Image" className="rounded-md object-cover" priority />
        <div className="absolute inset-0 flex flex-col z-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center text-6xl font-extrabold leading-tight text-center">
            <p className="text-amber-500">Fellows보다 더 좋을 수는 없습니다</p>
            Fellows에 문의하세요
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
