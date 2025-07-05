"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function calculateScale(width: number): number {
  if (width > 1536) return 1;
  return 0.4 + (width / 1536) * 0.5;
}

const fixedIcons = [
  { id: "google-drive", alt: "Google Drive", x: 5, y: 15, size: 120, delay: 0.1, src: "/main-section-4-1.png" },
  { id: "box", alt: "Box", x: 67, y: 8, size: 144, delay: 0.2, src: "/main-section-4-2.png" },
  { id: "canva", alt: "Canva", x: 32, y: 25, size: 112, delay: 0.3, src: "/main-section-4-3.png" },
  { id: "figma", alt: "Figma", x: 57, y: 35, size: 115, delay: 0.4, src: "/main-section-4-4.png" },
  { id: "notion", alt: "Notion", x: 10, y: 60, size: 115, delay: 0.5, src: "/main-section-4-5.png" },
  { id: "word", alt: "Microsoft Word", x: 35, y: 50, size: 88, delay: 0.6, src: "/main-section-4-6.png" },
  { id: "excel", alt: "Excel", x: 55, y: 70, size: 112, delay: 0.8, src: "/main-section-4-6.png" },
  { id: "powerpoint", alt: "PowerPoint", x: 80, y: 60, size: 88, delay: 1.0, src: "/main-section-4-1.png" },
] as const;

export default function MainSection4() {
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale(window.innerWidth));
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">다른 업체와는 비교 불허</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            글로벌 개발 파트너사의 AI 전문가 등<br />
            100명 이상의 전문가들과 협력하고 있어요.
          </h4>
        </div>
      </div>

      <div className="col-span-1 md:pr-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-white">
          {/* 텍스트 - 최상위 레이어 */}
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                각 분야 전문가로 구성된 팀이
                <br />
                프로젝트 완수를 위해
              </p>
            </div>
          </div>

          {/* 고정 위치 앱 아이콘들 - Floating 효과 */}
          <div className="grow w-full relative">
            {fixedIcons.map((icon) => (
              <motion.div
                key={icon.id}
                className="absolute"
                style={{
                  left: `${icon.x}%`,
                  top: `${icon.y}%`,
                }}
                animate={{
                  y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                  x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                }}
                transition={{
                  x: {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.size}
                  height={icon.size}
                  className="rounded-xl md:rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.12)] shrink-0"
                  style={{
                    width: `${icon.size * scale}px`,
                    height: `${icon.size * scale}px`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-1 md:pl-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-emerald-200">
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                각 분야 전문가로 구성된 팀이
                <br />
                프로젝트 완수를 위해
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
