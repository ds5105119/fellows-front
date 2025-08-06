"use client";

import ImageTrail from "@/components/resource/imagetrail";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function WorkMain3() {
  const lenis = useLenis();

  const detailSectionRef = useRef<HTMLDivElement>(null);
  const [isDetailSectionOpen, setIsDetailSectionOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (!isDetailSectionOpen) {
      if (detailSectionRef.current) {
        lenis?.scrollTo(detailSectionRef.current);
      }
    }
    setIsDetailSectionOpen(!isDetailSectionOpen);
  };

  const closeDetailSection = () => {
    setIsDetailSectionOpen(false);
  };

  const mainVariants = {
    closed: {
      y: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      y: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <div className="relativew-full h-full">
      <div className="relative w-full h-[calc(100%-80px)] px-4 overflow-hidden">
        <div className="absolute bottom-4 right-4 w-full -z-10">
          <div className="w-full pl-8 text-4xl md:text-7xl leading-tight tracking-wide font-extrabold text-right flex flex-col space-x-0 select-none">
            <div className="flex justify-end flex-wrap gap-x-[1.5vw] items-center">
              <span>Fellows는</span>
              <span className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle">
                <Image alt="랜덤 이미지" src="https://picsum.photos/600/400?random=2" fill className="object-cover" priority />
              </span>
              <span>디자인과 기술을</span>
            </div>
            섬세하게 어루만져 경험을 빚어내고,
            <div className="flex justify-end flex-wrap gap-x-[1.5vw] items-center">
              <span>브랜드와 고객의</span>
              <span className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle">
                <Image alt="랜덤 이미지" src="https://picsum.photos/600/400?random=3" fill className="object-cover" priority />
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
        <div
          ref={detailSectionRef}
          onClick={toggleMobileMenu}
          className="w-full h-20 border-y flex items-center justify-center font-black tracking-tight hover:text-[#f25840]"
        >
          Learn more about our company
        </div>

        <AnimatePresence>
          {isDetailSectionOpen && (
            <motion.div
              className="absolute bottom-0 w-full h-[80dvh] bg-white z-40 border-t"
              variants={mainVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* 헤더 */}
              <div className="absolute top-0 w-full flex justify-between items-center px-4 py-6 h-fit">
                <div />
                <button onClick={closeDetailSection}>
                  <X className="size-10" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center space-y-12 md:space-y-16 h-full">
                <div className="max-w-3xl px-4 text-center text-4xl md:text-7xl font-black leading-[0.9em] tracking-tight">
                  We work creating relevant and global projects for individuals and companies
                </div>
                <div className="group relative size-16 aspect-square [perspective:1000px]">
                  <div className="relative size-full transition-transform duration-500 group-hover:[transform:rotateY(180deg)] [transform-style:preserve-3d]">
                    {/* 앞면 */}
                    <Image
                      alt="fellows 로고"
                      src="/fellows/logo-img.svg"
                      fill
                      className="object-cover absolute inset-0 [backface-visibility:hidden]"
                      priority
                    />
                    {/* 뒷면 (거울 반전) */}
                    <Image
                      alt="fellows 로고"
                      src="/fellows/logo-img.svg"
                      fill
                      className="object-cover absolute inset-0 [transform:rotateY(180deg)_scaleX(-1)] [backface-visibility:hidden]"
                      priority
                    />
                  </div>
                </div>{" "}
                <div className="max-w-7xl px-4 text-center text-base md:text-xl font-bold tracking-tight">
                  Fellows는 복잡함을 단순하게 바꾸기 위해 Fellows SaaS를 출시하였고, 글로벌 파트너사와의 협업을 통해 특별하면서도 편리한 경험으로 완성합니다.
                  국내 대비 저렴하지만 높은 품질의 개발 결과를 제공하는 Fellows는 여러분의 프로젝트를 위한 최선의 파트너입니다.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
