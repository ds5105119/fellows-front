import type { Issue } from "@/@types/service/issue";
import { Badge } from "@/components/ui/badge";
import { User, Mail, ArrowLeft, FileText, Copy, Edit } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { useProject } from "@/hooks/fetch/project";
import { useUsers } from "@/hooks/fetch/user";
import { STATUS_MAPPING } from "@/components/resource/project";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function IssueSheet({ issue, onClose, onEdit }: { issue: Issue; onClose: () => void; onEdit: (issue: Issue) => void }) {
  const { data: project, isLoading: projectLoading } = useProject(issue.project ?? null);
  const { data: customer, isLoading: customerLoading } = useUsers([issue.customer]);

  return (
    <div className="w-full overflow-y-auto">
      <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b border-b-sidebar-border px-4 bg-background z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-500/10 border-0 focus-visible:ring-0"
            aria-label="뒤로 가기"
            type="button"
            onClick={onClose}
          >
            <ArrowLeft className="!size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent"
            type="button"
            onClick={() => onEdit(issue)}
          >
            <Edit className="mr-2 !size-4" />
            이슈 수정
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Issue Header */}
        <div className="pt-12 pb-5 px-4 md:px-8">
          <div className="w-full flex items-center space-x-3">
            <div className="flex items-center justify-center size-8 md:size-9 rounded-sm bg-blue-500/15">
              <FileText className="!size-5 md:!size-6 text-blue-500" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-blue-500">이슈</span>
            <span className="text-xs font-normal text-muted-foreground">{dayjs(issue.creation).format("LL")}</span>
          </div>
        </div>

        {/* Issue Title Section */}
        <div className="px-4 md:px-8 py-6">
          <div className="w-full flex flex-col space-y-3">
            <h2 className="text-4xl font-bold break-keep">{issue.subject}</h2>

            <div className="w-full flex items-center space-x-2 pt-2">
              <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">이슈 번호</div>
              <div className="pl-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap flex-1">{issue.name}</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(issue.name);
                  toast("이슈 번호가 복사되었습니다.");
                }}
                className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colors duration-200"
                aria-label="이슈 번호 복사"
                type="button"
              >
                <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
              </button>
            </div>

            <div className="w-full flex items-center space-x-2">
              <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">열람 일자</div>
              <div className="pl-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                {issue.opening_date ? dayjs(issue.opening_date).format("LL") : "미열람"}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between min-h-13 max-h-13 px-5 md:px-8 border-b-1 border-b-sidebar-border hover:bg-muted active:bg-muted transition-colors duration-200">
          <h3 className="text-sm font-bold">의뢰 상태</h3>
          <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">{issue.status || "상태 없음"}</div>
        </div>

        <div className="w-full flex items-center justify-between min-h-13 max-h-13 px-5 md:px-8 border-b-1 border-b-sidebar-border hover:bg-muted active:bg-muted transition-colors duration-200">
          <h3 className="text-sm font-bold">중요도</h3>
          <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">{issue.priority || "미정"}</div>
        </div>

        <div className="w-full flex items-center justify-between min-h-13 max-h-13 px-5 md:px-8 border-b-1 border-b-sidebar-border hover:bg-muted active:bg-muted transition-colors duration-200">
          <h3 className="text-sm font-bold">이슈 타입</h3>
          <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">{issue.issue_type}</div>
        </div>

        <div className="w-full flex flex-col space-y-6 px-5 md:px-8 pt-8 pb-12">
          <div className="w-full flex flex-col space-y-2">
            <div className="text-sm font-semibold">설명</div>
            <div className="rounded-xs bg-zinc-50 border px-2.5 py-2 text-sm">{issue.description ?? ""}</div>
          </div>

          <div className="w-full flex flex-col space-y-2">
            <div className="text-sm font-semibold">프로젝트</div>
            {issue.project && (
              <div className="space-y-3 rounded-xs border bg-muted/50 p-4">
                {projectLoading ? (
                  <p className="text-xs text-muted-foreground">로딩 중...</p>
                ) : project ? (
                  <div className="flex items-center gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      {project.custom_project_title && (
                        <p className="text-sm font-medium truncate">
                          {project.custom_emoji && `${project.custom_emoji} `}
                          {project.custom_project_title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">{project.project_name}</p>
                      {project.custom_project_status && (
                        <Badge variant="secondary" className="text-xs">
                          {STATUS_MAPPING[project.custom_project_status]}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">프로젝트 정보를 불러올 수 없습니다</p>
                )}
              </div>
            )}
          </div>

          <div className="w-full flex flex-col space-y-2">
            <div className="text-sm font-semibold">고객 정보</div>
            {issue.customer && (
              <div className="space-y-3 rounded-xs border bg-muted/50 p-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
