"use client";

import ImageTrail from "@/components/resource/imagetrail";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Workmain3Text from "./workmain3text";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";

export default function WorkMain3() {
  const lenis = useLenis();

  const detailSectionRef = useRef<HTMLDivElement>(null);
  const [isDetailSectionOpen, setIsDetailSectionOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (!isDetailSectionOpen) {
      if (detailSectionRef.current) {
        const viewportHeight = window.innerHeight;
        const elementHeight = detailSectionRef.current.offsetHeight;
        lenis?.scrollTo(detailSectionRef.current, {
          offset: -(viewportHeight - elementHeight),
          duration: 1.4,
        });
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
    <div className="relative w-full">
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
      <div className="relative w-full px-4 overflow-hidden">
        <Workmain3Text />
      </div>
      <div
        ref={detailSectionRef}
        onClick={toggleMobileMenu}
        className="text-2xl md:text-6xl flex font-normal tracking-tight hover:text-[#f25840] place-self-start md:place-self-center px-4 mt-12 md:mt-36 pb-4 md:pb-8"
      >
        <LetterSwapPingPong label="↳ More about our company" staggerFrom="first" className="mono pb-2 border-b-4 border-black" />
      </div>
      <div className="relative w-full">
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

              <div className="flex flex-col items-center justify-center space-y-10 md:space-y-16 h-full">
                <div className="max-w-3xl px-4 text-center text-3xl md:text-7xl font-black leading-[0.9em] tracking-tight">
                  We work creating relevant and global projects for individuals and companies
                </div>
                <div className="group relative size-12 md:size-16 aspect-square [perspective:1000px]">
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
                </div>
                <div className="max-w-7xl px-4 text-center text-sm md:text-xl font-bold tracking-tight">
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
