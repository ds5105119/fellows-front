"use client";

import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import classNames from "react-day-picker/style.module.css";
import { useQuoteSlots } from "@/hooks/fetch/project";
import dayjs from "@/lib/dayjs";

interface DatePickerProps {
  value?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  text?: string;
}

export default function DatePicker({ value, onSelect, className }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const swr = useQuoteSlots();
  const availabilityData = swr.data || [];

  // 가용량 데이터를 Map으로 변환하여 빠른 조회 가능
  const availabilityMap = new Map(availabilityData.map((item) => [item.date, item.remaining]));

  // 예약 불가능한 날짜들 (가용량이 0이거나 데이터에 없는 날짜)
  const getAvailability = (date: Date) => {
    const dateString = dayjs(date).format("YYYY-MM-DD"); // ← 한국 시간 기준 문자열
    return Number(availabilityMap.get(dateString)) || 0;
  };

  const modifiers = {
    saturday: (date: Date) => date.getDay() === 6,
    sunday: (date: Date) => date.getDay() === 0,
    available: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 0;
    },
    lowAvailability: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 0 && availability <= 33;
    },
    mediumAvailability: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 33 && availability <= 66;
    },
    highAvailability: (date: Date) => {
      const availability = getAvailability(date);
      return availability > 66;
    },
    unavailable: (date: Date) => {
      const availability = getAvailability(date);
      return availability === 0;
    },
  };

  const handleSelect = (date: Date | undefined) => {
    if (date && getAvailability(date) > 0) {
      if (onSelect) onSelect(date);
    } else if (typeof date === "undefined") {
      if (onSelect) onSelect(date);
    }
  };

  return (
    <DayPicker
      animate
      mode="single"
      captionLayout="label"
      navLayout="after"
      locale={ko}
      defaultMonth={value || today}
      selected={value}
      onSelect={handleSelect}
      modifiers={modifiers}
      modifiersClassNames={{
        saturday: "text-blue-500",
        sunday: "text-red-500",
        today: "text-green-500 font-bold",
        selected: "text-white bg-primary hover:bg-primary/90 focus:bg-primary/90 border-0 rounded-md",
        lowAvailability: "bg-red-200 hover:bg-red-300 transition-colors duration-300 rounded-md",
        mediumAvailability: "bg-amber-200 hover:bg-amber-300 transition-colors duration-300 rounded-md",
        highAvailability: "bg-emerald-200 hover:bg-emerald-300 transition-colors duration-300 rounded-md",
        unavailable: "unavailable",
      }}
      classNames={{
        ...classNames,
        root: `${classNames.root}`,
        day_button: `${classNames.day_button} !font-semibold md:!font-medium`,
        chevron: `${classNames.chevron} !fill-blue-500`,
        month_grid: `${classNames.month_grid} !border-separate !border-spacing-x-1.5 !border-spacing-y-1.5`,
        months: `${classNames.months}`,
      }}
      className={className}
      required={false}
      disabled={(date) => getAvailability(date) === 0}
      fixedWeeks
    />
  );
}
