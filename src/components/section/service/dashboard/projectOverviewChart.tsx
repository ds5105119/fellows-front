"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useProjectOverView } from "@/hooks/fetch/project";

export const description = "A donut chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "진행 중",
    color: "var(--chart-1)",
  },
  safari: {
    label: "완료",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "유지보수",
    color: "var(--chart-3)",
  },
  edge: {
    label: "시작 전",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ProjectOverviewChart() {
  const overviewProjects = useProjectOverView();

  const chartData = [
    {
      browser: "진행 중",
      visitors: overviewProjects.data?.items?.filter((i) => i.custom_project_status?.startsWith("process")).length,
      fill: "var(--color-chrome)",
    },
    { browser: "완료", visitors: overviewProjects.data?.items?.filter((i) => i.custom_project_status === "complete").length, fill: "var(--color-safari)" },
    {
      browser: "유지보수",
      visitors: overviewProjects.data?.items?.filter((i) => i.custom_project_status === "maintenance").length,
      fill: "var(--color-firefox)",
    },
    { browser: "시작 전", visitors: overviewProjects.data?.items?.filter((i) => i.custom_project_status === "draft").length, fill: "var(--color-edge)" },
  ];

  const totalProjet = overviewProjects.data?.items?.length ?? 0;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={50}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                      {totalProjet.toLocaleString()}
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
    </ChartContainer>
  );
}
