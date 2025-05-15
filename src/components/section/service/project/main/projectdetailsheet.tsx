"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Copy, Download, Settings2, FileText, Plus, Calendar, SquareCode, ExternalLink, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectSchemaType } from "@/@types/service/project";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectDetailSheet({ project, onClose }: { project: ProjectSchemaType | null; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("상세");
  const [activeRightTab, setActiveRightTab] = useState("지출");

  if (!project) return null;

  // 예산 진행률 계산 (실제 데이터가 없으므로 가정)
  const budgetProgress = project.total_amount ? 65 : 0; // 예산 진행률 예시

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0">
            <ArrowLeft className="!size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0">
            <Link className="!size-5" />
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
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grow overflow-hidden grid grid-cols-1 md:grid-cols-5">
        {/* 왼쪽 패널 */}
        <div className="col-span-1 md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          <div className="w-full flex items-center pt-12 px-8 space-x-3">
            <div className="flex items-center justify-center size-9 rounded-sm bg-blue-500/15 ">
              <FileText className="!size-6 text-blue-500" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-blue-500">프로젝트 현황</span>
            <span className="text-xs font-normal text-muted-foreground">{dayjs(project.created_at).format("YY.MM.DD HH시 mm분")} 생성</span>
          </div>

          <div className="w-full flex flex-col pt-6 px-8 space-y-6">
            <h2 className="text-4xl font-bold">
              {project.emoji} {project.project_info.project_name}
            </h2>
            <div className="w-full flex items-center space-x-2">
              <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">계약 번호</div>
              <div className="ml-1 text-xs font-medium text-muted-foreground">{project.project_id}</div>
              <div className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colros duration-200">
                <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between pt-6 pb-3 px-8 border-b-1 border-b-sidebar-border">
            <h3 className="text-sm font-bold">상태</h3>
            <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">{project.status}</div>
          </div>

          <div className="w-full flex items-center justify-between py-3 px-8 border-b-1 border-b-sidebar-border">
            <h3 className="text-sm font-bold">종류</h3>
            <div className="flex space-x-2">
              {project.project_info.platforms.map((val, i) => (
                <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">{val}</div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col pt-6 px-8 space-y-4">
            <div className="w-full flex items-center space-x-2">
              <FileText className="!size-5" strokeWidth={2.2} />
              <span className="text-lg font-semibold">계약 내용</span>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <div className="text-base font-semibold">설명</div>
              <div className="text-sm font-normal">{project.project_info.project_summary}</div>
            </div>
          </div>

          <Tabs defaultValue="상세" className="w-full" onValueChange={setActiveTab}>
            <div className="px-6 pt-4">
              <TabsList className="w-full mb-4 grid grid-cols-2 bg-gray-100 p-1 rounded-full">
                <TabsTrigger
                  value="상세"
                  className={cn(
                    "rounded-full border-0 data-[state=active]:shadow-none",
                    "data-[state=active]:bg-white data-[state=active]:text-blue-600",
                    "data-[state=inactive]:bg-transparent"
                  )}
                >
                  상세
                </TabsTrigger>
                <TabsTrigger
                  value="커뮤고리"
                  className={cn(
                    "rounded-full border-0 data-[state=active]:shadow-none",
                    "data-[state=active]:bg-white data-[state=active]:text-blue-600",
                    "data-[state=inactive]:bg-transparent"
                  )}
                >
                  커뮤고리
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="상세" className="p-6 pt-0 space-y-6">
              <Card className="border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">계약 금액</CardTitle>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{project.total_amount?.toLocaleString() || "미정"}</span>
                      {project.total_amount && <span className="ml-1">원</span>}
                      {project.total_amount && <span className="text-xs text-muted-foreground ml-2">(세금제외 별도)</span>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full rounded-full border-gray-200">
                    정산 금액수정 확정하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">프로젝트 개요</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/10 border-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl p-4 bg-gray-50">
                    <div className="text-sm">{project.project_info.project_summary || "프로젝트 개요가 입력되지 않았습니다."}</div>
                  </div>
                </CardContent>
              </Card>

              {project.project_info.feature_list && project.project_info.feature_list.length > 0 && (
                <Card className="border-0 shadow-sm rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">주요 기능</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 list-disc list-inside text-sm">
                      {project.project_info.feature_list.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {project.project_info.preferred_tech_stack && project.project_info.preferred_tech_stack.length > 0 && (
                <Card className="border-0 shadow-sm rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">기술 스택</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.project_info.preferred_tech_stack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="rounded-full px-3 py-1 border-gray-200 bg-transparent">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-sm rounded-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium">시작일</div>
                      </div>
                      <div className="text-sm ml-6">
                        {project.project_info.start_date ? new Date(project.project_info.start_date).toLocaleDateString("ko-KR") : "정해지지 않았어요"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium">마감일</div>
                      </div>
                      <div className="text-sm ml-6">
                        {project.project_info.desired_deadline
                          ? new Date(project.project_info.desired_deadline).toLocaleDateString("ko-KR")
                          : "정해지지 않았어요"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full rounded-full bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-0">계약 종단하기</Button>
            </TabsContent>

            <TabsContent value="커뮤고리">
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">커뮤고리 내용이 여기에 표시됩니다.</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 오른쪽 패널 */}
        <div className="col-span-1 md:col-span-2 h-full overflow-y-auto scrollbar-hide">
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
