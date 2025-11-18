"use client";

import type React from "react";
import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants, type Transition } from "motion/react";

interface CursorProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  transition?: Transition;
  springConfig?: {
    bounce?: number;
    stiffness?: number;
    damping?: number;
  };
  attachToParent?: boolean;
  onPositionChange?: (x: number, y: number) => void;
}

export const Cursor: React.FC<CursorProps> = ({ children, className = "", variants, transition, springConfig, attachToParent = false, onPositionChange }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent): void => {
      let newPosition = { x: e.pageX, y: e.pageY };

      if (attachToParent && cursorRef.current) {
        const parent = cursorRef.current.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          newPosition = {
            x: e.pageX - parentRect.left - window.scrollX,
            y: e.pageY - parentRect.top - window.scrollY,
          };
        }
      }

      setPosition(newPosition);
      onPositionChange?.(e.clientX, e.clientY); // 콜백은 여전히 절대 좌표 전달
    };

    const handleMouseEnter = (e: MouseEvent): void => {
      updateCursorPosition(e); // 진입 시점의 마우스 위치로 초기화
      setIsVisible(true);
    };

    const handleMouseLeave = (): void => setIsVisible(false);

    if (attachToParent && cursorRef.current) {
      const parent = cursorRef.current.parentElement;
      if (parent) {
        parent.addEventListener("mouseenter", handleMouseEnter);
        parent.addEventListener("mouseleave", handleMouseLeave);
        parent.addEventListener("mousemove", updateCursorPosition);

        return () => {
          parent.removeEventListener("mouseenter", handleMouseEnter);
          parent.removeEventListener("mouseleave", handleMouseLeave);
          parent.removeEventListener("mousemove", updateCursorPosition);
        };
      }
    } else {
      document.addEventListener("mousemove", updateCursorPosition);
      setIsVisible(true);

      return () => {
        document.removeEventListener("mousemove", updateCursorPosition);
      };
    }
  }, [attachToParent, onPositionChange]);

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none z-[1000] hidden md:block ${className}`}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{
              type: "spring",
              ...springConfig,
              ...transition,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
