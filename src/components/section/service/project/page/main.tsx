"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SquareGanttChart, TableProperties } from "lucide-react";
import { Session } from "next-auth";
import { GanttChart } from "@/components/section/service/project/task/gantt-chart";
import ProjectMainSection from "../main/projectmainsection";

export default function ProjectMain({ session, project_id }: { session: Session; project_id?: string }) {
  const tabs = ["개요", "작업 현황", "파일"] as const;
  const [tab, setTab] = useState<"개요" | "작업 현황" | "파일">("개요");
  const [taskView, setTaskView] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col mt-12 md:mt-16">
      <div className="fixed w-full top-12 md:top-16 flex items-center justify-between min-h-12 h-12 md:min-h-16 md:h-16 px-6 md:px-6 bg-background z-50 border-b border-b-sidebar-border">
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
          <div className="flex items-center space-x-2 group">
            <Button variant="ghost" size="icon" onClick={() => setTaskView((prev) => !prev)}>
              {taskView ? (
                <SquareGanttChart className="size-6 text-muted-foreground group-hover:text-zinc-800 transition-colors duration-200" />
              ) : (
                <TableProperties className="size-6 text-muted-foreground group-hover:text-zinc-800 transition-colors duration-200" />
              )}
            </Button>
          </div>
        )}
      </div>
      {tab === "개요" && <ProjectMainSection project_id={project_id} session={session} />}
      {tab === "작업 현황" && taskView && <GanttChart project_id={project_id} />}
      {tab === "작업 현황" && !taskView && <GanttChart project_id={project_id} />}
    </div>
  );
}
