"use client";

import React, { createContext, useContext, useMemo, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Variants, Transition } from "motion/react";
import { Cursor } from "@/components/ui/cursor";

type CursorPayload = {
  content?: ReactNode;
  variants?: Variants;
  transition?: Transition;
  className?: string;
};

type CursorAPI = {
  /** 즉시 치환 */
  setCursor: (nodeOrPayload: ReactNode | CursorPayload) => void;
  /** 원상복구 */
  resetCursor: () => void;
  /** 중첩 진입/이탈 관리 (hover-in 시 push, leave 시 disposer 호출) */
  pushCursor: (payload: CursorPayload) => () => void;
  /** hover/focus 바인딩 헬퍼 */
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
      typeof nodeOrPayload === "object" && nodeOrPayload && "content" in nodeOrPayload
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
      {/* 실제 커서 렌더: 네가 만든 Cursor 컴포넌트를 그대로 사용 */}
      <Cursor attachToParent={attachToParent} variants={state.variants} transition={state.transition}>
        {state.content}
      </Cursor>
      {children}
    </CursorCtx.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorCtx);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}
