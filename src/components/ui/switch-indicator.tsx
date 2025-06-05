// components/ui/switch-indicator.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type SwitchIndicatorProps = {
  checked: boolean;
  className?: string;
};

export function SwitchIndicator({ checked, className }: SwitchIndicatorProps) {
  return (
    <AnimatePresence>
      <div className={clsx("w-9 h-5 rounded-full px-0.5 flex items-center", checked ? "bg-primary" : "bg-neutral-200", className)}>
        <motion.div
          layout
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.45,
          }}
          className="w-4 h-4 rounded-full bg-background drop-shadow"
          style={{
            marginLeft: checked ? "calc(100% - 1rem)" : "0rem",
          }}
        />
      </div>
    </AnimatePresence>
  );
}
