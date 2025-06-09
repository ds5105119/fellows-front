"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  type ReactElement,
  type ReactNode,
  useRef,
  useEffect,
  useState,
  useCallback, // ✅
  useLayoutEffect, // ✅
} from "react";

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

  // refs 배열 길이 맞추기
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs.length]);

  /** 🔧  메모이즈된 인디케이터 위치 계산 함수 */
  const updateIndicator = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (!activeEl || !container) return;

    const { left: cLeft } = container.getBoundingClientRect();
    const { left, width } = activeEl.getBoundingClientRect();

    setIndicatorStyle((prev) =>
      prev.left === left - cLeft && prev.width === width
        ? prev // 값이 같으면 setState 생략
        : { left: left - cLeft, width }
    );
  }, [activeTab]); // ← activeTab 바뀔 때만 새 함수

  /* 활성 탭이 바뀌면 즉시 계산 (레이아웃 깜빡임 방지) */
  useLayoutEffect(updateIndicator, [updateIndicator]);

  /* 탭 배열이 바뀌면 한 프레임 뒤에 계산 */
  useEffect(() => {
    const id = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(id);
  }, [tabs, updateIndicator]);

  /* 윈도 크기 변경에 대응 */
  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <div ref={containerRef} className="relative flex space-x-1 border-b px-2 overflow-x-auto">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          ref={(el) => {
            tabRefs.current[idx] = el;
          }}
          className={cn(
            "relative px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap outline-none",
            activeTab === idx ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => handleTabChange(idx)}
        >
          {tab}
        </button>
      ))}

      <motion.div
        className="absolute bottom-0 h-0.5 bg-blue-500"
        animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        transition={springTransition}
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
    </div>
  );
}
