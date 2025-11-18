"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, type Easing } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCursor } from "@/components/ui/cursor-controller";
import Link from "next/link";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";
import UnderlineToBackground from "@/components/fancy/text/underline-to-background";

const HamburgerButton = ({ isOpen, onClick, closedColorClass }: { isOpen: boolean; onClick: () => void; closedColorClass: string }) => {
  const closed = closedColorClass;
  const open = "bg-black";

  const lineTransition = { duration: 0.2, ease: "easeInOut" as Easing };

  return (
    <motion.button onClick={onClick} className="flex flex-col space-y-1 p-2">
      <motion.div
        className={`w-[22px] h-[2px] rounded-[1px] ${isOpen ? open : closed}`}
        style={{ transformOrigin: "center" }}
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={lineTransition}
      />
      <motion.div
        className={`w-[22px] h-[2px] rounded-[1px] ${isOpen ? open : closed}`}
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={lineTransition}
      />
      <motion.div
        className={`w-[22px] h-[2px] rounded-[1px] ${isOpen ? open : closed}`}
        style={{ transformOrigin: "center" }}
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={lineTransition}
      />
    </motion.button>
  );
};

export default function Navbar() {
  const lenis = useLenis();
  const scrollY = useMotionValue(0);
  const { setCursor, resetCursor } = useCursor();

  // ===== 데스크톱 로고 =====
  const desktopLogoRef = useRef<SVGSVGElement | null>(null);
  const [vh, setVh] = useState(0);

  useLenis(({ scroll }) => scrollY.set(scroll));

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

  // ===== 모바일 메뉴 =====
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      lenis?.start();
      setIsMobileMenuOpen(false);
    } else {
      lenis?.stop();
      setIsMobileMenuOpen(true);
    }
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

  const mobileMenuItems = [
    { label: "home", href: "/" },
    { label: "saas", href: "/service" },
    { label: "blog", href: "/blog" },
    { label: "contact", href: "/#contact" },
  ];

  const menuVariants = {
    closed: { opacity: "0%", transition: { duration: 0.3, ease: "easeInOut" as Easing } },
    open: { opacity: "100%", transition: { duration: 0.3, ease: "easeInOut" as Easing } },
    exit: { opacity: "0%", transition: { duration: 0.3, ease: "easeInOut" as Easing } },
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
      {/* 로고 */}
      <motion.div
        className="relative w-full h-svh z-50 pointer-events-none [isolation:isolate] pb-12 px-4 flex flex-col justify-end"
        style={{ height: vh - 48 }}
      >
        <motion.div className="mb-4 w-full md:w-140 text-lg md:text-xl">
          <motion.span>Fellows는 디자인과 기술을 섬세하게 어루만져 경험을 빚어내고, 브랜드와 고객의 연결을 더</motion.span>
          <motion.span className="text-[#f25840]">&nbsp;❉&nbsp;</motion.span>
          <motion.span>깊고 자연스럽게 만듭니다.</motion.span>
          <motion.p className="font-bold">We help you get there with design that is bold, imaginative, and distinctly human.</motion.p>
        </motion.div>

        <motion.svg ref={desktopLogoRef} className="select-none" viewBox="0 0 44 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path d="M0 8.52V0H5.88V1.536H0.816L1.824 0.492V4.392L0.816 3.6H5.664V5.112H0.816L1.824 4.32V8.52H0Z" fill="black" />
          <motion.path
            d="M9.75694 8.664C9.10094 8.664 8.52894 8.528 8.04094 8.256C7.56094 7.976 7.18494 7.584 6.91294 7.08C6.64894 6.576 6.51694 5.984 6.51694 5.304C6.51694 4.624 6.64894 4.036 6.91294 3.54C7.18494 3.036 7.56094 2.644 8.04094 2.364C8.52094 2.084 9.08894 1.944 9.74494 1.944C10.3849 1.944 10.9409 2.084 11.4129 2.364C11.8849 2.644 12.2489 3.044 12.5049 3.564C12.7689 4.084 12.9009 4.704 12.9009 5.424V5.784H8.37694C8.40094 6.296 8.53694 6.676 8.78494 6.924C9.04094 7.172 9.37694 7.296 9.79294 7.296C10.0969 7.296 10.3489 7.232 10.5489 7.104C10.7569 6.976 10.9049 6.78 10.9929 6.516L12.8049 6.624C12.6369 7.264 12.2809 7.764 11.7369 8.124C11.1929 8.484 10.5329 8.664 9.75694 8.664ZM8.37694 4.68H11.0529C11.0289 4.208 10.8969 3.856 10.6569 3.624C10.4249 3.392 10.1209 3.276 9.74494 3.276C9.36894 3.276 9.05694 3.4 8.80894 3.648C8.56894 3.888 8.42494 4.232 8.37694 4.68Z"
            fill="black"
          />
          <motion.path
            d="M15.752 8.52C15.224 8.52 14.812 8.388 14.516 8.124C14.22 7.86 14.072 7.432 14.072 6.84V0H15.872V6.648C15.872 6.84 15.916 6.976 16.004 7.056C16.092 7.136 16.22 7.176 16.388 7.176H16.82V8.52H15.752Z"
            fill="black"
          />
          <motion.path
            d="M19.3965 8.52C18.8685 8.52 18.4565 8.388 18.1605 8.124C17.8645 7.86 17.7165 7.432 17.7165 6.84V0H19.5165V6.648C19.5165 6.84 19.5605 6.976 19.6485 7.056C19.7365 7.136 19.8645 7.176 20.0325 7.176H20.4645V8.52H19.3965Z"
            fill="black"
          />
          <motion.path
            d="M24.277 8.664C23.621 8.664 23.049 8.528 22.561 8.256C22.073 7.976 21.693 7.584 21.421 7.08C21.149 6.576 21.013 5.984 21.013 5.304C21.013 4.624 21.149 4.036 21.421 3.54C21.693 3.036 22.073 2.644 22.561 2.364C23.049 2.084 23.621 1.944 24.277 1.944C24.933 1.944 25.505 2.084 25.993 2.364C26.481 2.644 26.861 3.036 27.133 3.54C27.405 4.036 27.541 4.624 27.541 5.304C27.541 5.984 27.405 6.576 27.133 7.08C26.861 7.584 26.481 7.976 25.993 8.256C25.505 8.528 24.933 8.664 24.277 8.664ZM24.277 7.284C24.725 7.284 25.073 7.112 25.321 6.768C25.569 6.416 25.693 5.928 25.693 5.304C25.693 4.68 25.569 4.196 25.321 3.852C25.073 3.5 24.725 3.324 24.277 3.324C23.829 3.324 23.481 3.5 23.233 3.852C22.985 4.196 22.861 4.68 22.861 5.304C22.861 5.928 22.985 6.416 23.233 6.768C23.481 7.112 23.829 7.284 24.277 7.284Z"
            fill="black"
          />
          <motion.path
            d="M29.7954 8.52L27.8874 2.088H29.6994L30.8034 6.444L31.9914 2.088H33.4554L34.6434 6.444L35.7594 2.088H37.5714L35.6634 8.52H33.9114L32.7234 4.5L31.5354 8.52H29.7954Z"
            fill="black"
          />
          <motion.path
            d="M41.0192 8.664C40.3552 8.664 39.7992 8.572 39.3512 8.388C38.9032 8.196 38.5592 7.94 38.3192 7.62C38.0872 7.292 37.9552 6.916 37.9232 6.492L39.7472 6.432C39.8032 6.736 39.9312 6.972 40.1312 7.14C40.3312 7.308 40.6272 7.392 41.0192 7.392C41.3392 7.392 41.5872 7.34 41.7632 7.236C41.9472 7.132 42.0392 6.972 42.0392 6.756C42.0392 6.62 42.0072 6.508 41.9432 6.42C41.8792 6.324 41.7512 6.244 41.5592 6.18C41.3752 6.108 41.0992 6.044 40.7312 5.988C40.0512 5.868 39.5192 5.728 39.1352 5.568C38.7512 5.408 38.4792 5.2 38.3192 4.944C38.1592 4.688 38.0792 4.376 38.0792 4.008C38.0792 3.392 38.3152 2.896 38.7872 2.52C39.2672 2.136 39.9832 1.944 40.9352 1.944C41.5432 1.944 42.0512 2.04 42.4592 2.232C42.8752 2.424 43.1952 2.688 43.4192 3.024C43.6512 3.352 43.7952 3.728 43.8512 4.152L42.0392 4.224C42.0152 4.016 41.9512 3.84 41.8472 3.696C41.7512 3.544 41.6272 3.428 41.4752 3.348C41.3232 3.26 41.1392 3.216 40.9232 3.216C40.6032 3.216 40.3552 3.284 40.1792 3.42C40.0112 3.548 39.9272 3.72 39.9272 3.936C39.9272 4.096 39.9632 4.228 40.0352 4.332C40.1152 4.428 40.2432 4.508 40.4192 4.572C40.5952 4.636 40.8312 4.688 41.1272 4.728C41.8152 4.824 42.3592 4.96 42.7592 5.136C43.1672 5.304 43.4592 5.516 43.6352 5.772C43.8112 6.028 43.8992 6.344 43.8992 6.72C43.8992 7.136 43.7792 7.488 43.5392 7.776C43.2992 8.064 42.9632 8.284 42.5312 8.436C42.1072 8.588 41.6032 8.664 41.0192 8.664Z"
            fill="black"
          />
        </motion.svg>
      </motion.div>

      {/* 데스크톱 */}
      <motion.header className="fixed top-0 w-full z-50 hidden md:flex mix-blend-difference pointer-events-none">
        <motion.nav className="absolute top-4 left-0 w-full flex gap-4 px-4 pointer-events-auto">
          {/* 1. 로고 */}
          <motion.div className="text-white shrink-0 pr-4 lg:pr-16 xl:pr-64">
            <motion.span className="font-extrabold text-lg">Fellows </motion.span>
            <motion.span className="font-normal text-lg">works</motion.span>
          </motion.div>

          {/* 2+3 묶음 */}
          <motion.div className="flex items-center gap-6 min-w-0">
            {/* 2. 메뉴 */}
            <motion.div className="flex flex-col items-start flex-1 min-w-0">
              {menuItems.map((item) => (
                <a key={item.href} href={item.href} className="text-white text-lg leading-tight select-none">
                  <LetterSwapForward label={item.label} reverse />
                </a>
              ))}
            </motion.div>

            {/* 3. 아이콘 - 메뉴 옆에 바로 */}
            <motion.div className="flex items-center space-x-4 shrink-0 px-1 md:px-4 lg:px-10 xl:px-16 select-none">
              <motion.div className="text-yellow-200 text-5xl md:text-6xl lg:text-7xl animate-spin duration-5000">❋</motion.div>
              <motion.div className="text-yellow-200 text-5xl md:text-6xl lg:text-7xl animate-spin duration-10000">❖</motion.div>
              <motion.div className="text-yellow-200 text-5xl md:text-6xl lg:text-7xl animate-spin duration-15000">✥</motion.div>
            </motion.div>
          </motion.div>

          {/* 4. 맨 끝 */}
          <Link
            href="/#inquery"
            className="relative ml-auto text-4xl self-center !cursor-none"
            onMouseEnter={() =>
              setCursor(
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="text-4xl">
                  👋
                </motion.div>
              )
            }
            onMouseLeave={resetCursor}
          >
            <UnderlineToBackground targetTextColor="#ff0000" className="font-normal text-4xl text-white !cursor-none">
              Contact→
            </UnderlineToBackground>
          </Link>
        </motion.nav>
      </motion.header>

      {/* 모바일 */}
      <motion.header className="fixed top-0 w-full z-50 block md:hidden" style={{ mixBlendMode: isMobileMenuOpen ? "normal" : "difference" }}>
        <motion.div className={`relative w-full flex items-center h-14 justify-between px-4 ${isMobileMenuOpen ? "bg-white text-black" : "text-white"}`}>
          <motion.div className="shrink-0">
            <motion.span className="font-extrabold text-lg">Fellows </motion.span>
            <motion.span className="font-normal text-lg">works</motion.span>
          </motion.div>
          <HamburgerButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} closedColorClass="bg-white" />
        </motion.div>
      </motion.header>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col" variants={menuVariants} initial="closed" animate="open" exit="exit">
            <motion.div className="flex items-center justify-between h-14 px-4">
              <motion.div className="shrink-0 text-black">
                <motion.span className="font-extrabold text-lg">Fellows </motion.span>
                <motion.span className="font-normal text-lg">works</motion.span>
              </motion.div>
              <HamburgerButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} closedColorClass="bg-black" />
            </motion.div>

            <motion.nav className="flex-1 flex flex-col justify-center px-6 space-y-6" variants={containerVariants} initial="closed" animate="open">
              {mobileMenuItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  variants={menuItemVariants}
                  className="text-3xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>

            <motion.div className="p-6">
              <motion.p className="text-sm text-zinc-500 text-center">© 2025 Fellows. All rights reserved.</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
