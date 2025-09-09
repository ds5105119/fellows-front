"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ProgressiveBlur } from "@/components/ui/motion-primitives/progressive-blur";
import { HelpRead } from "@/@types/service/help";

interface HelpCardProps {
  help: HelpRead;
}

export function HelpCard({ help }: HelpCardProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link href={`/help/${help.id}`} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <div className="relative overflow-hidden" style={{ borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem" }}>
        <AspectRatio ratio={16 / 9}>
          <Image src={help.title_image || "/placeholder.svg"} alt={help.title} className="object-cover" fill />
        </AspectRatio>
        <div className="absolute inset-0">
          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 left-0 w-full h-full"
            blurIntensity={0.5}
            animate={isHover ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0"
            animate={isHover ? "visible" : "hidden"}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-col items-start gap-0 px-4 py-4">
              <p className="text-sm font-medium text-zinc-300 line-clamp-2">{help.content != "" ? help.content : "설명이 없습니다."}</p>
            </div>
          </motion.div>
        </div>
      </div>
      <div
        className="p-4 w-full shrink-0 flex flex-col space-y-1.5 border-b border-l border-r overflow-hidden"
        style={{ borderBottomLeftRadius: "0.75rem", borderBottomRightRadius: "0.75rem" }}
      >
        <p className="text-base font-bold line-clamp-1">{help.title}</p>
        <p className="text-sm font-semibold text-muted-foreground line-clamp-2">{help.summary}</p>
      </div>
    </Link>
  );
}
