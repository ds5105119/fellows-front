"use client";

import { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

const AnimatedUnderlineInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(({ className, ...props }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      {/* 실제 입력창 */}
      <Input
        ref={ref}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={cn("font-medium border-0 border-b-2 rounded-none shadow-none px-0 h-10 focus-visible:ring-0", className)}
      />

      {/* 회색 기본 밑줄 */}
      <span className="pointer-events-none absolute left-0 bottom-0 block h-0.5 w-full bg-gray-200" />

      {/* 파란색 애니메이션 밑줄 */}
      <motion.span
        className="pointer-events-none absolute left-0 bottom-0 h-0.5 w-full bg-blue-500"
        style={{ scaleX: 0, originX: 0 }} // origin-left
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.6, duration: 0.2 }}
      />
    </div>
  );
});
AnimatedUnderlineInput.displayName = "AnimatedUnderlineInput";

export default AnimatedUnderlineInput;
