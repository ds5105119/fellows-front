"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { createIssue, updateIssue, deleteIssue, IssueFilters, useIssues } from "@/hooks/fetch/issue";
import type { Issue, CreateIssueData, UpdateIssueData } from "@/@types/service/issue";
import IssueList from "@/components/section/service/project/issue/issue-list";
import IssueForm from "@/components/section/service/project/issue/issue-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { toast } from "sonner";
import { Search, Plus, Filter, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

export default function IssuesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({});

  // 모든 필터를 SWR에 전달
  const IssueSwr = useIssues({ ...filters, size: 50 });

  const handleCreateClick = () => {
    setSelectedIssue(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateIssueData | UpdateIssueData) => {
    setIsSubmitting(true);
    try {
      if (selectedIssue) {
        await updateIssue(selectedIssue.name, data as UpdateIssueData);
      } else {
        await createIssue(data as CreateIssueData);
      }
      IssueSwr.mutate();
      setIsFormOpen(false);
    } catch {
      toast(selectedIssue ? "이슈 수정에 실패했습니다." : "이슈 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIssue) return;

    setIsSubmitting(true);
    try {
      await deleteIssue(selectedIssue.name);
      IssueSwr.mutate();
      setIsDeleteDialogOpen(false);
    } catch {
      toast("이슈 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

    const cleanedFilters = Object.fromEntries(Object.entries(newFilters).filter(([, value]) => value !== undefined)) as IssueFilters;

    setFilters(cleanedFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof IssueFilters];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

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
            <Button onClick={handleCreateClick} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto border-0">
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

      <IssueList swr={IssueSwr} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />

      <IssueForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} issue={selectedIssue} isLoading={isSubmitting} />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이슈 삭제</DialogTitle>
            <DialogDescription>정말로 이 이슈를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              <strong>제목:</strong> {selectedIssue?.subject}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0">
              취소
            </Button>
            <Button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white border-0">
              {isSubmitting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
