"use client";

import { motion } from "framer-motion";

interface BlogPostSkeletonProps {
  featured?: boolean;
  index?: number;
}

export default function BlogPostSkeleton({ featured = false, index = 0 }: BlogPostSkeletonProps) {
  // 펄스 애니메이션 속성
  const pulseAnimation = {
    animate: {
      opacity: [0.4, 0.7, 0.4],
    },
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  };

  if (featured) {
    return (
      <>
        {/* 피처드 포스트 - 큰 화면용 가로 레이아웃 */}
        <div className="hidden min-[70rem]:flex md:col-span-full">
          <div className="rounded-l-4xl overflow-hidden grow">
            <motion.div className="relative aspect-[16/9] bg-gray-200" {...pulseAnimation} />
          </div>
          <div className="rounded-r-4xl bg-white space-y-4 px-8 py-8 flex flex-col w-[30%]">
            <div className="flex space-x-2">
              <motion.div className="h-4 w-24 bg-gray-200 rounded" {...pulseAnimation} />
            </div>

            <div className="grow">
              <motion.div className="h-7 w-full bg-gray-200 rounded mb-2" {...pulseAnimation} />
              <motion.div className="h-7 w-4/5 bg-gray-200 rounded" {...pulseAnimation} />
            </div>

            <div className="flex flex-col space-y-2">
              <motion.div className="h-4 w-32 bg-gray-200 rounded" {...pulseAnimation} />
              <div className="flex items-center space-x-1">
                <motion.div className="h-4 w-4 bg-gray-200 rounded-full" {...pulseAnimation} />
                <motion.div className="h-4 w-16 bg-gray-200 rounded" {...pulseAnimation} />
              </div>
            </div>
          </div>
        </div>

        {/* 피처드 포스트 - 작은 화면용 세로 레이아웃 */}
        <div className="block min-[70rem]:hidden md:col-span-full">
          <div className="rounded-t-3xl min-[70rem]:rounded-t-4xl overflow-hidden">
            <motion.div className="relative aspect-[16/9] bg-gray-200" {...pulseAnimation} />
          </div>

          <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
            <div className="flex space-x-2">
              <motion.div className="h-4 w-24 bg-gray-200 rounded" {...pulseAnimation} />
            </div>

            <div className="grow">
              <motion.div className="h-6 w-full bg-gray-200 rounded mb-2" {...pulseAnimation} />
              <motion.div className="h-6 w-4/5 bg-gray-200 rounded" {...pulseAnimation} />
            </div>

            <div className="flex items-center justify-between">
              <motion.div className="h-4 w-32 bg-gray-200 rounded" {...pulseAnimation} />
              <div className="flex items-center space-x-1">
                <motion.div className="h-4 w-4 bg-gray-200 rounded-full" {...pulseAnimation} />
                <motion.div className="h-4 w-16 bg-gray-200 rounded" {...pulseAnimation} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 일반 포스트 - 항상 세로 레이아웃
  return (
    <div className="w-full">
      <div className="rounded-t-3xl min-[70rem]:rounded-t-4xl overflow-hidden">
        <motion.div className="relative aspect-[16/9] bg-gray-200" {...pulseAnimation} />
      </div>

      <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
        <div className="flex space-x-2">
          <motion.div className="h-4 w-24 bg-gray-200 rounded" {...pulseAnimation} />
        </div>

        <div className="grow">
          <motion.div className="h-6 w-full bg-gray-200 rounded mb-2" {...pulseAnimation} />
          <motion.div className="h-6 w-4/5 bg-gray-200 rounded" {...pulseAnimation} />
        </div>

        <div className="flex items-center justify-between">
          <motion.div className="h-4 w-32 bg-gray-200 rounded" {...pulseAnimation} />
          <div className="flex items-center space-x-1">
            <motion.div className="h-4 w-4 bg-gray-200 rounded-full" {...pulseAnimation} />
            <motion.div className="h-4 w-16 bg-gray-200 rounded" {...pulseAnimation} />
          </div>
        </div>
      </div>
    </div>
  );
}
