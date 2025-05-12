"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export default function GravityBox({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!lenis) return;

    const delta = Math.abs(latest - 0.5);

    if (delta < 0.03) {
      lenis.scrollTo(window.scrollY + delta, {
        duration: 0.7,
      });
    }
  });

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
