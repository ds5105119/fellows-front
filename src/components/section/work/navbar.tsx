"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

export default function Navbar() {
  const targetRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLHeadingElement | null>(null);

  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    if (!targetRef.current) return;
    const headerHeight = targetRef.current.offsetHeight;
    setScrollRange(headerHeight);
  }, []);

  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    return scrollY.on("change", (y) => {
      if (scrollRange > 0) {
        const progress = Math.min(y / scrollRange, 1);
        scrollProgress.set(progress);
      }
    });
  }, [scrollY, scrollRange, scrollProgress]);

  const [maxFontSize, setMaxFontSize] = useState(0);

  useEffect(() => {
    function updateFontSize() {
      if (!logoRef.current) return;
      const testSize = 1000;
      logoRef.current.style.fontSize = `${testSize}px`;
      const width = logoRef.current.getBoundingClientRect().width;
      const newFontSize = (window.innerWidth / width) * testSize;
      setMaxFontSize(newFontSize);
    }

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  const headerHeight = useTransform(scrollProgress, [0, 1], ["98vh", "8vh"]);

  const logoFontSize = useTransform(scrollProgress, [0, 1], [maxFontSize, 48]);
  const logoFontSizePx = useTransform(logoFontSize, (v) => `${v}px`);
  const logoLetterSpacing = useTransform(scrollProgress, [0, 1], ["-0.3rem", "0rem"]);
  const logoTop = useTransform(scrollProgress, [0, 1], ["100%", "0%"]);
  const logoTranslateY = useTransform(scrollProgress, [0, 1], ["-90%", "0%"]);

  const navLeft = useTransform(scrollProgress, [0, 1], ["0%", "50%"]);
  const navTranslateX = useTransform(scrollProgress, [0, 1], ["0%", "-50%"]);

  return (
    <motion.header className="fixed w-full z-50 bg-white" ref={targetRef} style={{ height: headerHeight }}>
      <div className="relative h-full w-full">
        <motion.h1
          ref={logoRef}
          className="absolute font-black text-gray-900 whitespace-nowrap px-4"
          style={{
            top: logoTop,
            translateY: logoTranslateY,
            fontSize: logoFontSizePx,
            letterSpacing: logoLetterSpacing,
          }}
        >
          Fellows
        </motion.h1>

        <motion.div className="absolute hidden md:flex h-fit w-fit px-4" style={{ left: navLeft, translateX: navTranslateX }}>
          <nav className="flex items-center justify-start space-x-6 text-gray-700 h-[80px]">
            <a href="#about" className="hover:text-gray-900 text-2xl font-semibold">
              about
            </a>
            <a href="#work" className="hover:text-gray-900 flex items-center text-2xl font-semibold">
              work<span className="ml-1 text-xs text-gray-500">(10)</span>
            </a>
            <a href="#blog" className="hover:text-gray-900 text-2xl font-semibold">
              blog
            </a>
            <a href="#contact" className="hover:text-gray-900 text-2xl font-semibold">
              contact
            </a>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}
