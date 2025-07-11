"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function calculateScale(width: number): number {
  if (width > 1536) return 1;
  return 0.3 + (width / 1536) * 0.7;
}

const fixedIcons = [
  { id: "google-drive", alt: "Google Drive", x: 6, y: 15, size: 120, delay: 0.1, src: "/main-section-4-3.png" },
  { id: "box", alt: "Box", x: 67, y: 8, size: 144, delay: 0.2, src: "/main-section-4-2.png" },
  { id: "canva", alt: "Canva", x: 32, y: 25, size: 112, delay: 0.3, src: "/main-section-4-4.png" },
  { id: "figma", alt: "Figma", x: 57, y: 35, size: 115, delay: 0.4, src: "/main-section-4-8.jpg" },
  { id: "notion", alt: "Notion", x: 10, y: 60, size: 115, delay: 0.5, src: "/main-section-4-5.png" },
  { id: "word", alt: "Microsoft Word", x: 35, y: 50, size: 88, delay: 0.6, src: "/main-section-4-7.png" },
  { id: "excel", alt: "Excel", x: 55, y: 70, size: 112, delay: 0.8, src: "/main-section-4-6.png" },
  { id: "powerpoint", alt: "PowerPoint", x: 80, y: 60, size: 88, delay: 1.0, src: "/main-section-4-1.png" },
] as const;

const comparisonData = [
  { fellows: ["자체 SaaS에서 프로젝트 관리,", "이슈 관리, 전자 계약 체결"], other: "인보이스, Notion" },
  { fellows: ["해외 파트너사를 통해", "국내 대비 40% 비용 절감"], other: "-" },
  { fellows: ["기획부터 견적까지", "투명한 프로세스"], other: "-" },
  { fellows: ["반복되는 미팅, 견적요청 없이", "몇 번이고 편하게 견적 수정"], other: "-" },
  { fellows: ["MSA 환경에서 실행되는", "긴밀한 자사 홈페이지"], other: ["노코드, 바이브 코딩으로", "만들어진 홈페이지"] },
];

export default function MainSection4() {
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">한 번 맡겨도 제대로 된 곳에서 맡기세요</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            글로벌 개발 파트너사, 디자인 하우스 등<br />
            50명 이상의 전문가들과 협력하고 있습니다.
          </h4>
        </div>
      </div>

      {/* Left Section */}
      <div className="col-span-1 md:pr-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-white">
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                고도몰과 같은 노코드 솔루션부터
                <br />
                크로스 플랫폼 앱 개발까지
              </p>
            </div>
          </div>
          <div className="grow w-full relative">
            {fixedIcons.map((icon) => (
              <motion.div
                key={icon.id}
                className="absolute select-none"
                style={{ left: `${icon.x}%`, top: `${icon.y}%` }}
                animate={{
                  y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                  x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                }}
                transition={{
                  x: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  y: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.size}
                  height={icon.size}
                  className="rounded-lg md:rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.12)] shrink-0 object-cover"
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

      {/* Right Section (Refactored) */}
      <div className="col-span-1 md:pl-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col overflow-hidden relative bg-white">
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full shrink-0">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Cost</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                해외 개발 파트너사를 통해
                <br />
                국내 대비 최대 40% 낮은 가격
              </p>
            </div>
          </div>

          <div className="grow w-full p-4 sm:p-6 md:py-12 relative flex flex-col items-center justify-center">
            <div className="w-full h-full mx-auto flex flex-col justify-between">
              <div className="grid grid-cols-2 py-2">
                <div className="h-full flex items-center justify-center">
                  <AspectRatio ratio={180 / 31} className="h-4 md:h-6 my-auto">
                    <Image src="/fellows/logo.svg" alt="Fellows Logo" fill />
                  </AspectRatio>
                </div>
                <div className="flex items-center justify-center">
                  <h2 className="text-sm md:text-base font-medium text-center">타 SI 업체</h2>
                </div>
              </div>

              {comparisonData.map((row, index) => (
                <>
                  <hr key={`${index}-hr`} className="border-gray-200 mx-3" />
                  <div key={index} className="grid grid-cols-2 items-center py-2">
                    <div className="flex flex-col items-center justify-center">
                      {Array.isArray(row.fellows) ? (
                        row.fellows.map((line) => (
                          <p key={line} className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold leading-snug">
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold leading-snug">{row.fellows}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      {Array.isArray(row.other) ? (
                        row.other.map((line) => (
                          <p key={line} className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug">
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug">{row.other}</p>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
