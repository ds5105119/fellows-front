"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

const features = [
  {
    name: "자체 SaaS 솔루션",
    fellows: "계약, 작업 상황, 이슈 관리, 전자 계약",
    other: "별도 협의 또는 수동 진행",
    type: "text",
  },
  {
    name: "해외 개발 파트너 협력",
    fellows: "해외 파트너사 연계 (비용 효율성)",
    other: "주로 국내 개발사",
    type: "text",
  },
  {
    name: "체계적인 프로젝트 관리",
    fellows: true,
    other: false,
    type: "boolean",
  },
  {
    name: "투명한 계약 및 결제",
    fellows: true,
    other: false,
    type: "boolean",
  },
  {
    name: "SEO 기본 최적화",
    fellows: true,
    other: false,
    type: "boolean",
  },
  {
    name: "유지보수 및 사후 관리",
    fellows: "전담팀 운영",
    other: "별도 계약 또는 제한적",
    type: "text",
  },
];

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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">한 번 맡겨도 제대로 된 곳에서 맡기세요</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            Fellows는 글로벌 개발 파트너사, 디자인 하우스 등<br />
            50명 이상의 전문가들과 협력하고 있습니다.
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
                고도몰과 같은 노코드 솔루션부터
                <br />
                크로스 플랫폼 앱 개발까지
              </p>
            </div>
          </div>

          {/* 고정 위치 앱 아이콘들 - Floating 효과 */}
          <div className="grow w-full relative">
            {fixedIcons.map((icon) => (
              <motion.div
                key={icon.id}
                className="absolute select-none"
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
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 5,
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

      <div className="col-span-1 md:pl-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-white">
          {/* 텍스트 - 최상위 레이어 */}
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Cost</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                해외 개발 파트너사를 통해
                <br />
                국내 대비 최대 40% 낮은 가격
              </p>
            </div>
          </div>

          <div className="grow py-8 px-6 w-full relative overflow-hidden flex flex-col justify-between">
            <div className="w-full h-full flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-3 text-sm md:text-base font-semibold text-gray-500 border-b-2 border-gray-200">
                <div className="py-3 px-4 border-r-2 border-gray-200 flex items-center justify-center"></div>
                <div className="py-3 px-4 text-center border-r-2 border-gray-200 flex items-center justify-center">Fellows</div>
                <div className="py-3 px-4 text-center flex items-center justify-center">타 개발 SI 업체</div>
              </div>
              {/* Table Rows */}
              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className={cn(
                    "grid grid-cols-3 text-sm md:text-base grow",
                    index < features.length - 1 && "border-b-2 border-gray-200" // Thicker horizontal border
                  )}
                >
                  <div className="py-3 px-4 font-medium text-black border-r-2 border-gray-200 flex text-center items-center justify-center">{feature.name}</div>{" "}
                  {/* Centered */}
                  <div className="py-3 px-4 flex items-center justify-center text-center border-r-2 border-gray-200 bg-blue-200">
                    {feature.type === "boolean" ? (
                      feature.fellows ? (
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XIcon className="w-5 h-5 text-gray-400" />
                      )
                    ) : (
                      <span className="text-black">{feature.fellows}</span>
                    )}
                  </div>
                  <div className="py-3 px-4 flex items-center justify-center text-center">
                    {feature.type === "boolean" ? (
                      feature.other ? (
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XIcon className="w-5 h-5 text-gray-400" />
                      )
                    ) : (
                      <span className="text-gray-600">{feature.other}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
