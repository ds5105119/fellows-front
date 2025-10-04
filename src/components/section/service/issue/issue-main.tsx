"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Session } from "next-auth";
import dayjs from "@/lib/dayjs";
import { useProjectOverView, useTasks } from "@/hooks/fetch/project";
import IssueSidebar from "./issue-sidebar";

export default function IssueMain({ session }: { session: Session }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({
    start: dayjs(new Date()).subtract(1, "year").format("YYYY-MM-DD"),
    end: dayjs(new Date()).format("YYYY-MM-DD"),
  });
  const [keywordText, setKeywordText] = useState<string>("");
  const keyword = useThrottle(keywordText, 500);

  // SWR 훅들
  const IssueSwr = useIssues({ ...filters, keyword, size: 50 }, { initialSize: 2 });
  const hasIssueSwr = useIssues({ size: 1 }, { refreshInterval: 0 });
  const projectsOverview = useProjectOverView();
  const overviewProjects = projectsOverview?.data?.items || [];
  const TasksSwr = useTasks({
    size: 50,
  });

  // 데이터 처리
  const issues = IssueSwr.data?.flatMap((issue) => issue.items) ?? [];
  const isReachedEnd = IssueSwr.data && IssueSwr.data.length > 0 && IssueSwr.data[IssueSwr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && (IssueSwr.isLoading || (IssueSwr.data && IssueSwr.size > 0 && typeof IssueSwr.data[IssueSwr.size - 1] === "undefined"));
  const hasIssueLoading = hasIssueSwr.isLoading || (hasIssueSwr.data && hasIssueSwr.size > 0 && typeof hasIssueSwr.data[hasIssueSwr.size - 1] === "undefined");
  const hasIssue = (hasIssueSwr.data?.flatMap((issue) => issue.items) ?? []).length !== 0;

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

  // URL 쿼리 파라미터 업데이트
  const updateUrlParams = useCallback(
    (newFilters: IssueFilters, newKeyword: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // 기존 파라미터 제거
      params.delete("issue_type");
      params.delete("status");
      params.delete("project_id");
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

      if (newFilters.project_id && newFilters.project_id.length > 0) {
        newFilters.project_id.forEach((project_id) => params.append("project_id", project_id));
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
    const urlProjectId = searchParams.getAll("project_id");
    const urlStart = searchParams.get("start") || "";
    const urlEnd = searchParams.get("end") || "";
    const urlKeyword = searchParams.get("keyword") || "";

    const newFilters: IssueFilters = {};

    if (urlIssueType.length > 0) newFilters.issue_type = urlIssueType;
    if (urlStatus.length > 0) newFilters.status = urlStatus;
    if (urlProjectId.length > 0) newFilters.project_id = urlProjectId;
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

  // Effects
  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd && hasIssue) {
      IssueSwr.setSize((s) => s + 1);
    }
  }, [isReachingEnd, isLoading, isReachedEnd, hasIssue]);

  return (
    <div className="w-full h-full flex flex-col xl:flex-row">
      <IssueSidebar
        session={session}
        project={filters.project_id}
        setProject={(p) => setFilters({ ...filters, project_id: p })}
        overviewProjects={overviewProjects}
      />
      <div className="w-full h-full">
        <IssueFilterHeader
          filters={filters}
          setFilters={setFilters}
          keywordText={keywordText}
          setKeywordText={setKeywordText}
          onCreateClick={handleCreateClick}
          overviewProjects={overviewProjects}
        />

        <div className="bg-white border-b border-gray-200">
          <IssueEmptyState hasIssue={hasIssue} hasIssueLoading={hasIssueLoading} isLoading={isLoading} issuesLength={issues.length} />

          <IssueList issues={issues} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} overviewProjects={overviewProjects} />

          {isLoading && <IssueSkeleton count={2} />}

          <div ref={infinitRef} />

          {issues.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50">총 {issues.length}개의 이슈</div>}
        </div>

        <IssueForm
          session={session}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          issue={selectedIssue}
          tasksSwr={TasksSwr}
          isLoading={isSubmitting}
        />

        <IssueDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          issue={selectedIssue}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
