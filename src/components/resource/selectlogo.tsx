"use client";

import Image from "next/image";
import Link from "next/link";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Copyright, ScanText } from "lucide-react";
import { motion } from "framer-motion";

export default function SelectLogo({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const handleCopySVGLogo = async () => {
    try {
      const res = await fetch("/fellows/logo.svg");
      const svgText = await res.text();
      await navigator.clipboard.writeText(svgText);
      console.log("SVG copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  };

  return (
    <div {...props}>
      <ContextMenu>
        <ContextMenuTrigger className="grow px-2">
          <Link href="/" className="flex space-x-2 group">
            <Image
              src="/fellows/logo-img.svg"
              width={20}
              height={20}
              alt="image logo"
              className="transition-transform duration-500 transform group-hover:rotate-y-180"
            />
            <Image src="/fellows/logo-text.svg" width={91} height={20} alt="text logo" />
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className="rounded-2xl px-2.5 py-2.5 space-y-1 font-semibold w-fit" asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 1.08 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <ContextMenuItem className="text-md" onClick={handleCopySVGLogo}>
              <ScanText strokeWidth={3} className="text-foreground !size-5" />
              SVG로 로고 복사하기
            </ContextMenuItem>
            <ContextMenuItem className="text-md">
              <Copyright strokeWidth={3} className="text-foreground !size-5" />
              Design By IIH
            </ContextMenuItem>
          </motion.div>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
