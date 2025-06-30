"use client";

import type React from "react";

import { useState } from "react";
import type { Issue, IssueType } from "@/@types/service/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Search, Plus, Edit, Trash2, Building, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface IssueListProps {
  issues: Issue[];
  isLoading: boolean;
  isValidating: boolean;
  onCreateClick: () => void;
  onEditClick: (issue: Issue) => void;
  onDeleteClick: (issue: Issue) => void;
  onSearch: (keyword: string) => void;
  onFilterChange: (filters: { issue_type?: IssueType[] }) => void;
}

const getIssueTypeColor = (type: IssueType | null) => {
  switch (type) {
    case "Design":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Feature":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ETC":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getPriorityColor = (priority: string | null) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "높음":
      return "bg-red-50 text-red-700 border-red-200";
    case "medium":
    case "보통":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "low":
    case "낮음":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "open":
    case "열림":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in progress":
    case "진행중":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "closed":
    case "완료":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function IssueList({ issues, isLoading, isValidating, onCreateClick, onEditClick, onDeleteClick, onSearch, onFilterChange }: IssueListProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchKeyword);
  };

  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
    if (value === "all") {
      onFilterChange({});
    } else {
      onFilterChange({ issue_type: [value as IssueType] });
    }
  };

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
            <Badge variant="outline" className={`text-xs ${getIssueTypeColor(issue.issue_type)}`}>
              {issue.issue_type === "Design" ? "디자인" : issue.issue_type === "Feature" ? "기능" : "기타"}
            </Badge>
          )}
          {issue.priority && (
            <Badge variant="outline" className={`text-xs ${getPriorityColor(issue.priority)}`}>
              {issue.priority}
            </Badge>
          )}
        </div>

        {/* 상태 - 데스크톱에서 표시 */}
        <div className="hidden md:block flex-shrink-0">
          {issue.status && (
            <Badge variant="outline" className={`text-xs ${getStatusColor(issue.status)}`}>
              {issue.status}
            </Badge>
          )}
        </div>

        {/* 회사 - 큰 화면에서 표시 */}
        <div className="hidden lg:block text-sm text-gray-500 flex-shrink-0 w-24 truncate">{issue.company || "-"}</div>
      </div>

      {/* 액션 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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

  return (
    <div>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            이슈 관리
            {isValidating && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
          </h1>
          <p className="text-sm text-gray-600 mt-1">프로젝트 이슈를 관리하고 추적하세요</p>
        </div>
        <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />새 이슈 등록
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50">
          <form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="이슈 제목, 설명으로 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 border-gray-200 bg-white"
                disabled={isValidating}
              />
            </div>
            <Button type="submit" variant="outline" disabled={isValidating} className="w-full sm:w-auto bg-white">
              {isValidating ? <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" /> : "검색"}
            </Button>
          </form>

          <Select value={selectedType} onValueChange={handleTypeFilter} disabled={isValidating}>
            <SelectTrigger className="w-full sm:w-40 border-gray-200 bg-white">
              <SelectValue placeholder="타입 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 타입</SelectItem>
              <SelectItem value="Design">디자인</SelectItem>
              <SelectItem value="Feature">기능</SelectItem>
              <SelectItem value="ETC">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 이슈 목록 */}
      <div className="bg-white border border-gray-200">
        {/* 로딩 오버레이 */}
        {isValidating && issues.length > 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-white px-4 py-2 shadow-sm border">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">검색 중...</span>
            </div>
          </div>
        )}

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
              <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />첫 번째 이슈 등록하기
              </Button>
            </div>
          ) : (
            // 이슈 목록
            issues.map((issue) => <IssueItem key={issue.name} issue={issue} />)
          )}
        </div>

        {/* 결과 개수 */}
        {issues.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50">총 {issues.length}개의 이슈</div>}
      </div>
    </div>
  );
}
