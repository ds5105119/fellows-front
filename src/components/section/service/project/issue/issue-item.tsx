"use client"

import type { Issue, IssueType } from "@/@types/service/issue"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Building, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface IssueItemProps {
  issue: Issue
  onEditClick: (issue: Issue) => void
  onDeleteClick: (issue: Issue) => void
}

const getIssueTypeColor = (type: IssueType | null) => {
  switch (type) {
    case "Design":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "Feature":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "ETC":
      return "bg-gray-50 text-gray-700 border-gray-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

const getPriorityColor = (priority: string | null) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "높음":
      return "bg-red-50 text-red-700 border-red-200"
    case "medium":
    case "보통":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "low":
    case "낮음":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "open":
    case "열림":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "working":
    case "진행중":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "completed":
    case "완료":
      return "bg-gray-50 text-gray-700 border-gray-200"
    case "cancelled":
    case "취소":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

const getTypeLabel = (type: IssueType | null) => {
  switch (type) {
    case "Design":
      return "디자인"
    case "Feature":
      return "기능"
    case "ETC":
      return "기타"
    default:
      return type || ""
  }
}

export function IssueItem({ issue, onEditClick, onDeleteClick }: IssueItemProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* 상태 인디케이터 */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <div
            className={`w-3 h-3 rounded-full ${
              issue.status?.toLowerCase() === "open"
                ? "bg-green-500"
                : issue.status?.toLowerCase() === "working"
                  ? "bg-blue-500"
                  : issue.status?.toLowerCase() === "completed"
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
            <Badge className={`text-xs ${getIssueTypeColor(issue.issue_type)}`}>{getTypeLabel(issue.issue_type)}</Badge>
          )}
          {issue.priority && <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>}
        </div>

        {/* 상태 - 데스크톱에서 표시 */}
        <div className="hidden md:block flex-shrink-0">
          {issue.status && <Badge className={`text-xs ${getStatusColor(issue.status)}`}>{issue.status}</Badge>}
        </div>
      </div>

      {/* 액션 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-gray-100"
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
  )
}
