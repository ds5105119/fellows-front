/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * 엑센트 버튼
 */
"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { VariantProps } from "class-variance-authority";

interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  href?: string;
}

export default function AccentButton({ href, size, variant, children, ...props }: AccentButtonProps & VariantProps<typeof buttonVariants>) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative inline-flex group">
      {/* button */}
      {href ? (
        <Link href={href}>
          <Button
            variant={variant}
            size={size}
            {...props}
            className={`relative z-10 rounded-full bg-linear-to-r/oklab from-sky-500 to-blue-500 font-bold ${props.className}`}
          >
            {children}
          </Button>
        </Link>
      ) : (
        <Button
          variant={variant}
          size={size}
          {...props}
          className={`relative z-1 rounded-full bg-linear-to-r/oklab from-sky-500 to-blue-500 font-bold ${props.className}`}
        >
          {children}
        </Button>
      )}

      {/* glow background */}
      <div className="absolute -inset-1 z-0 rounded-full blur-sm opacity-60 bg-linear-to-r/oklab from-sky-500 to-blue-500 group-hover:opacity-85" />
    </motion.div>
  );
}
