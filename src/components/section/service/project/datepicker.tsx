"use client";

import { DayPicker, Matcher } from "react-day-picker";
import { ko } from "date-fns/locale";
import classNames from "react-day-picker/style.module.css";

interface DatePickerProps {
  value?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  modifiers?: Record<string, Matcher | Matcher[] | undefined> | undefined;
  disabled?: Matcher | Matcher[] | undefined;
}

export default function DatePicker({ value, onSelect, className, modifiers, disabled }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DayPicker
      animate
      mode="single"
      captionLayout="label"
      navLayout="after"
      locale={ko}
      defaultMonth={value || today}
      selected={value}
      onSelect={onSelect}
      modifiers={modifiers}
      modifiersClassNames={{
        saturday: "text-blue-500",
        sunday: "text-red-500",
        today: "text-green-500 font-bold",
        selected: "text-white bg-primary hover:bg-primary/90 focus:bg-primary/90 border-0 rounded-md",
        lowAvailability: "bg-red-200 hover:bg-red-300 transition-colors duration-300 rounded-md",
        mediumAvailability: "bg-amber-200 hover:bg-amber-300 transition-colors duration-300 rounded-md",
        highAvailability: "bg-emerald-200 hover:bg-emerald-300 transition-colors duration-300 rounded-md",
      }}
      classNames={{
        ...classNames,
        root: `${classNames.root}`,
        day_button: `${classNames.day_button} !font-semibold md:!font-medium`,
        chevron: `${classNames.chevron} !fill-blue-500`,
        month_grid: `${classNames.month_grid} !border-separate !border-spacing-x-0.5 !border-spacing-y-0.5 lg:!border-spacing-x-1.5 lg:!border-spacing-y-1.5`,
        months: `${classNames.months}`,
      }}
      className={className}
      required={false}
      disabled={disabled}
      fixedWeeks
    />
  );
}
