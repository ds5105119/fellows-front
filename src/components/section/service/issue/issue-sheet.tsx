import type { Issue } from "@/@types/service/issue";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, AlertCircle, Mail } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { useProject } from "@/hooks/fetch/project";
import { useUsers } from "@/hooks/fetch/user";

export default function IssueSheet({ issue }: { issue: Issue }) {
  const { data: project, isLoading: projectLoading } = useProject(issue.project ?? null);
  const { data: customer, isLoading: customerLoading } = useUsers([issue.customer]);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return dayjs(date).format("YYYY년 M월 D일 A h:mm");
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "-";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "urgent":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "working":
      case "pending review":
        return "secondary";
      case "overdue":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getIssueTypeColor = (type: string | null) => {
    switch (type) {
      case "Design":
        return "default";
      case "Feature":
        return "secondary";
      case "ETC":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-tight text-balance">{issue.subject}</h2>
          <Badge variant={getStatusColor(issue.status)} className="shrink-0">
            {issue.status || "상태 없음"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {issue.priority && (
            <Badge variant={getPriorityColor(issue.priority)}>
              <AlertCircle className="mr-1 size-3" />
              {issue.priority}
            </Badge>
          )}
          {issue.issue_type && <Badge variant={getIssueTypeColor(issue.issue_type)}>{issue.issue_type}</Badge>}
        </div>
      </div>

      {/* Description */}
      {issue.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">설명</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>
        </div>
      )}

      {issue.project && (
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <h3 className="text-sm font-medium">프로젝트 정보</h3>
          {projectLoading ? (
            <p className="text-xs text-muted-foreground">로딩 중...</p>
          ) : project ? (
            <div className="flex items-center gap-3">
              {project.custom_emoji && <span className="text-2xl">{project.custom_emoji}</span>}
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{project.project_name}</p>
                {project.custom_project_title && <p className="text-xs text-muted-foreground truncate">{project.custom_project_title}</p>}
                <div className="flex items-center gap-2 flex-wrap">
                  {project.status && (
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                  )}
                  {project.custom_project_status && (
                    <Badge variant="secondary" className="text-xs">
                      {project.custom_project_status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">프로젝트 정보를 불러올 수 없습니다</p>
          )}
        </div>
      )}

      {issue.customer && (
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <h3 className="text-sm font-medium">고객 정보</h3>
          {customerLoading ? (
            <p className="text-xs text-muted-foreground">로딩 중...</p>
          ) : customer ? (
            <div className="grid gap-3">
              {customer[0].name?.[0] && (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs text-muted-foreground">이름</p>
                    <p className="text-sm font-medium">{customer[0].name[0]}</p>
                  </div>
                </div>
              )}

              {customer[0].email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs text-muted-foreground">이메일</p>
                    <p className="text-sm font-medium truncate">{customer[0].email}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">고객 정보를 불러올 수 없습니다</p>
          )}
        </div>
      )}

      {/* Dates Section */}
      <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
        <h3 className="text-sm font-medium">날짜 정보</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs text-muted-foreground">생성일</p>
              <p className="text-xs font-medium">{formatDate(issue.creation)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs text-muted-foreground">수정일</p>
              <p className="text-xs font-medium">{formatDate(issue.modified)}</p>
            </div>
          </div>

          {issue.response_by && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-muted-foreground">응답 기한</p>
                <p className="text-xs font-medium">{formatDate(issue.response_by)}</p>
              </div>
            </div>
          )}

          {issue.sla_resolution_by && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-muted-foreground">SLA 해결 기한</p>
                <p className="text-xs font-medium">{formatDate(issue.sla_resolution_by)}</p>
              </div>
            </div>
          )}

          {issue.first_responded_on && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-muted-foreground">첫 응답일</p>
                <p className="text-xs font-medium">{formatDate(issue.first_responded_on)}</p>
              </div>
            </div>
          )}

          {issue.on_hold_since && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-3.5 text-muted-foreground shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-muted-foreground">보류 시작일</p>
                <p className="text-xs font-medium">{formatDate(issue.on_hold_since)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Metrics */}
      {(issue.first_response_time || issue.avg_response_time || issue.total_hold_time) && (
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <h3 className="text-sm font-medium">시간 지표</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {issue.first_response_time && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">첫 응답 시간</p>
                <p className="text-sm font-medium">{formatTime(issue.first_response_time)}</p>
              </div>
            )}

            {issue.avg_response_time && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">평균 응답 시간</p>
                <p className="text-sm font-medium">{formatTime(issue.avg_response_time)}</p>
              </div>
            )}

            {issue.total_hold_time && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">총 보류 시간</p>
                <p className="text-sm font-medium">{formatTime(issue.total_hold_time)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issue ID */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          이슈 ID: <span className="font-mono">{issue.name}</span>
        </p>
      </div>
    </div>
  );
}
