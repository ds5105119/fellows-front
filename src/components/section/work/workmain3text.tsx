"use client";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TextLine {
  elements: React.ReactNode[];
  y: number;
}

function AnimatedLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

  const lineVariants = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6,
        delay: delay,
      },
    },
    exit: {
      y: -50,
      opacity: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6,
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-end flex-wrap"
      variants={lineVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export default function Workmain3Text() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textLines, setTextLines] = useState<TextLine[]>([]);

  const textElements = [
    <span key="1">Fellows는</span>,
    <span key="2" className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle mx-[1.5vw]">
      <Image alt="랜덤 이미지" src="https://picsum.photos/300/200?random=2" fill className="object-cover" priority />
    </span>,
    <span key="3">디자인과 기술을</span>,
    <span key="4">섬세하게 어루만져 경험을 빚어내고,</span>,
    <span key="5">브랜드와 고객의</span>,
    <span key="6" className="relative inline-block h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-middle mx-[1.5vw]">
      <Image alt="랜덤 이미지" src="https://picsum.photos/300/200?random=3" fill className="object-cover" priority />
    </span>,
    <span key="7">연결을</span>,
    <span key="8">더 깊고</span>,
    <span key="9" className="text-[#f25840]">
      &nbsp;❉&nbsp;
    </span>,
    <span key="10">자연스럽게 만듭니다.</span>,
  ];

  const calculateLines = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const children = Array.from(container.children) as HTMLElement[];

    if (children.length === 0) return;

    const lines: TextLine[] = [];
    let currentLine: { elements: React.ReactNode[]; y: number } = { elements: [], y: 0 };

    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeY = rect.top - containerRect.top;

      if (currentLine.elements.length === 0) {
        // 첫 번째 요소
        currentLine.y = relativeY;
        currentLine.elements.push(textElements[index]);
      } else if (Math.abs(relativeY - currentLine.y) < 10) {
        // 같은 줄 (10px 오차 허용)
        currentLine.elements.push(textElements[index]);
      } else {
        // 새로운 줄
        lines.push({ ...currentLine });
        currentLine = {
          elements: [textElements[index]],
          y: relativeY,
        };
      }
    });

    // 마지막 줄 추가
    if (currentLine.elements.length > 0) {
      lines.push(currentLine);
    }

    setTextLines(lines);
  };

  useEffect(() => {
    // 초기 계산
    const timer = setTimeout(() => {
      calculateLines();
    }, 100);

    // 리사이즈 이벤트 리스너
    const handleResize = () => {
      setTimeout(() => {
        calculateLines();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute bottom-4 right-4 w-3/4 -z-10">
      {/* 숨겨진 참조용 컨테이너 */}
      <div
        ref={containerRef}
        className="w-full pl-8 text-3xl md:text-7xl leading-tight tracking-wide font-extrabold text-right items-center justify-end flex flex-wrap space-x-0 select-none opacity-0 absolute pointer-events-none"
        aria-hidden="true"
      >
        {textElements.map((element, index) => (
          <div key={index} className="inline-block">
            {element}
          </div>
        ))}
      </div>

      <div className="w-full pl-8 text-3xl md:text-7xl leading-tight tracking-wide font-extrabold text-right select-none">
        {textLines.map((line, lineIndex) => (
          <AnimatedLine key={lineIndex} delay={lineIndex * 0.2}>
            {line.elements}
          </AnimatedLine>
        ))}
      </div>
    </div>
  );
}
