"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface UploadProgressIndicatorProps {
  progress: number;
  onRemove?: () => void;
  size?: number;
}

export function UploadProgressIndicator({ progress, onRemove, size = 36 }: UploadProgressIndicatorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const isComplete = progress >= 100;

  // Calculate the circumference of the circle
  const radius = size / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke-dashoffset based on progress
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isComplete && onRemove?.();
  };

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      onHoverStart={() => isComplete && setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={(e) => onClick(e)}
      whileHover={isComplete ? { scale: 1.1 } : undefined}
      transition={{ scale: { type: "spring", stiffness: 400, damping: 17 } }}
    >
      {/* Progress Circle */}
      <AnimatePresence>
        {!isComplete && (
          <motion.svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.2,
              transition: { duration: 0.2 },
            }}
            className="absolute"
          >
            {/* Background Circle */}
            <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="4" />
            {/* Progress Circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgb(50, 125, 255)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Completion Check Icon */}
      <AnimatePresence>
        {isComplete && !isHovering && (
          <motion.div
            className="text-green-500 absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.15 },
            }}
          >
            <Check size={size * 0.6} strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove X Icon (on hover) */}
      <AnimatePresence>
        {isComplete && isHovering && (
          <motion.div
            className="text-red-500 absolute inset-0 flex items-center justify-center cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.15 },
            }}
          >
            <X size={size * 0.6} strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Text (optional) */}
      {!isComplete && (
        <motion.div className="absolute text-xs font-medium text-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {Math.round(progress)}
        </motion.div>
      )}
    </motion.div>
  );
}
