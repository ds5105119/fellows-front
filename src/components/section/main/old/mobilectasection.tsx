import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default async function MobileCTASection() {
  return (
    <div className="relative w-full block md:hidden">
      {/* Base image */}
      <AspectRatio ratio={892.37 / 260} className="w-full">
        <Image src="/mobile-footer-background.png" fill alt="Image" className="rounded-md object-cover" priority />
        <div className="absolute inset-0 flex z-10 items-center justify-center">
          <div className="p-4 flex flex-col gap-3 text-center items-center justify-center">
            <h1 className="text-xl font-extrabold tracking-normal text-background">
              <p className="text-amber-500">Fellows보다 더 좋을 수는 없습니다</p>
              Fellows에 문의하세요
            </h1>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
