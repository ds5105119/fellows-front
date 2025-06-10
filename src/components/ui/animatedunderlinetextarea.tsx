"use client";

import { type ComponentProps, useRef, useEffect, useImperativeHandle, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedUnderlineTextareaProps extends ComponentProps<"textarea"> {
  maxHeight?: number; // 최대 높이 (px)
}

const AnimatedUnderlineTextarea = forwardRef<HTMLTextAreaElement, AnimatedUnderlineTextareaProps>(({ className, maxHeight = 384, ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false);
  const internalRef = useRef<HTMLTextAreaElement>(null);

  // 외부 ref와 내부 ref를 연결
  useImperativeHandle(ref, () => internalRef.current!, []);

  // 높이 자동 조절 함수
  const adjustHeight = () => {
    const textarea = internalRef.current;
    if (textarea) {
      // 초기 높이를 명시적으로 설정 (한 줄 높이와 동일하게)
      const initialHeight = 40; // h-10과 동일한 40px

      textarea.style.height = `${initialHeight}px`;
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight <= maxHeight) {
        // 최대 높이보다 작으면 스크롤바 숨기고 높이 자동 조절
        textarea.style.height = `${Math.max(initialHeight, scrollHeight)}px`;
        setIsAtMaxHeight(false);
      } else {
        // 최대 높이에 도달하면 스크롤바 표시
        textarea.style.height = `${maxHeight}px`;
        setIsAtMaxHeight(true);
      }
    }
  };

  // 컴포넌트 마운트 시 초기 높이 설정
  useEffect(() => {
    adjustHeight();
  }, []);

  // value prop이 변경될 때 높이 조절
  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  return (
    <div className="relative w-full">
      {/* 실제 입력창 */}
      <Textarea
        ref={internalRef}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        onInput={(e) => {
          adjustHeight();
          props.onInput?.(e);
        }}
        onChange={(e) => {
          adjustHeight();
          props.onChange?.(e);
        }}
        wrap="soft"
        className={cn(
          "!max-w-full font-medium border-0 border-b-2 rounded-none shadow-none px-1 h-10 min-h-10 focus-visible:ring-0",
          "resize-none whitespace-pre-line break-all transition-all duration-200 ease-in-out",
          "leading-normal py-2", // 명시적인 padding과 line-height 설정
          isAtMaxHeight ? "overflow-y-auto" : "overflow-hidden",
          className
        )}
        style={{
          maxHeight: `${maxHeight}px`,
          boxSizing: "border-box", // 명시적으로 box-sizing 설정
          ...props.style,
        }}
      />

      {/* 회색 기본 밑줄 */}
      <span className="pointer-events-none absolute left-0 bottom-0 block h-0.5 w-full bg-gray-200" />

      {/* 파란색 애니메이션 밑줄 */}
      <motion.span
        className="pointer-events-none absolute left-0 bottom-0 h-0.5 w-full bg-blue-500"
        style={{ scaleX: 0, originX: 0 }} // origin-left
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.6, duration: 0.2 }}
      />
    </div>
  );
});

AnimatedUnderlineTextarea.displayName = "AnimatedUnderlineTextarea";

export default AnimatedUnderlineTextarea;
