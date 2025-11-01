"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, type Easing } from "framer-motion";
import { AlignLeft, X } from "lucide-react";
import { useLenis } from "lenis/react";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function Navbar() {
  const lenis = useLenis();
  const { scrollY } = useScroll();

  // ===== 데스크톱 로고 =====
  const desktopLogoRef = useRef<HTMLImageElement | null>(null);
  const desktopMinHeight = 80;
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const measureAndSet = () => {
      const el = desktopLogoRef.current;
      if (!el) return;

      const vw = window.innerWidth;
      const targetWidth = vw - 32;

      const BASE = 64;
      el.style.width = BASE + "px";
      const rect = el.getBoundingClientRect();
      const realWidth = rect.width || 1;

      const ratio = targetWidth / realWidth;
      const nextFontSize = BASE * ratio;

      el.style.width = `${nextFontSize}px`;
    };

    measureAndSet();
    window.addEventListener("resize", measureAndSet);

    const el = desktopLogoRef.current;
    const ro = el ? new ResizeObserver(measureAndSet) : null;
    if (el && ro) ro.observe(el);

    return () => {
      window.removeEventListener("resize", measureAndSet);
      ro?.disconnect();
    };
  }, []);

  // ===== 스크롤로 위로만 나가게 =====
  useEffect(() => {
    const f = () => setVh(window.innerHeight);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const headerHeight = useTransform(scrollY, [0, vh], [vh, desktopMinHeight], { clamp: true });
  const headerHeightPx = useTransform(headerHeight, (v) => `${v}px`);

  const logoTranslateY = useTransform(scrollY, [0, vh], [0, -vh], { clamp: true });

  // 모바일용 height 미리 만들어
  const mobileHeaderHeight = useTransform(scrollY, [0, (vh || 600) * 0.9 - 48], [(vh || 600) * 0.9, 48], { clamp: true });

  // ===== 모바일 메뉴 =====
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) lenis?.start();
    else lenis?.stop();
    setIsMobileMenuOpen((p) => !p);
  };
  const closeMobileMenu = () => {
    lenis?.start();
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { label: "home", href: "/" },
    { label: "saas", href: "/service" },
    { label: "blog", href: "/blog" },
  ];

  const menuVariants = {
    closed: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" as Easing } },
    open: { x: "0%", transition: { duration: 0.3, ease: "easeInOut" as Easing } },
    exit: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" as Easing } },
  };

  const menuItemVariants = {
    closed: { y: 50, opacity: 0 },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" as Easing },
    },
  };

  const containerVariants = {
    closed: {},
    open: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <>
      {/* 데스크톱 */}
      <motion.header className="fixed w-full z-50 hidden md:flex mix-blend-difference pointer-events-none" style={{ height: headerHeightPx }}>
        <motion.img
          ref={desktopLogoRef}
          src="/fellows/logo-text-2.svg"
          className="invert absolute hidden md:block font-black pointer-events-auto h-auto text-black select-none"
          style={{
            bottom: 48,
            left: 16,
            translateY: logoTranslateY,
            whiteSpace: "nowrap",
          }}
        />

        {/* 네비는 그대로 */}
        <motion.nav className="absolute w-full top-4 flex pointer-events-auto px-4">
          <motion.div className="text-white shrink-0 mr-64">
            <motion.span className="font-extrabold text-lg">Fellows </motion.span>
            <motion.span className="font-normal text-lg">works</motion.span>
          </motion.div>

          <motion.div className="flex flex-col items-start">
            {menuItems.map((item) => (
              <a key={item.href} href={item.href} className="text-white text-lg font-normal leading-tight select-none">
                <LetterSwapForward label={item.label} reverse />
              </a>
            ))}
          </motion.div>

          <motion.div className="flex items-center space-x-5 px-32 select-none self-center">
            <motion.div className="text-yellow-200 text-7xl animate-spin duration-5000 hover:duration-10000 transition-all">❋</motion.div>
            <motion.div className="text-yellow-200 text-7xl animate-spin duration-10000 hover:duration-15000 transition-all">❖</motion.div>
            <motion.div className="text-yellow-200 text-7xl animate-spin duration-15000 hover:duration-20000 transition-all">✥</motion.div>
          </motion.div>

          <motion.div className="text-white font-normal text-4xl self-center">Contact</motion.div>
        </motion.nav>
      </motion.header>

      {/* 모바일 */}
      <motion.header className="fixed w-full z-[100] block md:hidden mix-blend-difference" style={{ height: mobileHeaderHeight }}>
        <div className="relative h-full w-full">
          <h1 className="absolute font-black whitespace-nowrap mx-4 block md:hidden bottom-0 text-white" style={{ fontSize: "14vw", lineHeight: 1 }}>
            Fellows
          </h1>
          <div className="absolute top-2 right-3 flex md:hidden">
            <button onClick={toggleMobileMenu} className="p-2 text-white">
              <AlignLeft size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[90] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-full bg-white z-[100] md:hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="exit"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-4 h-12">
                  <h2 className="text-2xl font-black text-gray-900">Fellows℠</h2>
                  <button onClick={closeMobileMenu} className="hover:bg-gray-100 rounded-full transition-colors p-2">
                    <X size={24} />
                  </button>
                </div>

                <motion.nav className="flex-1 flex flex-col justify-center px-6" variants={containerVariants} initial="closed" animate="open">
                  {menuItems.map((item) => (
                    <motion.div key={item.href} variants={menuItemVariants}>
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
