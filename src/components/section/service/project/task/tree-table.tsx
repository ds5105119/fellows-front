"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { type ColumnDef, type ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, type OnChangeFn, useReactTable } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ERPNextTaskForUser, ERPNextTaskStatus } from "@/@types/service/project";
import { StatusBadge } from "./status-badge";
import { PriorityIndicator } from "./priority-indicator";
import { buildTree, getInitialExpandedState } from "@/lib/task-utils";
import { useProjectOverView, useTasks } from "@/hooks/fetch/project";
import useThrottle from "@/lib/useThrottle";
import type { Dayjs } from "dayjs";
import { useInView } from "framer-motion";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import { FilterHeader } from "./filter-header";

export interface DateRange {
  start?: Dayjs;
  end?: Dayjs;
}

export function TreeTable({ expand = false, showControl = true }: { expand?: boolean; showControl?: boolean }) {
  const [taskExpended, setTaskExpanded] = useState<boolean>(expand ?? true);
  const [deepSearch, setDeepSearch] = useState<boolean>(true);
  const [status, setStatus] = useState<ERPNextTaskStatus[] | null>(null);
  const [projectId, setProjectId] = useState<string[] | null>(null);
  const [keywordText, setKeywordText] = useState<string>("");
  const keyword = useThrottle(keywordText, 3000);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: undefined,
    end: undefined,
  });

  // Stable reference for date range to prevent unnecessary re-renders
  const stableDateRange = useMemo(() => dateRange, [dateRange.start?.valueOf(), dateRange.end?.valueOf()]);

  const TasksSwr = useTasks({
    project_id: projectId,
    size: 50,
    status: status,
    start: stableDateRange.start?.startOf("day").toDate(),
    end: stableDateRange.end?.endOf("day").toDate(),
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

  const overviewProjectSwr = useProjectOverView();

  // Memoize tree data with stable reference
  const treeData = useMemo(() => {
    if (!tasks.length) return [];
    return buildTree(tasks);
  }, [tasks.length, tasks]);

  // Stable expanded state management
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized functions to prevent recreation
  const expandAll = useCallback(() => {
    if (!treeData.length) return;

    const newExpanded: Record<string, boolean> = {};
    const setAllExpanded = (taskList: ERPNextTaskForUser[], parentPath = "") => {
      taskList.forEach((task, index) => {
        const rowId = parentPath ? `${parentPath}.${index}` : `${index}`;
        if (task.subRows && task.subRows.length > 0) {
          newExpanded[rowId] = true;
          setAllExpanded(task.subRows, rowId);
        }
      });
    };
    setAllExpanded(treeData);
    setExpanded(newExpanded);
  }, [treeData]);

  const collapseAll = useCallback(() => {
    setExpanded({});
  }, []);

  // Stable handler for expanded change
  const handleExpandedChange = useCallback<OnChangeFn<ExpandedState>>((updaterOrValue) => {
    setExpanded(updaterOrValue);
  }, []);

  // Initialize expanded state only once when data is first loaded
  useEffect(() => {
    if (treeData.length > 0 && !isInitialized) {
      const initialExpanded = getInitialExpandedState(tasks, 2);
      setExpanded(initialExpanded);
      setIsInitialized(true);
    }
  }, [treeData.length, tasks, isInitialized]);

  // Handle expand/collapse based on taskExpended state
  useEffect(() => {
    if (!isInitialized) return;
    if (taskExpended) {
      expandAll();
    } else {
      collapseAll();
    }
  }, [taskExpended, isInitialized]);

  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd) {
      TasksSwr.setSize((s) => s + 1);
    }
  }, [isReachingEnd, isLoading, isReachedEnd]);

  // Stable date range setter to prevent Popper issues
  const handleDateRangeChange = useCallback((start?: Dayjs, end?: Dayjs) => {
    setDateRange((prev) => {
      // Only update if values actually changed
      if (prev.start?.valueOf() === start?.valueOf() && prev.end?.valueOf() === end?.valueOf()) {
        return prev;
      }
      return { start, end };
    });
  }, []);

  // Memoized columns with stable references
  const columns: ColumnDef<ERPNextTaskForUser>[] = useMemo(
    () => [
      {
        id: "task",
        header: "작업",
        cell: ({ row }) => {
          const task = row.original;
          const hasChildren = row.subRows?.length > 0;
          const isExpanded = row.getIsExpanded();

          return (
            <div className="flex items-center gap-2 w-80" style={{ paddingLeft: `${row.depth * 24}px` }}>
              {hasChildren && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={row.getToggleExpandedHandler()}>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              <div className="flex items-center justify-start gap-3 min-w-0">
                {task.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />}
                <div className="min-w-0">
                  <div className="text-start font-medium text-sm text-gray-900 break-words line-clamp-2">{task.subject}</div>
                  <div className="text-xs text-gray-500 font-mono">{task.name}</div>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ getValue }) => <StatusBadge status={getValue() as ERPNextTaskForUser["status"]} />,
      },
      {
        accessorKey: "progress",
        header: "프로세스",
        cell: ({ getValue }) => {
          const progress = getValue() as number;
          return (
            <div className="flex items-center gap-2 min-w-[120px]">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-xs font-medium text-gray-600 w-8">{progress}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: "expected_time",
        header: "소요시간",
        cell: ({ getValue }) => {
          const time = getValue() as number;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-gray-500" />
                <span>{time}h</span>
              </div>
              <PriorityIndicator expectedTime={time} />
            </div>
          );
        },
      },
      {
        id: "dates",
        header: "타임라인",
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="flex flex-col gap-1 text-xs">
              {task.exp_start_date && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Start: {task.exp_start_date.toLocaleDateString()}</span>
                </div>
              )}
              {task.exp_end_date && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>End: {task.exp_end_date.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "project",
        header: "프로젝트",
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="text-xs">
            {getValue() as string}
          </Badge>
        ),
      },
    ],
    []
  );

  // Memoized table configuration
  const table = useReactTable({
    data: treeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    onExpandedChange: handleExpandedChange,
    state: {
      expanded,
    },
    enableRowSelection: false,
    manualPagination: true,
    autoResetPageIndex: false,
    autoResetExpanded: false, // Prevent auto-reset of expanded state
  });

  return (
    <div className="w-full max-w-full">
      <FilterHeader
        showControl={showControl}
        dateRange={stableDateRange}
        setDateRange={handleDateRangeChange}
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
      <div className="w-full overflow-x-auto">
        <div className={cn("min-w-[1200px] w-full", table.getRowModel().rows.length > 0 ? "border-b" : "")}>
          <Table className="table-fixed">
            <TableHeader className="w-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "font-semibold h-12 text-center",
                        header.id === "task" && "border-r w-16 md:w-80",
                        header.id === "status" && "w-32",
                        header.id === "progress" && "w-32",
                        header.id === "expected_time" && "w-32",
                        header.id === "dates" && "w-32",
                        header.id === "project" && "w-32"
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="w-full">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-100 transition-colors h-16">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3"
                      style={{
                        textAlign: cell.column.id === "expected_time" || cell.column.id === "dates" ? "left" : "center",
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EmptyState hasTasks={hasTasks} hasTaskIsLoading={hasTaskIsLoading ?? true} isLoading={isLoading ?? true} tasksLength={tasks.length} />

      <div ref={infinitRef} />
    </div>
  );
}
