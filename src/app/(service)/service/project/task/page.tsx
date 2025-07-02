"use client";

import { useState } from "react";
import { GanttChart } from "@/components/section/service/project/task/gantt-chart";
import { TreeTable } from "@/components/section/service/project/task/tree-table";
import ProjectTab from "@/components/section/service/project/main/project-tab";

export default function Page() {
  const [taskView, setTaskView] = useState(false);

  return (
    <div className="shrink-0 w-full h-full flex flex-col">
      <ProjectTab taskView={taskView} setTaskView={setTaskView} />
      {taskView ? <TreeTable /> : <GanttChart />}
    </div>
  );
}
