import { auth } from "@/auth";
import { ProjectSchemaType } from "@/@types/service/project";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ProjectDetailMainProps {
  project: ProjectSchemaType;
}

export default async function ProjectDetailMain({ project }: ProjectDetailMainProps) {
  const session = await auth();
  if (!session) return null;

  const info = project.project_info;
  const fmtDate = (d: Date | string | null | undefined) => (d ? new Date(d).toLocaleDateString("ko-KR") : "-");

  return (
    <div className="flex flex-col space-y-6">
      {/* 1. 헤더 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 mt-2">
          <h2 className="text-2xl font-bold">프로젝트 정보</h2>
          <Badge variant="outline">{project.status}</Badge>
          <span className="text-sm text-muted-foreground">{info.platforms.join(", ")}</span>
        </div>
      </div>

      <Separator />

      {/* 2. 기본 정보 그리드 */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div className="flex items-center space-x-2">
          <Label className="w-32">시작일</Label>
          <span>{fmtDate(info.start_date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">완료 희망일</Label>
          <span>{fmtDate(info.desired_deadline)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">준비 단계</Label>
          <Badge variant="outline" className="uppercase">
            {info.readiness_level}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">콘텐츠 페이지</Label>
          <span>{info.content_pages ?? "-"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="w-32">유지보수 필요</Label>
          <span>{info.maintenance_required ? "예" : "아니오"}</span>
        </div>
      </div>

      <Separator />

      {/* 3. 요구사항 상세 */}
      <div className="space-y-4 text-sm">
        <div>
          <Label className="mb-1">프로젝트 개요</Label>
          <p className="whitespace-pre-wrap">{info.project_summary}</p>
        </div>

        {info.design_requirements && (
          <div>
            <Label className="mb-1">디자인 요구사항</Label>
            <p>{info.design_requirements}</p>
          </div>
        )}

        {info.feature_list?.length ? (
          <div>
            <Label className="mb-1">주요 기능</Label>
            <ul className="list-disc list-inside">
              {info.feature_list.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {info.preferred_tech_stack?.length ? (
          <div>
            <Label className="mb-1">선호 기술 스택</Label>
            <p>{info.preferred_tech_stack.join(" / ")}</p>
          </div>
        ) : null}
      </div>

      <Separator />

      {/* 4. 메타 & 그룹 링크 */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>생성: {fmtDate(project.created_at)}</div>
        <div>수정: {fmtDate(project.updated_at)}</div>
      </div>

      {project.group_links.length > 0 && (
        <>
          <Separator className="my-2" />
          <div className="text-sm">
            <Label className="mb-1">연결된 그룹</Label>
            <ul className="list-disc list-inside">
              {project.group_links.map((gl, i) => (
                <li key={i}>{gl.group_id}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
