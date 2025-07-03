"use client";

import { Label, Pie, PieChart } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useProjectOverView } from "@/hooks/fetch/project";
import { ResponsiveContainer } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import Color from "color";
import Link from "next/link";

const chartConfig = {
  process: {
    label: "진행 중",
    color: "rgba(0, 85, 255, 0.5)",
  },
  complete: {
    label: "완료",
    color: "rgba(76, 0, 255, 0.5)",
  },
  maintenance: {
    label: "유지보수",
    color: "rgba(255, 85, 0, 0.5)",
  },
  draft: {
    label: "시작 전",
    color: "rgba(140, 140, 140, 0.5)",
  },
} satisfies ChartConfig;

export function ProjectOverviewChart() {
  const overviewProjects = useProjectOverView();

  const totalProject = overviewProjects.data?.items?.length ?? 0;

  const chartData = [
    {
      key: "process",
      value: overviewProjects.data?.items?.filter((i) => i.custom_project_status?.startsWith("process")).length,
      fill: "var(--color-process)",
    },
    {
      key: "complete",
      value: overviewProjects.data?.items?.filter((i) => i.custom_project_status === "complete").length,
      fill: "var(--color-complete)",
    },
    {
      key: "maintenance",
      value: overviewProjects.data?.items?.filter((i) => i.custom_project_status === "maintenance").length,
      fill: "var(--color-maintenance)",
    },
    {
      key: "draft",
      value: overviewProjects.data?.items?.filter((i) => i.custom_project_status === "draft").length,
      fill: "var(--color-draft)",
    },
  ];

  const [status, setStatus] = useState(chartData[0].key);

  return (
    <div className="w-full md:h-[422px] flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
      <div className="w-full max-w-[400px] h-fit flex flex-col space-y-2 items-center">
        <div className="w-full max-w-[250px] aspect-square pb-2">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} nameKey="key" dataKey="value" innerRadius="40%" outerRadius="80%" cx="50%" cy="50%">
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              {totalProject.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              프로젝트
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {chartData.map((data, index) => {
          const name = chartConfig[data.key as keyof typeof chartConfig];

          return (
            <button
              key={index}
              className={cn(
                "flex items-center justify-between w-full max-w-[400px] p-1.5 rounded-sm",
                status == data.key ? "bg-gray-200" : "hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
              )}
              onClick={() => setStatus(data.key)}
            >
              <div
                style={{
                  borderWidth: "0.5px",
                  borderStyle: "solid",
                  borderColor: name.color,
                  backgroundColor: Color(name.color).alpha(0.3).rgb().string(),
                }}
                className="flex items-center justify-center text-xs font-bold text-white w-14 rounded-[3px] py-[3px]"
              >
                {name.label}
              </div>
              <div className="text-sm font-bold">{data.value?.toLocaleString() ?? 0} 개</div>
            </button>
          );
        })}
      </div>

      <div className="w-full h-[422px] md:h-full flex flex-col">
        <div className="flex flex-col rounded-sm border h-full overflow-hidden">
          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="flex gap-2 p-4">
              <div
                style={{
                  borderWidth: "0.5px",
                  borderStyle: "solid",
                  borderColor: chartConfig[status as keyof typeof chartConfig].color,
                  backgroundColor: Color(chartConfig[status as keyof typeof chartConfig].color)
                    .alpha(0.3)
                    .rgb()
                    .string(),
                }}
                className="flex items-center justify-center text-xs font-bold text-white w-14 rounded-[3px] py-[3px]"
              >
                {chartConfig[status as keyof typeof chartConfig].label}
              </div>
              <span className="text-sm font-bold">프로젝트</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">
              {overviewProjects.data?.items
                ?.filter((i) => i.custom_project_status?.startsWith(status))
                .map((data, index) => {
                  return (
                    <Link
                      key={index}
                      href={`/service/project/${data.project_name}`}
                      className="p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col space-y-1">
                          <h4 className="font-medium text-sm">{data.custom_project_title}</h4>
                          <h4 className="font-medium text-xs text-muted-foreground">{data.project_name}</h4>
                        </div>
                        <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                          <span>수정: {dayjs(data.modified).format("LL")}</span>
                          <span>생성: {dayjs(data.creation).format("LL")}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
