"use client";
import type { Session } from "next-auth";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, Loader2, RefreshCw, Home, Search } from "lucide-react";
import Flattabs from "@/components/ui/flattabs";
import { useProject, updateProject, acceptInviteProjectGroup } from "@/hooks/fetch/project";
import { updateERPNextProjectSchema, type UserERPNextProject } from "@/@types/service/project";
import { cn } from "@/lib/utils";
// 분리된 컴포넌트들 import
import { CustomerInfo } from "./customer-info";
import { FilesList } from "./files-list";
import { TeamsList } from "./teams-list";
import { ProjectHeader } from "./project-header";
import { ProjectBasicInfo } from "./project-basic-info";
import { ProjectStatus } from "./project-status";
import { ProjectDetails } from "./project-details";
import { ProjectActions } from "./project-actions";
import { ProjectNotices } from "./project-notices";
import dayjs from "dayjs";
import Link from "next/link";

interface ProjectDetailSheetProps {
  project_id: string;
  onClose: () => void;
  session: Session;
}

function Project404({ onClose, onRetry }: { onClose: () => void; onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-6">
        {/* 메시지 */}
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">프로젝트를 찾을 수 없습니다</h1>
          <p className="text-gray-600 leading-relaxed">요청하신 프로젝트가 삭제되었거나 접근 권한이 없습니다.</p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={onRetry}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center text-xs space-y-1.5 text-muted-foreground">
      <Loader2 className="!size-6 animate-spin" />
      <p>로딩 중</p>
    </div>
  );
}

export default function ProjectDetailSheet({ project_id, onClose, session }: ProjectDetailSheetProps) {
  // State 관리
  const project = useProject(project_id);
  const editable = project.data?.custom_team ? project.data.custom_team.filter((member) => member.member == session.sub)[0].level < 3 : false;
  const [editedProject, setEditedProject] = useState<UserERPNextProject>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [autosave, setAutosave] = useState(editable);
  const [activeMobileTab, setActiveMobileTab] = useState(0);
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);
  const [isInvited, setIsInvited] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 탭 구성
  const mobileTabs = [
    <div className="flex space-x-1 items-center" key="overview">
      <span>개요</span>
    </div>,
    <div className="flex space-x-1 items-center" key="files">
      <span>파일</span>
    </div>,
    <div className="flex space-x-1 items-center" key="teams">
      <span>팀원</span>
    </div>,
  ];

  const tabs1 = useMemo(
    () => [
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
      <div className="flex space-x-1.5 items-center" key="company-ok">
        <span>회사</span>
        <div className="size-2.5 rounded-full bg-emerald-500" />
      </div>,
    ],
    [session?.user, project]
  );

  const tabs2 = [
    <div className="flex space-x-1 items-center" key="files">
      <span>파일</span>
    </div>,
    <div className="flex space-x-1 items-center" key="teams">
      <span>팀원</span>
    </div>,
  ];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(project_id);
      toast.success("프로젝트 번호가 복사되었습니다.");
    } catch {
      toast.error("프로젝트 번호 복사에 실패했습니다.");
    }
  }, [project_id]);

  const handleUpdateProject = async () => {
    if (editable) {
      setIsUpdating(true);
      await updateProject(project_id, updateERPNextProjectSchema.parse(editedProject));
      await project.mutate();
      setIsUpdating(false);
    }
  };

  const handleRetry = useCallback(() => {
    project.mutate();
  }, [project]);

  const acceptInvite = useCallback(async () => {
    console.log(project_id);
    await acceptInviteProjectGroup(project_id);
    project.mutate();
  }, [project]);

  // 프로젝트 정보 반영
  useEffect(() => {
    setEditedProject(project.data);
  }, [project.data]);

  // 프로젝트 자동 저장
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const original = JSON.stringify(project.data);
      const current = JSON.stringify(editedProject);
      if (original !== current && !isUpdating && autosave) {
        try {
          await handleUpdateProject();
        } catch {
          toast.error("프로젝트 저장에 실패했습니다.");
        }
      }
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [project.data, editedProject, isUpdating, autosave]);

  useEffect(() => {
    setIsInvited(project.data?.custom_team.filter((member) => member.member == session.sub)[0].level == 4);
  }, [project.data, session.sub]);

  // 로딩 상태
  if (!editedProject || !project.data || project.isLoading) {
    return <ProjectLoading />;
  }

  // 에러 상태 (404)
  if (project.error) {
    return <Project404 onClose={onClose} onRetry={handleRetry} />;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto md:overflow-hidden pb-12">
      {/* 초대된 프로젝트의 경우 */}
      {isInvited && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-xs z-50">
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <p className="text-sm text-gray-700 mb-2">이 프로젝트는 초대된 프로젝트입니다.</p>
            <p className="text-xs text-gray-500 mb-4">초대를 수락하시겠습니까?</p>
            <div className="flex space-x-3">
              <Button variant="default" size="sm" onClick={acceptInvite}>
                수락
              </Button>
              <Button variant="secondary" size="sm" onClick={onClose}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4 bg-background z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
            <ArrowLeft className="!size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
            <LinkIcon className="!size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent">
            이용 가이드
          </Button>
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent" asChild>
            <Link href={`/service/project/task?project_id=${project_id}`}>작업 현황</Link>
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:overflow-hidden">
        {/* 데스크톱 왼쪽 패널 */}
        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          <div className="flex flex-col h-full w-full">
            <div className="pt-12 pb-5 px-8">
              <ProjectHeader project={editedProject} />
            </div>
            <div className="px-8 py-6">
              <ProjectBasicInfo project={editedProject} />
            </div>
            <ProjectStatus project={editedProject} session={session} setEditedProject={setEditedProject} />
            <div className="p-8">
              <ProjectDetails project={editedProject} setEditedProject={setEditedProject} />
            </div>
            <ProjectActions project={editedProject} />
            <div className="px-8 pt-1 pb-5">
              <ProjectNotices />
            </div>
          </div>
        </div>

        {/* 데스크톱 오른쪽 패널 */}
        <div className="flex flex-col md:col-span-2 h-full overflow-hidden">
          <div className="w-full">
            {/* 상태 표시 탭 */}
            <Flattabs tabs={tabs1} activeTab={activeTab1} handleTabChange={setActiveTab1} />
            {/* 탭 콘텐츠 */}
            <div className="w-full bg-muted">
              {activeTab1 === 0 && <CustomerInfo session={session} />}
              {activeTab1 === 1 && (
                <div className="px-6 py-4">
                  <p className="text-gray-600">문서 관련 내용이 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full hidden md:block">
            {/* 일반 정보 탭 */}
            <Flattabs tabs={tabs2} activeTab={activeTab2} handleTabChange={setActiveTab2} />
            {/* 탭 콘텐츠 */}
            <div className="w-full grow overflow-y-auto scrollbar-hide">
              {activeTab2 === 0 && <FilesList projectSwr={project} />}
              {activeTab2 === 1 && <TeamsList projectSwr={project} session={session} />}
            </div>
          </div>
        </div>

        {/* 모바일 전체 화면 탭 인터페이스 */}
        <div className="md:hidden col-span-full h-full flex flex-col overflow-x-hidden">
          {/* 모바일 탭 */}
          <Flattabs tabs={mobileTabs} activeTab={activeMobileTab} handleTabChange={setActiveMobileTab} />
          {/* 모바일 탭 콘텐츠 */}
          <div className="flex flex-col h-full w-full">
            {activeMobileTab === 0 && (
              <>
                <div className="pt-12 pb-5 px-4">
                  <ProjectHeader project={editedProject} />
                </div>
                <div className="px-4 py-6">
                  <ProjectBasicInfo project={editedProject} />
                </div>
                <ProjectStatus project={editedProject} session={session} setEditedProject={setEditedProject} />
                <div className="p-4">
                  <ProjectDetails project={editedProject} setEditedProject={setEditedProject} />
                </div>
                <ProjectActions project={editedProject} />
                <div className="px-4 pt-1 pb-5">
                  <ProjectNotices />
                </div>
              </>
            )}
            {activeMobileTab === 1 && <FilesList projectSwr={project} />}
            {activeMobileTab === 2 && <TeamsList projectSwr={project} session={session} />}
          </div>
        </div>
      </div>

      {/* 시트 푸터 */}
      <div className="absolute bottom-0 w-full flex items-center justify-between h-12 border-t-1 border-t-sidebar-border px-4 bg-zinc-50 z-20">
        {project.data.custom_project_status === "draft" ? (
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {editable
                ? project.data.modified
                  ? `${dayjs(project.data.modified).format("YYYY-MM-DD HH:mm:ss")} 수정됨`
                  : "수정되지 않은 프로젝트"
                : "읽기 전용 모드(저장되지 않습니다)"}
            </p>
            <button
              disabled={!editable}
              onClick={() => setAutosave((prev) => !prev)}
              className={cn(
                "py-0.5 px-1.5 text-[11px] font-semibold rounded-sm cursor-pointer select-none border",
                autosave ? "bg-blue-100 hover:bg-blue-200 active:bg-blue-200 border-blue-400 text-blue-500" : "bg-zinc-100 border-zinc-400 text-zinc-500"
              )}
            >
              {autosave ? "자동 저장 중" : "자동 저장 끔"}
            </button>
            {editable && (
              <button
                onClick={handleUpdateProject}
                disabled={isUpdating}
                className={cn(
                  "py-0.5 px-1.5 text-[11px] font-semibold rounded-sm cursor-pointer select-none border flex items-center gap-1",
                  isUpdating
                    ? "bg-zinc-50 border-zinc-300 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-200 border-zinc-400 text-zinc-500"
                )}
              >
                {isUpdating && <Loader2 className="!size-3 animate-spin" />}
                {isUpdating ? "저장중" : "저장"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold text-muted-foreground">진행 중인 프로젝트는 수정할 수 없어요.</p>
          </div>
        )}
        {project.data.custom_project_status === "draft" ? (
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-sm border-gray-200 shadow-none bg-transparent">
              이용 약관
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-sm border-gray-200 shadow-none bg-transparent">
              이용 약관
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
