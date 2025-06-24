"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskSkeletonProps {
  count?: number;
  className?: string;
}

export function TaskSkeleton({ count = 5, className }: TaskSkeletonProps) {
  return (
    <div className={cn("divide-y overflow-hidden w-full h-fit", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <TaskSkeletonRow key={index} delay={index * 0.1} />
      ))}
    </div>
  );
}

function TaskSkeletonRow({ delay = 0 }: { delay?: number }) {
  const leftPosition = ((delay * 70 + 10) % 30) + 5;
  const barWidth = ((delay * 77 + 20) % 50) + 15;

  return (
    <motion.div
      className="flex w-full hover:bg-gray-50 h-16"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay,
      }}
    >
      {/* Task Info Skeleton */}
      <div className="h-full flex items-center w-16 md:w-80 px-2 border-r bg-white flex-shrink-0 overflow-hidden">
        <div className="flex w-full items-center gap-3 justify-center">
          {/* Expand/Collapse Button Skeleton */}
          <motion.div className="h-6 w-6" />

          <div className="min-w-0 w-full flex-1 hidden md:block">
            <div className="w-full flex items-center space-x-1.5">
              {/* Color Dot Skeleton */}
              <motion.div
                className="w-3 h-3 rounded-full bg-gray-200 flex-shrink-0"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + 0.3,
                }}
              />

              {/* Task Title Skeleton */}
              <motion.div
                className="h-4 bg-gray-200 rounded flex-1 max-w-[200px]"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + 0.4,
                }}
              />
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* Expected Time Skeleton */}
              <motion.div
                className="h-3 w-8 bg-gray-200 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + 0.6,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Bar Skeleton */}
      <div className="relative flex-1 min-w-0 h-full py-4">
        <div className="relative h-8">
          <motion.div
            className="absolute top-1 bottom-1 rounded-[3px] bg-gray-200"
            style={{
              left: `${leftPosition}%`,
              width: `${barWidth}%`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + 0.7,
            }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + 1,
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
