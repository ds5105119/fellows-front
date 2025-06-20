"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";

export default function MobileHeader({ session }: { session: Session | null }) {
  const navRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Pricing", href: "#" },
    { name: "Works", href: "/works" },
    { name: "Blog", href: "/blog" },
  ];

  const BORDER_RADIUS = "28px";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-50 min-md:hidden">
      {/* Expandable Navigation Bar with Fixed Border Radius */}
      <motion.nav
        ref={navRef}
        className="absolute left-1/2 top-3 z-10 w-[calc(100%-24px)] -translate-x-1/2 overflow-hidden bg-[hsla(0,0%,93%,0.42)]"
        initial={false}
        animate={{
          height: isOpen ? "auto" : "3.5rem", // 3.5rem = h-14
          transition: {
            height: {
              type: "spring",
              stiffness: 400,
              damping: 30,
            },
          },
        }}
        style={{
          borderRadius: BORDER_RADIUS,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* Header Section (Always Visible) */}
        <div className="flex items-center justify-between h-14 px-7">
          {/* Logo */}
          <Link href="/" className="flex space-x-2 group">
            <Image
              src="/fellows/logo-img.svg"
              width={18}
              height={18}
              alt="image logo"
              className="transition-transform duration-500 transform group-hover:rotate-y-180"
            />
            <Image src="/fellows/logo-text.svg" width={80} height={18} alt="text logo" />
          </Link>

          {/* Right side controls */}
          <motion.button onClick={toggleNav} className="p-2 rounded-full hover:bg-white/20 transition-colors" whileTap={{ scale: 0.9 }}>
            <AnimatePresence initial={false} mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Expandable Menu Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="pb-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  opacity: 1,
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.05,
                  },
                },
                hidden: {
                  opacity: 0,
                  transition: {
                    when: "afterChildren",
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
            >
              {/* Navigation Links */}
              <div className="grid grid-cols-1 gap-4 mb-5 pt-2 px-7">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-lg font-semibold text-gray-800 hover:text-black transition-colors"
                    variants={{
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          y: { type: "spring", stiffness: 300, damping: 24 },
                          opacity: { duration: 0.2 },
                        },
                      },
                      hidden: {
                        y: 20,
                        opacity: 0,
                        transition: {
                          y: { duration: 0.2 },
                          opacity: { duration: 0.2 },
                        },
                      },
                    }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.button
                  onClick={() => (session?.user ? signOut() : signIn("keycloak", { redirectTo: "/service/dashboard" }))}
                  className="text-lg text-left font-semibold text-gray-800 hover:text-black transition-colors"
                  variants={{
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        y: { type: "spring", stiffness: 300, damping: 24 },
                        opacity: { duration: 0.2 },
                      },
                    },
                    hidden: {
                      y: 20,
                      opacity: 0,
                      transition: {
                        y: { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      },
                    },
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {session?.user ? "Sign Out" : "Sign In"}
                </motion.button>
              </div>

              {/* Buttons Section */}
              <motion.div
                className="flex px-6"
                variants={{
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.1,
                      y: { type: "spring", stiffness: 300, damping: 24 },
                      opacity: { duration: 0.2 },
                    },
                  },
                  hidden: {
                    y: 20,
                    opacity: 0,
                    transition: {
                      y: { duration: 0.2 },
                      opacity: { duration: 0.2 },
                    },
                  },
                }}
              >
                {/* Login Button */}
                <button className="flex items-center gap-x-2 px-5 py-2.5 rounded-full bg-black text-white font-semibold w-fit">
                  <span>지금 바로 시작하기 ✨</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
