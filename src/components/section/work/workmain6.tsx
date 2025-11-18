"use client";

import { useCursor } from "@/components/ui/cursor-controller";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WorkMain6() {
  const router = useRouter();

  const { setCursor, resetCursor } = useCursor();

  // 모바일: 부모 width, 텍스트 width, 원 크기
  const mobileWidth = 200;
  const mobileTextWidth = 75;
  const mobileCircle = 76;
  const padding = 16;

  // 데스크톱
  const desktopWidth = 350;
  const desktopTextWidth = 143;
  const desktopCircle = 120;

  return (
    <div className="relative w-full py-24 md:py-0 md:h-lvh flex flex-col justify-center bg-[#E0DDD8] px-4">
      <div className="text-[5rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] leading-none font-medium">
        Let's Work
        <br />
        Together
      </div>

      <div className="mt-6 md:mt-12 flex md:space-x-64">
        {/* 모바일 버전 */}
        <motion.button
          className="relative rounded-full bg-amber-500 h-24 w-[200px] overflow-hidden block md:hidden mt-6"
          initial="initial"
          whileHover="hover"
          variants={{
            initial: { backgroundColor: "#f59e0b" }, // bg-amber-500
            hover: { backgroundColor: "#000000" }, // bg-black
          }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          onClick={() => router.push("/#insquery")}
        >
          {/* 텍스트 */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 font-bold text-white whitespace-nowrap"
            style={{ left: padding + 4 }}
            variants={{
              initial: { x: 0 },
              hover: { x: mobileWidth - mobileTextWidth - 40 },
            }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          >
            CONTACT
          </motion.div>

          {/* 원 */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 bg-amber-50 rounded-full"
            style={{ left: mobileWidth - mobileCircle - padding + 4, width: mobileCircle, height: mobileCircle }}
            variants={{
              initial: { x: 0 },
              hover: { x: -(mobileWidth - mobileCircle - 22) },
            }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          />
        </motion.button>
        {/* 데스크톱 버전 */}
        <motion.button
          className="relative rounded-full bg-amber-500 h-36 w-[350px] overflow-hidden hidden md:block mt-12"
          initial="initial"
          whileHover="hover"
          variants={{
            initial: { backgroundColor: "#f59e0b" }, // bg-amber-500
            hover: { backgroundColor: "#000000" }, // bg-black
          }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          onMouseEnter={() =>
            setCursor(
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="text-4xl">
                👋
              </motion.div>
            )
          }
          onMouseLeave={resetCursor}
          onClick={() => router.push("/#insquery")}
        >
          {/* 텍스트 */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 text-3xl font-bold text-white whitespace-nowrap"
            style={{ left: 32 }}
            variants={{
              initial: { x: 0 },
              hover: { x: desktopWidth - desktopTextWidth - 64 },
            }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          >
            CONTACT
          </motion.div>

          {/* 원 */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 bg-amber-50 rounded-full"
            style={{ left: desktopWidth - desktopCircle - padding, width: desktopCircle, height: desktopCircle }}
            variants={{
              initial: { x: 0 },
              hover: { x: -(desktopWidth - desktopCircle - padding * 2) },
            }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          />
        </motion.button>

        <motion.div
          className="relative hidden md:block md:w-[13rem] aspect-[3/1] md:aspect-square" // 너비 기준
          animate={{
            scale: [1, 0.7, 1], // 정사각형 자체를 스케일
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <motion.div className="absolute inset-0 flex items-center justify-center md:text-[13rem]">↘</motion.div>
        </motion.div>
      </div>
    </div>
  );
}
