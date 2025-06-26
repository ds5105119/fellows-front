"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from "@/hooks/fetch/project";
import dayjs from "@/lib/dayjs";
import { type ERPNextTaskForUser, type ERPNextTaskStatus, erpNextTaskStatusEnum } from "@/@types/service/project";
import { useMemo, useState } from "react";

export const description = "An interactive area chart showing task status over time";

const chartConfig = {
  Open: {
    label: "Open",
    color: "var(--chart-1)",
  },
  Working: {
    label: "Working",
    color: "var(--chart-2)",
  },
  Overdue: {
    label: "Overdue",
    color: "var(--chart-3)",
  },
  Completed: {
    label: "Completed",
    color: "var(--chart-4)",
  },
  Cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function TaskOverviewChart() {
  const [timeRange, setTimeRange] = useState("7");

  // Calculate date range based on selected time range
  const dateRange = useMemo(() => {
    const days = Number.parseInt(timeRange);
    return {
      start: dayjs().subtract(days, "day").toDate(),
      end: dayjs().add(10, "day").toDate(),
    };
  }, [timeRange]);

  const tasks = useTasks(dateRange);

  function transformTasksToStatusByDate(tasks: ERPNextTaskForUser[], timeRange: string) {
    // 전체 날짜 범위 생성
    const days = Number.parseInt(timeRange);
    const startDate = dayjs().subtract(days, "day");
    const endDate = dayjs();

    // 모든 날짜에 대해 초기 데이터 구조 생성
    const grouped: Record<string, Record<ERPNextTaskStatus, number>> = {};

    // 날짜 범위 내의 모든 날짜를 0으로 초기화
    for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, "day")) {
      const dateKey = date.format("YYYY-MM-DD");

      // 모든 status를 0으로 초기화한 객체를 바로 생성
      grouped[dateKey] = erpNextTaskStatusEnum.options.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {} as Record<ERPNextTaskStatus, number>);
    }

    // 실제 task 데이터로 업데이트
    for (const task of tasks) {
      const date = task.exp_start_date ? dayjs(task.exp_start_date).format("YYYY-MM-DD") : null;
      const status = task.status;

      if (!date || !status || !grouped[date]) continue;

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
    <div className="w-full pt-0">
      <div className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg" aria-label="Select a value">
            <SelectValue placeholder="최근 한달" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90" className="rounded-lg">
              한 분기
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              한달
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              일주일
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="px-2 pt-4 sm:px-6 sm:pt-6">
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
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
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
            {erpNextTaskStatusEnum.options.map((status) => (
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
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
