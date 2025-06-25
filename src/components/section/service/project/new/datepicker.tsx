"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import classNames from "react-day-picker/style.module.css";

interface DatePickerProps {
  value?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}

export default function DatePicker({ value, onSelect, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledDays = [
    { before: today },
    (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
  ];

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
      <div className={cn("grid gap-2", className)}>
        <div className="w-full border-0 h-20 flex">
          <div className={cn("h-full flex-1 flex flex-col justify-center items-start space-y-1 px-6 bg-gray-100", value && "bg-primary")}>
            <div className={cn("text-sm font-semibold", value ? "text-muted" : "text-muted-foreground")}>날짜 선택</div>
            <input
              type="date"
              value={formatDateForInput(value)}
              onChange={handleNativeChange}
              min={format(today, "yyyy-MM-dd")}
              className="text-base font-medium bg-transparent border-0 outline-none w-full text-background"
              style={{
                colorScheme: value ? "dark" : "light",
                color: value ? "white" : "#737373",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div id="date" className={cn("w-full border-0 h-20 flex")}>
            <div
              className={cn(
                "h-full flex-1 flex flex-col justify-center items-start space-y-1 px-6 transition-colors duration-150",
                isOpen ? "bg-gray-300" : "bg-gray-100",
                value && "bg-primary"
              )}
            >
              <div className={cn("text-sm font-semibold", value ? "text-muted" : "text-muted-foreground")}>날짜 선택</div>
              {value instanceof Date && !isNaN(value.getTime()) ? (
                <div className={cn("text-base text-background font-medium")}>{format(value, "yyyy. MM. dd.")}</div>
              ) : (
                <div className="text-base text-neutral-500">날짜를 선택하세요</div>
              )}
            </div>
          </div>
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
            disabled={disabledDays}
            modifiers={modifiers}
            modifiersClassNames={{
              saturday: "text-blue-500",
              sunday: "text-red-500",
              today: "text-green-500",
              selected: "bg-primary hover:bg-primary/90 focus:bg-primary/90 border-0 rounded-md",
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
