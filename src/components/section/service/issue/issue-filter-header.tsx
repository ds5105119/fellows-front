"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import type { IssueFilters } from "@/hooks/fetch/issue";
import { MultiSelect } from "./multi-select";
import DatePicker from "../task/datepicker";
import dayjs from "@/lib/dayjs";
import { OverviewERPNextProject } from "@/@types/service/project";

interface IssueFilterHeaderProps {
  filters: IssueFilters;
  setFilters: (filters: IssueFilters) => void;
  keywordText: string;
  setKeywordText: (text: string) => void;
  onCreateClick: () => void;
  overviewProjects: OverviewERPNextProject[];
}

export function IssueFilterHeader({ filters, setFilters, keywordText, overviewProjects, setKeywordText, onCreateClick }: IssueFilterHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터 업데이트
  const updateUrlParams = useCallback(
    (newFilters: IssueFilters, newKeyword: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // 기존 파라미터 제거
      params.delete("issue_type");
      params.delete("status");
      params.delete("start");
      params.delete("end");
      params.delete("keyword");

      // 새로운 파라미터 추가
      if (newFilters.issue_type && newFilters.issue_type.length > 0) {
        newFilters.issue_type.forEach((type) => params.append("issue_type", type));
      }

      if (newFilters.status && newFilters.status.length > 0) {
        newFilters.status.forEach((status) => params.append("status", status));
      }

      if (newFilters.start) {
        params.set("start", newFilters.start);
      }

      if (newFilters.end) {
        params.set("end", newFilters.end);
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
    const urlIssueType = searchParams.getAll("issue_type");
    const urlStatus = searchParams.getAll("status");
    const urlStart = searchParams.get("start") || "";
    const urlEnd = searchParams.get("end") || "";
    const urlKeyword = searchParams.get("keyword") || "";

    const newFilters: IssueFilters = {};

    if (urlIssueType.length > 0) newFilters.issue_type = urlIssueType;
    if (urlStatus.length > 0) newFilters.status = urlStatus;
    if (urlStart) newFilters.start = urlStart;
    if (urlEnd) newFilters.end = urlEnd;

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }

    if (urlKeyword !== keywordText) {
      setKeywordText(urlKeyword);
    }
  }, []);

  // 상태 변경 시 URL 업데이트
  useEffect(() => {
    updateUrlParams(filters, keywordText);
  }, [filters, keywordText, updateUrlParams]);

  const handleMultiSelectChange = (key: keyof IssueFilters, value: string[]) => {
    setFilters({ ...filters, [key]: value.length > 0 ? value : undefined });
  };

  const handleFilterChange = (key: keyof IssueFilters, value: string | undefined) => {
    if (value) {
      setFilters({ ...filters, [key]: value });
    }
  };

  const clearFilter = (key: keyof IssueFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const clearMultiSelectFilter = (key: keyof IssueFilters, value: string) => {
    const newFilters = { ...filters };

    const currentValue = newFilters[key];

    if (Array.isArray(currentValue)) {
      const filtered = currentValue.filter((item) => item !== value);

      if (filtered.length > 0) {
        (newFilters as Record<keyof IssueFilters, unknown>)[key] = filtered;
      } else {
        delete newFilters[key];
      }
    } else {
      delete newFilters[key];
    }

    setFilters(newFilters);
  };

  const activeFiltersCount =
    Object.keys(filters).filter((key) => {
      const value = filters[key as keyof IssueFilters];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    }).length + (keywordText ? 1 : 0);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Design":
        return "디자인";
      case "Feature":
        return "기능";
      case "ETC":
        return "기타";
      default:
        return type;
    }
  };

  return (
    <div className="sticky z-30 top-24 md:top-32 bg-background flex flex-col gap-3 w-full py-3 px-6 xl:px-3 border-b border-b-sidebar-border">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 flex-1">
          <div className="flex flex-col sm:flex-row flex-1 gap-2">
            <div className="w-full sm:max-w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이슈 제목, 설명으로 검색..."
                  value={keywordText}
                  onChange={(e) => setKeywordText(e.target.value)}
                  className="pl-9 h-8 border-0 bg-muted hover:bg-muted focus:bg-muted focus-visible:ring-0 shadow-none"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-1 sm:flex-0">
            <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700 h-8 px-6 ml-auto">
              <Plus className="w-4 h-4 mr-2" />새 이슈 등록
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 flex-1">
        <div className="flex gap-2">
          <MultiSelect
            options={[
              { value: "Design", label: "디자인" },
              { value: "Feature", label: "기능" },
              { value: "ETC", label: "기타" },
            ]}
            value={filters.issue_type || []}
            onValueChange={(value) => handleMultiSelectChange("issue_type", value)}
            placeholder="타입"
          />
          <MultiSelect
            options={[
              { value: "Open", label: "열림" },
              { value: "Working", label: "진행중" },
              { value: "Pending Review", label: "검토 대기" },
              { value: "Completed", label: "완료" },
              { value: "Cancelled", label: "취소" },
            ]}
            value={filters.status || []}
            onValueChange={(value) => handleMultiSelectChange("status", value)}
            placeholder="상태"
          />
        </div>

        <div className="flex gap-2">
          <DatePicker
            value={dayjs(filters.start).toDate()}
            onSelect={(date) => {
              if (!date) return;
              const newStart = dayjs(date);
              const currentEnd = dayjs(filters.end);
              // 시작일이 종료일보다 이후이면, 종료일도 같이 변경하거나 무시
              if (currentEnd && newStart.isAfter(currentEnd)) {
                // 종료일도 시작일과 같게 설정
                handleFilterChange("start", filters.end);
              } else {
                handleFilterChange("start", newStart.format("YYYY-MM-DD"));
              }
            }}
            text="시작일"
          />
          <DatePicker
            value={dayjs(filters.end).toDate()}
            onSelect={(date) => {
              if (!date) return;
              const newEnd = dayjs(date);
              const currentStart = dayjs(filters.start);
              // 종료일이 시작일보다 이전이면, 시작일도 같이 변경하거나 무시
              if (currentStart && newEnd.isBefore(currentStart)) {
                // 시작일도 종료일과 같게 설정
                handleFilterChange("end", filters.start);
              } else {
                handleFilterChange("end", newEnd.format("YYYY-MM-DD"));
              }
            }}
            text="종료일"
          />
        </div>
      </div>

      {/* 활성 필터 표시 */}
      {activeFiltersCount > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">활성 필터:</span>

          {keywordText && (
            <Badge variant="secondary" className="flex items-center gap-1 pl-1.5 pr-0.5 rounded-[3px]">
              <span className="text-xs">검색: {keywordText}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive-foreground"
                onClick={() => setKeywordText("")}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          )}

          {filters.issue_type?.map((type) => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1 pl-1.5 pr-0.5 rounded-[3px]">
              <span className="text-xs">타입: {getTypeLabel(type)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive-foreground"
                onClick={() => clearFilter("issue_type")}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          ))}

          {filters.status?.map((status) => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1 pl-1.5 pr-0.5 rounded-[3px]">
              <span className="text-xs">상태: {status}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive-foreground"
                onClick={() => clearMultiSelectFilter("status", status)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          ))}

          {filters.project_id?.map((projectId) => (
            <Badge key={projectId} variant="secondary" className="flex items-center gap-1 pl-1.5 pr-0.5 rounded-[3px]">
              <span className="text-xs">이름: {overviewProjects.find((project) => project.project_name == projectId)?.custom_project_title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive-foreground"
                onClick={() => clearMultiSelectFilter("project_id", projectId)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
