"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NavButtonGroup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrolledEnough = scrollY >= windowHeight * 0.5;
      const shortPage = docHeight <= windowHeight * 1.8;

      setIsVisible(scrolledEnough || shortPage);
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.span
        key="navbutton1"
        initial={false}
        animate={{ x: isVisible ? -170 : 0 }}
        exit={{ opacity: 1, x: 170 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-fit font-bold space-x-7"
      >
        <Link href="/login" className="hover:opacity-80">
          가격
        </Link>
        <Link href="/login" className="hover:opacity-80">
          포토폴리오
        </Link>
        <Link href="/login" className="hover:opacity-80">
          로그인
        </Link>
      </motion.span>

      {isVisible && (
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
          className="absolute right-2.5 inset-y-2 px-5 font-bold text-white bg-black rounded-full flex items-center justify-center hover:bg-neutral-700"
        >
          <Link href="/login" className="flex w-full h-full items-center">
            지금 바로 시작하기
          </Link>
        </motion.span>
      )}
    </AnimatePresence>
  );
}
