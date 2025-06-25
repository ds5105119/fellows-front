"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Color from "color";
import Image from "next/image";
import dayjs from "@/lib/dayjs";
import { useInView } from "framer-motion";
import type { Dayjs } from "dayjs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { erpNextTaskStatusEnum, type ERPNextTaskForUser, type ERPNextTaskStatus } from "@/@types/service/project";
import { StatusBadge } from "./status-badge";
import { buildTree, getAllExpandableTaskIds } from "@/lib/task-utils";
import { ChevronDown, ChevronRight, ChevronLeft, FilePenLine, ClockIcon, ArrowRight, ZapIcon, FilterIcon, SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useTasks } from "@/hooks/fetch/project";
import { TaskSkeleton } from "./task-loading";
import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import { statusConfig } from "@/components/resource/project";
import { Input } from "@/components/ui/input";

export type TimeUnit = "day" | "week" | "month";

export function GanttChart({
  project_id,
  expand = true,
  timeunit,
  showControl = true,
}: {
  project_id?: string;
  expand?: boolean;
  timeunit?: TimeUnit;
  showControl?: boolean;
}) {
  const [taskExpended, setTaskExpanded] = useState<boolean>(expand ?? true);
  const [deepSearch, setDeepSearch] = useState<boolean>(true);
  const [status, setStatus] = useState<ERPNextTaskStatus[] | null>(null);
  const [keywordText, setKeywordText] = useState<string>("");
  const keyword = useThrottle(keywordText, 3000);

  const [timeUnit, setTimeUnit] = useState<TimeUnit>(timeunit ?? "week");
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(1, "week"),
    end: dayjs().add(2, "week"),
    intervals: [dayjs().subtract(1, "week"), dayjs(), dayjs().add(1, "week"), dayjs().add(2, "week")],
  });

  const TasksSwr = useTasks({
    project_id: project_id,
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
    return result;
  }, [treeData, expandedTasks]);

  // Navigation functions
  const navigatePrevious = () => {
    switch (timeunit ?? timeUnit) {
      case "day":
        setCurrentDate((prev) => prev.subtract(1, "week"));
        break;
      case "week":
        setCurrentDate((prev) => prev.subtract(1, "week"));
        break;
      case "month":
        setCurrentDate((prev) => prev.subtract(1, "month"));
        break;
    }
  };

  const navigateNext = () => {
    switch (timeunit ?? timeUnit) {
      case "day":
        setCurrentDate((prev) => prev.add(1, "week"));
        break;
      case "week":
        setCurrentDate((prev) => prev.add(1, "week"));
        break;
      case "month":
        setCurrentDate((prev) => prev.add(1, "month"));
        break;
    }
  };

  const navigateToToday = () => {
    setCurrentDate(dayjs());
  };

  // Format date range for display
  const formatDateRange = () => {
    const { start, end } = dateRange;
    switch (timeunit ?? timeUnit) {
      case "day":
        return `${start.format("YYYY.MM.DD")} - ${end.format("MM.DD")}`;
      case "week":
        return `${start.format("YYYY.MM.DD")} - ${end.format("MM.DD")}`;
      case "month":
        return `${start.format("YYYY.MM")} - ${end.format("MM")}`;
    }
  };

  const getTaskBarStyle = (task: ERPNextTaskForUser) => {
    if (!task.exp_start_date || !task.exp_end_date) return null;

    const taskStart = dayjs(task.exp_start_date);
    const taskEnd = dayjs(task.exp_end_date);
    const { start: rangeStart, end: rangeEnd } = dateRange;

    // 태스크가 현재 표시 범위와 전혀 겹치지 않으면 숨김
    if (taskEnd.isBefore(rangeStart) || taskStart.isAfter(rangeEnd)) {
      return null;
    }

    // 표시 범위 내에서의 위치 계산
    const totalDuration = rangeEnd.diff(rangeStart, "minute", true);
    const taskStartOffset = Math.max(0, taskStart.diff(rangeStart, "minute", true));
    const taskEndOffset = Math.min(rangeEnd.diff(rangeStart, "minute", true), taskEnd.diff(rangeStart, "minute", true));
    const taskDuration = taskEndOffset - taskStartOffset;

    if (taskDuration <= 0) return null;

    const leftPercent = (taskStartOffset / totalDuration) * 100;
    const widthPercent = (taskDuration / totalDuration) * 100;

    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.max(0.1, widthPercent)}%`,
    };
  };

  const formatInterval = (date: Dayjs) => {
    switch (timeunit ?? timeUnit) {
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
    const today = dayjs();

    switch (timeunit ?? timeUnit) {
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

  const calculateDateRange = (start: Dayjs, end: Dayjs) => {
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

  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd) {
      TasksSwr.setSize((s) => s + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* Controls */}
      <div
        className={cn(
          "sticky z-30 top-24 md:top-32 bg-background flex flex-col gap-3 w-full py-3 px-6 border-b border-b-sidebar-border",
          showControl ? "" : "hidden"
        )}
      >
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <ComboBoxResponsive
              statuses={[
                { label: "일별", value: "day" },
                { label: "주별", value: "week" },
                { label: "월별", value: "month" },
              ]}
              initial={"month"}
              callback={(value: string) => setTimeUnit(value as TimeUnit)}
            />

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 border rounded-sm px-1 h-8">
              <Button variant="ghost" size="sm" onClick={navigatePrevious} className="size-6 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={navigateToToday} className="px-3 h-7 text-sm font-medium min-w-[120px] hidden md:block">
                {formatDateRange()}
              </Button>
              <Button variant="ghost" size="sm" onClick={navigateNext} className="size-6 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={navigateToToday} className="text-xs font-bold text-blue-400 hover:text-blue-500 px-2 h-7">
              오늘
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="font-semibold hidden md:flex" onClick={() => setDeepSearch((prev) => !prev)}>
              {deepSearch ? "상세검색 끄기" : "상세검색 켜기"}
            </Button>

            <Button variant="secondary" size="sm" className="font-semibold md:hidden" onClick={() => setDeepSearch((prev) => !prev)}>
              {deepSearch ? "상세검색" : "일반검색"}
            </Button>

            <Button variant="secondary" size="sm" className="font-semibold hidden md:flex" onClick={() => setTaskExpanded((prev) => !prev)}>
              {taskExpended ? "접기" : "펼치기"}
            </Button>

            <Button variant="secondary" size="sm" className="font-semibold md:hidden" onClick={() => setTaskExpanded((prev) => !prev)}>
              {taskExpended ? <ChevronDown /> : <ChevronRight />}
            </Button>
          </div>
        </div>
        {deepSearch && (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-sm bg-muted font-bold flex items-center !pl-1.5 hover:bg-zinc-200 transition-colors duration-300"
                  >
                    <FilterIcon className="!size-4 ml-1" />
                    필터
                  </Button>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="drop-shadow-white/10 drop-shadow-2xl p-0 h-3/4 overflow-y-auto scrollbar-hide focus-visible:ring-0"
                >
                  <DialogHeader className="sr-only">
                    <DialogTitle className="sr-only">필터 창</DialogTitle>
                    <DialogDescription className="sr-only" />
                  </DialogHeader>
                  <div className="w-full h-full flex flex-col">
                    <div className="sticky top-0 w-full px-5 py-3 border-b border-b-muted bg-white font-bold">필터 추가하기</div>
                    <div className="w-full h-full flex flex-col p-5">
                      <div className="w-full flex flex-col space-y-3">
                        <div className="w-full flex items-center space-x-3">
                          <p className="text-sm font-bold">상태</p>
                          <button
                            disabled={status == null}
                            onClick={() => setStatus(null)}
                            className="cursor-pointer select-none px-2 py-1 rounded-sm bg-muted text-xs font-bold flex items-center hover:bg-zinc-200 transition-colors duration-300"
                          >
                            <p>전체 해제</p>
                          </button>
                        </div>
                        <div className="w-full grid grid-cols-3 gap-3">
                          {erpNextTaskStatusEnum.options.map((val, idx) => {
                            return (
                              <div key={idx} className="flex space-x-2 text-sm font-semibold">
                                <input
                                  type="checkbox"
                                  checked={status ? status.includes(val) : false}
                                  onChange={() =>
                                    status?.includes(val)
                                      ? status && status.length == 1
                                        ? setStatus(null)
                                        : setStatus(status.filter((v) => v !== val))
                                      : status
                                      ? setStatus([...status, val])
                                      : setStatus([val])
                                  }
                                />
                                <p>{statusConfig[val].text}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="relative w-full h-8 max-w-96 rounded-sm bg-muted">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="검색어를 입력하세요"
                  className="ml-4 h-full px-4 border-0 shadow-none focus-visible:ring-0 font-medium"
                  onChange={(e) => setKeywordText(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center md:justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setDeepSearch((prev) => !prev)}>
                <span className="text-muted-foreground font-semibold">시작일</span>
                {dateRange.start.format("YYYY-MM-DD")}
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setTaskExpanded((prev) => !prev)}>
                <span className="text-muted-foreground font-semibold">종료일</span>
                {dateRange.end.format("YYYY-MM-DD")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-hidden h-fit">
        <div className="w-full min-w-fit">
          {/* Header */}
          <div className="flex border-b bg-gray-50 h-12">
            <div className="w-16 md:w-80 border-r bg-white flex-shrink-0 flex items-center justify-center">
              <h3 className="font-semibold">작업</h3>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex">
                {dateRange.intervals.map((interval, index) => {
                  const formatted = formatInterval(interval);
                  const isCurrent = isCurrentInterval(interval);

                  return (
                    <div
                      key={`${interval.format()}-${index}`}
                      className={cn("flex-1 p-2 h-full text-xs text-center border-r min-w-[60px]", isCurrent ? "bg-blue-100 text-blue-800 font-semibold" : "")}
                    >
                      <div>{formatted.main}</div>
                      <div className="text-gray-500">{formatted.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Not have Tasks */}
          {!hasTasks && !hasTaskIsLoading && !isLoading && (
            <div className="flex justify-center items-center py-24">
              <div className="w-84 md:w-[512px] flex flex-col justify-center items-center space-y-4 text-center text-sm">
                <div>아직 할당된 테스크가 없습니다</div>
                <div className="text-2xl font-bold line-clamp-2">
                  가장 앞선 SI에 합리적인 비용으로
                  <br />
                  외주 개발을 의뢰해보세요
                </div>
                <Button size="lg" asChild>
                  <Link href="/service/project">
                    <ZapIcon />
                    지금 의뢰하기
                  </Link>
                </Button>
                <div className="mt-8 w-full rounded-2xl overflow-hidden border border-zinc-300">
                  <AspectRatio ratio={1600 / 1150} className="w-full">
                    <Image src="/task-empty.png" alt="테스크가 없습니다" fill />
                  </AspectRatio>
                </div>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div className="divide-y">
            {visibleTasks.map((task) => {
              const barStyle = getTaskBarStyle(task);
              const hasChildren = task.subRows && task.subRows.length > 0;
              const isExpanded = expandedTasks[task.name];

              return (
                <div key={task.name} className="flex hover:bg-gray-50 h-16 border-b">
                  {/* Task Info */}
                  <div className="h-full flex items-center w-16 md:w-80 px-2 border-r bg-white flex-shrink-0 overflow-hidden">
                    <div className="flex w-full items-center gap-3 justify-center" style={{ paddingLeft: `${task.depth * 16}px` }}>
                      {hasChildren && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={() => toggleTaskExpansion(task.name)}>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      )}
                      {!hasChildren && <div className="md:w-6" />}

                      <div className="min-w-0 w-full flex-1 hidden md:block">
                        <div className="w-full flex items-center space-x-1.5">
                          {task.color && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: task.color }} />}
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
                      {/* Task bar */}
                      <Popover>
                        <PopoverTrigger asChild>
                          {barStyle && (
                            <button
                              className="absolute top-1 bottom-1 rounded-[3px] overflow-hidden cursor-pointer"
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
                            </button>
                          )}
                        </PopoverTrigger>
                        <PopoverContent className="drop-shadow-2xl p-0 rounded-xl">
                          <div className="p-4 flex flex-col space-y-4">
                            <div className="flex space-x-3">
                              <FilePenLine className="!size-4 mt-[1.5px] shrink-0" />
                              <div className="flex flex-col space-y-2">
                                <div className="text-sm font-bold">{task.subject}</div>
                                <div className="text-xs font-normal">{task.description}</div>
                              </div>
                            </div>
                            <div className="flex space-x-3 w-full">
                              <ClockIcon className="!size-4 shrink-0" />
                              <div className="flex flex-col space-y-1.5 w-full">
                                <div className="flex justify-between items-center w-full">
                                  <div className="text-xs font-semibold">{dayjs(task.exp_start_date).format("LL")}</div>
                                  <ArrowRight className="!size-3.5 text-zinc-400" />
                                  <div className="text-xs font-semibold">{dayjs(task.exp_end_date).format("LL")}</div>
                                </div>
                                <div className="text-xs font-semibold text-zinc-400">총 {task.expected_time}시간</div>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div className="px-2 py-2 flex justify-end space-y-4">
                            <PopoverClose asChild>
                              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-muted-foreground w-fit">
                                확인
                              </Button>
                            </PopoverClose>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* No dates indicator - 태스크에 날짜가 없을 때만 표시 */}
                      {!task.exp_start_date || !task.exp_end_date ? (
                        <div className="absolute top-1/2 left-1/2 -translate-1/2 border-2 px-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">No dates set</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (TasksSwr.data?.length == 1 ? <TaskSkeleton count={1} /> : <TaskSkeleton count={8} />)}

        <div className="col-span-full" ref={infinitRef} />
      </div>
    </div>
  );
}
