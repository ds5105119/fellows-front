"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { ReactElement, ReactNode } from "react";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

type TabInput = string | ReactElement<{ value: string; children?: ReactNode }>;

interface FlattabsProps {
  tabs: TabInput[];
  activeTab: number;
  handleTabChange: (tabIdentifier: number) => void;
  layoutId: string;
}

export default function Flattabs({ tabs, activeTab, handleTabChange, layoutId }: FlattabsProps) {
  return (
    <div className="relative flex space-x-1 border-b px-2">
      {tabs.map((tab, idx) => {
        return (
          <motion.button
            key={idx}
            className={cn(
              "relative px-3 py-2.5 text-sm font-medium transition-colors outline-none",
              activeTab === idx ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange(idx)}
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 1.0 }}
          >
            {tab}
            {activeTab === idx && (
              <motion.div layoutId={layoutId} className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" transition={springTransition} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
