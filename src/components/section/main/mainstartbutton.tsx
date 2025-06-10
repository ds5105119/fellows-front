"use client";

import Link from "next/link";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MainStartButton() {
  const originalButtonRef = useRef(null);
  const isInView = useInView(originalButtonRef, {
    once: false,
  });

  return (
    <>
      {/* 실제 자리 (보이면 sticky 버튼 사라짐) */}
      <div ref={originalButtonRef} className="h-1 md:h-16" />

      {/* sticky 버튼 (모바일용) */}
      <motion.div
        animate={{
          y: isInView ? 300 : 0,
          opacity: isInView ? 0 : 1,
          pointerEvents: isInView ? "none" : "auto",
        }}
        transition={{
          y: isInView ? { duration: 0.5, ease: "easeIn" } : { duration: 0.5, ease: "easeOut" },
          opacity: isInView ? { duration: 0.2 } : { duration: 0.8 },
        }}
        className="px-3 w-full sticky flex flex-col bottom-0 z-20 md:hidden"
      >
        <div className="w-full h-4" />
        <div className="w-full flex pb-4 pt-3">
          <Button size="lg" className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold bg-black hover:bg-zinc-800" asChild>
            <Link href="/service/dashboard">시작하기</Link>
          </Button>
        </div>
      </motion.div>
    </>
  );
}
