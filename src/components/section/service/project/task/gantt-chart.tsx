"use client";

import { useMemo, useState, useEffect } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, CalendarDays, CalendarRange, ChevronDown, ChevronRight, Expand, Shrink } from "lucide-react";
import type { ERPNextTaskForUser } from "@/@types/service/project";
import { StatusBadge } from "./status-badge";
import { buildTree, calculateParentTaskDates, getAllExpandableTaskIds } from "@/lib/task-utils";
import Color from "color";
import { cn } from "@/lib/utils";

type TimeUnit = "hour" | "day" | "week" | "month";

export function GanttChart({
  tasks,
  expand = true,
  timeunit,
  showControl = true,
  minwidth = 1580,
}: {
  tasks: ERPNextTaskForUser[];
  expand?: boolean;
  timeunit?: TimeUnit;
  showControl?: boolean;
  minwidth?: number;
}) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(timeunit ?? "day");

  // 기본으로 모든 태스크 펼쳐진 상태로 시작
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(() => {
    const expandableIds = getAllExpandableTaskIds(tasks);
    const initialExpanded: Record<string, boolean> = {};
    expandableIds.forEach((id) => {
      initialExpanded[id] = true;
    });
    return initialExpanded;
  });

  // Calculate parent task dates first
  const tasksWithCalculatedDates = useMemo(() => calculateParentTaskDates(tasks), [tasks]);
  const treeData = useMemo(() => buildTree(tasksWithCalculatedDates), [tasksWithCalculatedDates]);

  const expandableTaskIds = useMemo(() => getAllExpandableTaskIds(tasks), [tasks]);

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
    return result;
  }, [treeData, expandedTasks]);

  // Calculate date range with exact padding and minimum width
  const dateRange = useMemo(() => {
    const dates = tasksWithCalculatedDates
      .flatMap((task) => [task.exp_start_date, task.exp_end_date])
      .filter((date): date is Date => date !== null && date !== undefined);

    if (dates.length === 0) {
      const now = new Date();
      return {
        start: dayjs(now),
        end: dayjs(now),
        intervals: [dayjs(now)],
        minWidth: minwidth,
      };
    }

    const minDate = dayjs(new Date(Math.min(...dates.map((d) => d.getTime()))));
    const maxDate = dayjs(new Date(Math.max(...dates.map((d) => d.getTime()))));

    let start: Dayjs, end: Dayjs, intervals: Dayjs[];

    switch (timeunit ?? timeUnit) {
      case "hour":
        start = minDate.subtract(2, "hour");
        end = maxDate.add(2, "hour");
        intervals = [];
        let currentHour = start;
        while (currentHour.isBefore(end) || currentHour.isSame(end, "hour")) {
          intervals.push(currentHour);
          currentHour = currentHour.add(1, "hour");
        }
        break;
      case "day":
        start = minDate.subtract(2, "day");
        end = maxDate.add(2, "day");
        intervals = [];
        let currentDay = start;
        while (currentDay.isBefore(end) || currentDay.isSame(end, "day")) {
          intervals.push(currentDay);
          currentDay = currentDay.add(1, "day");
        }
        break;
      case "week":
        start = minDate.subtract(2, "week");
        end = maxDate.add(2, "week");
        intervals = [];
        let currentWeek = start;
        while (currentWeek.isBefore(end) || currentWeek.isSame(end, "week")) {
          intervals.push(currentWeek);
          currentWeek = currentWeek.add(1, "week");
        }
        break;
      case "month":
        start = minDate.subtract(2, "month");
        end = maxDate.add(2, "month");
        intervals = [];
        let currentMonth = start;
        while (currentMonth.isBefore(end) || currentMonth.isSame(end, "month")) {
          intervals.push(currentMonth);
          currentMonth = currentMonth.add(1, "month");
        }
        break;
    }

    // Calculate minimum width needed
    const calculatedWidth = intervals.length * 60;
    const minWidth = Math.max(minwidth, calculatedWidth);

    return { start, end, intervals, minWidth };
  }, [tasksWithCalculatedDates, timeunit, timeUnit]);

  const today = dayjs();

  const getTaskBarStyle = (task: ERPNextTaskForUser) => {
    if (!task.exp_start_date || !task.exp_end_date) return null;

    const taskStart = dayjs(task.exp_start_date);
    const taskEnd = dayjs(task.exp_end_date);

    // 실제 태스크 날짜와 전체 범위의 실제 날짜로 정확한 계산
    const rangeStartDate = dayjs(
      tasksWithCalculatedDates
        .map((t) => t.exp_start_date)
        .filter(Boolean)
        .reduce((min, date) => (min ? (date! < min ? date! : min) : date))
    );

    const rangeEndDate = dayjs(
      tasksWithCalculatedDates
        .map((t) => t.exp_end_date)
        .filter(Boolean)
        .reduce((max, date) => (max ? (date! > max ? date! : max) : date))
    );

    // 패딩 적용
    let paddedStart: Dayjs, paddedEnd: Dayjs;

    switch (timeunit ?? timeUnit) {
      case "hour":
        paddedStart = rangeStartDate.subtract(2, "hour");
        paddedEnd = rangeEndDate.add(2, "hour");
        break;
      case "day":
        paddedStart = rangeStartDate.subtract(2, "day");
        paddedEnd = rangeEndDate.add(2, "day");
        break;
      case "week":
        paddedStart = rangeStartDate.subtract(2, "week");
        paddedEnd = rangeEndDate.add(2, "week");
        break;
      case "month":
        paddedStart = rangeStartDate.subtract(2, "month");
        paddedEnd = rangeEndDate.add(2, "month");
        break;
    }

    // 전체 범위에서의 정확한 위치 계산 (일 단위로 통일)
    const totalDays = paddedEnd.diff(paddedStart, "day", true);
    const taskStartDays = taskStart.diff(paddedStart, "day", true);
    const taskDurationDays = taskEnd.diff(taskStart, "day", true);

    // 최소 0.5일은 보장
    const safeDuration = Math.max(0.5, taskDurationDays);

    const leftPercent = Math.max(0, (taskStartDays / totalDays) * 100);
    const widthPercent = Math.min(100 - leftPercent, (safeDuration / totalDays) * 100);

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(0.5, widthPercent)}%`,
    };
  };

  const formatInterval = (date: Dayjs) => {
    switch (timeunit ?? timeUnit) {
      case "hour":
        return {
          main: date.format("HH:mm"),
          sub: date.format("DD/MM"),
        };
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

  const isCurrentInterval = (date: Dayjs) => {
    switch (timeunit ?? timeUnit) {
      case "hour":
        return date.isSame(today, "hour");
      case "day":
        return date.isSame(today, "day");
      case "week":
        return date.isSame(today, "week");
      case "month":
        return date.isSame(today, "month");
    }
  };

  const toggleTaskExpansion = (taskName: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskName]: !prev[taskName],
    }));
  };

  useEffect(() => {
    if (expand) {
      expandAll();
    } else {
      collapseAll();
    }
  }, [expand]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className={cn("flex w-full justify-between items-center", showControl ? "" : "hidden")}>
        <Select value={timeunit ?? timeUnit} onValueChange={(value: TimeUnit) => setTimeUnit(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hours
              </div>
            </SelectItem>
            <SelectItem value="day">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Days
              </div>
            </SelectItem>
            <SelectItem value="week">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Weeks
              </div>
            </SelectItem>
            <SelectItem value="month">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Months
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll} className="flex items-center gap-2">
            <Expand className="h-4 w-4" />
            Expand All ({tasks.length})
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="flex items-center gap-2">
            <Shrink className="h-4 w-4" />
            Collapse All
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <div style={{ width: `${dateRange.minWidth}px` }}>
          {/* Header */}
          <div className="flex border-b bg-gray-50">
            <div className="w-80 p-2 border-r bg-white flex-shrink-0">
              <h3 className="font-semibold">Task</h3>
            </div>
            <div style={{ width: `${dateRange.minWidth - 320}px` }}>
              <div className="flex">
                {dateRange.intervals.map((interval, index) => {
                  const formatted = formatInterval(interval);
                  const isCurrent = isCurrentInterval(interval);

                  return (
                    <div
                      key={`${interval.format()}-${index}`}
                      className={cn("flex-shrink-0 p-2 h-full text-xs text-center border-r", isCurrent ? "bg-blue-100 text-blue-800 font-semibold" : "")}
                      style={{ width: `${(dateRange.minWidth - 320) / dateRange.intervals.length}px` }}
                    >
                      <div>{formatted.main}</div>
                      <div className="text-gray-500">{formatted.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="divide-y">
            {visibleTasks.map((task) => {
              const barStyle = getTaskBarStyle(task);
              const hasChildren = task.subRows && task.subRows.length > 0;
              const isExpanded = expandedTasks[task.name];

              return (
                <div key={task.name} className="flex hover:bg-gray-50">
                  {/* Task Info */}
                  <div className="w-80 p-4 border-r bg-white flex-shrink-0">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${task.depth * 16}px` }}>
                      {hasChildren && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={() => toggleTaskExpansion(task.name)}>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      )}
                      {!hasChildren && <div className="w-6" />}

                      {task.color && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: task.color }} />}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-gray-900 truncate">{task.subject}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={task.status} />
                          <span className="text-xs text-gray-500">{task.expected_time}h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gantt Bar */}
                  <div className="relative p-2" style={{ width: `${dateRange.minWidth - 320}px` }}>
                    <div className="relative h-8">
                      {/* Task bar */}
                      {barStyle && (
                        <div
                          className="absolute top-1 bottom-1 rounded-[3px] overflow-hidden"
                          style={{
                            ...barStyle,
                            borderTop: `1px solid ${Color(task.color || "#007AFF")
                              .lighten(0.6)
                              .hex()}`,
                            borderLeft: `1px solid ${Color(task.color || "#007AFF")
                              .lighten(0.6)
                              .hex()}`,
                            borderRight: `1px solid ${Color(task.color || "#007AFF")
                              .lighten(0.6)
                              .hex()}`,
                            borderBottom: `1px solid ${Color(task.color || "#007AFF")
                              .darken(0.2)
                              .hex()}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = Color(task.color || "#007AFF")
                              .alpha(0.3)
                              .string();
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {/* 배경 바 (전체 - 희미하게) */}
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: task.color || "#007AFF",
                              opacity: 0.5,
                            }}
                          />
                          {/* 진행 바 (완료된 부분 - 원래 색상) */}
                          {task.progress > 0 && (
                            <div
                              className="absolute top-0 h-full"
                              style={{
                                width: `${task.progress}%`,
                                backgroundColor: task.color || "#007AFF",
                                opacity: 1,
                              }}
                            />
                          )}
                          {/* Task label */}
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs text-white font-medium truncate drop-shadow-sm select-none">{task.subject}</span>
                          </div>
                        </div>
                      )}

                      {/* No dates indicator */}
                      {!barStyle && (
                        <div className="absolute top-1 bottom-1 left-2 right-2 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">No dates set</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
