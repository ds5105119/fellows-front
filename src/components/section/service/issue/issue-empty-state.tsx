"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";

interface IssueEmptyStateProps {
  hasIssue: boolean;
  hasIssueLoading?: boolean;
  isLoading?: boolean;
  issuesLength: number;
}

export function IssueEmptyState({ hasIssue, hasIssueLoading, isLoading, issuesLength }: IssueEmptyStateProps) {
  // 이슈가 전혀 없는 경우
  if (!hasIssue && !hasIssueLoading && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 이슈가 없습니다</h3>
        <p className="text-gray-500 mb-6">문의사항이 있다면 새로운 이슈를 등록해보세요</p>
        <Button asChild>
          <Link href="#" onClick={(e) => e.preventDefault()}>
            <Plus className="w-4 h-4 mr-2" />새 이슈 등록
          </Link>
        </Button>
      </div>
    );
  }

  // 필터 결과가 없는 경우
  if (hasIssue && !hasIssueLoading && !isLoading && issuesLength === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Filter className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">조회된 이슈가 없습니다</h3>
        <p className="text-gray-500">필터 조건을 변경하여 다시 시도해보세요</p>
      </div>
    );
  }

  return null;
}
