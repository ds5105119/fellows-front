"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  size?: number;
};

const BreathingSparkles: React.FC<Props> = ({ size = 24 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
      animate={{
        scale: [1, 1.01, 1],
        opacity: [0.95, 1, 0.95],
      }}
      transition={{
        duration: 10.0,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <defs>
        <linearGradient id={"grad-breathingsparkles"} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7944d" />
          <stop offset="50%" stopColor="#c86dd7" />
          <stop offset="100%" stopColor="#00c6ff" />
        </linearGradient>
      </defs>

      {/* 뾰족하고 움푹 파인 별 */}
      <path
        d="
          M50 0 
          C60 30, 70 40, 100 50 
          C70 60, 60 70, 50 100 
          C40 70, 30 60, 0 50 
          C30 40, 40 30, 50 0
        "
        fill={`url(#grad-breathingsparkles)`}
      />
    </motion.svg>
  );
};

export default BreathingSparkles;
