"use client";

import type React from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function AnimatedLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

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
  };

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-start md:justify-end flex-wrap"
      variants={lineVariants}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export default function Workmain3Text() {
  const textElements = [
    <span key="1">Fellows는</span>,
    <span
      key="2"
      className="relative inline-block h-[1.1em] md:h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-text-top md:align-middle md:mx-[1.5vw]"
    >
      <Image alt="랜덤 이미지" src="https://picsum.photos/300/200?random=2" fill className="self-center" priority />
    </span>,
    <span key="3">디자인과 기술을</span>,
    <span key="4">섬세하게 어루만져 경험을 빚어내고,</span>,
    <span key="5">브랜드와 고객의</span>,
    <span
      key="6"
      className="relative inline-block h-[1.1em] md:h-[1em] aspect-[5/2] rounded-[50px] overflow-hidden align-text-top md:align-middle md:mx-[1.5vw]"
    >
      <Image alt="랜덤 이미지" src="https://picsum.photos/300/200?random=3" fill className="object-cover" priority />
    </span>,
    <span key="7">연결을</span>,
    <span key="8">더 깊고</span>,
    <span key="9" className="text-[#f25840]">
      &nbsp;❉&nbsp;
    </span>,
    <span key="10">자연스럽게 만듭니다.</span>,
  ];

  const [lines, setLines] = useState<React.ReactNode[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateLines = () => {
      if (!measureRef.current) return;

      const spans = Array.from(measureRef.current.children) as HTMLElement[];
      const lineGroups: React.ReactNode[][] = [];
      let currentLine: React.ReactNode[] = [];
      let currentTop = -1;

      spans.forEach((span, index) => {
        const rect = span.getBoundingClientRect();
        const spanTop = Math.round(rect.top);

        if (currentTop === -1) {
          currentTop = spanTop;
        }

        if (Math.abs(spanTop - currentTop) > 5) {
          // New line detected
          if (currentLine.length > 0) {
            lineGroups.push([...currentLine]);
          }
          currentLine = [textElements[index]];
          currentTop = spanTop;
        } else {
          // Same line
          currentLine.push(textElements[index]);
        }
      });

      if (currentLine.length > 0) {
        lineGroups.push(currentLine);
      }

      if (lineGroups.length === 0) {
        lineGroups.push([...textElements]);
      }

      setLines(lineGroups);
    };

    // Initial calculation with delay to ensure rendering is complete
    const timer = setTimeout(calculateLines, 200);

    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateLines, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="place-self-start md:place-self-end mt-24 md:mt-40 w-full md:w-3/4 -z-10">
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none text-2xl md:text-7xl leading-tight tracking-wide font-extrabold text-left md:text-right"
        style={{
          top: "-9999px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {textElements.map((element, index) => (
          <span key={index} className="mr-2">
            {element}
          </span>
        ))}
      </div>

      <div ref={containerRef} className="relative w-full text-2xl md:text-7xl leading-tight tracking-wide font-extrabold text-left md:text-right select-none">
        {lines.map((line, lineIndex) => (
          <AnimatedLine key={lineIndex} delay={lineIndex * 0.3}>
            {line.map((element, elementIndex) => (
              <span key={`${lineIndex}-${elementIndex}`} className="mr-2">
                {element}
              </span>
            ))}
          </AnimatedLine>
        ))}
      </div>
    </div>
  );
}
