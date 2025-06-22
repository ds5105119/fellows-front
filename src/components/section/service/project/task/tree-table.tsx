"use client";

import { useMemo, useState, useEffect } from "react";
import { type ColumnDef, type ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, type OnChangeFn, useReactTable } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Calendar, Clock, Expand, Shrink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ERPNextTaskForUser } from "@/@types/service/project";
import { StatusBadge } from "./status-badge";
import { PriorityIndicator } from "./priority-indicator";
import { buildTree, getInitialExpandedState } from "@/lib/task-utils";

export function TreeTable({ tasks }: { tasks: ERPNextTaskForUser[] }) {
  const treeData = useMemo(() => buildTree(tasks), [tasks]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => getInitialExpandedState(tasks, 2));

  const expandAll = () => {
    const newExpanded: Record<string, boolean> = {};

    // 모든 태스크를 펼침 상태로 설정 (TanStack Table의 row ID 시스템 사용)
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
    console.log("Expanding all tasks with IDs:", newExpanded);
    setExpanded(newExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const columns: ColumnDef<ERPNextTaskForUser>[] = [
    {
      id: "task",
      header: "Task",
      cell: ({ row }) => {
        const task = row.original;
        const hasChildren = row.subRows?.length > 0;
        const isExpanded = row.getIsExpanded();

        return (
          <div className="flex items-center gap-2" style={{ paddingLeft: `${row.depth * 24}px` }}>
            {hasChildren && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={row.getToggleExpandedHandler()}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            {!hasChildren && <div className="w-6" />}

            <div className="flex items-center gap-3 min-w-0">
              {task.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />}
              <div className="min-w-0">
                <div className="font-medium text-sm text-gray-900 break-words line-clamp-2">{task.subject}</div>
                <div className="text-xs text-gray-500 font-mono">{task.name}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as ERPNextTaskForUser["status"]} />,
    },
    {
      accessorKey: "progress",
      header: "Progress",
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
      header: "Time",
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
      header: "Timeline",
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
      header: "Project",
      cell: ({ getValue }) => (
        <Badge variant="secondary" className="text-xs">
          {getValue() as string}
        </Badge>
      ),
    },
  ];

  const table = useReactTable({
    data: treeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    onExpandedChange: setExpanded as OnChangeFn<ExpandedState>,
    state: {
      expanded,
    },
  });

  // 디버깅용 - expanded 상태 변화 감지
  useEffect(() => {
    console.log("Expanded state changed:", expanded);
    console.log("Visible rows:", table.getRowModel().rows.length);
  }, [expanded, table]);

  return (
    <div className="space-y-4 w-full max-w-full">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={expandAll} className="flex items-center gap-2">
          <Expand className="h-4 w-4" />
          Expand All ({tasks.length})
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll} className="flex items-center gap-2">
          <Shrink className="h-4 w-4" />
          Collapse All
        </Button>
      </div>

      <div className="w-full border-y overflow-x-auto">
        <div className="min-w-[1200px] w-full">
          <Table className="table-fixed">
            <TableHeader className="w-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold"
                      style={{
                        width:
                          header.id === "task"
                            ? "300px"
                            : header.id === "status"
                            ? "100px"
                            : header.id === "progress"
                            ? "150px"
                            : header.id === "expected_time"
                            ? "120px"
                            : header.id === "dates"
                            ? "200px"
                            : header.id === "project"
                            ? "130px"
                            : "auto",
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="w-full">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="y-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
