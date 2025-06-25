"use client";

import type React from "react";
import { motion, useInView, type Variants, type MotionProps } from "motion/react";
import { useRef, useEffect, useState } from "react";

interface BlurFadeDebugProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: string;
  debugName?: string;
}

export function BlurFade({
  children,
  className,
  duration = 0.6,
  delay = 0,
  offset = 20,
  direction = "down",
  blur = "8px",
  debugName = "BlurFade",
  ...props
}: BlurFadeDebugProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isInView = useInView(ref, {
    once: true,
    margin: "-200px 0px -200px 0px",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted && isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isMounted, isInView, hasAnimated, debugName]);

  const variants: Variants = {
    hidden: {
      [direction === "left" || direction === "right" ? "x" : "y"]: direction === "right" || direction === "down" ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === "left" || direction === "right" ? "x" : "y"]: 0,
      opacity: 1,
      filter: `blur(0px)`,
    },
  };

  const animationState = isMounted && hasAnimated ? "visible" : "hidden";

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animationState}
      variants={variants}
      transition={{
        delay: delay,
        duration,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
