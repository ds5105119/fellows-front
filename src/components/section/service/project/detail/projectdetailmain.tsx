import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ERPNextProject } from "@/@types/service/project";

interface ProjectDetailMainProps {
  project: ERPNextProject;
}

export default async function ProjectDetailMain({ project }: ProjectDetailMainProps) {
  const session = await auth();
  if (!session) return null;

  const fmtDate = (d: Date | string | null | undefined) => (d ? new Date(d).toLocaleDateString("ko-KR") : "-");

  return (
    <div className="flex flex-col space-y-6">
      {/* 1. 헤더 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 mt-2">
          <h2 className="text-2xl font-bold">프로젝트 정보</h2>
          <Badge variant="outline">{project.status}</Badge>
          <span className="text-sm text-muted-foreground">
            {project.custom_platforms?.map((platform, idx) => (
              <div key={idx}>{platform.platform}</div>
            ))}
          </span>
        </div>
      </div>

      <Separator />

      {/* 2. 기본 정보 그리드 */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div className="flex items-center space-x-2">
          <Label className="w-32">시작일</Label>
          <span>{fmtDate(project.expected_start_date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">완료 희망일</Label>
          <span>{fmtDate(project.expected_end_date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">준비 단계</Label>
          <Badge variant="outline" className="uppercase">
            {project.custom_readiness_level}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">콘텐츠 페이지</Label>
          <span>{project.custom_content_pages ?? "-"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">유지보수 필요</Label>
          <span>{project.custom_maintenance_required ? "예" : "아니오"}</span>
        </div>
      </div>

      <Separator />

      {/* 3. 요구사항 상세 */}
      <div className="space-y-4 text-sm">
        <div>
          <Label className="mb-1">프로젝트 개요</Label>
          <p className="whitespace-pre-wrap">{project.custom_project_summary}</p>
        </div>
      </div>

      <Separator />

      {/* 4. 메타 & 그룹 링크 */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>생성: {fmtDate(project.creation)}</div>
        <div>수정: {fmtDate(project.modified)}</div>
      </div>
    </div>
  );
}
