"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Copy, Download, FileText, SquareCode, ExternalLink, LinkIcon, Fullscreen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectSchemaType } from "@/@types/service/project";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import Link from "next/link";
import { fileIconMap, getFileExtension } from "@/components/form/fileinput";
import { UploadProgressIndicator } from "@/components/ui/uploadprogressindicator";

export default function ProjectDetailSheet({ project, onClose }: { project: ProjectSchemaType | null; onClose: () => void }) {
  const [valueToggle, setValueToggle] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("지출");
  const [files, setFiles] = useState(project?.project_info.files || []);

  if (!project) return null;

  const budgetProgress = project.total_amount ? 65 : 0; // 예산 진행률 예시

  const removeFile = async (key: string, sse_key: string) => {
    const params = new URLSearchParams();
    params.append("key", key);
    params.append("sse_key", sse_key);

    await fetch(`/api/cloud/object?${params.toString()}`, {
      method: "DELETE",
    });

    if (files) {
      setFiles((prev) => prev.filter((file) => file.file_record.key !== key));
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between min-h-16 border-b-1 border-b-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
            <ArrowLeft className="!size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
            <LinkIcon className="!size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
            이용 가이드
          </Button>
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
            <Download className="h-4 w-4" />
            내보내기
          </Button>
          <Button variant="outline" size="icon" className="size-8 font-semibold rounded-sm border-gray-200 shadow-none" asChild>
            <Link href={`./project/${project.project_id}`}>
              <Fullscreen className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grow overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* 왼쪽 패널 */}
        <div className="col-span-full md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          {/* 프로젝트 헤더 */}
          <div className="w-full flex items-center pt-12 px-8 space-x-3">
            <div className="flex items-center justify-center size-9 rounded-sm bg-blue-500/15 ">
              <FileText className="!size-6 text-blue-500" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-blue-500">프로젝트 미리보기</span>
            <span className="text-xs font-normal text-muted-foreground">{dayjs(project.created_at).format("YY.MM.DD HH시 mm분")} 생성</span>
          </div>
          {/* 프로젝트 이름 및 기본 정보 */}
          <div className="w-full flex flex-col pt-6 px-8 space-y-5">
            <h2 className="text-4xl font-bold break-keep">
              {project.emoji} {project.project_info.project_name}
            </h2>
            <div className="w-full flex items-center space-x-2">
              <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">계약 번호</div>
              <div className="ml-1 flex-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">{project.project_id}</div>
              <div className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colors duration-200">
                <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
              </div>
            </div>
          </div>
          {/* 프로젝트 상태 및 종류 */}
          <div className="w-full flex items-center justify-between pt-6 pb-3 px-8 border-b-1 border-b-sidebar-border">
            <h3 className="text-sm font-bold">상태</h3>
            <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">{project.status}</div>
          </div>
          <div className="w-full flex items-center justify-between py-3 px-8 border-b-1 border-b-sidebar-border">
            <h3 className="text-sm font-bold">종류</h3>
            <div className="flex space-x-2">
              {project.project_info.platforms.map((val, i) => (
                <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
                  {val}
                </div>
              ))}
            </div>
          </div>
          {/* 프로젝트 설명 및 사용기술 */}
          <div className="w-full flex flex-col pt-6 pb-6 px-8 space-y-4 border-b-1 border-b-sidebar-border">
            <div className="w-full flex items-center space-x-2">
              <FileText className="!size-5" strokeWidth={2.2} />
              <span className="text-lg font-semibold">계약 내용</span>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <div className="text-sm font-semibold">{project.status === "draft" ? "얘상 금액" : "계약 금액"}</div>
              {project.total_amount ? (
                <div className="flex flex-col space-y-2">
                  <div>
                    <span className="text-lg font-bold">
                      {valueToggle ? (project.total_amount * 1.1).toLocaleString() : project.total_amount.toLocaleString()}
                    </span>
                    <span className="text-sm font-normal"> 원 (부가세 별도)</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-fit text-xs h-7 shadow-none" onClick={() => setValueToggle((prev) => !prev)}>
                    {valueToggle ? "부가세 미포함 금액으로 변경" : "부가세 포함된 금액으로 변경"}
                  </Button>
                </div>
              ) : (
                <div className="text-lg font-bold">AI 견적으로 예상 견적을 확인해보세요</div>
              )}
            </div>

            <div className="w-full flex flex-col space-y-2">
              <div className="text-sm font-semibold">설명</div>
              <div className="text-sm font-normal">{project.project_info.project_summary}</div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <div className="text-sm font-semibold">디자인 요구사항</div>
              <div className="text-sm font-normal">{project.project_info.design_requirements ?? "디자인 요구사항이 없어요."}</div>
            </div>

            <div className="w-full flex flex-col space-y-1.5">
              <div className="text-sm font-semibold">{project.status === "draft" ? "희망 사용기술" : "계약 사용기술"}</div>
              <div className="flex space-x-2">
                {project.project_info.preferred_tech_stack && project.project_info.preferred_tech_stack.length > 0 ? (
                  project.project_info.preferred_tech_stack.map((val, i) => (
                    <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
                      {val}
                    </div>
                  ))
                ) : (
                  <span className="text-sm font-normal">사용기술이 정해지지 않았어요</span>
                )}
              </div>
            </div>

            <div className="w-full flex">
              <div className="w-1/2 flex flex-col space-y-1.5">
                <div className="text-sm font-semibold">{project.status === "draft" ? "예상 시작일" : "계약 시작일"}</div>
                <div className="text-sm font-normal">{project.project_info.start_date ?? "정해지지 않았어요"}</div>
              </div>

              <div className="w-1/2 flex flex-col space-y-1.5">
                <div className="text-sm font-semibold">{project.status === "draft" ? "예상 종료일" : "계약 종료일"}</div>
                <div className="text-sm font-normal">{project.project_info.desired_deadline ?? "정해지지 않았어요"}</div>
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <div className="text-sm font-semibold">파일</div>
              <div className="grid grid-cols-1 gap-2">
                {files && files.length > 0 ? (
                  files.map((f, i) => {
                    const extension = getFileExtension(f.file_record.name);
                    const IconComponent = fileIconMap[extension] || fileIconMap.default;

                    return (
                      <div
                        key={i}
                        className="col-span-1 grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full rounded-sm bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconComponent className="!size-7" />

                        <div className="min-w-0 overflow-hidden">
                          <p className="truncate text-sm">{f.file_record.name}</p>
                          <p className="truncate text-xs font-normal">{f.file_record.algorithm}로 암호화됐어요</p>
                        </div>

                        <div className="w-9 h-9 flex items-center justify-center">
                          <UploadProgressIndicator progress={100} onRemove={() => removeFile(f.file_record.key, f.file_record.sse_key)} size={36} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm font-normal">첨부된 파일이 없어요</span>
                )}
              </div>
            </div>
          </div>
          {/* AI 견적 */}
          <div className="w-full items-center justify-between pt-4 pb-3 px-8 flex">
            <div className="w-full flex flex-col space-y-3 pt-2">
              <div className="w-full flex justify-between">
                <div className="w-full flex items-center space-x-2">
                  <BreathingSparkles />
                  <span className="text-lg font-bold">AI 견적</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
                  <Fullscreen className="!size-5" />
                </Button>
              </div>

              <div>
                {project.ai_estimate && (
                  <div className="pt-2 prose prose-h2:text-base prose-p:text-sm prose-a:text-sm">
                    <MarkdownPreview loading={false}>{project.ai_estimate}</MarkdownPreview>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 계약 시작하기 버튼 */}
          {(project.status === "draft" || project.status === "process:1") && (
            <div className="sticky flex flex-col bottom-0 z-50 px-4">
              <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
              <div className="w-full flex pb-4 pt-3 bg-background">
                {project.status === "draft" && project.ai_estimate ? (
                  <Button size="lg" className="w-full px-16 h-[3.75rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500" asChild>
                    <Link href="/service/dashboard">계약 시작하기</Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full px-16 h-[3.75rem] rounded-2xl text-lg font-semibold" asChild>
                    <Link href={`./project/${project.project_id}`}>지금 바로 예상 견적을 받아보세요 ✨</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 패널 */}
        <div className="hidden md:block md:col-span-2 h-full overflow-y-auto scrollbar-hide">
          {/* 상태 표시 */}
          <div className="flex items-center px-6 py-3 bg-white">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">고객</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">회사</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">프로젝트</span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* 기본 정보 */}
            <Card className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">프로젝트 ID</div>
                    <div className="font-medium">{project.project_id}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">상태</div>
                    <div className="font-medium">{project.status}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">생성일</div>
                    <div className="font-medium">{new Date(project.created_at).toLocaleDateString("ko-KR")}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">준비 단계</div>
                    <div className="font-medium">
                      {project.project_info.readiness_level === "idea"
                        ? "아이디어"
                        : project.project_info.readiness_level === "requirements"
                        ? "요구사항"
                        : "와이어프레임"}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-sm text-muted-foreground">유지보수 필요</div>
                    <div className="font-medium">{project.project_info.maintenance_required ? "예" : "아니오"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 탭 */}
            <div className="flex space-x-1 border-b">
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeRightTab === "지출" ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveRightTab("지출")}
              >
                지출
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeRightTab === "히스토리" ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveRightTab("히스토리")}
              >
                히스토리
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeRightTab === "문서" ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveRightTab("문서")}
              >
                문서
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeRightTab === "팀원" ? "border-blue-500 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveRightTab("팀원")}
              >
                팀원
              </button>
            </div>

            {/* 예산 게이지 */}
            {project.total_amount && (
              <Card className="border-0 shadow-sm rounded-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-2xl">{Math.round((project.total_amount * budgetProgress) / 100).toLocaleString()}</span>
                      <span>원</span>
                    </div>
                    <div className="text-sm text-muted-foreground">총예산 {project.total_amount.toLocaleString()}원</div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2.5 relative">
                      <Progress value={budgetProgress} className="h-2.5 bg-gray-100" />
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div>진행률 {budgetProgress}%</div>
                      <div className="flex items-center gap-1">
                        <span>잔액</span>
                        <span className="font-medium">{Math.round((project.total_amount * (100 - budgetProgress)) / 100).toLocaleString()}</span>
                        <span>원</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 플랫폼 정보 */}
            <Card className="border-0 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">개발 플랫폼</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.project_info.platforms.map((platform, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-500/15 text-blue-600 px-3 py-1.5 rounded-full">
                      <SquareCode className="h-4 w-4" />
                      <span>{platform === "web" ? "웹" : platform === "android" ? "안드로이드" : "iOS"}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 디자인 요구사항 */}
            {project.project_info.design_requirements && (
              <Card className="border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">디자인 요구사항</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">{project.project_info.design_requirements}</div>
                </CardContent>
              </Card>
            )}

            {/* 참조 디자인 URL */}
            {project.project_info.reference_design_url && project.project_info.reference_design_url.length > 0 && (
              <Card className="border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">참조 디자인</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.project_info.reference_design_url.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 그룹 정보 */}
            {project.groups.length > 0 && (
              <Card className="border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">그룹</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.groups.map((group, index) => (
                      <Badge key={index} variant="outline" className="rounded-full px-3 py-1 border-gray-200 bg-transparent">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 마지막 업데이트 정보 */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(project.updated_at).toLocaleString("ko-KR")}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-7 rounded-full hover:bg-blue-500/10 border-0">
                버전 전환
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
