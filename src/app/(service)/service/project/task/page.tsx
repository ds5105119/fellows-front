"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GanttChart } from "@/components/section/service/task/gantt-chart";
import { TreeTable } from "@/components/section/service/task/tree-table";
import TaskNavigation from "@/components/section/service/task/task-navigation";

export default function Page() {
  const [taskView, setTaskView] = useState(false);
  const searchParams = useSearchParams();

  const projectId = searchParams.getAll("project_id");

  return (
    <Suspense>
      <div className="shrink-0 w-full h-full flex flex-col">
        <TaskNavigation taskView={taskView} setTaskView={setTaskView} />
        {taskView ? <TreeTable /> : <GanttChart initalProjectId={projectId} />}
      </div>
    </Suspense>
  );
}
