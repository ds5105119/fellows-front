"use client";
import { useIssues, IssueFilters } from "@/hooks/fetch/issue";
import type { Issue, IssueListResponse, IssueType } from "@/@types/service/issue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Plus, Edit, Trash2, Building, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { SWRInfiniteResponse } from "swr/infinite";

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

export default function IssueList({
  swr,
  onEditClick,
  onDeleteClick,
}: {
  swr: SWRInfiniteResponse<IssueListResponse>;
  onEditClick: (issue: Issue) => void;
  onDeleteClick: (issue: Issue) => void;
}) {
  const issues = swr.data?.flatMap((item) => item.items) ?? [];

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
            </div>
          ) : (
            // 이슈 목록
            issues.map((issue) => <IssueItem key={issue.name} issue={issue} />)
          )}
        </div>

        {/* 로딩 오버레이 */}
        {swr.isValidating && issues.length > 0 && (
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
