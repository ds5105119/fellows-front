"use client";

import React, { createContext, useEffect, useContext, useMemo, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, LayoutGroup, type Variants, type Transition } from "motion/react";

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
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setPos(newPos);
      onPositionChange?.(newPos.x, newPos.y);
    };

    const show = (e: MouseEvent) => {
      updatePosition(e);
      setVisible(true);
    };

    const hide = () => setVisible(false);

    if (attachToParent && cursorRef.current) {
      const parent = cursorRef.current.parentElement;
      if (!parent) return;

      parent.addEventListener("mouseenter", show);
      parent.addEventListener("mouseleave", hide);
      parent.addEventListener("mousemove", updatePosition);

      return () => {
        parent.removeEventListener("mouseenter", show);
        parent.removeEventListener("mouseleave", hide);
        parent.removeEventListener("mousemove", updatePosition);
      };
    }

    // 기본: 전체 문서 추적
    document.addEventListener("mousemove", updatePosition);
    setVisible(true);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
    };
  }, [attachToParent, onPositionChange]);

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed top-0 left-0 z-[1000] hidden md:block ${className}`}
      style={{
        // 마우스 위치 + 중앙 정렬
        transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
        width: 0,
        height: 0,
        overflow: "visible",
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
            {/* 여기 안에 layoutId="cursor"가 들어간 모양들이 들어올 거야 */}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export type CursorPayload = {
  content?: ReactNode;
  variants?: Variants;
  transition?: Transition;
  className?: string; // Cursor wrapper용 클래스
};

type CursorAPI = {
  setCursor: (nodeOrPayload: ReactNode | CursorPayload) => void;
  resetCursor: () => void;
  pushCursor: (payload: CursorPayload) => () => void;
  withCursor: (payload: CursorPayload) => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
};

const CursorCtx = createContext<CursorAPI | null>(null);

export function CursorProvider({
  children,
  attachToParent = false,
  defaultContent,
  defaultVariants,
  defaultTransition,
}: {
  children: ReactNode;
  attachToParent?: boolean;
  defaultContent: ReactNode;
  defaultVariants?: Variants;
  defaultTransition?: Transition;
}) {
  const [state, setState] = useState<CursorPayload>({
    content: defaultContent,
    variants: defaultVariants,
    transition: defaultTransition,
  });

  // 중첩 상태 복구용
  const stackRef = useRef<CursorPayload[]>([]);

  const setCursor = useCallback((nodeOrPayload: ReactNode | CursorPayload) => {
    setState((prev) =>
      typeof nodeOrPayload === "object" && nodeOrPayload !== null && "content" in nodeOrPayload
        ? (nodeOrPayload as CursorPayload)
        : { ...prev, content: nodeOrPayload as ReactNode }
    );
  }, []);

  const resetCursor = useCallback(() => {
    const last = stackRef.current[stackRef.current.length - 1];
    if (last) {
      setState(last);
    } else {
      setState({
        content: defaultContent,
        variants: defaultVariants,
        transition: defaultTransition,
      });
    }
  }, [defaultContent, defaultVariants, defaultTransition]);

  const pushCursor = useCallback(
    (payload: CursorPayload) => {
      setState((prev) => {
        stackRef.current.push(prev);
        return payload;
      });
      // disposer
      return () => {
        stackRef.current.pop();
        resetCursor();
      };
    },
    [resetCursor]
  );

  const withCursor = useCallback(
    (payload: CursorPayload) => {
      let dispose: (() => void) | null = null;
      return {
        onMouseEnter: () => {
          dispose = pushCursor(payload);
        },
        onMouseLeave: () => {
          dispose?.();
          dispose = null;
        },
        onFocus: () => {
          dispose = pushCursor(payload);
        },
        onBlur: () => {
          dispose?.();
          dispose = null;
        },
      };
    },
    [pushCursor]
  );

  const value = useMemo(() => ({ setCursor, resetCursor, pushCursor, withCursor }), [setCursor, resetCursor, pushCursor, withCursor]);

  return (
    <CursorCtx.Provider value={value}>
      {/* layoutId 공유를 위해 LayoutGroup으로 Cursor + children 감싸기 */}
      <LayoutGroup id="global-cursor">
        <Cursor attachToParent={attachToParent} variants={state.variants} transition={state.transition} className={state.className}>
          {state.content}
        </Cursor>
        {children}
      </LayoutGroup>
    </CursorCtx.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorCtx);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}
