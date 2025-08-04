"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GeistSans } from "geist/font/sans";

export default function MainSection1Design() {
  const symbols = ["✵", "✷", "✸", "✹", "✺", "❇", "❉", "❋", "✦", "❤︎", "❖", "✠", "✢", "✣", "✤", "✥", "✖"];

  // 세련되고 대비가 강한 Tailwind 색상들
  const colors = [
    "#ec4899", // rose-500
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#8b5cf6", // purple-500
    "#f97316", // orange-500
    "#06b6d4", // cyan-500
    "#ef4444", // red-500
    "#eab308", // yellow-500
    "#f59e0b", // amber-500
    "#84cc16", // lime-500
    "#6366f1", // indigo-500
    "#d946ef", // fuchsia-500
  ];

  const [currentSymbol, setCurrentSymbol] = useState("✵");
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setAnimationKey((prev) => prev + 1);

    let step = 0;
    const totalSteps = 30;

    const interval = setInterval(() => {
      if (step < totalSteps) {
        const symbolIndex = step % symbols.length;
        const colorIndex = step % colors.length;
        setCurrentSymbol(symbols[symbolIndex]);
        setCurrentColor(colors[colorIndex]);
        step++;
      } else {
        // End with ❉ and final color
        setCurrentSymbol("❉");
        setCurrentColor("#fbbf24"); // amber-400으로 마무리
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [symbols, colors]);

  useEffect(() => {
    startAnimation();
  }, []);

  const handleReplay = () => {
    if (!isAnimating) {
      startAnimation();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div key={animationKey} className="relative" onClick={handleReplay} whileHover={{ scale: isAnimating ? 1 : 1.1 }} whileTap={{ scale: 0.95 }}>
        <motion.div
          className={`text-[46px] font-bold transition-all duration-300 ease-out cursor-pointer select-none ${GeistSans.className}`}
          style={{ color: currentColor }}
          onClick={handleReplay}
          whileHover={{ scale: isAnimating ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentSymbol}
        </motion.div>

        <motion.div
          className={`absolute inset-0 text-[46px] font-bold blur-xl opacity-40 -z-10 transition-all duration-300 ease-out ${GeistSans.className}`}
          style={{ color: currentColor }}
          animate={{
            scale: isAnimating ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 0.4,
            repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {currentSymbol}
        </motion.div>
      </motion.div>
    </div>
  );
}
