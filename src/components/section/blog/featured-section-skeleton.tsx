"use client";

import { motion } from "framer-motion";

export default function FeaturedSectionSkeleton() {
  // 펄스 애니메이션 속성
  const pulseAnimation = {
    animate: {
      opacity: [0.4, 0.7, 0.4] as [number, number, number],
    },
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  };

  return (
    <section className="flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 h-fit">
        {/* Main Featured Post Skeleton */}
        <div className="lg:col-span-4">
          <div className="group">
            <div className="rounded-3xl min-[70rem]:rounded-4xl overflow-hidden">
              <motion.div className="relative aspect-[4/3] bg-slate-200" {...pulseAnimation} />
            </div>

            <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 pt-8 pb-4 flex flex-col">
              <div className="flex space-x-2">
                <motion.div className="h-4 w-20 bg-slate-200 rounded-lg" {...pulseAnimation} />
              </div>

              <motion.div className="h-7 w-full bg-slate-200 rounded-lg" {...pulseAnimation} />
              <motion.div className="h-7 w-4/5 bg-slate-200 rounded-lg" {...pulseAnimation} />

              <motion.div className="h-6 w-full bg-slate-100 rounded-lg" {...pulseAnimation} />
              <motion.div className="h-6 w-3/4 bg-slate-100 rounded-lg" {...pulseAnimation} />
            </div>
          </div>
        </div>

        {/* Sidebar Posts Skeleton */}
        <div className="lg:col-span-2 space-y-8 w-full h-full min-h-0">
          {/* First Sidebar Post */}
          <div className="overflow-hidden w-full aspect-[4/3] rounded-3xl min-[70rem]:rounded-4xl bg-slate-200">
            <div className="relative h-full overflow-hidden p-8 flex flex-col justify-between">
              <div className="flex flex-col space-y-3">
                <motion.div className="h-6 w-24 bg-white/30 rounded-full" {...pulseAnimation} />
                <motion.div className="h-5 w-full bg-white/30 rounded-lg mt-2" {...pulseAnimation} />
                <motion.div className="h-7 w-full bg-white/30 rounded-lg" {...pulseAnimation} />
              </div>
              <div className="flex justify-end">
                <motion.div className="h-6 w-28 bg-white/30 rounded-lg" {...pulseAnimation} />
              </div>
            </div>
          </div>

          {/* Second Sidebar Post */}
          <div className="overflow-hidden w-full aspect-[4/3] md:aspect-[4/4] rounded-3xl min-[70rem]:rounded-4xl bg-slate-200">
            <div className="relative h-full">
              <div className="absolute inset-8 flex flex-col justify-between">
                <div className="flex flex-col space-y-3">
                  <motion.div className="h-6 w-24 bg-white/30 rounded-full" {...pulseAnimation} />
                  <motion.div className="h-5 w-full bg-white/30 rounded-lg mt-2" {...pulseAnimation} />
                  <motion.div className="h-7 w-full bg-white/30 rounded-lg" {...pulseAnimation} />
                </div>
                <div className="flex justify-end">
                  <motion.div className="h-6 w-28 bg-white/30 rounded-lg" {...pulseAnimation} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
