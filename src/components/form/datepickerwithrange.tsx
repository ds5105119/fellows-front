"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import classNames from "react-day-picker/style.module.css";

interface DatePickerWithRangeProps {
  value?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}

export default function DatePickerWithRange({ value, onSelect, className }: DatePickerWithRangeProps) {
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
    single_selected: (currentCalendarDate: Date): boolean => {
      if (value && value.from && !value.to) {
        const fromDateAtMidnight = new Date(value.from);
        fromDateAtMidnight.setHours(0, 0, 0, 0);

        const calendarDateAtMidnight = new Date(currentCalendarDate);
        calendarDateAtMidnight.setHours(0, 0, 0, 0);

        return calendarDateAtMidnight.getTime() === fromDateAtMidnight.getTime();
      }
      return false;
    },
    saturday: (date: Date) => date.getDay() === 6,
    sunday: (date: Date) => date.getDay() === 0,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number>(1);

  const handleSelect = (range: DateRange | undefined) => {
    onSelect(range);
  };

  useEffect(() => {
    if (isOpen) {
      if (!value?.from) {
        setSelected(1);
      } else if (!value?.to) {
        setSelected(2);
      }
    }
  }, [isOpen, value]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div id="date" className={cn("w-full border-0 h-20 flex space-x-1")}>
            <div
              className={cn(
                "h-full flex-1 flex flex-col justify-center items-start space-y-1 px-6 transition-colors duration-150",
                isOpen && selected === 1 ? "bg-gray-300" : "bg-gray-100",
                value?.from && "bg-primary"
              )}
            >
              <div className={cn("text-sm font-semibold", value?.from ? "text-muted" : "text-muted-foreground")}>시작 예정일</div>
              {value?.from instanceof Date && !isNaN(value.from.getTime()) ? (
                <div className={cn("text-base text-background font-medium")}>{format(value.from, "yyyy. MM. dd.")}</div>
              ) : (
                <div className="text-base text-neutral-500">날짜를 선택하세요</div>
              )}
            </div>
            <div
              className={cn(
                "h-full flex-1 flex flex-col justify-center items-start space-y-1 px-6 transition-colors duration-150",
                isOpen && selected === 2 ? "bg-gray-300" : "bg-gray-100",
                value?.to && "bg-primary"
              )}
            >
              <div className={cn("text-sm font-semibold", value?.to ? "text-muted" : "text-muted-foreground")}>종료 희망일</div>
              {value?.to instanceof Date && !isNaN(value.to.getTime()) ? (
                <div className={cn("text-base text-background font-medium")}>{format(value.to, "yyyy. MM. dd.")}</div>
              ) : (
                <div className="text-base text-neutral-500">날짜를 선택하세요</div>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 rounded-xl" align="center">
          <DayPicker
            animate
            mode="range"
            captionLayout="label"
            navLayout="around"
            locale={ko}
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabledDays}
            modifiers={modifiers}
            modifiersClassNames={{
              saturday: "text-blue-500",
              sunday: "text-red-500",
              today: "text-green-500",
              single_selected: "rounded-md",
              range_start: "rounded-l-md",
              range_end: "rounded-r-md",
              selected: "bg-primary hover:bg-primary/90 focus:bg-primary/90 border-0",
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
