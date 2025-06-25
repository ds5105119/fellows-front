"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import classNames from "react-day-picker/style.module.css";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  value?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  text?: string;
}

export default function DatePicker({ value, text, onSelect, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const modifiers = {
    saturday: (date: Date) => date.getDay() === 6,
    sunday: (date: Date) => date.getDay() === 0,
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    if (date) {
      setIsOpen(false);
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const selectedDate = new Date(dateValue);
      onSelect(selectedDate);
    } else {
      onSelect(undefined);
    }
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return format(date, "yyyy-MM-dd");
  };

  if (isMobile) {
    return (
      <div className={cn("relative flex", className)}>
        {/* label로 버튼 전체를 감싸기 */}
        <label htmlFor="date" className="absolute inset-0 z-10 cursor-pointer">
          {/* 완전히 투명한 input이 아니라, label이 클릭을 input에 전달함 */}
        </label>

        <input
          id="date"
          type="date"
          value={formatDateForInput(value)}
          onChange={handleNativeChange}
          className="absolute opacity-0" // 접근성 지키면서 완전히 숨김
        />

        <Button variant="secondary" size="sm" className="shadow-none w-full pointer-events-none">
          {text && <span className="text-sm text-muted-foreground font-semibold">{text}</span>}
          <span className="text-sm text-foreground font-medium">{formatDateForInput(value)}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button id="date" variant="secondary" size="sm">
            {text && <span className="text-sm text-muted-foreground font-semibold">{text}</span>}
            {value instanceof Date && !isNaN(value.getTime()) ? (
              <div className={cn("text-sm text-foreground font-medium")}>{format(value, "yyyy. MM. dd.")}</div>
            ) : (
              <div className="text-sm text-neutral-500">날짜를 선택하세요</div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 rounded-xl" align="center">
          <DayPicker
            animate
            mode="single"
            captionLayout="label"
            navLayout="around"
            locale={ko}
            defaultMonth={value || today}
            selected={value}
            onSelect={handleSelect}
            modifiers={modifiers}
            modifiersClassNames={{
              saturday: "text-blue-500",
              sunday: "text-red-500",
              today: "text-green-500",
              selected: "text-white bg-primary hover:bg-primary/90 focus:bg-primary/90 border-0 rounded-md",
            }}
            classNames={{
              ...classNames,
            }}
            required={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
