"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import dayjs from "@/lib/dayjs";
import type { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";
import type { ERPNextTaskForUser, ERPNextTaskStatus } from "@/@types/service/project";
import { buildTree, getAllExpandableTaskIds } from "@/lib/task-utils";
import { useTasks } from "@/hooks/fetch/project";
import { TaskSkeleton } from "./task-loading";
import useThrottle from "@/lib/useThrottle";
import { FilterHeader } from "./filter-header";
import { GanttTaskRow } from "./gantt-task-row";
import { EmptyState } from "./empty-state";

export type TimeUnit = "day" | "week" | "month";

export interface DateRange {
  start: Dayjs;
  end: Dayjs;
  intervals: Dayjs[];
}

export function GanttChart({
  expand = false,
  timeunit,
  showControl = true,
  initalProjectId = [],
}: {
  expand?: boolean;
  timeunit?: TimeUnit;
  showControl?: boolean;
  initalProjectId: string[];
}) {
  const [taskExpended, setTaskExpanded] = useState<boolean>(expand ?? true);
  const [deepSearch, setDeepSearch] = useState<boolean>(initalProjectId ? true : false);
  const [status, setStatus] = useState<ERPNextTaskStatus[] | null>(null);
  const [projectId, setProjectId] = useState<string[] | null>(initalProjectId ? initalProjectId : null);
  const [keywordText, setKeywordText] = useState<string>("");
  const keyword = useThrottle(keywordText, 3000);

  const [timeUnit, setTimeUnit] = useState<TimeUnit>(timeunit ?? "week");
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [dateRange, setDateRange] = useState<DateRange>({
    start: dayjs().subtract(1, "week"),
    end: dayjs().add(2, "week"),
    intervals: [dayjs().subtract(1, "week"), dayjs(), dayjs().add(1, "week"), dayjs().add(2, "week")],
  });

  const TasksSwr = useTasks({
    project_id: projectId,
    size: 50,
    status: status,
    start: dateRange.start.startOf("year").toDate(),
    end: dateRange.end.endOf("year").toDate(),
    keyword: keyword,
  });

  const tasks = TasksSwr.data?.flatMap((task) => task.items) ?? [];
  const isReachedEnd = TasksSwr.data && TasksSwr.data.length > 0 && TasksSwr.data[TasksSwr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && (TasksSwr.isLoading || (TasksSwr.data && TasksSwr.size > 0 && typeof TasksSwr.data[TasksSwr.size - 1] === "undefined"));
  const infinitRef = useRef<HTMLDivElement>(null);
  const isReachingEnd = useInView(infinitRef, {
    once: false,
    margin: "-50px 0px -50px 0px",
  });

  const hasTaskSwr = useTasks({ size: 1 }, { refreshInterval: 0 });
  const hasTaskIsLoading = hasTaskSwr.isLoading || (hasTaskSwr.data && hasTaskSwr.size > 0 && typeof hasTaskSwr.data[hasTaskSwr.size - 1] === "undefined");
  const hasTasks = (hasTaskSwr.data?.flatMap((task) => task.items) ?? []).length != 0;

  const treeData = useMemo(() => buildTree(tasks), [tasks]);
  const expandableTaskIds = useMemo(() => getAllExpandableTaskIds(tasks), [tasks]);

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(() => {
    const expandableIds = getAllExpandableTaskIds(tasks);
    const initialExpanded: Record<string, boolean> = {};
    expandableIds.forEach((id) => {
      initialExpanded[id] = true;
    });
    return initialExpanded;
  });

  const expandAll = () => {
    const newExpanded: Record<string, boolean> = {};
    expandableTaskIds.forEach((id) => {
      newExpanded[id] = true;
    });
    setExpandedTasks(newExpanded);
  };

  const collapseAll = () => {
    setExpandedTasks({});
  };

  // Get visible tasks based on expanded state
  const visibleTasks = useMemo(() => {
    const result: (ERPNextTaskForUser & { depth: number })[] = [];

    const traverse = (taskList: ERPNextTaskForUser[], depth = 0) => {
      taskList.forEach((task) => {
        result.push({ ...task, depth });
        if (task.subRows && task.subRows.length > 0 && expandedTasks[task.name]) {
          traverse(task.subRows, depth + 1);
        }
      });
    };

    traverse(treeData);
    return result.filter((res) => dayjs(res.exp_start_date) >= dateRange.start && dayjs(res.exp_end_date) <= dateRange.end);
  }, [treeData, expandedTasks]);

  const calculateDateRange = (start?: Dayjs, end?: Dayjs) => {
    if (!start || !end) return;
    switch (timeUnit) {
      case "day":
        const intervals_day = [];
        let currentDay = start;
        while (currentDay.isBefore(end) || currentDay.isSame(end, "day")) {
          intervals_day.push(currentDay);
          currentDay = currentDay.add(1, "day");
        }
        setDateRange({ start: start, end: end, intervals: intervals_day });
        break;
      case "week":
        const intervals_week = [];
        let currentWeek = start;
        while (currentWeek.isBefore(end) || currentWeek.isSame(end, "week")) {
          intervals_week.push(currentWeek);
          currentWeek = currentWeek.add(1, "week");
        }
        setDateRange({ start: start, end: end, intervals: intervals_week });
        break;
      case "month":
        const intervals_month = [];
        let currentMonth = start;
        while (currentMonth.isBefore(end) || currentMonth.isSame(end, "month")) {
          intervals_month.push(currentMonth);
          currentMonth = currentMonth.add(1, "month");
        }
        setDateRange({ start: start, end: end, intervals: intervals_month });
        break;
    }
  };

  const toggleTaskExpansion = (taskName: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskName]: !prev[taskName],
    }));
  };

  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd) {
      TasksSwr.setSize((s) => s + 1);
    }
  }, [isReachingEnd, isLoading, isReachedEnd]);

  useEffect(() => {
    switch (timeUnit) {
      case "day":
        calculateDateRange(currentDate.startOf("week"), currentDate.endOf("week"));
        break;
      case "week":
        calculateDateRange(currentDate.subtract(1, "week").startOf("week"), currentDate.add(2, "week").endOf("week"));
        break;
      case "month":
        calculateDateRange(currentDate.subtract(1, "month").startOf("month"), currentDate.add(2, "month").endOf("month"));
        break;
    }
  }, [timeUnit, currentDate]);

  useEffect(() => {
    if (taskExpended) {
      expandAll();
    } else {
      collapseAll();
    }
  }, [taskExpended]);

  return (
    <div className="w-full h-full">
      <FilterHeader
        showControl={showControl}
        timeUnit={timeUnit}
        setTimeUnit={setTimeUnit}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        dateRange={dateRange}
        setDateRange={calculateDateRange}
        taskExpended={taskExpended}
        setTaskExpanded={setTaskExpanded}
        deepSearch={deepSearch}
        setDeepSearch={setDeepSearch}
        status={status}
        setStatus={setStatus}
        keywordText={keywordText}
        setKeywordText={setKeywordText}
        projectId={projectId}
        setProjectId={setProjectId}
      />

      <div className="overflow-x-auto overflow-y-hidden h-fit">
        <div className="w-full min-w-fit">
          {/* Header */}
          <div className="flex border-b bg-gray-50 h-12">
            <div className="w-16 md:w-80 shrink-0 border-r bg-white flex items-center justify-center">
              <h3 className="font-semibold">작업</h3>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex h-full">
                {dateRange.intervals.map((interval, index) => {
                  const formatted = formatInterval(interval, timeUnit);
                  const isCurrent = isCurrentInterval(interval, timeUnit);

                  return (
                    <div
                      key={`${interval.format()}-${index}`}
                      className={cn(
                        "flex-1 flex flex-col items-center justify-center p-2 h-full text-xs text-center border-r min-w-[60px]",
                        isCurrent ? "bg-blue-100 text-blue-800 font-semibold" : ""
                      )}
                    >
                      <div>{formatted.main}</div>
                      <div className="text-gray-500">{formatted.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <EmptyState hasTasks={hasTasks} hasTaskIsLoading={hasTaskIsLoading ?? true} isLoading={isLoading ?? true} tasksLength={visibleTasks.length} />

          {/* Tasks */}
          <div className="divide-y">
            {visibleTasks.map((task) => (
              <GanttTaskRow key={task.name} task={task} dateRange={dateRange} expandedTasks={expandedTasks} onToggleExpansion={toggleTaskExpansion} />
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (TasksSwr.data?.length == 1 ? <TaskSkeleton count={1} /> : <TaskSkeleton count={8} />)}

        <div className="col-span-full" ref={infinitRef} />
      </div>
    </div>
  );
}

// Helper functions
const formatInterval = (date: Dayjs, timeUnit: TimeUnit) => {
  switch (timeUnit) {
    case "day":
      return {
        main: date.format("DD"),
        sub: date.format("MMM"),
      };
    case "week":
      return {
        main: date.format("DD"),
        sub: date.format("MMM"),
      };
    case "month":
      return {
        main: date.format("MMM"),
        sub: date.format("YYYY"),
      };
  }
};

const isCurrentInterval = (date: Dayjs, timeUnit: TimeUnit) => {
  const today = dayjs();

  switch (timeUnit) {
    case "day":
      return date.isSame(today, "day");
    case "week":
      return date.isSame(today, "week");
    case "month":
      return date.isSame(today, "month");
  }
};
