"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TextHighlighter from "@/components/fancy/text/text-highlighter";
import { Cursor } from "@/components/ui/cursor";

function calculateScale(width: number): number {
  if (width > 1536) return 1;
  return 0.4 + (width / 1536) * 0.6;
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
  { fellows: ["반복되는 미팅, 견적요청 없이", "몇 번이고 편하게 견적 수정"], other: "-" },
] as const;

export default function MainSection4() {
  const [scale, setScale] = useState(1.0);
  const [showDetail, setShowDetail] = useState(0);

  // Added refs for the two clickable containers
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);

  const transition = { type: "spring", duration: 1, delay: 0.4, bounce: 0 } as const;
  const highlightClass = "rounded-[0.3em] px-px";
  const highlightColor = "#F2AD91";
  const inViewOptions = { once: true, initial: true, amount: 0.1 };

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Added useEffect for handling outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both containers
      if (leftContainerRef.current && rightContainerRef.current && !leftContainerRef.current.contains(target) && !rightContainerRef.current.contains(target)) {
        setShowDetail(0);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">한 번 맡겨도 제대로 된 곳에서 맡기세요</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            글로벌 개발 파트너사, 디자인 하우스 등<br />
            100명 이상의 전문가들과 협력하고 있습니다.
          </h4>
        </div>
      </div>

      {/* Left Section */}
      <div
        ref={leftContainerRef}
        className="relative col-span-1 md:mr-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0 cursor-none"
        onClick={() => (showDetail == 1 ? setShowDetail(0) : setShowDetail(1))}
      >
        <Cursor
          attachToParent
          variants={{
            initial: { scale: 0.3, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.3, opacity: 0 },
          }}
          springConfig={{
            bounce: 0.001,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.15,
          }}
          className="hidden md:block"
        >
          <motion.div
            animate={{
              width: showDetail != 1 ? 80 : 16,
              height: showDetail != 1 ? 80 : 16,
            }}
            className="flex items-center justify-center rounded-[40px] bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40"
          >
            <AnimatePresence>
              {showDetail != 1 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="inline-flex w-full items-center justify-center"
                >
                  <div className="inline-flex items-center text-sm text-white dark:text-black">Click</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </Cursor>
        <AnimatePresence>
          {showDetail == 1 && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden bg-zinc-800 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-md mx-auto px-8 p-0 text-white">
                <h1 className="text-2xl md:text-4xl font-medium mb-6 md:mb-12 font-calendas tracking-tight">Fellows Teams</h1>

                <div className="text text-xs md:text-sm lg:text-base leading-normal space-y-4">
                  <p>
                    개발은 코드와 노코드 모두를 지원하며, 다국적 개발 파트너사와 협력하여 진행됩니다. 국내 SI 대비
                    <TextHighlighter className={highlightClass} transition={transition} highlightColor={highlightColor} useInViewOptions={inViewOptions}>
                      25~30% 비용 절감
                    </TextHighlighter>
                    이 가능하며, 프로젝트 관리, 견적, 전자 계약, 테스크 관리, 인보이스까지 자체 SaaS 플랫폼을 통해 모든 과정을 한 곳에서 투명하게 확인하고
                    관리할 수 있습니다.
                  </p>

                  <p className="hidden xl:inline-block">
                    반복되는 미팅이나 견적 요청 없이, 고객은 원하는 만큼 편하게 프로젝트를 조정할 수 있으며, AI가 제공하는 예상 견적과 기능 추천으로 의사결정이
                    훨씬 쉬워집니다. 이렇게 우리는 스타트업이 보다 빠르고 효율적으로 개발을 진행할 수 있도록 돕습니다.
                  </p>

                  <p className="whitespace-break-spaces">
                    디자인이 필요할 경우, 국내 최고 수준의 디자인 하우스와 협업하여
                    <TextHighlighter className={highlightClass} transition={transition} highlightColor={highlightColor} useInViewOptions={inViewOptions}>
                      세심하고 완벽한 UI/UX 경험
                    </TextHighlighter>
                    를 제공합니다. 디자인은 높은 수준의 마감과 다양한 인터랙션을 구현합니다.
                  </p>

                  <p>
                    글로벌 전문가와 고급 디자인 역량, AI 기반 프로젝트 분석과 추천, 자체 SaaS를 통한 투명한 관리까지 갖춘 Fellows 단순 개발 대행을 넘어, 고객이
                    생각하는 아이디어를 현실로 구현하는 과정 전체를 체계적으로 지원합니다. 코드와 노코드 개발을 아우르는 글로벌 전문가 풀로,&nbsp;
                    <TextHighlighter className={highlightClass} transition={transition} highlightColor={highlightColor} useInViewOptions={inViewOptions}>
                      비용과 시간 모두를 절감하며 최고의 결과를 제공합니다.
                    </TextHighlighter>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-white -z-10">
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
            {fixedIcons.map((icon, idx) => (
              <motion.div
                key={idx}
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
                  src={icon.src || "/placeholder.svg"}
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
      <div
        ref={rightContainerRef}
        className="relative col-span-1 md:ml-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0 cursor-none"
        onClick={() => (showDetail == 2 ? setShowDetail(0) : setShowDetail(2))}
      >
        <Cursor
          attachToParent
          variants={{
            initial: { scale: 0.3, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.3, opacity: 0 },
          }}
          springConfig={{
            bounce: 0.001,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.15,
          }}
          className="hidden md:block"
        >
          <motion.div
            animate={{
              width: showDetail != 2 ? 80 : 16,
              height: showDetail != 2 ? 80 : 16,
            }}
            className="flex items-center justify-center rounded-[40px] bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40"
          >
            <AnimatePresence>
              {showDetail != 2 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="inline-flex w-full items-center justify-center"
                >
                  <div className="inline-flex items-center text-sm text-white dark:text-black">Click</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </Cursor>
        <AnimatePresence>
          {showDetail == 2 && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden bg-zinc-800 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-md mx-auto px-8 p-0 text-white">
                <h1 className="text-2xl md:text-4xl font-medium mb-6 md:mb-12 font-calendas tracking-tight">Fellows Teams</h1>

                <div className="text text-xs md:text-sm lg:text-base leading-normal space-y-4">
                  <p>
                    개발은 코드와 노코드 모두를 지원하며, 말레이시아, 인도네시아 등 다국적 개발 파트너사와 협력하여 진행됩니다. 국내 SI 대비
                    <TextHighlighter className={highlightClass} transition={transition} highlightColor={highlightColor} useInViewOptions={inViewOptions}>
                      25~30% 비용 절감
                    </TextHighlighter>
                    이 가능하며, 프로젝트 관리, 견적, 전자 계약, 테스크 관리, 인보이스까지 자체 SaaS 플랫폼을 통해 모든 과정을 한 곳에서 투명하게 확인하고
                    관리할 수 있습니다.
                  </p>

                  <p className="hidden xl:inline-block">
                    반복되는 미팅이나 견적 요청 없이, 고객은 원하는 만큼 편하게 프로젝트를 조정할 수 있으며, AI가 제공하는 예상 견적과 기능 추천으로 의사결정이
                    훨씬 쉬워집니다. 이렇게 우리는 스타트업이 보다 빠르고 효율적으로 개발을 진행할 수 있도록 돕습니다.
                  </p>

                  <p className="whitespace-break-spaces">
                    디자인이 필요할 경우, 국내 최고 수준의 디자인 하우스와 협업하여
                    <TextHighlighter className={highlightClass} transition={transition} highlightColor={highlightColor} useInViewOptions={inViewOptions}>
                      세심하고 완벽한 UI/UX 경험
                    </TextHighlighter>
                    를 제공합니다. 디자인은 높은 수준의 마감과 다양한 인터랙션을 구현합니다.
                  </p>

                  <p>
                    글로벌 전문가와 고급 디자인 역량, AI 기반 프로젝트 분석과 추천, 자체 SaaS를 통한 투명한 관리까지 갖춘 Fellows 단순 개발 대행을 넘어, 고객이
                    생각하는 아이디어를 현실로 구현하는 과정 전체를 체계적으로 지원합니다. 코드와 노코드 개발을 아우르는 글로벌 전문가 풀로,&nbsp;
                    <TextHighlighter className={highlightClass} transition={transition} highlightColor={highlightColor} useInViewOptions={inViewOptions}>
                      비용과 시간 모두를 절감하며 최고의 결과를 제공합니다.
                    </TextHighlighter>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-full h-full rounded-3xl flex flex-col overflow-hidden relative bg-white -z-10">
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full shrink-0">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Cost</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                결국 필요한 개발자,
                <br />
                해외 개발자를 통해 30% 낮은 가격으로
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
                <div key={index}>
                  <hr className="border-gray-200 mx-3" />
                  <div className="grid grid-cols-2 items-center py-2">
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
                        row.other.map((line, idx) => (
                          <p key={idx} className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug">
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug">{row.other}</p>
                      )}
                    </div>
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
