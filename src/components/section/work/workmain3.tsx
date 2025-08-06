import ImageTrail from "@/components/resource/imagetrail";
import Image from "next/image";

export default function WorkMain3() {
  return (
    <div className="relativew-full h-full">
      <div className="relative w-full h-[calc(100%-80px)] px-4 overflow-hidden">
        <div className="absolute bottom-4 right-4 w-full -z-10">
          <div className="w-full pl-8 text-4xl md:text-7xl leading-tight tracking-wide font-extrabold text-right flex flex-col space-x-0 select-none">
            <div className="flex justify-end flex-wrap gap-x-[1.5vw] items-center">
              <span>Fellows는</span>
              <span className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle">
                <Image alt="랜덤 이미지" src="https://picsum.photos/600/400?random=2" fill className="object-cover" />
              </span>
              <span>디자인과 기술을</span>
            </div>
            섬세하게 어루만져 경험을 빚어내고,
            <div className="flex justify-end flex-wrap gap-x-[1.5vw] items-center">
              <span>브랜드와 고객의</span>
              <span className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle">
                <Image alt="랜덤 이미지" src="https://picsum.photos/600/400?random=3" fill className="object-cover" />
              </span>
              <span>연결을</span>
            </div>
            <div className="flex justify-end flex-wrap gap-x-[1vw] items-center">
              <span>더 깊고</span>
              <span className="text-[#f25840]">❉</span>
              <span>자연스럽게 만듭니다.</span>
            </div>
          </div>
        </div>

        <ImageTrail
          key="imagetrail"
          items={[
            "https://picsum.photos/id/287/300/300",
            "https://picsum.photos/id/1001/300/300",
            "https://picsum.photos/id/1025/300/300",
            "https://picsum.photos/id/1026/300/300",
            "https://picsum.photos/id/1027/300/300",
            "https://picsum.photos/id/1028/300/300",
            "https://picsum.photos/id/1029/300/300",
            "https://picsum.photos/id/1030/300/300",
          ]}
          variant={1}
        />
      </div>
      <div className="relative w-full h-20">
        <div className="w-full h-20 border-y flex items-center justify-center font-black tracking-tight hover:text-[#f25840]">Learn more about our company</div>
      </div>
    </div>
  );
}
