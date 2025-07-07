"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { createIssue, updateIssue, deleteIssue, type IssueFilters, useIssues } from "@/hooks/fetch/issue";
import type { Issue, CreateIssueData, UpdateIssueData } from "@/@types/service/issue";
import { IssueFilterHeader } from "./issue-filter-header";
import { IssueList } from "./issue-list";
import { IssueForm } from "./issue-form";
import { IssueDeleteDialog } from "./issue-delete-dialog";
import { IssueEmptyState } from "./issue-empty-state";
import { IssueSkeleton } from "./issue-skeleton";
import { toast } from "sonner";
import useThrottle from "@/lib/useThrottle";

export default function IssueMain() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({});
  const [keywordText, setKeywordText] = useState<string>("");

  const keyword = useThrottle(keywordText, 500);

  // SWR 훅들
  const IssueSwr = useIssues({ ...filters, keyword, size: 50 });
  const hasIssueSwr = useIssues({ size: 1 }, { refreshInterval: 0 });

  // 데이터 처리
  const issues = IssueSwr.data?.flatMap((issue) => issue.items) ?? [];
  const isReachedEnd = IssueSwr.data && IssueSwr.data.length > 0 && IssueSwr.data[IssueSwr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && (IssueSwr.isLoading || (IssueSwr.data && IssueSwr.size > 0 && typeof IssueSwr.data[IssueSwr.size - 1] === "undefined"));
  const hasIssueLoading = hasIssueSwr.isLoading || (hasIssueSwr.data && hasIssueSwr.size > 0 && typeof hasIssueSwr.data[hasIssueSwr.size - 1] === "undefined");
  const hasIssue = (hasIssueSwr.data?.flatMap((issue) => issue.items) ?? []).length !== 0;

  console.log(hasIssue, hasIssueLoading, isLoading, issues.length);

  // 무한 스크롤
  const infinitRef = useRef<HTMLDivElement>(null);
  const isReachingEnd = useInView(infinitRef, {
    once: false,
    margin: "-50px 0px -50px 0px",
  });

  // 이벤트 핸들러들
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
        toast.success("이슈가 성공적으로 수정되었습니다.");
      } else {
        await createIssue(data as CreateIssueData);
        toast.success("이슈가 성공적으로 등록되었습니다.");
      }
      IssueSwr.mutate();
      setIsFormOpen(false);
    } catch {
      toast.error(selectedIssue ? "이슈 수정에 실패했습니다." : "이슈 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIssue) return;
    setIsSubmitting(true);
    try {
      await deleteIssue(selectedIssue.name);
      toast.success("이슈가 성공적으로 삭제되었습니다.");
      IssueSwr.mutate();
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error("이슈 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd && hasIssue) {
      IssueSwr.setSize((s) => s + 1);
    }
  }, [isReachingEnd, isLoading, isReachedEnd, hasIssue]);

  return (
    <div className="w-full h-full">
      <IssueFilterHeader
        filters={filters}
        setFilters={setFilters}
        keywordText={keywordText}
        setKeywordText={setKeywordText}
        onCreateClick={handleCreateClick}
      />

      <div className="bg-white border-y border-gray-200">
        <IssueEmptyState hasIssue={hasIssue} hasIssueLoading={hasIssueLoading} isLoading={isLoading} issuesLength={issues.length} />

        <IssueList issues={issues} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} isValidating={IssueSwr.isValidating} />

        {isLoading && hasIssue && <IssueSkeleton count={IssueSwr.data?.length === 1 ? 3 : 8} />}

        <div ref={infinitRef} />

        {issues.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50">총 {issues.length}개의 이슈</div>}
      </div>

      <IssueForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} issue={selectedIssue} isLoading={isSubmitting} />

      <IssueDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        issue={selectedIssue}
        isLoading={isSubmitting}
      />
    </div>
  );
}
