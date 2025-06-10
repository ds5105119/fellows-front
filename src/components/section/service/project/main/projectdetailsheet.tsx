"use client";

import type React from "react";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import Flattabs from "@/components/ui/flattabs";
import Link from "next/link";
import useSWRInfinite, { type SWRInfiniteKeyLoader } from "swr/infinite";
import { useState, useRef, useEffect, useMemo } from "react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download, FileText, LinkIcon, Fullscreen, Info, ArrowUpRight, DownloadCloud, Plus, Check, X } from "lucide-react";
import { fileIconMap, getFileExtension } from "@/components/form/fileinput";
import { UploadProgressIndicator } from "@/components/ui/uploadprogressindicator";
import { useInView } from "framer-motion";
import { useProject } from "@/hooks/fetch/project";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { type ERPNextProjectFileRowType, ERPNextProjectFileRowZod, type ERPNextProjectType, ERPNextTaskPaginatedResponseZod } from "@/@types/service/erpnext";
import { downloadFilefromPresignedUrl, FileDownloadButton, getPresignedGetUrl, getPresignedPutUrl, uploadFileToPresignedUrl } from "@/hooks/fetch/presigned";
dayjs.extend(relativeTime);
dayjs.locale("ko");

interface getKeyFactoryProps {
  project_id: string;
  size?: string;
}

const getKeyFactory = ({ size, project_id }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index * Number(size || 20)}`);

    if (size) params.append("size", size);

    return `/api/service/project/${project_id}/tasks?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return ERPNextTaskPaginatedResponseZod.parse(data);
};

export default function ProjectDetailSheet({
  project,
  onClose,
  session,
}: {
  project: ERPNextProjectType | null;
  onClose: () => void;
  session: Session | null;
}) {
  if (!project || !session) return null;

  return <ProjectDetailSheetInner project={project} onClose={onClose} session={session} />;
}

function ProjectDetailSheetInner({ project: _project, onClose, session }: { project: ERPNextProjectType; onClose: () => void; session: Session | null }) {
  const detailedProject = useProject({ project_id: _project.project_name });
  const [project, setProject] = useState<ERPNextProjectType>(_project);
  const [valueToggle, setValueToggle] = useState(false);
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});

  const getKey = getKeyFactory({ size: "20", project_id: project.project_name });
  const { data, error, isLoading: _isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const isReachedEnd = data && data.length > 0 && data[data.length - 1]?.items.length === 0;
  const isLoading = !isReachedEnd && (_isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"));
  const taskInfRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const istaskInfRefView = useInView(taskInfRef);

  const statusMapping: Record<string, string> = {
    draft: "초안",
    "process:1": "견적 확인중",
    "process:2": "계약 진행중",
    "process:3": "진행중",
    maintenance: "유지보수",
    complete: "완료",
  };
  const platformMapping: Record<string, string> = { web: "웹", android: "안드로이드 앱", ios: "iOS 앱" };

  // 모바일 탭 구성 (개요 탭 추가)
  const mobileTabs = [
    <div className="flex space-x-1 items-center" key="overview">
      <span>개요</span>
    </div>,
    <div className="flex space-x-1 items-center" key="task-status">
      <span>작업 현황</span>
      <span className="text-xs">{data?.flatMap((i) => i.items).length ?? 0}</span>
    </div>,
    <div className="flex space-x-1 items-center" key="files">
      <span>파일</span>
      <span className="text-xs">{project.custom_files?.length ?? 0}</span>
    </div>,
    <div className="flex space-x-1 items-center" key="team-members">
      <span>팀원</span>
      <span className="text-xs">{project.custom_files?.length ?? 0}</span>
    </div>,
  ];

  // 데스크톱 탭 구성 (기존)
  const tabs1 = [
    session?.user.name && session?.user.phoneNumber && session?.user.email ? (
      <div className="flex space-x-1.5 items-center" key="customer-ok">
        <span>고객</span>
        <div className="size-2.5 rounded-full bg-emerald-500" />
      </div>
    ) : (
      <div className="flex space-x-1.5 items-center" key="customer-no">
        <span>고객</span>
        <div className="size-2.5 rounded-full bg-red-500" />
      </div>
    ),
    project ? (
      <div className="flex space-x-1.5 items-center" key="company-ok">
        <span>회사</span>
        <div className="size-2.5 rounded-full bg-emerald-500" />
      </div>
    ) : (
      <div className="flex space-x-1.5 items-center" key="company-no">
        <span className="text-yellow-500">매니저</span>
        <div className="size-2.5 rounded-full bg-yellow-500" />
      </div>
    ),
  ];

  const tabs2 = [
    <div className="flex space-x-1 items-center" key="task-status">
      <span>작업 현황</span>
      <span className="text-xs">{data?.flatMap((i) => i.items).length ?? 0}</span>
    </div>,
    <div className="flex space-x-1 items-center" key="files">
      <span>파일</span>
      <span className="text-xs">{project.custom_files?.length ?? 0}</span>
    </div>,
    <div className="flex space-x-1 items-center" key="team-members">
      <span>팀원</span>
      <span className="text-xs">{project.custom_files?.length ?? 0}</span>
    </div>,
  ];

  const [activeMobileTab, setActiveMobileTab] = useState(0);
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);

  const groupedFiles = useMemo(() => {
    if (!detailedProject.data?.custom_files) return [];

    const reversedFiles = [...detailedProject.data.custom_files].reverse();

    return reversedFiles.reduce<
      {
        uploader: string;
        files: ERPNextProjectFileRowType[];
      }[]
    >((acc, f) => {
      const last = acc[acc.length - 1];
      return !last || last.uploader !== f.uploader
        ? [...acc, { uploader: f.uploader, files: [f] }]
        : [...acc.slice(0, -1), { ...last, files: [...last.files, f] }];
    }, []);
  }, [detailedProject.data?.custom_files]);

  const getFile = async (algorithm: string, key: string, sse_key: string, filename: string) => {
    const presigned = await getPresignedGetUrl(algorithm, key, sse_key);
    return await downloadFilefromPresignedUrl(presigned);
  };

  const uploadFiles = async (file: File) => {
    const isDuplicate = (detailedProject.data?.custom_files || []).some((f) => f.file_name === file.name);
    if (isDuplicate) {
      toast.info("이미 업로드된 파일입니다.");
      return;
    }

    try {
      const presigned = await getPresignedPutUrl(file.name);
      const fileRecord = ERPNextProjectFileRowZod.parse({
        doctype: "Files",
        key: presigned.key,
        file_name: file.name,
        algorithm: "AES256",
        sse_key: presigned.sse_key,
        uploader: "user",
      });

      detailedProject.mutate((prev) => (prev ? { ...prev, ["custom_files"]: prev.custom_files ? [...prev.custom_files, fileRecord] : [fileRecord] } : prev), {
        revalidate: false,
      });

      await uploadFileToPresignedUrl({
        file,
        presigned,
        onProgress: ({ percent }) => {
          setFileProgress((prev) => ({
            ...prev,
            [file.name]: percent,
          }));
        },
      });

      await fetch(`/api/service/project/${project.project_name}/files`, {
        method: "PUT",
        body: JSON.stringify(fileRecord),
      });

      detailedProject.mutate();
    } catch {
      toast.warning("업로드에 실패했어요.");
      detailedProject.mutate((prev) =>
        prev
          ? {
              ...prev,
              custom_files: prev.custom_files?.filter((f) => f.file_name !== file.name) ?? [],
            }
          : prev
      );
    }
  };

  const handleChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFiles(file);
  };

  const removeFile = async (key: string, sse_key: string) => {
    const params = new URLSearchParams();
    params.append("key", key);
    params.append("sse_key", sse_key);

    await fetch(`/api/cloud/object?${params.toString()}`, {
      method: "DELETE",
    });

    detailedProject.mutate((prev) =>
      prev
        ? {
            ...prev,
            custom_files: prev.custom_files?.filter((f) => f.key !== key) ?? [],
          }
        : prev
    );
  };

  const submitProject = async () => {
    await fetch(`/api/service/project/${project.project_name}/submit`, {
      method: "POST",
    });
    window.location.reload();
  };

  const cancelSubmit = async () => {
    await fetch(`/api/service/project/${project.project_name}/submit/cancel`, {
      method: "POST",
    });
    window.location.reload();
  };

  useEffect(() => {
    if (istaskInfRefView && !isReachedEnd && !isLoading) {
      setSize((s) => s + 1);
    }
  }, [istaskInfRefView, isReachedEnd, isLoading, setSize, data]);

  useEffect(() => {
    if (!_project || !session || !detailedProject.data) return;

    setProject(detailedProject.data);
  }, [_project, detailedProject.data, session]);

  // 개요 탭 콘텐츠 (원래 왼쪽 패널 내용)
  const OverviewContent = () => (
    <div className="flex flex-col h-full w-full">
      {/* 프로젝트 헤더 */}
      <div className="w-full flex items-center pt-12 px-5 md:px-8 space-x-3">
        <div className="flex items-center justify-center size-8 md:size-9 rounded-sm bg-blue-500/15 ">
          <FileText className="!size-5 md:!size-6 text-blue-500" strokeWidth={2.2} />
        </div>
        <span className="text-base font-bold text-blue-500">프로젝트</span>
        <span className="text-xs font-normal text-muted-foreground">{dayjs(project.creation).format("YY.MM.DD HH시 mm분")} 생성</span>
      </div>

      {/* 프로젝트 이름 및 기본 정보 */}
      <div className="w-full flex flex-col pt-6 px-5 md:px-8 space-y-5">
        <h2 className="text-4xl font-bold break-keep">
          {project.custom_emoji} {project.custom_project_title}
        </h2>
        <div className="w-full flex items-center space-x-2">
          <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">계약 번호</div>
          <div className="ml-1 flex-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">{project.project_name}</div>
          <div className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colors duration-200">
            <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
          </div>
        </div>
      </div>

      {/* 프로젝트 상태 및 종류 */}
      <div className="w-full flex items-center justify-between pt-6 pb-3 px-5 md:px-8 border-b-1 border-b-sidebar-border">
        <h3 className="text-sm font-bold">의뢰 상태</h3>
        <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold truncate">
          {project.custom_project_status ? statusMapping[project.custom_project_status] : "상태 없음"}
        </div>
      </div>
      <div className="w-full flex items-center justify-between py-3 px-5 md:px-8 border-b-1 border-b-sidebar-border">
        <h3 className="text-sm font-bold">플랫폼</h3>
        <div className="flex space-x-2">
          {project.custom_platforms &&
            project.custom_platforms.map((val, i) => (
              <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
                {platformMapping[val.platform]}
              </div>
            ))}
        </div>
      </div>

      {/* 프로젝트 설명 및 사용기술 */}
      <div className="w-full flex flex-col pt-6 pb-6 px-5 md:px-8 space-y-4 border-b-1 border-b-sidebar-border">
        <div className="w-full flex items-center space-x-2">
          <FileText className="!size-5" strokeWidth={2.2} />
          <span className="text-lg font-semibold">계약 내용</span>
        </div>

        <div className="w-full flex flex-col space-y-2">
          <div className="text-sm font-semibold">{project.custom_project_status === "draft" ? "얘상 금액" : "계약 금액"}</div>
          {project.estimated_costing ? (
            <div className="flex flex-col space-y-2">
              <div>
                <span className="text-lg font-bold">
                  {valueToggle ? (project.estimated_costing * 1.1).toLocaleString() : project.estimated_costing.toLocaleString()}
                </span>
                <span className="text-sm font-normal"> 원 (부가세 {valueToggle ? "포함" : "별도"})</span>
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
          <div className="text-sm font-normal whitespace-pre-wrap">{project.custom_project_summary}</div>
        </div>

        <div className="w-full flex flex-col space-y-2">
          <div className="text-sm font-semibold">디자인 요구사항</div>
          <div className="text-sm font-normal whitespace-pre-wrap">{project.custom_design_requirements ?? "디자인 요구사항이 없어요."}</div>
        </div>

        <div className="w-full flex flex-col space-y-1.5">
          <div className="text-sm font-semibold">{project.custom_project_status === "draft" ? "희망 사용기술" : "계약 사용기술"}</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {project.custom_preferred_tech_stacks && project.custom_preferred_tech_stacks.length > 0 ? (
              project.custom_preferred_tech_stacks.map((val, i) => (
                <div key={i} className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">
                  {val.stack}
                </div>
              ))
            ) : (
              <span className="text-sm font-normal">사용기술이 정해지지 않았어요</span>
            )}
          </div>
        </div>

        <div className="w-full flex">
          <div className="w-1/2 flex flex-col space-y-1.5">
            <div className="text-sm font-semibold">{project.custom_project_status === "draft" ? "예상 시작일" : "계약 시작일"}</div>
            <div className="text-sm font-normal">
              {project.expected_start_date ? dayjs(project.expected_start_date).format("YYYY-MM-DD") : "정해지지 않았어요"}
            </div>
          </div>

          <div className="w-1/2 flex flex-col space-y-1.5">
            <div className="text-sm font-semibold">{project.custom_project_status === "draft" ? "예상 종료일" : "계약 종료일"}</div>
            <div className="text-sm font-normal">{project.expected_end_date ? dayjs(project.expected_end_date).format("YYYY-MM-DD") : "정해지지 않았어요"}</div>
          </div>
        </div>
      </div>

      {/* AI 견적 */}
      <div className="w-full items-center justify-between pt-4 pb-3 px-5 md:px-8 flex">
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

          <div className="w-full">
            {project.custom_ai_estimate && (
              <div className="w-full max-w-full pt-2 prose prose-h2:text-base prose-p:text-sm prose-a:text-sm">
                <MarkdownPreview loading={false}>{project.custom_ai_estimate}</MarkdownPreview>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 계약 시작하기 버튼 */}
      {(project.custom_project_status === "draft" || project.custom_project_status === "process:1") && (
        <div className="sticky bottom-0 flex flex-col z-50 px-4">
          <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
          <div className="w-full flex pb-4 pt-3 bg-background">
            {project.custom_project_status === "draft" && project.custom_ai_estimate ? (
              <Button
                size="lg"
                className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
                onClick={submitProject}
              >
                계약 문의하기
              </Button>
            ) : project.custom_project_status === "process:1" ? (
              <Button
                size="lg"
                className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold bg-blue-200 hover:bg-blue-300 text-blue-500"
                onClick={cancelSubmit}
              >
                계약 문의 취소하기
              </Button>
            ) : (
              <Button size="lg" className="w-full px-16 h-[3.5rem] md:h-[3.75rem] rounded-2xl text-lg font-semibold" asChild>
                <Link href={`./project/${project.project_name}`}>지금 바로 예상 견적을 받아보세요 ✨</Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 주의사항 */}
      <div className="w-full flex flex-col pt-2 pb-6 px-6 space-y-4">
        <div className="flex space-x-1.5 text-muted-foreground">
          <div className="pt-[1.75px]">
            <Info className="!size-4" />
          </div>
          <p className="text-sm break-keep">
            계약 문의 취소하기는 계약이 진행중이지 않은 상태에서만 신청할 수 있어요. 진행 중인 계약을 종료하고 싶은 경우 문의하기를 사용해주세요.
          </p>
        </div>
        <div className="flex space-x-1.5 text-muted-foreground">
          <div className="pt-[1.75px]">
            <Info className="!size-4" />
          </div>
          <p className="text-sm break-keep">
            세금계산서 발행은 6개월 이하로 진행되는 경우 프로젝트 완료 이후, 6개월 이상 진행되는 경우 계약금과 잔금 지급 후 각각 발행할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto md:overflow-hidden">
      {/* 헤더 */}
      <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4 bg-background z-20">
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
            <Link href={`./project/${project.project_name}`}>
              <Fullscreen className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:overflow-hidden">
        {/* 데스크톱 왼쪽 패널 */}
        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          <OverviewContent />
        </div>

        {/* 데스크톱 오른쪽 패널 */}
        <div className="flex flex-col md:col-span-2 h-full overflow-hidden">
          <div className="w-full">
            {/* 상태 표시 탭 */}
            <Flattabs tabs={tabs1} activeTab={activeTab1} handleTabChange={setActiveTab1} />
            {/* 탭 콘텐츠 */}
            <div className="w-full bg-muted">
              {activeTab1 == 0 && (
                <div className="w-full flex space-x-2.5 px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm font-medium">성함</div>
                    <div className="text-sm font-medium">휴대전화</div>
                    <div className="text-sm font-medium">이메일</div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {!session?.user.name ? (
                      <Link href="/" className="flex items-center select-none space-x-0.5">
                        <p className="text-sm font-bold text-blue-500">이름을 등록해주세요</p>
                        <ArrowUpRight className="!size-4 text-blue-500" />
                      </Link>
                    ) : (
                      <div className="text-sm font-bold">{session.user.name} </div>
                    )}
                    {!session?.user.phoneNumber ? (
                      <Link href="/" className="flex items-center select-none space-x-0.5">
                        <p className="text-sm font-bold text-blue-500">전화번호를 등록해주세요</p>
                        <ArrowUpRight className="!size-4 text-blue-500" />
                      </Link>
                    ) : (
                      <div className="text-sm font-bold">{session.user.phoneNumber} </div>
                    )}
                    {!session?.user.email ? (
                      <Link href="/" className="flex items-center select-none space-x-0.5">
                        <p className="text-sm font-bold text-blue-500">이메일을 등록해주세요</p>
                        <ArrowUpRight className="!size-4 text-blue-500" />
                      </Link>
                    ) : (
                      <div className="text-sm font-bold">{session.user.email} </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab1 === 1 && (
                <div>
                  <p className="text-gray-600">문서 관련 내용이 여기에 표시됩니다.</p>
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="font-medium">프로젝트 계획서</div>
                      <div className="text-sm text-gray-500">PDF • 2.5MB</div>
                    </div>
                    <div>
                      <div className="font-medium">요구사항 명세서</div>
                      <div className="text-sm text-gray-500">DOCX • 1.2MB</div>
                    </div>
                    <div>
                      <div className="font-medium">디자인 가이드</div>
                      <div className="text-sm text-gray-500">PDF • 3.1MB</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full hidden md:block">
            {/* 일반 정보 탭 */}
            <Flattabs tabs={tabs2} activeTab={activeTab2} handleTabChange={setActiveTab2} />
            {/* 탭 콘텐츠 */}
            <div className="w-full grow overflow-y-auto scrollbar-hide">
              {activeTab2 === 0 && (
                <div className="flex flex-col space-y-2 pt-6">
                  <div className="text-sm font-bold mx-4">
                    테스크:
                    {data?.flatMap((i) => i.items).length}개
                  </div>

                  {error && <p className="px-6 py-4 text-sm text-red-500">테스크를 불러오는데 실패했습니다.</p>}
                  {data?.map((page, i) =>
                    page.items.map((task, j) => (
                      <div key={task.subject || `${i}-${j}`} className="flex space-x-2 px-4 py-4 hover:bg-muted cursor-pointer transition-colors duration-200">
                        <div className="mt-[5px] size-2.5 rounded-full shrink-0" style={{ backgroundColor: task.color ?? "#d1d5db" }}></div>
                        <div className="flex flex-col space-y-1.5">
                          <div className="pr-1 text-sm font-semibold">{task.subject}</div>
                          {task.description && <div className="text-sm whitespace-pre-wrap">{task.description}</div>}
                          {task.exp_start_date && (
                            <div className="text-xs text-muted-foreground flex space-x-1.5 items-center">
                              예상 마감일: {dayjs(task.exp_start_date).format("YYYY년 MM월 DD일")} {task.exp_end_date && "-"}{" "}
                              {task.exp_end_date && dayjs(task.exp_end_date).format("YYYY년 MM월 DD일")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {data?.map(
                    (page, i) =>
                      page.items.length === 0 &&
                      i === 0 && (
                        <div key={i} className="flex flex-col w-full px-4 mt-3">
                          <div className="flex flex-col space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#e5f2ff] via-[#daebff] to-[#e5f2ff] px-8 py-12 mb-1 text-sm select-none">
                            <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                              <fileIconMap.default className="!size-4" />
                              <p className="grow">Business Identity.zip</p>
                              <DownloadCloud className="!size-4 text-blue-500" />
                              <Check className="!size-4 text-emerald-500 ml-1" />
                            </div>
                            <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                              <fileIconMap.default className="!size-4" />
                              <p className="grow">디자인 레퍼런스.docs</p>
                              <DownloadCloud className="!size-4 text-blue-500" />
                              <X className="!size-4 text-red-500 ml-1" />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
                            <div className="text-base font-semibold">프로젝트 문의 시작하기</div>
                            <div className="text-sm font-medium text-muted-foreground">계약을 문의하고 프로젝트 현황을 파악해보세요.</div>
                          </div>
                        </div>
                      )
                  )}
                  {isLoading && <p className="px-6 py-4 text-sm text-muted-foreground">테스크 로딩 중...</p>}
                  <div ref={taskInfRef} />
                </div>
              )}
              {activeTab2 === 1 && (
                <div className="grid grid-cols-1 gap-3 px-4 py-6">
                  <div className="text-sm font-bold">파일: {(detailedProject.data?.custom_files || []).length}/50</div>
                  <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
                    <Info className="!size-4" />
                    <p>파일 첨부는 최대 30MB까지 가능해요.</p>
                  </div>
                  {Array.from(groupedFiles.entries()).map(([idx, files]) => (
                    <section key={idx} className="space-y-3">
                      <p className="text-xs font-medium text-blue-600">{files.uploader === "user" ? "내가 올린 파일" : "from Fellows"}</p>

                      {/* 기존 grid row 재사용 */}
                      {files.files.map((f, i) => {
                        const extension = getFileExtension(f.file_name);
                        const IconComponent = fileIconMap[extension] || fileIconMap.default;

                        return (
                          <div
                            key={i}
                            className={cn(
                              "grid items-center gap-2 w-full rounded-sm outline-1 outline-gray-200 pl-4 pr-3 py-1 text-sm font-medium",
                              f.uploader === "user" ? "grid-cols-[auto_1fr_auto_auto]" : "grid-cols-[auto_1fr_auto]"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconComponent className="!size-5" />

                            <div className="min-w-0 overflow-hidden">
                              <p className="truncate text-sm">{f.file_name}</p>
                            </div>

                            <FileDownloadButton file={f}>
                              <DownloadCloud className="!size-5 text-blue-500" />
                            </FileDownloadButton>

                            <div
                              className={cn(
                                "flex items-center justify-center rounded-sm",
                                f.uploader == "user" ? "w-8 h-8 hover:bg-muted cursor-pointer transition-colors duration-200" : "sr-only"
                              )}
                            >
                              {f.uploader == "user" && (
                                <UploadProgressIndicator progress={fileProgress[f.file_name] ?? 100} size={32} onRemove={() => removeFile(f.key, f.sse_key)} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  ))}

                  {detailedProject.data?.custom_files && detailedProject.data.custom_files.length === 0 && (
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#ffeee6] via-[#ffe5da] to-[#ffeee6] px-8 py-12 mb-1 text-sm select-none">
                        <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                          <fileIconMap.default className="!size-4" />
                          <p className="grow">Business Identity.zip</p>
                          <DownloadCloud className="!size-4 text-blue-500" />
                          <Check className="!size-4 text-emerald-500 ml-1" />
                        </div>
                        <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                          <fileIconMap.default className="!size-4" />
                          <p className="grow">디자인 레퍼런스.docs</p>
                          <DownloadCloud className="!size-4 text-blue-500" />
                          <X className="!size-4 text-red-500 ml-1" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
                        <div className="text-base font-semibold">프로젝트 파일 관리하기</div>
                        <div className="text-sm font-medium text-muted-foreground">프로젝트에 사용한 파일들을 정리해드릴께요.</div>
                      </div>
                    </div>
                  )}

                  <button
                    className="flex items-center justify-center space-x-1.5 mt-1 w-full rounded-sm bg-blue-200 hover:bg-blue-300 text-blue-500 font-bold px-4 py-3 mb-1 text-sm transition-colors duration-200 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="!size-5" strokeWidth={2} />
                    <p>파일 추가하기</p>
                  </button>

                  <input id="fileInput" ref={fileInputRef} type="file" onChange={handleChangeUpload} style={{ display: "none" }} className="sr-only" />
                </div>
              )}
              {activeTab2 === 2 && (
                <div>
                  <p className="text-gray-600">팀원 관련 내용이 여기에 표시됩니다.</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">김</div>
                      <div>
                        <div className="font-medium">김개발</div>
                        <div className="text-sm text-gray-500">Frontend Developer</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">이</div>
                      <div>
                        <div className="font-medium">이디자인</div>
                        <div className="text-sm text-gray-500">UI/UX Designer</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">박</div>
                      <div>
                        <div className="font-medium">박백엔드</div>
                        <div className="text-sm text-gray-500">Backend Developer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 모바일 전체 화면 탭 인터페이스 */}
        <div className="md:hidden col-span-full h-full flex flex-col">
          {/* 모바일 탭 */}
          <Flattabs tabs={mobileTabs} activeTab={activeMobileTab} handleTabChange={setActiveMobileTab} />

          {/* 모바일 탭 콘텐츠 */}
          <div className="w-full grow scrollbar-hide">
            {activeMobileTab === 0 && <OverviewContent />}
            {activeMobileTab === 1 && (
              <div className="flex flex-col space-y-2 pt-6">
                <div className="text-sm font-bold mx-4">
                  테스크:
                  {data?.reduce((sum, page) => {
                    return sum + (page.items?.length ?? 0);
                  }, 0) ?? 0}
                  개
                </div>

                {error && <p className="px-6 py-4 text-sm text-red-500">테스크를 불러오는데 실패했습니다.</p>}
                {data?.map((page, i) =>
                  page.items.map((task, j) => (
                    <div key={task.subject || `${i}-${j}`} className="flex space-x-2 px-4 py-4 hover:bg-muted cursor-pointer transition-colors duration-200">
                      <div className="mt-[5px] size-2.5 rounded-full shrink-0" style={{ backgroundColor: task.color ?? "#d1d5db" }}></div>
                      <div className="flex flex-col space-y-1.5">
                        <div className="pr-1 text-sm font-semibold">{task.subject}</div>
                        {task.description && <div className="text-sm whitespace-pre-wrap">{task.description}</div>}
                        {task.exp_start_date && (
                          <div className="text-xs text-muted-foreground flex space-x-1.5 items-center">
                            예상 마감일: {dayjs(task.exp_start_date).format("YYYY년 MM월 DD일")} {task.exp_end_date && "-"}{" "}
                            {task.exp_end_date && dayjs(task.exp_end_date).format("YYYY년 MM월 DD일")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {data?.map(
                  (page, i) =>
                    page.items.length === 0 &&
                    i === 0 && (
                      <div key={i} className="flex flex-col w-full px-4 mt-3">
                        <div className="flex flex-col space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#e5f2ff] via-[#daebff] to-[#e5f2ff] px-8 py-12 mb-1 text-sm select-none">
                          <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                            <fileIconMap.default className="!size-4" />
                            <p className="grow">Business Identity.zip</p>
                            <DownloadCloud className="!size-4 text-blue-500" />
                            <Check className="!size-4 text-emerald-500 ml-1" />
                          </div>
                          <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                            <fileIconMap.default className="!size-4" />
                            <p className="grow">디자인 레퍼런스.docs</p>
                            <DownloadCloud className="!size-4 text-blue-500" />
                            <X className="!size-4 text-red-500 ml-1" />
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
                          <div className="text-base font-semibold">프로젝트 문의 시작하기</div>
                          <div className="text-sm font-medium text-muted-foreground">계약을 문의하고 프로젝트 현황을 파악해보세요.</div>
                        </div>
                      </div>
                    )
                )}
                {isLoading && <p className="px-6 py-4 text-sm text-muted-foreground">테스크 로딩 중...</p>}
                <div ref={taskInfRef} />
              </div>
            )}
            {activeMobileTab === 2 && (
              <div className="grid grid-cols-1 gap-3 px-4 py-6">
                <div className="text-sm font-bold">파일: {(detailedProject.data?.custom_files || []).length}/50</div>
                <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
                  <Info className="!size-4" />
                  <p>파일 첨부는 최대 30MB까지 가능해요.</p>
                </div>
                {Array.from(groupedFiles.entries()).map(([idx, files]) => (
                  <section key={idx} className="space-y-3">
                    <p className="text-xs font-medium text-blue-600">{files.uploader === "user" ? "내가 올린 파일" : "from Fellows"}</p>

                    {files.files.map((f, i) => {
                      const extension = getFileExtension(f.file_name);
                      const IconComponent = fileIconMap[extension] || fileIconMap.default;

                      return (
                        <div
                          key={i}
                          className={cn(
                            "grid items-center gap-2 w-full rounded-sm outline-1 outline-gray-200 pl-4 pr-3 py-1 text-sm font-medium",
                            f.uploader === "user" ? "grid-cols-[auto_1fr_auto_auto]" : "grid-cols-[auto_1fr_auto]"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconComponent className="!size-5" />

                          <div className="min-w-0 overflow-hidden">
                            <p className="truncate text-sm">{f.file_name}</p>
                          </div>

                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-muted cursor-pointer transition-colors duration-200"
                            onClick={() => getFile(f.algorithm, f.key, f.sse_key, f.file_name)}
                          >
                            <DownloadCloud className="!size-5 text-blue-500" />
                          </button>

                          <div
                            className={cn(
                              "flex items-center justify-center rounded-sm",
                              f.uploader == "user" ? "w-8 h-8 hover:bg-muted cursor-pointer transition-colors duration-200" : "sr-only"
                            )}
                          >
                            {f.uploader == "user" && (
                              <UploadProgressIndicator progress={fileProgress[f.file_name] ?? 100} size={32} onRemove={() => removeFile(f.key, f.sse_key)} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                ))}

                {detailedProject.data?.custom_files && detailedProject.data.custom_files.length === 0 && (
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#ffeee6] via-[#ffe5da] to-[#ffeee6] px-8 py-12 mb-1 text-sm select-none">
                      <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                        <fileIconMap.default className="!size-4" />
                        <p className="grow">Business Identity.zip</p>
                        <DownloadCloud className="!size-4 text-blue-500" />
                        <Check className="!size-4 text-emerald-500 ml-1" />
                      </div>
                      <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
                        <fileIconMap.default className="!size-4" />
                        <p className="grow">디자인 레퍼런스.docs</p>
                        <DownloadCloud className="!size-4 text-blue-500" />
                        <X className="!size-4 text-red-500 ml-1" />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
                      <div className="text-base font-semibold">프로젝트 파일 관리하기</div>
                      <div className="text-sm font-medium text-muted-foreground">프로젝트에 사용한 파일들을 정리해드릴께요.</div>
                    </div>
                  </div>
                )}

                <button
                  className="flex items-center justify-center space-x-1.5 mt-1 w-full rounded-sm bg-blue-200 hover:bg-blue-300 text-blue-500 font-bold px-4 py-3 mb-1 text-sm transition-colors duration-200 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="!size-5" strokeWidth={2} />
                  <p>파일 추가하기</p>
                </button>

                <input id="fileInput" ref={fileInputRef} type="file" onChange={handleChangeUpload} style={{ display: "none" }} className="sr-only" />
              </div>
            )}
            {activeMobileTab === 3 && (
              <div>
                <p className="text-gray-600">팀원 관련 내용이 여기에 표시됩니다.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">김</div>
                    <div>
                      <div className="font-medium">김개발</div>
                      <div className="text-sm text-gray-500">Frontend Developer</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">이</div>
                    <div>
                      <div className="font-medium">이디자인</div>
                      <div className="text-sm text-gray-500">UI/UX Designer</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">박</div>
                    <div>
                      <div className="font-medium">박백엔드</div>
                      <div className="text-sm text-gray-500">Backend Developer</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
