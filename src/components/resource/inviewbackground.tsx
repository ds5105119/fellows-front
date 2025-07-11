"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface InViewBackgroundProps {
  className?: string; // Tailwind CSS 클래스를 받을 수 있도록 추가
  maxOpacity?: number; // 최대 투명도 (0~1), 기존 opacity prop 이름을 변경하여 혼동 방지
}

export default function InViewBackground({
  className, // className prop을 받습니다.
  maxOpacity = 1, // 기본값: 1 (완전히 불투명)
}: InViewBackgroundProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "60% end"], // 요소가 나타나기 시작해서 40%까지만
  });

  // 스크롤 진행률(0~1)을 투명도(0~maxOpacity)로 변환
  const animatedOpacity = useTransform(scrollYProgress, [0, 1], [0, maxOpacity]);

  // 스프링 애니메이션 적용
  const springOpacity = useSpring(animatedOpacity, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      ref={ref}
      className={className} // className prop을 적용합니다.
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -10,
        width: "100%",
        height: "100%",
        opacity: springOpacity, // motion.div의 opacity를 조절합니다.
      }}
    />
  );
}
