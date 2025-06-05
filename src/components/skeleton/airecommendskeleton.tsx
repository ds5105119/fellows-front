"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function AIRecommendSkeleton({ isLoading }: { isLoading: boolean }) {
  const [cardKey, setCardKey] = useState(0);
  const [key, setKey] = useState(0); // 애니메이션 리셋을 위한 키

  useEffect(() => {
    if (isLoading) {
      const cardInterval = setInterval(() => {
        setCardKey((prev) => prev + 1);
      }, 1500); // 1.5초마다 새 카드
    }
  }, [key, isLoading]);

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key={`loading-${key}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 w-80 md:w-96"
          >
            {/* Single card with continuous animation */}
            <div className="w-full h-[120px] relative">
              <AnimatePresence>
                <motion.div
                  key={cardKey}
                  initial={{ opacity: 0, y: 120, scale: 1 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -120, scale: 1 }}
                  transition={springTransition}
                  className="absolute w-full bg-gray-50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <SkeletonBox className="w-8 h-8 rounded-md" />
                    <SkeletonLine width="40%" />
                  </div>
                  <SkeletonLine width="90%" />
                  <SkeletonLine width="75%" />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`complete-${key}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                <Check className="w-8 h-8 text-blue-600" />
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-2">
              <h3 className="text-xl font-bold text-blue-600">추천이 완료되었어요.</h3>
              <p className="text-muted-foreground">자동으로 페이지가 넘어갑니다.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkeletonLine({ width = "100%", height = "h-4" }: { width?: string; height?: string }) {
  return (
    <div className={`${height} bg-gray-200 rounded-md overflow-hidden`} style={{ width }}>
      <motion.div
        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-md overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
