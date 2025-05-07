// src/components/HeroCardSection.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { Zap, Sparkles, SlidersHorizontal, Waypoints, Wallet, CheckCircle, CircleDollarSign, Globe, Users, Check, Database, Smartphone } from "lucide-react";

// --- 카드 데이터 (동일) ---
const cardSets = [
  // ... (cardSets 데이터) ...
  {
    id: 1,
    left: {
      title: "프로젝트에 대해서 설명해주세요.",
      badge: "AI 견적서 작성",
      color: "bg-blue-200",
      textColor: "text-blue-800",
      icon: <Zap size={36} />,
    },
    center: {
      title: "Create your wallet",
      image: "/images/card-icons-placeholder.svg", // --- 실제 이미지 경로 확인 ---
      buttonText: "With a Recovery Phrase",
      isMockup: false,
      icon: <Wallet size={48} className="text-blue-500" />, // 이미지 대신 아이콘 예시
    },
    right: {
      title: "예산, 개발 규모 및 도메인을 확인하고 브릿지 매니저가 미팅을 통해 적합한 개발팀을 추천합니다.",
      icons: [
        { icon: <Users size={20} />, color: "bg-red-100 text-red-600", label: "Social" },
        { icon: <Globe size={20} />, color: "bg-blue-100 text-blue-600", label: "Web" },
      ],
    },
  },
  {
    id: 2,
    left: {
      title: "견적 검토 뒤 프로젝트가 시작됩니다",
      badge: "전문 컨설턴트와 진행",
      color: "bg-yellow-200",
      textColor: "text-yellow-800",
      icon: <Sparkles size={36} />,
    },
    center: {
      title: "Gas Tank",
      image: "/images/gas-tank-screen.png", // --- 실제 이미지 경로 확인 ---
      isMockup: true,
      icon: <Waypoints size={48} className="text-yellow-500" />, // 이미지 없을 시 대체
    },
    right: {
      title: "노코드, 앱 및 웹 개발, 디자인, QC/QA 등 프로젝트에 적합한 개발 방식을 사용해 프로젝트를 진행합니다.",
      icons: [
        { icon: <CheckCircle size={20} />, color: "bg-green-200 text-green-700", label: "$USDC" },
        { icon: <CircleDollarSign size={20} />, color: "bg-purple-200 text-purple-700", label: "$CTRL" },
      ],
    },
  },
  {
    id: 3,
    left: {
      title: "프로젝트가 완료된 후 결과물을 받아보세요",
      badge: "결과물 수령",
      color: "bg-green-200",
      textColor: "text-green-800",
      icon: <SlidersHorizontal size={36} />,
    },
    center: {
      title: "Your Wallet",
      image: "/images/wallet-screen.png", // --- 실제 이미지 경로 확인 ---
      isMockup: true,
      icon: <Wallet size={48} className="text-green-500" />, // 이미지 없을 시 대체
    },
    right: {
      title: "프로젝트 진행 과정에서 개발 팀의 평가 보고서를 제공합니다. 이슈 트래킹 및 모니터링이 가능합니다.",
      icons: [
        { icon: <Check size={20} />, color: "bg-indigo-200 text-indigo-700", label: "Txs" },
        { icon: <Database size={20} />, color: "bg-orange-200 text-orange-700", label: "Assets" },
      ],
    },
  },
];

// --- 타입 정의 (복원 및 유지) ---
type CardSet = (typeof cardSets)[0];
type LeftCardData = CardSet["left"];
type CenterCardData = CardSet["center"];
type RightCardData = CardSet["right"];

interface CommonCardProps extends HTMLMotionProps<"div"> {
  scrollYProgress: MotionValue<number>;
  segmentStart: number;
  segmentEnd: number;
}

interface LeftCardProps extends CommonCardProps {
  data: LeftCardData;
  index: number; // 자신의 순서 (스택 오프셋, z-index용)
  h: number;
  w: number;
  compressedScaleY: number;
}

interface CenterCardProps extends HTMLMotionProps<"div"> {
  data: CenterCardData;
}

interface RightCardProps extends CommonCardProps {
  data: RightCardData;
  index: number;
}

// --- 카드 세트 표시 컨테이너 --- (변경 없음)
interface CardSetDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  set: CardSet;
  index: number;
  totalSets: number;
  scrollYProgress: MotionValue<number>;
  isActive: boolean;
}

const LeftCard = ({ scrollYProgress, segmentStart, segmentEnd, data, index, h, w, compressedScaleY, className, ...props }: LeftCardProps) => {
  // --- 애니메이션 값 설정 (사용자 값 기준 + compressedScaleY 조정) ---
  const entranceOffsetY = 200;
  const stackGap = h * compressedScaleY + 20;
  const baseStackOffsetY = index * stackGap;

  // --- 애니메이션 타임라인 ---
  const enterEnd = 0.3;
  const compressStart = 0.85; // 이 시점 전후로 제목 fade-out 시작 및 scale 시작
  const compressEnd = 1.0;
  const titleFadeStart = compressStart * 0.95;
  const titleFadeEnd = compressStart + (compressEnd - compressStart) * 0.4; // 압축 초반에 fade 완료

  // --- 진행률 ---
  const progressInSegment = useTransform(scrollYProgress, [segmentStart, segmentEnd], [0, 1]);

  // --- Y 위치 애니메이션 (사용자 값 기반 유지) ---
  const y = useTransform(
    progressInSegment,
    [0, enterEnd, compressStart, compressEnd],
    [`${entranceOffsetY + baseStackOffsetY}px`, `${baseStackOffsetY}px`, `${baseStackOffsetY}px`, `${baseStackOffsetY}px`],
    { clamp: false }
  );

  // --- 카드 전체 Opacity ---
  const cardOpacity = useTransform(progressInSegment, [0, enterEnd * 0.7], [0, 1], { clamp: false });

  // --- 내부 제목(h2) Opacity (1 -> 0 Fade-out) ---
  const titleOpacity = useTransform(
    progressInSegment,
    [enterEnd, titleFadeStart, titleFadeEnd],
    [1, 1, 0], // 값: [보임, 보임, 사라짐]
    { clamp: true }
  );

  const scale = useTransform(
    progressInSegment,
    [enterEnd, compressStart, compressEnd], // 안착 후 ~ 압축 시작 ~ 압축 완료
    [1, 1, compressedScaleY], // 스케일: 1 -> 1 -> compressedScaleY
    { clamp: false } // 최종 스케일 유지
  );

  const height = useTransform(scale, (val) => h * val);

  return (
    <motion.div
      className={cn("relative rounded-2xl w-full z-10", data.color, className)}
      style={{
        y,
        opacity: cardOpacity,
        width: w,
        height: height,
        originY: 1,
      }}
      {...props}
    >
      <div className="w-full">
        <motion.h2
          className={cn("absolute top-6 left-6 mr-15 text-3xl font-semibold leading-tight whitespace-normal", data.textColor)}
          style={{ opacity: titleOpacity }}
        >
          {data.title}
        </motion.h2>
        <div className={cn("absolute top-6 right-6", data.textColor)}>{data.icon}</div>
      </div>
      <div className="absolute bottom-6 left-6">
        <span className={cn("inline-block bg-white/75 text-md font-medium px-4 py-2 rounded-full", data.textColor)}>{data.badge}</span>
      </div>
    </motion.div>
  );
};

const CenterCard = ({ data }: CenterCardProps) => {
  const cardVariants = { hidden: { opacity: 0, transition: { duration: 0.3 } }, visible: { opacity: 1, transition: { duration: 0.3 } } };

  return (
    <motion.div className="w-[500px] h-[600px] mx-auto" variants={cardVariants} initial="hidden" animate="visible" exit="hidden">
      <div className="w-full h-full bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center">
        {data.image ? (
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400">{data.icon || <Smartphone size={48} />}</div>
        )}
      </div>
    </motion.div>
  );
};

const RightCard = ({ data, scrollYProgress, segmentStart, segmentEnd, index }: RightCardProps) => {
  /* ... */
  const progressInSegment = useTransform(scrollYProgress, [segmentStart, segmentEnd], [0, 1]);
  const enterStart = 0;
  const enterEnd = 0.3;
  const exitStart = 0.7;
  const exitEnd = 1.0;
  const y = useTransform(progressInSegment, [enterStart, enterEnd, exitStart, exitEnd], ["200px", "0px", "0px", "-200px"]);
  const opacity = useTransform(progressInSegment, [enterStart, enterEnd, exitStart, exitEnd], [0, 1, 1, 0]);
  return (
    <motion.div className="bg-amber-50 p-6 rounded-2xl w-[340px] flex flex-col justify-between h-[340px] absolute" style={{ y, opacity, zIndex: index }}>
      <p className="text-gray-700 text-3xl font-semibold leading-tight whitespace-normal mb-4">{data.title}</p>
      <div className="flex justify-end items-center mt-auto gap-1">
        {data.icons.map((iconData, idx) => (
          <div
            key={iconData.label || idx}
            title={iconData.label}
            className={cn(
              "w-10 h-10 rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-xl",
              iconData.color,
              idx > 0 ? "-ml-2" : ""
            )}
          >
            {iconData.icon}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const CardSetDisplay = ({ set, index, totalSets, scrollYProgress, isActive, className, ...props }: CardSetDisplayProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const segmentStart = index / totalSets;
  const segmentEnd = (index + 1) / totalSets;

  const onClick = () => {
    const el = ref.current;
    console.log("씨발");
    if (el) lenis?.scrollTo(el);
  };

  return (
    <div ref={ref} className={cn("absolute inset-0 w-full h-full flex items-center justify-between", className)} {...props}>
      <div className="relative w-1/3 h-[600px] flex flex-col justify-start items-center">
        <LeftCard
          data={set.left}
          scrollYProgress={scrollYProgress}
          segmentStart={segmentStart}
          segmentEnd={segmentEnd}
          index={index}
          h={340}
          w={340}
          compressedScaleY={0.25}
          onClick={onClick}
          className="cursor-pointer"
        />
      </div>
      <div className="w-1/3 flex justify-center items-center relative h-full pointer-events-auto">
        <AnimatePresence initial={false}>{isActive && <CenterCard key={set.id} data={set.center} />}</AnimatePresence>
      </div>
      <div className="w-1/3 flex justify-center items-center relative h-full pointer-events-auto">
        <RightCard data={set.right} scrollYProgress={scrollYProgress} segmentStart={segmentStart} segmentEnd={segmentEnd} index={index} />
      </div>
    </div>
  );
};

// --- 메인 섹션 컴포넌트 --- (변경 없음)
export default function HeroCardSection() {
  /* ... */
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const totalSets = cardSets.length;
  const sectionHeight = `${totalSets * 100 + 100}vh`;
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(Math.max(Math.floor(latest * totalSets), 0), totalSets - 1);
    const finalIndex = latest === 1 ? totalSets - 1 : newIndex;
    if (finalIndex !== activeIndex) setActiveIndex(finalIndex);
  });
  return (
    <div ref={scrollRef} className="relative w-full" style={{ height: sectionHeight }}>
      <div className="sticky top-6 h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {cardSets.map((set, index) => {
            const zIndex = activeIndex === index ? totalSets : index;
            return (
              <CardSetDisplay
                key={set.id}
                set={set}
                index={index}
                totalSets={totalSets}
                scrollYProgress={scrollYProgress}
                isActive={activeIndex === index}
                className={cn(activeIndex !== index && "pointer-events-none")}
                style={{ zIndex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
