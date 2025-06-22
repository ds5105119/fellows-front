"use client";

import DetailMain from "@/components/section/service/project/detail/detail-main";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SquareGanttChart, TableProperties } from "lucide-react";
import { useTasks } from "@/hooks/fetch/project";
import { TreeTable } from "@/components/section/service/project/task/tree-table";
import { GanttChart, TimeUnit } from "@/components/section/service/project/task/gantt-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeUnitToKorean = (timeUnit: TimeUnit) => {
  switch (timeUnit) {
    case "day":
      return "일";
    case "week":
      return "주";
    case "month":
      return "월";
  }
};

export default function Page() {
  const params = useParams();
  const project_id = params.project_id as string;

  const tabs = ["개요", "작업 현황", "파일"] as const;
  const [tab, setTab] = useState<"개요" | "작업 현황" | "파일">("개요");
  const [taskView, setTaskView] = useState<boolean>(true);

  const [taskExpanded, setTaskExpanded] = useState<boolean>(true);
  const [ganttTimeUnit, setGanttTimeUnit] = useState<TimeUnit>("day");

  const tasks = useTasks(project_id, { size: 20 });
  const taskRaw = tasks.data?.flatMap((task) => task.items) ?? [];

  return (
    <div className="w-full flex flex-col">
      <div className="sticky w-full top-0 flex items-center justify-between min-h-12 h-12 md:min-h-16 md:h-16 px-6 md:px-6 bg-background z-20">
        <div className="flex items-center space-x-5">
          {tabs.map((t, index) => {
            return (
              <button
                key={index}
                onClick={() => setTab(t)}
                className={cn("text-base md:text-xl font-bold", t === tab ? "text-black" : "text-muted-foreground")}
              >
                {t}
              </button>
            );
          })}
        </div>
        {tab == "작업 현황" && (
          <div className="flex items-center space-x-2">
            {!taskView && (
              <Select value={ganttTimeUnit} onValueChange={(value: TimeUnit) => setGanttTimeUnit(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["hour", "day", "week", "month"].map((t) => {
                    return (
                      <SelectItem key={t} value={t}>
                        <div className="flex items-center gap-2">{timeUnitToKorean(t as TimeUnit)}</div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <Button variant="secondary" size="sm" onClick={() => setTaskExpanded((prev) => !prev)}>
              {taskExpanded ? "접기" : "펼치기"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTaskView((prev) => !prev)}>
              {taskView ? <SquareGanttChart className="size-6" /> : <TableProperties className="size-6" />}
            </Button>
          </div>
        )}
      </div>
      {tab === "개요" && <DetailMain project_id={project_id} />}
      {tab === "작업 현황" && taskView && <TreeTable tasks={taskRaw} />}
      {tab === "작업 현황" && !taskView && <GanttChart tasks={taskRaw} />}
    </div>
  );
}
