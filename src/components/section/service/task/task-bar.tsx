"use client";

import { useMemo } from "react";
import Color from "color";
import dayjs from "@/lib/dayjs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { FilePenLine, ClockIcon, ArrowRight, RectangleEllipsis, FolderIcon } from "lucide-react";
import type { ERPNextTaskForUser } from "@/@types/service/project";
import type { DateRange } from "./gantt-chart";
import Link from "next/link";
import { useProjectOverView } from "@/hooks/fetch/project";

interface TaskBarProps {
  task: ERPNextTaskForUser;
  dateRange: DateRange;
}

export function TaskBar({ task, dateRange }: TaskBarProps) {
  const overviewProjectSwr = useProjectOverView();

  const barStyle = useMemo(() => {
    if (!task.exp_start_date || !task.exp_end_date) return null;

    const taskStart = dayjs(task.exp_start_date).startOf("day");
    const taskEnd = dayjs(task.exp_end_date).endOf("day");
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
  }, [task.exp_start_date, task.exp_end_date, dateRange]);

  if (!task.exp_start_date || !task.exp_end_date) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-1/2 border-2 px-2 border-dashed border-gray-300 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500">No dates set</span>
      </div>
    );
  }

  if (!barStyle) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
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
              opacity: 0.4,
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
      </PopoverTrigger>
      <PopoverContent className="drop-shadow-2xl p-0 rounded-xl md:w-[342px]">
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex space-x-3">
            <FilePenLine className="!size-4 mt-[1.5px] shrink-0" />
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-bold">{task.subject}</div>
              <div className="text-xs font-normal">{task.description}</div>
            </div>
          </div>
          <div className="flex space-x-3">
            <FolderIcon className="!size-4 mt-[1.5px] shrink-0" />
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-bold">프로젝트명</div>
              <div className="text-xs font-normal">
                {overviewProjectSwr.data?.items.flatMap((item) => item).find((project) => project.project_name === task.project)?.custom_project_title ??
                  "프로젝트가 정해지지 않았거나 아직 등록되지 않았어요."}
              </div>
            </div>
          </div>
          <div className="flex space-x-3 w-full">
            <ClockIcon className="!size-4 shrink-0" />
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex space-x-2 items-center">
                <div className="text-xs font-semibold">{dayjs(task.exp_start_date).format("LL")}</div>
                <ArrowRight className="!size-3.5 text-zinc-400" />
                <div className="text-xs font-semibold">{dayjs(task.exp_end_date).format("LL")}</div>
              </div>
              <div className="text-xs font-semibold text-zinc-400">총 {task.expected_time}시간</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RectangleEllipsis className="!size-4 mt-[1.5px] shrink-0" />
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-normal">
                <span className="font-bold">진행률:&nbsp;</span>
                {task.progress}%
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="px-2 py-2 flex justify-between">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 w-fit px-2" asChild>
              <Link href={`/service/project/${task.project}`}>프로젝트로 이동</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 w-fit px-2" asChild>
              <Link href={`/service/project/${task.project}`}>이슈 생성</Link>
            </Button>
          </div>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-500 w-fit">
              확인
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
