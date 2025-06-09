"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactElement, type ReactNode, useRef, useEffect, useState } from "react";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 0.6,
};

type TabInput = string | ReactElement<{ value: string; children?: ReactNode }>;

interface FlattabsProps {
  tabs: TabInput[];
  activeTab: number;
  handleTabChange: (tabIdentifier: number) => void;
}

export default function Flattabs({ tabs, activeTab, handleTabChange }: FlattabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 초기화 시 refs 배열 크기 설정
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs.length]);

  const updateIndicator = () => {
    const activeTabElement = tabRefs.current[activeTab];
    const container = containerRef.current;

    if (activeTabElement && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [activeTab, updateIndicator]);

  useEffect(() => {
    // 탭 내용이 변경될 때도 업데이트
    const timeoutId = setTimeout(updateIndicator, 0);
    return () => clearTimeout(timeoutId);
  }, [tabs]);

  // 윈도우 크기 변경 시 업데이트
  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, []);

  return (
    <div ref={containerRef} className="relative flex space-x-1 border-b px-2">
      {tabs.map((tab, idx) => {
        return (
          <button
            key={idx}
            ref={(el) => {
              // void 반환을 명시적으로 표시
              tabRefs.current[idx] = el;
            }}
            className={cn(
              "relative px-3 py-2.5 text-sm font-medium transition-colors outline-none whitespace-nowrap",
              activeTab === idx ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange(idx)}
          >
            {tab}
          </button>
        );
      })}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-blue-500"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={springTransition}
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  );
}
