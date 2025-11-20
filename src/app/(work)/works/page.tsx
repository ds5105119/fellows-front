"use client";

import Navbar from "@/components/section/work/navbar";
import WorkMain2 from "@/components/section/work/workmain2";
import WorkMain4 from "@/components/section/work/workmain4";
import WorkMain5 from "@/components/section/work/workmain5";
import WorkMain6 from "@/components/section/work/workmain6";
import { CursorProvider } from "@/components/ui/cursor-controller";
import { motion } from "framer-motion";

export default async function Home() {
  const cursor = <motion.div layoutId="cursor" className="size-4 rounded-full bg-gray-500/40 backdrop-blur-md" />;

  return (
    <div className="relative">
      <CursorProvider
        defaultContent={cursor}
        defaultVariants={{
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
        }}
        defaultTransition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
          mass: 0.6,
        }}
      >
        <Navbar />
        <div className="grid grid-cols-4 lg:grid-cols-12 bg-[#FFFFFF]">
          <div className="col-span-full w-full">
            <WorkMain2 />
          </div>
          <div className="col-span-full w-full">
            <WorkMain4 />
          </div>
          <div className="col-span-full w-full">
            <WorkMain5 />
          </div>
          <div className="col-span-full w-full">
            <WorkMain6 />
          </div>
        </div>
      </CursorProvider>
    </div>
  );
}
