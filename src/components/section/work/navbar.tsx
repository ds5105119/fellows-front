"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { AlignLeft } from "lucide-react";

export default function Navbar() {
  const targetRef = useRef<HTMLElement | null>(null);
  const mobileTargetRef = useRef<HTMLElement | null>(null);
  const logoDesktopRef = useRef<HTMLHeadingElement | null>(null);
  const logoMobileRef = useRef<HTMLHeadingElement | null>(null);

  const { scrollY } = useScroll();
  const scrollProgress = useMotionValue(0);

  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [maxFontSizeDesktop, setMaxFontSizeDesktop] = useState(0);
  const [maxFontSizeMobile, setMaxFontSizeMobile] = useState(0);

  /** 🔹 뷰포트 높이를 기준으로 스크롤 범위 설정 */
  useEffect(() => {
    function updateHeight() {
      setViewportHeight(window.innerHeight);
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  /** 🔹 스크롤 진행도 계산 */
  useEffect(() => {
    return scrollY.on("change", (y) => {
      if (viewportHeight > 0) {
        const progress = Math.min(y / viewportHeight, 1);
        scrollProgress.set(progress);
      }
    });
  }, [scrollY, viewportHeight, scrollProgress]);

  /** 🔹 데스크탑 로고 최대 폰트 계산 */
  useEffect(() => {
    function updateDesktopFontSize() {
      if (!logoDesktopRef.current) return;
      const testSize = 1000;
      logoDesktopRef.current.style.fontSize = `${testSize}px`;
      const width = logoDesktopRef.current.getBoundingClientRect().width;
      const newFontSize = (window.innerWidth / width) * testSize;
      setMaxFontSizeDesktop(newFontSize);
    }

    updateDesktopFontSize();
    window.addEventListener("resize", updateDesktopFontSize);
    return () => window.removeEventListener("resize", updateDesktopFontSize);
  }, []);

  /** 🔹 모바일 로고 최대 폰트 계산 */
  useEffect(() => {
    function updateMobileFontSize() {
      if (!logoMobileRef.current) return;
      const testSize = 1000;
      logoMobileRef.current.style.fontSize = `${testSize}px`;
      const width = logoMobileRef.current.getBoundingClientRect().width;
      const newFontSize = (window.innerWidth / width) * testSize;
      setMaxFontSizeMobile(newFontSize);
    }

    updateMobileFontSize();
    window.addEventListener("resize", updateMobileFontSize);
    return () => window.removeEventListener("resize", updateMobileFontSize);
  }, []);

  /** 🔹 px 단위 height 변환 */
  const headerHeight = useTransform(scrollProgress, [0, 1], [viewportHeight * 0.96, viewportHeight * 0.08]);
  const headerHeightPx = useTransform(headerHeight, (v) => `${v}px`);
  const mobileHeaderHeight = useTransform(scrollProgress, [0, 1], [viewportHeight * 0.96, viewportHeight * 0.06]);
  const mobileHeaderHeightPx = useTransform(mobileHeaderHeight, (v) => `${v}px`);

  /** 🔹 폰트/위치 애니메이션 */
  const logoFontSize = useTransform(scrollProgress, [0, 1], [maxFontSizeDesktop, 48]);
  const logoFontSizePx = useTransform(logoFontSize, (v) => `${v}px`);
  const mobileLogoFontSize = useTransform(scrollProgress, [0, 1], [maxFontSizeMobile, 24]);
  const mobileLogoFontSizePx = useTransform(mobileLogoFontSize, (v) => `${v}px`);

  const logoLetterSpacing = useTransform(scrollProgress, [0, 1], ["-0.3rem", "0rem"]);

  /** 🔹 처음엔 아래쪽 → 줄어들면 세로 중앙 정렬 */
  const logoTop = useTransform(scrollProgress, [0, 1], ["100%", "50%"]);
  const logoTranslateY = useTransform(scrollProgress, [0, 1], ["-90%", "-50%"]);

  const navLeft = useTransform(scrollProgress, [0, 1], ["1%", "50%"]);
  const navTranslateX = useTransform(scrollProgress, [0, 1], ["0%", "-50%"]);
  const mobileNavLeft = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);
  const mobileNavTranslateX = useTransform(scrollProgress, [0, 1], ["0%", "-100%"]);

  return (
    <>
      {/* 데스크탑 */}
      <motion.header className="fixed w-full z-50 bg-white hidden md:flex" ref={targetRef} style={{ height: headerHeightPx }}>
        <div className="relative h-full w-full">
          <motion.h1
            ref={logoDesktopRef}
            className="absolute font-black text-gray-900 whitespace-nowrap px-4 hidden md:block"
            style={{
              top: logoTop,
              translateY: logoTranslateY,
              fontSize: logoFontSizePx,
              lineHeight: logoFontSizePx,
              letterSpacing: logoLetterSpacing,
            }}
          >
            Fellows
          </motion.h1>

          <motion.div className="absolute h-fit w-fit px-4 hidden md:flex" style={{ left: navLeft, translateX: navTranslateX }}>
            <nav className="flex items-center justify-start space-x-6 text-gray-700 h-[80px]">
              <a href="#about" className="hover:text-gray-900 text-sm md:text-2xl font-semibold">
                about
              </a>
              <a href="#blog" className="hover:text-gray-900 text-sm md:text-2xl font-semibold">
                blog
              </a>
              <a href="#contact" className="hover:text-gray-900 text-sm md:text-2xl font-semibold">
                contact
              </a>
            </nav>
          </motion.div>
        </div>
      </motion.header>

      {/* 모바일 */}
      <motion.header className="fixed w-full z-50 bg-white block md:hidden" ref={mobileTargetRef} style={{ height: mobileHeaderHeightPx }}>
        <div className="relative h-full w-full">
          <motion.h1
            ref={logoMobileRef}
            className="absolute font-black text-gray-900 whitespace-nowrap px-4 block md:hidden"
            style={{
              top: logoTop,
              translateY: logoTranslateY,
              fontSize: mobileLogoFontSizePx,
              lineHeight: mobileLogoFontSizePx,
              letterSpacing: logoLetterSpacing,
            }}
          >
            Fellows
          </motion.h1>

          <motion.div className="absolute h-fit w-fit px-4 flex md:hidden" style={{ left: mobileNavLeft, translateX: mobileNavTranslateX }}>
            <button className="mt-3">
              <AlignLeft />
            </button>
          </motion.div>
        </div>
      </motion.header>
    </>
  );
}
