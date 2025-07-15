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

  // --- 여기부터 수정된 부분 ---

  // 높이 자동 조절 함수
  const adjustHeight = () => {
    const textarea = internalRef.current;
    if (textarea) {
      // 높이를 'auto'로 초기화하여 scrollHeight가 현재 내용에 맞게 정확히 계산되도록 함
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const initialHeight = 40; // TailwindCSS h-10 (40px)과 일치

      if (scrollHeight > maxHeight) {
        // 최대 높이를 초과하면 높이를 고정하고 스크롤을 활성화
        textarea.style.height = `${maxHeight}px`;
        setIsAtMaxHeight(true);
      } else {
        // scrollHeight가 초기 높이보다 작아도 최소 높이(h-10)를 유지
        textarea.style.height = `${Math.max(scrollHeight, initialHeight)}px`;
        setIsAtMaxHeight(false);
      }
    }
  };

  // --- 여기까지 수정된 부분 ---

  // 컴포넌트 마운트 시 및 value prop이 변경될 때 높이 조절
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
        // onInput, onChange에서 모두 호출하여 사용자 입력에 즉시 반응
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
          "!max-w-full font-medium border-0 border-b-2 rounded-none shadow-none px-0 h-10 min-h-10 focus-visible:ring-0",
          "resize-none whitespace-pre-line break-all transition-all duration-200 ease-in-out",
          "leading-normal py-2",
          isAtMaxHeight ? "overflow-y-auto" : "overflow-hidden",
          className
        )}
        style={{
          maxHeight: `${maxHeight}px`,
          boxSizing: "border-box",
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
