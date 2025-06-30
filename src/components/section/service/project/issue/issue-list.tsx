"use client";
import { useState, useEffect } from "react";
import { useIssues, IssueFilters } from "@/hooks/fetch/issue";
import type { Issue, IssueType } from "@/@types/service/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Plus, Edit, Trash2, Building, Clock, Filter, X, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface IssueListProps {
  onCreateClick: () => void;
  onEditClick: (issue: Issue) => void;
  onDeleteClick: (issue: Issue) => void;
  onRefreshReady: (refreshFn: () => void) => void;
}

const getIssueTypeColor = (type: IssueType | null) => {
  switch (type) {
    case "Design":
      return "bg-purple-50 text-purple-700";
    case "Feature":
      return "bg-blue-50 text-blue-700";
    case "ETC":
      return "bg-gray-50 text-gray-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

const getPriorityColor = (priority: string | null) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "높음":
      return "bg-red-50 text-red-700";
    case "medium":
    case "보통":
      return "bg-amber-50 text-amber-700";
    case "low":
    case "낮음":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "open":
    case "열림":
      return "bg-emerald-50 text-emerald-700";
    case "in progress":
    case "진행중":
      return "bg-blue-50 text-blue-700";
    case "closed":
    case "완료":
      return "bg-gray-50 text-gray-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

// Multi-select 컴포넌트
const MultiSelect = ({
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-40 justify-between border-0 bg-muted hover:bg-muted focus:bg-muted focus:ring-0 focus:outline-0 shadow-none"
          disabled={disabled}
        >
          {value.length > 0 ? `${value.length}개 선택` : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  const newValue = value.includes(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value];
                  onValueChange(newValue);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value.includes(option.value) ? "opacity-100" : "opacity-0")} />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function IssueList({ onCreateClick, onEditClick, onDeleteClick, onRefreshReady }: IssueListProps) {
  const [filters, setFilters] = useState<IssueFilters>({});

  // 모든 필터를 SWR에 전달
  const { data, isValidating, mutate } = useIssues({
    keyword: filters.keyword,
    issue_type: filters.issue_type,
    status: filters.status,
    project_id: filters.project_id,
    start: filters.start,
    end: filters.end,
    size: 50,
  });

  const issues = data?.flatMap((item) => item.items) ?? [];

  // 부모 컴포넌트에 refresh 함수 전달
  useEffect(() => {
    onRefreshReady(() => mutate());
  }, [mutate, onRefreshReady]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value || undefined }));
  };

  const handleMultiSelectChange = (key: keyof IssueFilters, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value.length > 0 ? value : undefined }));
  };

  const handleFilterChange = (key: keyof IssueFilters, value: string | undefined) => {
    if (value) setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: keyof IssueFilters) => {
    const newFilters = { ...filters };
    newFilters[key] = undefined;

    const cleanedFilters = Object.fromEntries(Object.entries(newFilters).filter(([__, value]) => value !== undefined)) as IssueFilters;

    setFilters(cleanedFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof IssueFilters];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  // 이슈 아이템 컴포넌트
  const IssueItem = ({ issue }: { issue: Issue }) => (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* 상태 인디케이터 */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <div
            className={`w-3 h-3 rounded-full ${
              issue.status?.toLowerCase() === "open"
                ? "bg-green-500"
                : issue.status?.toLowerCase() === "in progress"
                ? "bg-blue-500"
                : issue.status?.toLowerCase() === "closed"
                ? "bg-gray-400"
                : "bg-gray-300"
            }`}
          />
        </div>

        {/* 제목과 부제목 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">{issue.subject}</h3>
            {issue.custom_sub && <span className="text-sm text-gray-500 truncate hidden sm:inline">{issue.custom_sub}</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {issue.project && (
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {issue.project}
              </span>
            )}
            {issue.creation && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(issue.creation), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            )}
          </div>
        </div>

        {/* 배지들 - 태블릿 이상에서 표시 */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {issue.issue_type && (
            <Badge className={`text-xs border-0 ${getIssueTypeColor(issue.issue_type)}`}>
              {issue.issue_type === "Design" ? "디자인" : issue.issue_type === "Feature" ? "기능" : "기타"}
            </Badge>
          )}
          {issue.priority && <Badge className={`text-xs border-0 ${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>}
        </div>

        {/* 상태 - 데스크톱에서 표시 */}
        <div className="hidden md:block flex-shrink-0">
          {issue.status && <Badge className={`text-xs border-0 ${getStatusColor(issue.status)}`}>{issue.status}</Badge>}
        </div>

        {/* 회사 - 큰 화면에서 표시 */}
        <div className="hidden lg:block text-sm text-gray-500 flex-shrink-0 w-24 truncate">{issue.company || "-"}</div>
      </div>

      {/* 액션 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 border-0 hover:bg-gray-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEditClick(issue)}>
            <Edit className="w-4 h-4 mr-2" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDeleteClick(issue)} className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // 스켈레톤 컴포넌트
  const SkeletonItem = () => (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-32 hidden sm:block" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12" />
        </div>
        <div className="hidden md:block flex-shrink-0">
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-14" />
        </div>
        <div className="hidden lg:block w-24">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
        </div>
      </div>
      <div className="w-8 h-8 bg-gray-100 rounded animate-pulse flex-shrink-0" />
    </div>
  );

  return (
    <div>
      {/* 필터 및 검색 */}
      <div>
        <div className="flex flex-col gap-4 p-4">
          {/* 첫 번째 줄: 검색과 새 이슈 등록 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이슈 제목, 설명으로 검색..."
                  value={filters.keyword || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 border-0 bg-muted hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:outline-0 shadow-none"
                />
              </div>
            </div>
            <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto border-0">
              <Plus className="w-4 h-4 mr-2" />새 이슈 등록
            </Button>
          </div>

          {/* 두 번째 줄: 필터들 */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              {/* 이슈 타입 필터 - Multi Select */}
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

              {/* 상태 필터 - Multi Select */}
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

              {/* 날짜 범위 필터 */}
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="시작일"
                  value={filters.start || ""}
                  onChange={(e) => handleFilterChange("start", e.target.value || undefined)}
                  className="w-full sm:w-36 border-0 bg-muted hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:outline-0 shadow-none"
                />
                <Input
                  type="date"
                  placeholder="종료일"
                  value={filters.end || ""}
                  onChange={(e) => handleFilterChange("end", e.target.value || undefined)}
                  className="w-full sm:w-36 border-0 bg-muted hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:outline-0 shadow-none"
                />
              </div>
            </div>

            {/* 필터 초기화 */}
            {activeFiltersCount > 0 && (
              <Button onClick={clearAllFilters} className="bg-white hover:bg-gray-100 text-gray-700 border-0">
                <Filter className="w-4 h-4 mr-2" />
                필터 초기화 ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* 활성 필터 표시 */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.issue_type && filters.issue_type.length > 0 && (
                <Badge className="flex items-center gap-1 bg-gray-200 text-gray-700 border-0">
                  타입: {filters.issue_type.map((type) => (type === "Design" ? "디자인" : type === "Feature" ? "기능" : "기타")).join(", ")}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter("issue_type");
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.status && filters.status.length > 0 && (
                <Badge className="flex items-center gap-1 bg-gray-200 text-gray-700 border-0">
                  상태: {filters.status.join(", ")}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter("status");
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.start && (
                <Badge className="flex items-center gap-1 bg-gray-200 text-gray-700 border-0">
                  시작일: {filters.start}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter("start");
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.end && (
                <Badge className="flex items-center gap-1 bg-gray-200 text-gray-700 border-0">
                  종료일: {filters.end}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter("end");
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 이슈 목록 */}
      <div className="bg-white border-y border-gray-200 relative">
        {/* 목록 */}
        <div>
          {issues.length === 0 ? (
            // 빈 상태
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 이슈가 없습니다</h3>
              <p className="text-gray-500 mb-6">새로운 이슈를 등록해보세요</p>
              <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700 border-0">
                <Plus className="w-4 h-4 mr-2" />첫 번째 이슈 등록하기
              </Button>
            </div>
          ) : (
            // 이슈 목록
            issues.map((issue) => <IssueItem key={issue.name} issue={issue} />)
          )}
        </div>

        {/* 로딩 오버레이 */}
        {isValidating && issues.length > 0 && (
          <div className="bg-white/70">
            <div className="space-y-0">
              {[...Array(Math.min(5, issues.length))].map((_, i) => (
                <SkeletonItem key={`skeleton-${i}`} />
              ))}
            </div>
          </div>
        )}

        {/* 결과 개수 */}
        {issues.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50">총 {issues.length}개의 이슈</div>}
      </div>
    </div>
  );
}
