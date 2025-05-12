"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  value?: DateRange;
  onSelect: (range: DateRange) => void;
  className?: string;
}

export default function DatePickerWithRange({ value, onSelect, className }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number>(1);
  const [internal, setInternal] = useState<DateRange | undefined>(value);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;
    setInternal(range);
    onSelect(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div id="date" className={cn("w-full border-0 h-20 flex space-x-1")}>
            <div
              className={cn(
                "h-full flex-1 flex flex-col justify-center items-start space-y-1 px-6 transition-colors duration-150",
                isOpen && selected === 1 ? "bg-gray-300" : "bg-gray-100",
                internal?.from && "bg-primary"
              )}
              onClick={() => setSelected(1)}
            >
              <div className={cn("text-sm font-semibold", internal?.from ? "text-muted" : "text-muted-foreground")}>시작 예정일</div>
              {internal?.from ? (
                <div className={cn("text-base text-background font-medium")}>{format(internal.from, "yyyy. MM. dd.")}</div>
              ) : (
                <div className="text-base text-neutral-500">날짜를 선택하세요</div>
              )}
            </div>
            <div
              className={cn(
                "h-full flex-1 flex flex-col justify-center items-start space-y-1 px-6 transition-colors duration-150",
                isOpen && selected === 2 ? "bg-gray-300" : "bg-gray-100",
                internal?.to && "bg-primary"
              )}
              onClick={() => setSelected(2)}
            >
              <div className={cn("text-sm font-semibold", internal?.to ? "text-muted" : "text-muted-foreground")}>종료 희망일</div>
              {internal?.to ? (
                <div className={cn("text-base text-background font-medium")}>{format(internal.to, "yyyy. MM. dd.")}</div>
              ) : (
                <div className="text-base text-neutral-500">날짜를 선택하세요</div>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 rounded-xl" align="center">
          <Calendar mode="range" defaultMonth={internal?.from} selected={internal} onSelect={handleSelect} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
