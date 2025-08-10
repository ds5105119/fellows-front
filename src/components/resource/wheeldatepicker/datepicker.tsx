"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InertiaWheel, { type InertiaItem } from "./inertia-wheel";

function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

type Precision = "year" | "month" | "day";

type DatePickerProps = {
  startDate?: Date;
  minDate?: Date;
  maxDate?: Date; // 이후부터 안되는 날짜(limit after)
  precision?: Precision; // "year" | "month" | "day"
  onChange?: (date: Date) => void;
};

export default function WheelDatePicker({ startDate, minDate, maxDate, precision = "day", onChange }: DatePickerProps) {
  const now = new Date();
  const init = startDate ?? now;

  const minYear = minDate ? minDate.getFullYear() : 1900;
  const maxYear = maxDate ? maxDate.getFullYear() : 2100;

  const [year, setYear] = React.useState(init.getFullYear());
  const [month, setMonth] = React.useState(init.getMonth() + 1); // 1..12
  const [day, setDay] = React.useState(init.getDate());
  const [open, setOpen] = React.useState<{ year: boolean; month: boolean; day: boolean }>({
    year: false,
    month: false,
    day: false,
  });

  React.useEffect(() => {
    // min/max 변경 시 연도 클램프
    setYear((prev) => Math.max(minYear, Math.min(maxYear, prev)));
  }, [minYear, maxYear]);

  // Helpers
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const isMonthDisabled = React.useCallback(
    (y: number, m: number) => {
      if (minDate && y === minDate.getFullYear() && m < minDate.getMonth() + 1) return true;
      if (maxDate && y === maxDate.getFullYear() && m > maxDate.getMonth() + 1) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const nearestEnabledMonthValue = React.useCallback(
    (y: number, m: number) => {
      if (!isMonthDisabled(y, m)) return m;
      for (let d = 1; d < 12; d++) {
        const down = m - d;
        const up = m + d;
        if (down >= 1 && !isMonthDisabled(y, down)) return down;
        if (up <= 12 && !isMonthDisabled(y, up)) return up;
      }
      const minM = minDate && y === minDate.getFullYear() ? minDate.getMonth() + 1 : 1;
      const maxM = maxDate && y === maxDate.getFullYear() ? maxDate.getMonth() + 1 : 12;
      return clamp(m, minM, maxM);
    },
    [isMonthDisabled, minDate, maxDate]
  );

  const clampDayToBounds = React.useCallback(
    (y: number, m: number, d: number) => {
      const total = daysInMonth(y, m);
      const minDay = minDate && y === minDate.getFullYear() && m === minDate.getMonth() + 1 ? minDate.getDate() : 1;
      const maxDay = maxDate && y === maxDate.getFullYear() && m === maxDate.getMonth() + 1 ? Math.min(total, maxDate.getDate()) : total;
      return clamp(d, minDay, maxDay);
    },
    [minDate, maxDate]
  );

  // Items
  const yearItems: InertiaItem[] = React.useMemo(() => {
    const arr: InertiaItem[] = [];
    for (let y = minYear; y <= maxYear; y++) arr.push({ value: y, label: `${y}년` });
    return arr;
  }, [minYear, maxYear]);

  const monthItems: InertiaItem[] = React.useMemo(() => {
    const arr: InertiaItem[] = [];
    for (let m = 1; m <= 12; m++) {
      arr.push({ value: m, label: `${m}월`, disabled: isMonthDisabled(year, m) });
    }
    return arr;
  }, [year, isMonthDisabled]);

  const dayItems: InertiaItem[] = React.useMemo(() => {
    const total = daysInMonth(year, month);
    const arr: InertiaItem[] = [];
    for (let d = 1; d <= total; d++) {
      const cur = new Date(year, month - 1, d);
      const curDay = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
      const minDay = minDate && new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      const maxDay = maxDate && new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      let disabled = false;
      if (minDay && curDay < minDay) disabled = true;
      if (maxDay && curDay > maxDay) disabled = true;
      arr.push({ value: d, label: `${d}일`, disabled });
    }
    return arr;
  }, [year, month, minDate, maxDate]);

  // Respond to year changes: adjust month/day as needed under precision
  React.useEffect(() => {
    const fixedMonth = nearestEnabledMonthValue(year, month);
    if (fixedMonth !== month) setMonth(fixedMonth);

    if (precision === "year") {
      const nextDay = clampDayToBounds(year, fixedMonth, 1);
      if (nextDay !== day) setDay(nextDay);
    } else {
      const nextDay = clampDayToBounds(year, fixedMonth, day);
      if (nextDay !== day) setDay(nextDay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, precision]);

  // Respond to month changes: clamp day appropriately
  React.useEffect(() => {
    const nextDay = precision === "month" ? clampDayToBounds(year, month, 1) : clampDayToBounds(year, month, day);
    if (nextDay !== day) setDay(nextDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, precision]);

  const selectedDate = React.useMemo(() => new Date(year, month - 1, day), [year, month, day]);

  React.useEffect(() => {
    onChange?.(selectedDate);
  }, [selectedDate, onChange]);

  const showYear = true;
  const showMonth = precision === "month" || precision === "day";
  const showDay = precision === "day";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Year - InertiaWheel */}
      {showYear && (
        <Popover open={open.year} onOpenChange={(v) => setOpen((s) => ({ ...s, year: v }))}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 w-full justify-between gap-2 rounded-xl border-neutral-200 bg-white/90 px-4 text-base font-medium text-neutral-900 shadow-[0_1px_0_rgba(255,255,255,0.6)] transition-colors hover:bg-white/100 sm:w-auto"
              aria-label="년도 선택"
            >
              <span className="flex items-center gap-2">
                <span className="text-neutral-500">년</span>
                <span>{year}</span>
              </span>
              <ChevronDown className="size-4 text-neutral-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[240px] rounded-2xl border border-black/10 bg-white/80 p-3 backdrop-blur-md overscroll-none overflow-hidden"
          >
            <div className="px-1 pb-2 text-sm font-medium text-neutral-500">년도 선택 (드래그/스크롤)</div>
            <InertiaWheel items={yearItems} value={year} onChange={(y) => setYear(y)} height={220} itemHeight={44} aria-label="년도 선택" active={open.year} />
          </PopoverContent>
        </Popover>
      )}

      {/* Month - InertiaWheel */}
      {showMonth && (
        <Popover open={open.month} onOpenChange={(v) => setOpen((s) => ({ ...s, month: v }))}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 w-full justify-between gap-2 rounded-xl border-neutral-200 bg-white/90 px-4 text-base font-medium text-neutral-900 shadow-[0_1px_0_rgba(255,255,255,0.6)] transition-colors hover:bg-white/100 sm:w-auto"
              aria-label="월 선택"
            >
              <span className="flex items-center gap-2">
                <span className="text-neutral-500">월</span>
                <span>{month}월</span>
              </span>
              <ChevronDown className="size-4 text-neutral-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[220px] rounded-2xl border border-black/10 bg-white/80 p-3 backdrop-blur-md overscroll-none overflow-hidden"
          >
            <div className="px-1 pb-2 text-sm font-medium text-neutral-500">월 선택 (드래그/스크롤)</div>
            <InertiaWheel
              items={monthItems}
              value={month}
              onChange={(m) => setMonth(m)}
              height={220}
              itemHeight={44}
              aria-label="월 선택"
              active={open.month}
            />
          </PopoverContent>
        </Popover>
      )}

      {/* Day - InertiaWheel */}
      {showDay && (
        <Popover open={open.day} onOpenChange={(v) => setOpen((s) => ({ ...s, day: v }))}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 w-full justify-between gap-2 rounded-xl border-neutral-200 bg-white/90 px-4 text-base font-medium text-neutral-900 shadow-[0_1px_0_rgba(255,255,255,0.6)] transition-colors hover:bg-white/100 sm:w-auto"
              aria-label="일 선택"
            >
              <span className="flex items-center gap-2">
                <span className="text-neutral-500">일</span>
                <span>{day}일</span>
              </span>
              <ChevronDown className="size-4 text-neutral-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[220px] rounded-2xl border border-black/10 bg-white/80 p-3 backdrop-blur-md overscroll-none overflow-hidden"
          >
            <div className="px-1 pb-2 text-sm font-medium text-neutral-500">일 선택 (드래그/스크롤)</div>
            <InertiaWheel items={dayItems} value={day} onChange={(d) => setDay(d)} height={220} itemHeight={44} aria-label="일 선택" active={open.day} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
