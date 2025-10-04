"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { TaskBar } from "./task-bar";
import type { ERPNextTaskForUser } from "@/@types/service/project";
import type { DateRange } from "./gantt-chart";

interface GanttTaskRowProps {
  task: ERPNextTaskForUser & { depth: number };
  dateRange: DateRange;
  expandedTasks: Record<string, boolean>;
  onToggleExpansion: (taskName: string) => void;
}

export function GanttTaskRow({ task, dateRange, expandedTasks, onToggleExpansion }: GanttTaskRowProps) {
  const hasChildren = task.subRows && task.subRows.length > 0;
  const isExpanded = expandedTasks[task.name];

  return (
    <div className="flex hover:bg-gray-100 h-16 border-b transition-colors duration-200 cursor-pointer">
      {/* Task Info */}
      <div className="h-full flex items-center w-16 md:w-80 px-2 border-r bg-white flex-shrink-0 overflow-hidden">
        <div className="flex w-full items-center gap-3 justify-center" style={{ paddingLeft: `${task.depth * 16}px` }}>
          {hasChildren && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={() => onToggleExpansion(task.name)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          {!hasChildren && <div className="md:w-6" />}

          <div className="min-w-0 w-full flex-1 hidden md:block">
            <div className="w-full flex items-center space-x-1.5">
              {task.color ? (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />
              ) : (
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              )}
              <div className="font-medium text-sm text-gray-900 truncate">{task.subject}</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={task.status} />
              <span className="text-xs text-gray-500">{task.expected_time}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Bar */}
      <div className="relative flex-1 min-w-0 h-full py-4">
        <div className="relative h-8">
          <TaskBar task={task} dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}
