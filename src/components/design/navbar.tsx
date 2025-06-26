"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 100);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <>
      {/* Fixed Navigation Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-black"
        animate={{
          height: isScrolled ? "80px" : "280px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div className="h-full flex">
          {/* Left Side - Logo */}
          <motion.h1
            className="font-bold text-gray-900 flex items-center justify-start border-r border-black"
            animate={{
              width: isScrolled ? "172px" : "50%",
              fontSize: isScrolled ? "48px" : "294px",
              letterSpacing: isScrolled ? "-0.25rem" : "-2rem",
              marginLeft: isScrolled ? "24px" : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            Fellows
          </motion.h1>

          {/* Right Side */}
          <div className="flex flex-col justify-between flex-1">
            {/* Top Navigation Menu */}
            <motion.nav className="flex items-center justify-start space-x-6 px-6 text-gray-700 h-[80px]">
              <a href="#about" className="hover:text-gray-900 transition-colors text-2xl font-semibold">
                about
              </a>
              <a href="#work" className="hover:text-gray-900 transition-colors flex items-center text-2xl font-semibold">
                work
                <span className="ml-1 text-xs text-gray-500">(10)</span>
              </a>
              <a href="#blog" className="hover:text-gray-900 transition-colors text-2xl font-semibold">
                blog
              </a>
              <a href="#contact" className="hover:text-gray-900 transition-colors text-2xl font-semibold">
                contact
              </a>
            </motion.nav>

            {/* Catchphrase - Only visible when not scrolled */}
            <motion.div
              className="flex flex-col justify-between border-t border-black"
              animate={{
                height: isScrolled ? "0px" : "200px",
                opacity: isScrolled ? 0 : 1,
                padding: isScrolled ? 0 : "24px",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-2xl font-normal text-gray-900 leading-tight mb-8">Distinctive website solutions for leading and rising companies</h2>

              <div className="flex items-center space-x-4">
                <div className="border border-gray-300 px-4 py-2 text-xs text-gray-600 text-center">
                  DESIGNED
                  <br />
                  BY IIH
                </div>
                <div className="text-2xl font-light text-gray-900">©2025</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
}
