import Image from "next/image";

export default function WorkMain3() {
  return (
    <div className="w-full h-full flex flex-col justify-end items-end px-4">
      <div className="w-full pl-8 text-4xl md:text-7xl leading-tight tracking-wide font-extrabold text-right flex flex-col space-x-0">
        <div className="flex justify-end flex-wrap gap-x-[1.5vw] items-center">
          <span>우리는</span>
          <span className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle">
            <Image alt="랜덤 이미지" src="https://picsum.photos/600/400?random=2" fill className="object-cover" />
          </span>
          <span>디자인과 기술을</span>
        </div>
        섬세하게 어우러져 경험을 빚어내고,
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
  );
}
