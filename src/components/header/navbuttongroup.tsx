"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

interface NavButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export default function NavButtonGroup({ session, ...props }: NavButtonGroupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrolledEnough = scrollY >= windowHeight * 0.03;
      const shortPage = docHeight <= windowHeight * 1.5;

      setIsVisible(scrolledEnough || shortPage);
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <div {...props}>
      <AnimatePresence>
        <motion.div
          key="nav-button-group"
          initial={false}
          animate={{ x: isVisible ? -170 : 0 }}
          exit={{ opacity: 1, x: 170 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex space-x-7 font-bold"
        >
          <Link href="/price" className="hover:opacity-80">
            Price
          </Link>
          <Link href="/works" className="hover:opacity-80">
            Works
          </Link>
          <Link href="/blog" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
            Blog
          </Link>
          <button style={{ cursor: "pointer" }} onClick={() => (session?.user ? signOut() : signIn("keycloak", { redirectTo: "/service/dashboard" }))}>
            {session?.user ? "Sign Out" : "Sign In"}
          </button>
        </motion.div>
        {isVisible && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
            className="absolute right-2.5 px-5 inset-y-2 font-bold text-white bg-black rounded-full flex items-center justify-center hover:bg-neutral-700"
            style={{ cursor: "pointer" }}
          >
            {session?.user ? (
              <Link href="/service/dashboard" className="flex w-full h-full items-center">
                지금 바로 시작하기
              </Link>
            ) : (
              <button
                onClick={() => (session?.user ? signOut() : signIn("keycloak", { redirectTo: "/service/project/new" }))}
                className="flex w-full h-full items-center"
              >
                지금 바로 시작하기
              </button>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
