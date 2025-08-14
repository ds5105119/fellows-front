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

  const adjustHeight = () => {
    const textarea = internalRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;

      // 빈 텍스트일 때는 명시적으로 36px로 설정 (사파리 호환성)
      if (!textarea.value.trim()) {
        textarea.style.height = "36px";
        setIsAtMaxHeight(false);
        return;
      }

      // 내용이 있을 때는 scrollHeight 기반으로 계산하되 최소 36px 보장
      const calculatedHeight = Math.max(scrollHeight, 36);

      if (calculatedHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        setIsAtMaxHeight(true);
      } else {
        textarea.style.height = `${calculatedHeight}px`;
        setIsAtMaxHeight(false);
      }
    }
  };

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
          "!max-w-full font-medium border-0 border-b-2 rounded-none shadow-none px-0 focus-visible:ring-0",
          "resize-none whitespace-pre-line break-all transition-all duration-200 ease-in-out",
          "text-base leading-[1.4] py-1.5", // font-size 명시적 지정
          isAtMaxHeight ? "overflow-y-auto" : "overflow-hidden",
          className
        )}
        style={{
          maxHeight: `${maxHeight}px`,
          boxSizing: "border-box",
          minHeight: "36px", // 36px로 변경
          height: "36px", // 초기 높이 명시적 설정
          fontSize: "16px", // 사파리 호환성을 위한 명시적 font-size
          lineHeight: "1.4", // 명시적 line-height
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
