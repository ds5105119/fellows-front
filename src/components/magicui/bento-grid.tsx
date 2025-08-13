"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Cursor } from "@/components/resource/cursor";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "lucide-react";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"a"> {
  name: string;
  className: string;
  background: ReactNode;
  description: ReactNode | string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] lg:auto-rows-[24rem] grid-cols-3 gap-4 lg:gap-8", className)} {...props}>
      {children}
    </div>
  );
};

const BentoCard = ({ name, className, background, description, href, cta, ...props }: BentoCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const handlePositionChange = (x: number, y: number) => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      setIsHovering(isInside);
    }
  };

  return (
    <div
      className={cn(
        "relative group col-span-3 rounded-2xl lg:rounded-3xl hover:drop-shadow-2xl drop-shadow-black/10 transition-shadow transform-gpu duration-300",
        className
      )}
      ref={targetRef}
    >
      <Cursor
        attachToParent
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{
          bounce: 0.001,
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.15,
        }}
        onPositionChange={handlePositionChange}
      >
        <motion.div
          animate={{
            width: isHovering ? 80 : 16,
            height: isHovering ? 32 : 16,
          }}
          className="flex items-center justify-center rounded-[24px] bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40"
        >
          <AnimatePresence>
            {isHovering ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="inline-flex w-full items-center justify-center"
              >
                <div className="inline-flex items-center text-sm text-white dark:text-black">
                  More <PlusIcon className="ml-1 h-4 w-4" />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Cursor>
      <a key={name} className={cn("group absolute inset-0 flex flex-col justify-between overflow-hidden", "cursor-none")} href={href} {...props}>
        <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-6 lg:p-10 transition-all">
          <div className="max-w-lg text-base md:text-lg font-semibold text-foreground whitespace-pre-wrap block">{description}</div>
          <h3 className="text-xl lg:text-[26px] font-extrabold text-foreground whitespace-pre-wrap dark:text-neutral-300">{name}</h3>
        </div>
        <div>{background}</div>
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 hidden lg:flex w-full translate-y-10 transform-gpu flex-row items-center p-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          )}
        >
          <div className="pointer-events-auto text-blue-500 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
            {cta}
            <ChevronRight className="ms-1 h-4 w-4 rtl:rotate-180" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:hover:bg-white/10 group-hover:dark:bg-neutral-800/10" />
      </a>
    </div>
  );
};

export { BentoCard, BentoGrid };
