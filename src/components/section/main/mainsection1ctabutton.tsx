"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export const DesktopCTAButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button size="lg" className="px-16 h-16 text-lg rounded-xl bg-black hover:bg-zinc-800 relative z-10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        시작하기
      </Button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 140 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute bottom-13 left-0 w-full bg-zinc-700/60 backdrop-blur-sm rounded-t-xl shadow-xl border border-zinc-600/50 overflow-hidden z-0"
            style={{ originY: 1 }}
          >
            <div className="h-full flex flex-col justify-start">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.25, ease: "easeOut" }}
                className="h-16"
              >
                <Link
                  href="/service/dashboard"
                  className="px-6 py-3 h-full text-white hover:bg-white/10 transition-all duration-200 text-center font-medium border-b border-zinc-600/30 last:border-b-0 hover:text-zinc-100 flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  대시보드
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.25, ease: "easeOut" }}
                className="h-16"
              >
                <Link
                  href="#inquery"
                  className="px-6 py-3 w-full h-full text-white hover:bg-white/10 transition-all duration-200 text-center font-medium border-b border-zinc-600/30 last:border-b-0 hover:text-zinc-100 flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  문의하기
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileCTAButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"up" | "down">("down");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 외부 터치 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // 버튼 위치 + 화면 크기 계산해서 펼칠 방향 결정
  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const menuHeight = 60; // 메뉴 예상 높이(px)

      if (spaceBelow < menuHeight) {
        setOpenDirection("up");
      } else {
        setOpenDirection("down");
      }
    }
  }, [isMenuOpen]);

  return (
    <div className="col-span-full w-full flex z-20 md:hidden pt-4 relative">
      <Button
        ref={buttonRef}
        size="lg"
        className="w-full px-16 h-[3.5rem] text-lg font-semibold rounded-2xl bg-black active:bg-black"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        무료 견적받기
      </Button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: openDirection === "down" ? 0 : 0 }}
            animate={{ opacity: 1, y: openDirection === "down" ? 10 : 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`absolute left-0 right-0 bg-white rounded-2xl border overflow-hidden ${openDirection === "down" ? "top-full" : "bottom-full"}`}
          >
            <div className="flex">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.2 }} className="flex-1">
                <Link
                  href="#inquery"
                  className="block px-4 py-4 text-gray-800 hover:bg-gray-50 transition-colors text-center font-medium border-r last:border-r-0 border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  무료 견적받기
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.2 }} className="flex-1">
                <Link
                  href="/service/dashboard"
                  className="block px-4 py-4 text-gray-800 hover:bg-gray-50 transition-colors text-center font-medium border-r last:border-r-0 border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  대시보드
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
