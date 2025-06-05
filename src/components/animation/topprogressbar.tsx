"use client";

import { cn } from "@/lib/utils";
import { motion, motionValue, useTransform, useScroll, animate, type HTMLMotionProps } from "framer-motion"; // animate 임포트
import React, { useEffect } from "react";

interface ScrollProgressProps extends Omit<HTMLMotionProps<"div">, "progress"> {
  progress?: number;
  top?: number;
  bottom?: number;
}

const progressP = (p: number, top?: number, bottom?: number): number => {
  const offset = top ?? 0;
  let effectiveP = p + offset;

  if (typeof bottom === "number" && bottom > 0 && bottom < 1) {
    const scaleFactor = 1 - bottom;
    if (effectiveP >= scaleFactor) return 1.0;
    if (effectiveP <= 0) return 0.0;
    return effectiveP / scaleFactor;
  }
  return Math.max(0, Math.min(1, effectiveP));
};

export const TopProgressBar = ({ className, progress, top, bottom, ...props }: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll();

  const scrollAdjustedProgress = useTransform(scrollYProgress, (p) => {
    return progressP(p, top, bottom);
  });

  const scaleX = React.useMemo(() => motionValue(0), []); // 초기값 0

  useEffect(() => {
    let animationControls: ReturnType<typeof animate> | undefined;

    if (progress !== undefined) {
      const targetValue = Math.max(0, Math.min(1, progress));
      animationControls = animate(scaleX, targetValue, {
        type: "tween", // tween 타입 명시
        duration: 1.0, // 애니메이션 지속 시간 (초)
        ease: "easeInOut", // 완화 함수 (예: "linear", "easeIn", "easeOut", [0.42, 0, 0.58, 1] 등)
      });
    }

    return () => {
      animationControls?.stop();
    };
  }, [progress, scaleX, top, bottom]);

  const effectiveProgressSource = progress !== undefined ? scaleX : scrollAdjustedProgress;

  return (
    <motion.div
      className={cn(
        "sticky top-16 inset-x-0 max-w-full z-50 h-[1.5px] origin-left bg-gradient-to-r from-[#7cbaf8] via-[#8cbaf3] to-[#92bbfd] drop-shadow-lg drop-shadow-cyan-500/50",
        className
      )}
      style={{
        scaleX: effectiveProgressSource,
      }}
      {...props}
    />
  );
};

TopProgressBar.displayName = "TopProgressBar";
