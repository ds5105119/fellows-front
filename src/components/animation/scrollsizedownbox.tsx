"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollSizeDownBox({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const scale = useTransform(scrollYProgress, [0.2, 0.48, 0.52, 0.7], [1, 0.95, 0.95, 0.85]);
  const radius = useTransform(scrollYProgress, [0.2, 0.48, 0.52, 0.7], ["0rem", "1rem", "1rem", "3rem"]);

  return (
    <motion.div ref={ref} style={{ scale, borderRadius: radius }} className={className}>
      {children}
    </motion.div>
  );
}
