"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { AlignLeft, X } from "lucide-react";
import { debounce } from "lodash";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** 🔹 뷰포트 높이를 기준으로 스크롤 범위 설정 */
  useEffect(() => {
    function updateHeight() {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
      setViewportHeight(window.innerHeight);
    }
    const debouncedUpdateHeight = debounce(updateHeight, 200);
    updateHeight();
    window.addEventListener("resize", debouncedUpdateHeight);
    return () => window.removeEventListener("resize", debouncedUpdateHeight);
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
  useLayoutEffect(() => {
    function updateDesktopFontSize() {
      if (!logoDesktopRef.current) return;
      const testSize = 1000;
      logoDesktopRef.current.style.fontSize = `${testSize}px`;
      const width = logoDesktopRef.current.getBoundingClientRect().width;
      const newFontSize = (window.innerWidth / width) * testSize;
      setMaxFontSizeDesktop(newFontSize);
      logoDesktopRef.current.style.fontSize = "";
    }
    const debouncedUpdate = debounce(updateDesktopFontSize, 200);
    updateDesktopFontSize();
    window.addEventListener("resize", debouncedUpdate);
    return () => window.removeEventListener("resize", debouncedUpdate);
  }, []);

  /** 🔹 모바일 로고 최대 폰트 계산 */
  useLayoutEffect(() => {
    function updateMobileFontSize() {
      if (!logoMobileRef.current) return;
      const testSize = 1000;
      logoMobileRef.current.style.fontSize = `${testSize}px`;
      const { width, height } = logoMobileRef.current.getBoundingClientRect();
      const maxAllowedWidth = window.innerWidth * 0.98;
      const maxAllowedHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vh")) * 100 * 0.3;
      const widthRatio = maxAllowedWidth / width;
      const heightRatio = maxAllowedHeight / height;
      const scaleRatio = Math.min(widthRatio, heightRatio);
      const newFontSize = testSize * scaleRatio;
      setMaxFontSizeMobile(newFontSize);
      logoMobileRef.current.style.fontSize = "";
    }
    const debouncedUpdate = debounce(updateMobileFontSize, 200);
    updateMobileFontSize();
    window.addEventListener("resize", debouncedUpdate);
    return () => window.removeEventListener("resize", debouncedUpdate);
  }, []);

  /** 🔹 px 단위 height 변환 */
  const headerHeight = useTransform(scrollProgress, [0, 1], [viewportHeight * 0.96, 80]);
  const headerHeightPx = useTransform(headerHeight, (v) => `${v}px`);
  const mobileHeaderHeight = useTransform(scrollProgress, [0, 1], [viewportHeight * 0.96, 48]);
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

  // 모바일 메뉴 열기/닫기 함수
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 모바일 메뉴 닫기 함수
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 메뉴 아이템들
  const menuItems = [
    { label: "home", href: "/" },
    { label: "saas", href: "/service" },
    { label: "blog", href: "/blog" },
    { label: "contact", href: "#contact" },
  ];

  // 메뉴 애니메이션 variants
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
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
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
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
      <motion.header className="fixed w-full z-50 bg-white hidden md:flex" ref={targetRef} style={{ height: headerHeightPx }}>
        <div className="relative h-full w-full">
          <motion.h1
            ref={logoDesktopRef}
            className="absolute font-black text-gray-900 whitespace-nowrap px-4 hidden md:block"
            style={{
              top: logoTop,
              translateY: logoTranslateY,
              fontSize: logoFontSizePx,
              lineHeight: "1",
              letterSpacing: logoLetterSpacing,
            }}
          >
            Fellows
          </motion.h1>
          <motion.div className="absolute h-fit w-fit px-4 hidden md:flex mt-5.5" style={{ left: navLeft, translateX: navTranslateX }}>
            <nav className="flex items-center justify-start space-x-6 text-gray-700">
              {menuItems.map((item, index) => (
                <a key={index} href={item.href} className="hover:text-gray-900 text-sm md:text-2xl font-semibold">
                  {item.label}
                </a>
              ))}
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
              lineHeight: "1",
              letterSpacing: logoLetterSpacing,
            }}
          >
            Fellows
          </motion.h1>
          <motion.div className="absolute h-fit w-fit px-4 flex md:hidden mt-1" style={{ left: mobileNavLeft, translateX: mobileNavTranslateX }}>
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
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* 메뉴 패널 */}
            <motion.div
              className="fixed top-0 right-0 w-full h-full bg-white z-[70] md:hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
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
                        className="block py-2 text-3xl font-semibold text-gray-900 hover:text-gray-600 transition-colors"
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
