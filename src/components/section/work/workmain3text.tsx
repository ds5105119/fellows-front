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
        currentLine.y = relativeY;
        currentLine.elements.push(textElements[index]);
      } else if (Math.abs(relativeY - currentLine.y) < 40) {
        currentLine.elements.push(textElements[index]);
      } else {
        lines.push({ ...currentLine });
        currentLine = {
          elements: [textElements[index]],
          y: relativeY,
        };
      }
    });

    if (currentLine.elements.length > 0) {
      lines.push(currentLine);
    }

    const totalElementsInLines = lines.reduce((sum, line) => sum + line.elements.length, 0);

    if (totalElementsInLines < textElements.length || lines.length === 0) {
      const fallbackLines = textElements.map((element) => ({
        elements: [element],
        y: 0,
      }));
      setTextLines(fallbackLines);
    } else {
      setTextLines(lines);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateLines();
    }, 100);

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
    <div className="place-self-start md:place-self-end mt-24 md:mt-40 w-full md:w-3/4 -z-10">
      <div
        ref={containerRef}
        className="w-full text-2xl md:text-7xl leading-tight tracking-wide font-extrabold text-left md:text-right items-center justify-start md:justify-end flex flex-wrap opacity-0 pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {textElements.map((element, index) => (
          <div key={index} className="inline-block">
            {element}
          </div>
        ))}
      </div>
      <div className="relative w-full text-2xl md:text-7xl leading-tight tracking-wide font-extrabold text-left md:text-right select-none">
        {textLines.map((line, lineIndex) => (
          <AnimatedLine key={lineIndex} delay={lineIndex * 0.2}>
            {line.elements}
          </AnimatedLine>
        ))}
      </div>
    </div>
  );
}
