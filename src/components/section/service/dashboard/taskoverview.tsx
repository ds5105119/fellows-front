"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTasks } from "@/hooks/fetch/project";
import { type ERPNextTaskForUser, type ERPNextTaskStatus, erpNextTaskStatusEnum } from "@/@types/service/project";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import dayjs from "@/lib/dayjs";

export const description = "An interactive area chart showing task status over time";

const chartConfig = {
  Open: {
    label: "열림",
    color: "var(--chart-4)",
  },
  Working: {
    label: "진행 중",
    color: "oklch(90.7% 0.231 133)",
  },
  Overdue: {
    label: "지연",
    color: "oklch(66.2% 0.225 25.9)",
  },
  Completed: {
    label: "완료",
    color: "oklch(69.6% 0.165 251)",
  },
  Cancelled: {
    label: "취소",
    color: "oklch(0.86 0.0701 252.53 / 0.6)",
  },
} satisfies ChartConfig;

export function TaskOverviewChart() {
  const [timeRange, setTimeRange] = useState("7");

  // Calculate date range based on selected time range
  const dateRange = useMemo(() => {
    const days = Number.parseInt(timeRange);
    return {
      start: dayjs().subtract(days, "day").toDate(),
      end: dayjs().add(days, "day").toDate(),
    };
  }, [timeRange]);

  const tasks = useTasks(dateRange);

  function transformTasksToStatusByDate(tasks: ERPNextTaskForUser[], timeRange: string) {
    // 전체 날짜 범위 생성
    const days = Number.parseInt(timeRange);
    const startDate = dayjs().subtract(days, "day");
    const endDate = dayjs().add(days, "day");

    // Template을 제외한 상태들만 사용
    const statusOptions = erpNextTaskStatusEnum.options.filter((status) => status !== "Template" && status !== "Pending Review");

    // 모든 날짜에 대해 초기 데이터 구조 생성
    const grouped: Record<string, Record<ERPNextTaskStatus, number>> = {};

    // 날짜 범위 내의 모든 날짜를 0으로 초기화
    for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, "day")) {
      const dateKey = date.format("YYYY-MM-DD");

      // Template을 제외한 status들만 0으로 초기화
      grouped[dateKey] = statusOptions.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {} as Record<ERPNextTaskStatus, number>);
    }

    // 실제 task 데이터로 업데이트 (Template 제외)
    for (const task of tasks) {
      const date = task.exp_start_date ? dayjs(task.exp_start_date).format("YYYY-MM-DD") : null;
      const status = task.status;

      if (!date || !status || !grouped[date] || status === "Template" || status === "Pending Review") continue;

      grouped[date][status] = (grouped[date][status] || 0) + 1;
    }

    // 배열로 변환하고 날짜순 정렬
    const result = Object.entries(grouped)
      .map(([date, statusCounts]) => ({
        date,
        ...statusCounts,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  }

  const chartData = useMemo(() => {
    if (!tasks.data || !tasks.data[0]?.items) {
      // 데이터가 없어도 빈 날짜 범위 생성
      return transformTasksToStatusByDate([], timeRange);
    }
    return transformTasksToStatusByDate(tasks.data[0].items, timeRange);
  }, [tasks.data, timeRange]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 space-y-0 sm:flex-row">
        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={setTimeRange}
          variant="outline"
          className="*:data-[slot=toggle-group-item]:!px-3 !shadow-none !rounded-sm"
        >
          <ToggleGroupItem value="7">일주일 전후</ToggleGroupItem>
          <ToggleGroupItem value="30">한달 전후</ToggleGroupItem>
          <ToggleGroupItem value="90">한분기 전후</ToggleGroupItem>
        </ToggleGroup>

        <div className="text-lg font-bold items-end gap-2 hidden md:flex">
          {dayjs(dateRange.start).format("LL")}
          <span>~</span>
          {dayjs(dateRange.end).format("LL")}
        </div>
      </div>

      <div className="pt-4 sm:pt-6 w-full">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              {erpNextTaskStatusEnum.options.map((status) => (
                <linearGradient key={status} id={`fill${status}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${status})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--color-${status})`} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return dayjs(date).format("MMMM DD");
              }}
            />
            <ChartTooltip
              accessibilityLayer
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {erpNextTaskStatusEnum.options
              .filter((status) => status !== "Template" && status !== "Pending Review")
              .map((status) => (
                <Area
                  key={status}
                  dataKey={status}
                  type="monotone"
                  fill={`url(#fill${status})`}
                  stroke={`var(--color-${status})`}
                  stackId="a"
                  connectNulls={false}
                />
              ))}
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
