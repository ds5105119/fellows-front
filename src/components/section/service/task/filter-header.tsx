"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ChevronLeft, FilterIcon, SearchIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import { erpNextTaskStatusEnum, type ERPNextTaskStatus } from "@/@types/service/project";
import { statusConfig } from "@/components/resource/project";
import DatePicker from "./datepicker";
import dayjs from "@/lib/dayjs";
import type { Dayjs } from "dayjs";
import type { TimeUnit } from "./gantt-chart";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useProjectOverView } from "@/hooks/fetch/project";

export interface DateRange {
  start?: Dayjs;
  end?: Dayjs;
  intervals?: Dayjs[];
}

interface GanttHeaderProps {
  showControl: boolean;
  timeUnit?: TimeUnit;
  setTimeUnit?: (unit: TimeUnit) => void;
  currentDate?: Dayjs;
  setCurrentDate?: (date: Dayjs) => void;
  dateRange: DateRange;
  setDateRange: (start?: Dayjs, end?: Dayjs) => void;
  taskExpended: boolean;
  setTaskExpanded: (expanded: boolean) => void;
  deepSearch: boolean;
  setDeepSearch: (search: boolean) => void;
  status: ERPNextTaskStatus[] | null;
  setStatus: (status: ERPNextTaskStatus[] | null) => void;
  keywordText: string;
  setKeywordText: (text: string) => void;
  projectId: string[] | null;
  setProjectId: (id: string[] | null) => void;
}

export function FilterHeader({
  showControl,
  timeUnit,
  setTimeUnit,
  currentDate,
  setCurrentDate,
  dateRange,
  setDateRange,
  taskExpended,
  setTaskExpanded,
  deepSearch,
  setDeepSearch,
  status,
  setStatus,
  keywordText,
  setKeywordText,
  projectId,
  setProjectId,
}: GanttHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectsOverview = useProjectOverView();
  const overviewProjects = projectsOverview?.data?.items || [];

  // URL 쿼리 파라미터 업데이트 함수
  const updateUrlParams = useCallback(
    (newStatus: ERPNextTaskStatus[] | null, newProjectId: string[] | null, newKeyword: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // 기존 파라미터 제거
      params.delete("status");
      params.delete("project_id");
      params.delete("keyword");

      // 새로운 파라미터 추가
      if (newStatus && newStatus.length > 0) {
        newStatus.forEach((s) => params.append("status", s));
      }

      if (newProjectId && newProjectId.length > 0) {
        newProjectId.forEach((id) => params.append("project_id", id));
      }

      if (newKeyword.trim()) {
        params.set("keyword", newKeyword);
      }

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  // URL에서 초기 상태 읽어오기
  useEffect(() => {
    const urlStatus = searchParams.getAll("status") as ERPNextTaskStatus[];
    const urlProjectId = searchParams.getAll("project_id");
    const urlKeyword = searchParams.get("keyword") || "";

    if (urlStatus.length > 0 && JSON.stringify(urlStatus.sort()) !== JSON.stringify((status || []).sort())) {
      setStatus(urlStatus);
    }

    if (urlProjectId.length > 0 && JSON.stringify(urlProjectId.sort()) !== JSON.stringify((projectId || []).sort())) {
      setProjectId(urlProjectId);
    }

    if (urlKeyword !== keywordText) {
      setKeywordText(urlKeyword);
    }
  }, []);

  // 상태 변경 시 URL 업데이트
  useEffect(() => {
    updateUrlParams(status, projectId, keywordText);
  }, [status, projectId, keywordText, updateUrlParams]);

  const navigatePrevious = () => {
    switch (timeUnit) {
      case "day":
        if (setCurrentDate && currentDate) setCurrentDate(currentDate.subtract(1, "week"));
        break;
      case "week":
        if (setCurrentDate && currentDate) setCurrentDate(currentDate.subtract(1, "week"));
        break;
      case "month":
        if (setCurrentDate && currentDate) setCurrentDate(currentDate.subtract(1, "month"));
        break;
    }
  };

  const navigateNext = () => {
    switch (timeUnit) {
      case "day":
        if (setCurrentDate && currentDate) setCurrentDate(currentDate.add(1, "week"));
        break;
      case "week":
        if (setCurrentDate && currentDate) setCurrentDate(currentDate.add(1, "week"));
        break;
      case "month":
        if (setCurrentDate && currentDate) setCurrentDate(currentDate.add(1, "month"));
        break;
    }
  };

  const navigateToToday = () => {
    if (setCurrentDate) setCurrentDate(dayjs());
  };

  // Format date range for display
  const formatDateRange = () => {
    const { start, end } = dateRange;
    if (!start || !end) return "";

    switch (timeUnit) {
      case "day":
        return `${start.format("YYYY.MM.DD")} - ${end.format("MM.DD")}`;
      case "week":
        return `${start.format("YYYY.MM.DD")} - ${end.format("MM.DD")}`;
      case "month":
        return `${start.format("YYYY.MM")} - ${end.format("MM")}`;
    }
  };

  // 개별 상태 제거
  const removeStatus = (statusToRemove: ERPNextTaskStatus) => {
    if (status) {
      const newStatus = status.filter((s) => s !== statusToRemove);
      setStatus(newStatus.length > 0 ? newStatus : null);
    }
  };

  // 개별 프로젝트 제거
  const removeProject = (projectToRemove: string) => {
    if (projectId) {
      const newProjectId = projectId.filter((id) => id !== projectToRemove);
      setProjectId(newProjectId.length > 0 ? newProjectId : null);
    }
  };

  // 모든 필터 제거
  const clearAllFilters = () => {
    setStatus(null);
    setProjectId(null);
    setKeywordText("");
  };

  // 활성 필터 개수 계산
  const activeFiltersCount = (status?.length || 0) + (projectId?.length || 0) + (keywordText ? 1 : 0);

  if (!showControl) return null;

  return (
    <div className="sticky z-30 top-24 md:top-32 bg-background flex flex-col gap-3 w-full py-3 px-6 border-b border-b-sidebar-border">
      <div className="flex w-full justify-between items-center h-8">
        <div className="flex items-center gap-2">
          {setTimeUnit && (
            <ComboBoxResponsive
              statuses={[
                { label: "일별", value: "day" },
                { label: "주별", value: "week" },
                { label: "월별", value: "month" },
              ]}
              initial={timeUnit}
              callback={(value: string) => setTimeUnit(value as TimeUnit)}
            />
          )}

          {/* Navigation Controls */}
          {setCurrentDate && dateRange && (
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
          )}

          {setCurrentDate && dateRange && (
            <Button variant="ghost" size="sm" onClick={navigateToToday} className="text-xs font-bold text-blue-400 hover:text-blue-500 px-2 h-7">
              오늘
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="font-semibold hidden md:flex" onClick={() => setDeepSearch(!deepSearch)}>
            {deepSearch ? "상세검색 끄기" : "상세검색 켜기"}
          </Button>
          <Button variant="secondary" size="sm" className="font-semibold md:hidden" onClick={() => setDeepSearch(!deepSearch)}>
            {deepSearch ? "상세검색" : "일반검색"}
          </Button>
          <Button variant="secondary" size="sm" className="font-semibold hidden md:flex" onClick={() => setTaskExpanded(!taskExpended)}>
            {taskExpended ? "접기" : "펼치기"}
          </Button>
          <Button variant="secondary" size="sm" className="font-semibold md:hidden" onClick={() => setTaskExpanded(!taskExpended)}>
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
                  className="rounded-sm bg-muted font-bold flex items-center !pl-1.5 !h-8 py-0 hover:bg-zinc-200 transition-colors duration-300 relative"
                >
                  <FilterIcon className="!size-4 ml-1" />
                  필터
                  {activeFiltersCount > 0 && (
                    <div className="rounded-[3px] ml-2 py-0.5 px-1.5 text-xs flex items-center justify-center bg-amber-400">{activeFiltersCount}</div>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="drop-shadow-white/10 drop-shadow-2xl p-0 h-3/4 max-h-3/4 overflow-y-auto scrollbar-hide focus-visible:ring-0"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle className="sr-only">필터 창</DialogTitle>
                  <DialogDescription className="sr-only" />
                </DialogHeader>
                <div className="w-full h-full flex flex-col">
                  <div className="sticky top-0 w-full px-6 py-3.5 border-b border-b-muted bg-white font-bold">필터 추가하기</div>
                  <div className="w-full h-full flex flex-col p-6 space-y-6">
                    <div className="w-full flex flex-col space-y-3">
                      <div className="w-full flex items-center space-x-3">
                        <p className="text-sm font-bold">작업 상태</p>
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
                            <div key={idx} className="flex space-x-2 text-xs md:text-sm font-semibold">
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

                    <div className="w-full flex flex-col space-y-3">
                      <div className="w-full flex items-center space-x-3">
                        <p className="text-sm font-bold">프로젝트</p>
                        <button
                          disabled={projectId == null}
                          onClick={() => setProjectId(null)}
                          className="cursor-pointer select-none px-2 py-1 rounded-sm bg-muted text-xs font-bold flex items-center hover:bg-zinc-200 transition-colors duration-300"
                        >
                          <p>전체 해제</p>
                        </button>
                      </div>
                      <div className="w-full grid grid-cols-3 gap-3">
                        <Command className="col-span-full rounded-sm bg-zinc-50">
                          <CommandInput placeholder="프로젝트 이름 또는 ID 입력" />
                          <CommandList className="max-h-64 overflow-y-auto scrollbar-hide">
                            <CommandEmpty>결과가 없어요</CommandEmpty>
                            <CommandGroup>
                              {overviewProjects
                                .filter((i) => (projectId ? !projectId.includes(i.project_name) : true))
                                .map((val, idx) => {
                                  return (
                                    <CommandItem
                                      key={idx}
                                      className="flex items-center space-x-2 data-[selected=true]:bg-zinc-100 cursor-pointer"
                                      value={val.project_name + " " + val.custom_project_title}
                                      onSelect={() =>
                                        projectId?.includes(val.project_name)
                                          ? projectId && projectId.length == 1
                                            ? setProjectId(null)
                                            : setProjectId(projectId.filter((v) => v !== val.project_name))
                                          : projectId
                                          ? setProjectId([...projectId, val.project_name])
                                          : setProjectId([val.project_name])
                                      }
                                    >
                                      <p className="w-1/3 truncate font-semibold">{val.custom_project_title}</p>
                                      <p className="grow truncate text-xs">{val.project_name}</p>
                                    </CommandItem>
                                  );
                                })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <div className="col-span-full w-full flex items-center space-x-3">
                          <p className="text-sm font-bold">선택된 프로젝트</p>
                          <p className="text-sm font-normal">클릭하여 필터에서 제외하세요</p>
                        </div>
                        <div className="col-span-full max-h-24 grow overflow-y-auto scrollbar-hide flex flex-col space-y-1 p-1 bg-zinc-50">
                          {projectId?.map((val, idx) => {
                            return (
                              <div
                                key={idx}
                                className="rounded-sm bg-zinc-100 flex items-center space-x-4.5 px-2 py-1 cursor-pointer hover:bg-zinc-200 transition-colors duration-300"
                                onClick={() => (projectId && projectId.length == 1 ? setProjectId(null) : setProjectId(projectId.filter((v) => v !== val)))}
                              >
                                <p className="w-1/3 truncate font-semibold text-sm">
                                  {overviewProjects.find((i) => i.project_name == val)?.custom_project_title}
                                </p>
                                <p className="grow truncate text-xs">{val}</p>
                              </div>
                            );
                          })}
                        </div>
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
                value={keywordText}
                onChange={(e) => setKeywordText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center md:justify-end gap-2">
            <DatePicker
              value={dateRange.start?.toDate()}
              onSelect={(date) => {
                if (!date) return setDateRange(undefined, dateRange?.end);
                const newStart = dayjs(date);
                const currentEnd = dateRange?.end;
                // 시작일이 종료일보다 이후이면, 종료일도 같이 변경하거나 무시
                if (currentEnd && newStart.isAfter(currentEnd)) {
                  // 종료일도 시작일과 같게 설정
                  setDateRange(newStart, newStart);
                } else {
                  setDateRange(newStart, currentEnd);
                }
              }}
              text="시작일"
            />
            <DatePicker
              value={dateRange.end?.toDate()}
              onSelect={(date) => {
                if (!date) return setDateRange(dateRange?.start, undefined);
                const newEnd = dayjs(date);
                const currentStart = dateRange?.start;
                // 종료일이 시작일보다 이전이면, 시작일도 같이 변경하거나 무시
                if (currentStart && newEnd.isBefore(currentStart)) {
                  // 시작일도 종료일과 같게 설정
                  setDateRange(newEnd, newEnd);
                } else {
                  setDateRange(currentStart, newEnd);
                }
              }}
              text="종료일"
            />
          </div>
        </div>
      )}

      {/* 활성 필터 표시 */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">활성 필터:</span>

          {/* 상태 필터 */}
          {status?.map((s) => (
            <Badge key={s} variant="secondary" className="flex items-center gap-1 pl-1.5 pr-0.5 rounded-[3px]">
              <span className="text-xs">싱태: {statusConfig[s].text}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 rounded-xs hover:bg-destructive/10 hover:text-destructive-foreground"
                onClick={() => removeStatus(s)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          ))}

          {/* 프로젝트 필터 */}
          {projectId?.map((id) => {
            const project = overviewProjects.find((p) => p.project_name === id);
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1 pl-1.5 pr-0.5 rounded-[3px]">
                <span className="text-xs">프로젝트: {project?.custom_project_title || id}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 rounded-xs hover:bg-destructive/10 hover:text-destructive-foreground"
                  onClick={() => removeProject(id)}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </Badge>
            );
          })}

          {/* 전체 필터 제거 버튼 */}
          <Button variant="outline" size="sm" className="h-6 px-1.5 text-xs bg-transparent rounded-[3px]" onClick={clearAllFilters}>
            전체 해제
          </Button>
        </div>
      )}
    </div>
  );
}
