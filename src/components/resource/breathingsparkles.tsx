"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useId } from "react";

type Props = {
  size?: number;
};

/**
 * BreathingSparkles
 * - Keeps the same outward behavior and visuals
 * - Improves cross-browser reliability:
 *   - Unique gradient id per instance (avoids ID collisions)
 *   - Animate a <g> instead of the SVG root
 *   - Explicit transformOrigin and transformBox
 *   - preserveAspectRatio and proper SVG attributes
 */
const BreathingSparkles: React.FC<Props> = ({ size = 24 }) => {
  const reactId = useId();
  // Sanitize useId for use inside url(#...)
  const gradId = `grad-breathingsparkles-${reactId.replace(/:/g, "-")}`;

  // Include transformBox which isn't in standard CSSProperties typings
  const svgStyle: React.CSSProperties & { transformBox?: "fill-box" | "view-box" | "border-box" } = {
    overflow: "visible",
    transformOrigin: "50% 50%",
    transformBox: "fill-box",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      aria-hidden="true"
      style={svgStyle}
    >
      <defs>
        {/* Use userSpaceOnUse so the gradient aligns consistently with the viewBox */}
        <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f7944d" />
          <stop offset="50%" stopColor="#c86dd7" />
          <stop offset="100%" stopColor="#00c6ff" />
        </linearGradient>
      </defs>

      {/* Animate a group for better cross-browser reliability */}
      <motion.g
        initial={false}
        animate={{
          scale: [0.95, 1, 0.95],
          opacity: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 10.0,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* 뾰족하고 움푹 파인 별 */}
        <path d="M50 0 C60 30, 70 40, 100 50 C70 60, 60 70, 50 100 C40 70, 30 60, 0 50 C30 40, 40 30, 50 0" fill={`url(#${gradId})`} />
      </motion.g>
    </svg>
  );
};

export default BreathingSparkles;
