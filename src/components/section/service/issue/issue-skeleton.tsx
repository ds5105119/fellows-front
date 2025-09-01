"use client"

import { motion } from "framer-motion"

interface IssueSkeletonProps {
  count?: number
}

export function IssueSkeleton({ count = 5 }: IssueSkeletonProps) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: count }).map((_, index) => (
        <IssueSkeletonItem key={index} delay={index * 0.1} />
      ))}
    </div>
  )
}

function IssueSkeletonItem({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="flex items-center justify-between py-4 px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay,
      }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* 상태 인디케이터 스켈레톤 */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <motion.div
            className="w-3 h-3 bg-gray-200 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: delay + 0.2,
            }}
          />
        </div>

        {/* 제목과 부제목 스켈레톤 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              className="h-4 bg-gray-200 rounded flex-1 max-w-[300px]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: delay + 0.3,
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className="h-3 w-20 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: delay + 0.4,
              }}
            />
            <motion.div
              className="h-3 w-16 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: delay + 0.5,
              }}
            />
          </div>
        </div>

        {/* 배지들 스켈레톤 */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <motion.div
            className="h-6 w-16 bg-gray-200 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: delay + 0.6,
            }}
          />
          <motion.div
            className="h-6 w-12 bg-gray-200 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: delay + 0.7,
            }}
          />
        </div>

        {/* 상태 스켈레톤 */}
        <div className="hidden md:block flex-shrink-0">
          <motion.div
            className="h-6 w-14 bg-gray-200 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: delay + 0.8,
            }}
          />
        </div>
      </div>

      {/* 액션 메뉴 스켈레톤 */}
      <motion.div
        className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: delay + 0.9,
        }}
      />
    </motion.div>
  )
}
