"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, type Easing } from "framer-motion";
import { AlignLeft, X } from "lucide-react";
import { useLenis } from "lenis/react";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function Navbar() {
  const lenis = useLenis();
  const targetRef = useRef<HTMLElement | null>(null);
  const mobileTargetRef = useRef<HTMLElement | null>(null);
  const logoDesktopRef = useRef<HTMLHeadingElement | null>(null);
  const logoMobileRef = useRef<HTMLHeadingElement | null>(null);
  const { scrollY } = useScroll();
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [maxFontSizeDesktop, setMaxFontSizeDesktop] = useState(0);
  const [maxFontSizeMobile, setMaxFontSizeMobile] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** 🔹 뷰포트 높이를 기준으로 스크롤 범위 설정 */
  useEffect(() => {
    function updateHeight() {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
      setViewportHeight(window.innerHeight);
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  /** 🔹 데스크탑 로고 최대 폰트 계산 */
  useLayoutEffect(() => {
    function updateDesktopFontSize() {
      if (!logoDesktopRef.current) return;
      const testSize = 1000;
      logoDesktopRef.current.style.fontSize = `${testSize}px`;
      const width = logoDesktopRef.current.getBoundingClientRect().width;
      const newFontSize = ((window.innerWidth - 16) / width) * testSize;
      setMaxFontSizeDesktop(newFontSize);
      logoDesktopRef.current.style.fontSize = "";
    }
    updateDesktopFontSize();
    window.addEventListener("resize", updateDesktopFontSize);
    return () => window.removeEventListener("resize", updateDesktopFontSize);
  }, []);

  /** 🔹 모바일 로고 최대 폰트 계산 */
  useLayoutEffect(() => {
    function updateMobileFontSize() {
      if (!logoMobileRef.current) return;
      const testSize = 1000;
      logoMobileRef.current.style.fontSize = `${testSize}px`;
      const { width, height } = logoMobileRef.current.getBoundingClientRect();
      const maxAllowedWidth = window.innerWidth * 0.98;
      const maxAllowedHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vh")) * 100 * 0.3;
      const widthRatio = maxAllowedWidth / width;
      const heightRatio = maxAllowedHeight / height;
      const scaleRatio = Math.min(widthRatio, heightRatio);
      const newFontSize = testSize * scaleRatio;
      setMaxFontSizeMobile(newFontSize);
      logoMobileRef.current.style.fontSize = "";
    }
    updateMobileFontSize();
    window.addEventListener("resize", updateMobileFontSize);
    return () => window.removeEventListener("resize", updateMobileFontSize);
  }, []);

  /** 🔹 px 단위 height 변환 */
  const fullHeight = viewportHeight * 0.96;

  const desktopMinHeight = 80;
  const desktopShrinkDistance = fullHeight - desktopMinHeight; // 줄어드는 거리(px)
  const headerHeight = useTransform(
    scrollY,
    [0, desktopShrinkDistance], // ΔH px
    [fullHeight, desktopMinHeight], // ΔH px
    { clamp: true }
  );
  const headerHeightPx = useTransform(headerHeight, (v) => `${v}px`);

  const mobileMinHeight = 48;
  const mobileShrinkDistance = fullHeight - mobileMinHeight;
  const mobileHeaderHeight = useTransform(
    scrollY,
    [0, mobileShrinkDistance], // ΔH px
    [fullHeight, mobileMinHeight], // ΔH px
    { clamp: true }
  );
  const mobileHeaderHeightPx = useTransform(mobileHeaderHeight, (v) => `${v}px`);

  /** 🔹 폰트/위치 애니메이션 */
  const logoFontSize = useTransform(scrollY, [0, desktopShrinkDistance], [100, (48 / maxFontSizeDesktop) * 100]);
  const logoFontSizePercent = useTransform(logoFontSize, (v) => `${v}%`);
  const logoTranslateY = useTransform(scrollY, [0, desktopShrinkDistance], ["0px", "-18px"]);
  const logoLetterSpacing = useTransform(scrollY, [0, desktopShrinkDistance], ["-0.3rem", "0rem"]);

  const mobileLogoFontSize = useTransform(scrollY, [0, mobileShrinkDistance], [100, (24 / maxFontSizeMobile) * 100]);
  const mobileLogoFontSizePercent = useTransform(mobileLogoFontSize, (v) => `${v}%`);
  const mobileLogoTranslateY = useTransform(scrollY, [0, mobileShrinkDistance], ["0px", "-12px"]);
  const mobileLogoLetterSpacing = useTransform(scrollY, [0, mobileShrinkDistance], ["-0.3rem", "0rem"]);

  /** 🔹 처음엔 아래쪽 → 줄어들면 세로 중앙 정렬 */
  const navLeft = useTransform(scrollY, [0, desktopShrinkDistance], ["1%", "50%"]);
  const navTranslateX = useTransform(scrollY, [0, desktopShrinkDistance], ["0%", "-50%"]);

  const mobileNavLeft = useTransform(scrollY, [0, mobileShrinkDistance], ["0%", "100%"]);
  const mobileNavTranslateX = useTransform(scrollY, [0, mobileShrinkDistance], ["0%", "-100%"]);

  // 모바일 메뉴 열기/닫기 함수
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      lenis?.start();
    } else {
      lenis?.stop();
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 모바일 메뉴 닫기 함수
  const closeMobileMenu = () => {
    lenis?.start();
    setIsMobileMenuOpen(false);
  };

  // 메뉴 아이템들
  const menuItems = [
    { label: "home", href: "/" },
    { label: "saas", href: "/service" },
    { label: "blog", href: "/blog" },
    { label: "contact", href: "/#contact" },
  ];

  // 메뉴 애니메이션 variants
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as Easing,
      },
    },
    open: {
      x: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as Easing,
      },
    },
    exit: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as Easing,
      },
    },
  };

  const menuItemVariants = {
    closed: {
      y: 50,
      opacity: 0,
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as Easing,
      },
    },
  };

  const containerVariants = {
    closed: {},
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <>
      {/* 데스크탑 */}
      <motion.header className="fixed w-full z-50 hidden md:flex mix-blend-difference" ref={targetRef} style={{ height: headerHeightPx }}>
        <motion.h1
          ref={logoDesktopRef}
          className="absolute font-black whitespace-nowrap hidden md:block select-none"
          style={{
            bottom: 0,
            translateY: logoTranslateY,
            fontSize: maxFontSizeDesktop,
            lineHeight: "1",
            letterSpacing: logoLetterSpacing,
            color: "white",
            scale: logoFontSizePercent,
            transformOrigin: "bottom left",
            marginLeft: 16,
          }}
        >
          Fellows
        </motion.h1>
        <motion.div
          className="absolute h-fit w-fit px-4 hidden md:flex mt-5.5 mix-blend-difference opacity-70"
          style={{ left: navLeft, translateX: navTranslateX }}
        >
          <nav className="flex items-center justify-start space-x-6">
            {menuItems.map((item, index) => (
              <a key={index} href={item.href} className="text-white text-sm md:text-2xl font-light select-none">
                <LetterSwapForward label={item.label} reverse={true} />
              </a>
            ))}
          </nav>
        </motion.div>
      </motion.header>

      {/* 모바일 */}
      <motion.header className="fixed w-full z-[100] block md:hidden mix-blend-difference" ref={mobileTargetRef} style={{ height: mobileHeaderHeightPx }}>
        <div className="relative h-full w-full">
          <motion.h1
            ref={logoMobileRef}
            className="absolute font-black whitespace-nowrap mx-4 block md:hidden"
            style={{
              bottom: 0,
              translateY: mobileLogoTranslateY,
              fontSize: maxFontSizeMobile,
              lineHeight: "1",
              letterSpacing: mobileLogoLetterSpacing,
              color: "white",
              scale: mobileLogoFontSizePercent,
              transformOrigin: "bottom left",
            }}
          >
            Fellows
          </motion.h1>
          <motion.div
            className="absolute h-fit w-fit px-4 flex md:hidden mt-1 opacity-70"
            style={{ left: mobileNavLeft, translateX: mobileNavTranslateX, color: "white" }}
          >
            <button onClick={toggleMobileMenu} className="p-2">
              <AlignLeft size={24} />
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* 모바일 메뉴 오버레이 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* 메뉴 패널 */}
            <motion.div
              className="fixed top-0 right-0 w-full h-full bg-white z-[100] md:hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="exit"
            >
              <div className="flex flex-col h-full">
                {/* 헤더 */}
                <div className="flex justify-between items-center px-4 h-12">
                  <h2 className="text-2xl font-black text-gray-900">Fellows℠</h2>
                  <button onClick={closeMobileMenu} className="hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {/* 메뉴 아이템들 */}
                <motion.nav className="flex-1 flex flex-col justify-center px-6" variants={containerVariants} initial="closed" animate="open">
                  {menuItems.map((item, index) => (
                    <motion.div key={index} variants={menuItemVariants}>
                      <a
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block py-2 text-3xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        {item.label}
                      </a>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* 푸터 */}
                <div className="p-6">
                  <p className="text-sm text-gray-500 text-center">© 2024 Fellows. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
