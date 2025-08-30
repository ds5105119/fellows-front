"use client";
import type { Session } from "next-auth";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, Loader2, RefreshCw } from "lucide-react";
import Flattabs from "@/components/ui/flattabs";
import { useProject, updateProject, acceptInviteProjectGroup } from "@/hooks/fetch/project";
import { updateERPNextProjectSchema, type UserERPNextProject } from "@/@types/service/project";
import { cn } from "@/lib/utils";
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
import { ContractList } from "./contract-list";
import { ContractSheet } from "./contract-sheet";
import { usePathname } from "next/navigation";
import type { UserERPNextContract } from "@/@types/service/contract";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ProjectDetailSheetProps {
  project_id: string;
  onClose: () => void;
  session: Session;
}

interface Project404Props {
  onClose: () => void;
  onRetry: () => void;
}

interface TeamMember {
  member: string;
  level: number;
}

function Project404({ onClose, onRetry }: Project404Props) {
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
  const pathname = usePathname();

  // State 관리
  const project = useProject(project_id);
  const [editedProject, setEditedProject] = useState<UserERPNextProject | undefined>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [autosave, setAutosave] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<number>(0);
  const [activeTab1, setActiveTab1] = useState<number>(0);
  const [activeTab2, setActiveTab2] = useState<number>(0);
  const [level, setLevel] = useState<number>(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedContract, setSelectedContract] = useState<UserERPNextContract | undefined>(undefined);
  const [contractSheetOpen, setContractSheetOpen] = useState(false);

  const initialContractName = useMemo(() => {
    const pathSegments = pathname.split("/");
    const contractsIndex = pathSegments.indexOf("contracts");

    if (contractsIndex !== -1 && pathSegments.length > contractsIndex + 1) {
      return decodeURIComponent(pathSegments[contractsIndex + 1]);
    }
    return undefined;
  }, [pathname]);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const hasContracts = pathSegments.includes("contracts");
    const hasTeams = pathSegments.includes("teams");
    const hasFiles = pathSegments.includes("files");

    const contractsIndex = pathSegments.indexOf("contracts");
    const isContractDetail = contractsIndex !== -1 && pathSegments.length > contractsIndex + 1;

    if (hasContracts || isContractDetail) {
      setActiveTab2(1);
      setActiveMobileTab(2);
    } else if (hasTeams) {
      setActiveTab2(2);
      setActiveMobileTab(3);
    } else if (hasFiles) {
      setActiveTab2(0);
      setActiveMobileTab(1);
    } else {
      setActiveTab2(0);
      setActiveMobileTab(0);
    }
  }, [pathname]);

  const handleMobileTabChange = useCallback(
    (index: number) => {
      setActiveMobileTab(index);

      const basePath = pathname.replace(/\/(files|contracts|teams)$/, "");
      const tabPaths = ["", "/files", "/contracts", "/teams"];
      const newPath = basePath + tabPaths[index];

      window.history.replaceState(null, "", newPath);
    },
    [pathname]
  );

  const handleDesktopTabChange = useCallback(
    (index: number) => {
      setActiveTab2(index);

      const basePath = pathname.replace(/\/(files|contracts|teams)$/, "");

      if (index === 1) {
        // contracts
        window.history.replaceState(null, "", basePath + "/contracts");
      } else if (index === 2) {
        // teams
        window.history.replaceState(null, "", basePath + "/teams");
      } else if (index === 0) {
        // files - 데스크톱에서는 기본 경로로
        window.history.replaceState(null, "", basePath);
      }
    },
    [pathname]
  );

  //  Calculate editable status more efficiently
  const editable = useMemo(() => {
    if (!project.data?.custom_team || !session.sub) return false;
    const member = project.data.custom_team.find((member: TeamMember) => member.member === session.sub);
    return member ? member.level < 3 : false;
  }, [project.data?.custom_team, session.sub]);

  //  Initialize autosave based on editable status
  useEffect(() => {
    setAutosave(editable);
  }, [editable]);

  // 탭 구성
  const mobileTabs = useMemo(
    () => [
      <div className="flex space-x-1 items-center" key="overview">
        <span>개요</span>
      </div>,
      <div className="flex space-x-1 items-center" key="files">
        <span>파일</span>
      </div>,
      <div className="flex space-x-1 items-center" key="contracts">
        <span>계약서</span>
      </div>,
      <div className="flex space-x-1 items-center" key="teams">
        <span>팀원</span>
      </div>,
    ],
    []
  );

  const tabs1 = useMemo(
    () => [
      project.data?.customer ? (
        <div className="flex space-x-1.5 items-center" key="customer-ok">
          <span>계약자</span>
          <div className="size-2.5 rounded-full bg-emerald-500" />
        </div>
      ) : (
        <div className="flex space-x-1.5 items-center" key="customer-no">
          <span>계약자</span>
          <div className="size-2.5 rounded-full bg-red-500" />
        </div>
      ),
      <div className="flex space-x-1.5 items-center" key="company-ok">
        <span>회사</span>
        <div className="size-2.5 rounded-full bg-emerald-500" />
      </div>,
    ],
    [project.data?.customer]
  );

  const tabs2 = useMemo(
    () => [
      <div className="flex space-x-1 items-center" key="files">
        <span>파일</span>
      </div>,
      <div className="flex space-x-1 items-center" key="contracts">
        <span>계약서</span>
      </div>,
      <div className="flex space-x-1 items-center" key="teams">
        <span>팀원</span>
      </div>,
    ],
    []
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(project_id);
      toast.success("프로젝트 번호가 복사되었습니다.");
    } catch {
      toast.error("프로젝트 번호 복사에 실패했습니다.");
    }
  }, [project_id]);

  const handleUpdateProject = useCallback(async () => {
    if (!editable || !editedProject) return;

    setIsUpdating(true);
    try {
      await updateProject(project_id, updateERPNextProjectSchema.parse(editedProject));
      await project.mutate();
    } catch {
      toast.error("프로젝트 저장에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  }, [editable, editedProject, project_id, project]);

  const handleRetry = useCallback(() => {
    project.mutate();
  }, [project]);

  const acceptInvite = useCallback(async () => {
    try {
      await acceptInviteProjectGroup(project_id);
      await project.mutate();
    } catch {
      toast.error("초대 수락에 실패했습니다.");
    }
  }, [project_id, project]);

  const handleContractSelect = useCallback(
    (contract: UserERPNextContract) => {
      setSelectedContract(contract);
      setContractSheetOpen(true);

      const pathSegments = pathname.split("/");
      const contractsIndex = pathSegments.indexOf("contracts");

      let newPath: string;
      if (contractsIndex !== -1) {
        // 이미 /contracts가 있는 경우
        if (pathSegments.length > contractsIndex + 1) {
          // 계약서 이름이 이미 있는 경우, 교체
          pathSegments[contractsIndex + 1] = encodeURIComponent(contract.name);
          newPath = pathSegments.join("/");
        } else {
          // 계약서 이름이 없는 경우, 추가
          newPath = `${pathname}/${encodeURIComponent(contract.name)}`;
        }
      } else {
        // /contracts가 없는 경우, 추가
        newPath = `${pathname}/contracts/${encodeURIComponent(contract.name)}`;
      }

      window.history.replaceState(null, "", newPath);
    },
    [pathname]
  );

  const handleContractSheetClose = useCallback(() => {
    setContractSheetOpen(false);
    setSelectedContract(undefined);

    const pathSegments = pathname.split("/");
    const contractsIndex = pathSegments.indexOf("contracts");

    if (contractsIndex !== -1 && pathSegments.length > contractsIndex + 1) {
      // 계약서 이름이 있는 경우, 계약서 이름만 제거
      const newPath = pathSegments.slice(0, contractsIndex + 1).join("/");
      window.history.replaceState(null, "", newPath);
    }
  }, [pathname]);

  //  Simplified project data sync
  useEffect(() => {
    if (project.data) {
      setEditedProject(project.data);
    }
  }, [project.data]);

  //  Optimized autosave with better dependency management
  useEffect(() => {
    if (!autosave || !editable || !project.data || !editedProject) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const original = JSON.stringify(project.data);
      const current = JSON.stringify(editedProject);

      if (original !== current && !isUpdating) {
        handleUpdateProject().catch(() => {
          toast.error("자동 저장에 실패했습니다.");
        });
      }
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autosave, editable, project.data, editedProject, isUpdating, handleUpdateProject]);

  //  Simplified level calculation
  useEffect(() => {
    if (project.data?.custom_team && session.sub) {
      const member = project.data.custom_team.find((member: TeamMember) => member.member === session.sub);
      setLevel(member?.level ?? 5);
    }
  }, [project.data?.custom_team, session.sub]);

  //  Show loading only for initial load, not for every render
  if (project.isLoading && !project.data) {
    return <ProjectLoading />;
  }

  // 에러 상태 (404)
  if (project.error) {
    return <Project404 onClose={onClose} onRetry={handleRetry} />;
  }

  //  Show content immediately even if editedProject is not ready
  const displayProject = editedProject || project.data;

  if (!displayProject) {
    return <ProjectLoading />;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto md:overflow-hidden pb-12">
      {/* 초대된 프로젝트의 경우 */}
      {level === 4 && (
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
      <div className="grid grid-cols-1 md:grid-cols-5 md:overflow-hidden overflow-x-hidden h-[calc(100%-48px)]">
        {/* 데스크톱 왼쪽 패널 */}
        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          <div className="flex flex-col h-full w-full">
            <div className="pt-12 pb-5 px-8">
              <ProjectHeader project={displayProject} />
            </div>
            <div className="px-8 py-6">
              <ProjectBasicInfo project={displayProject} />
            </div>
            <ProjectStatus project={displayProject} session={session} setEditedProject={setEditedProject} />
            <div className="p-8">
              <ProjectDetails project={displayProject} setEditedProject={setEditedProject} />
            </div>
            {level < 2 && <ProjectActions project={displayProject} />}
            <div className="px-8 pt-1 pb-5">
              <ProjectNotices />
            </div>
          </div>
        </div>

        {/* 데스크톱 오른쪽 패널 */}
        <div className="hidden md:flex flex-col md:col-span-2 h-full overflow-hidden">
          <div className="w-full">
            {/* 상태 표시 탭 */}
            <Flattabs tabs={tabs1} activeTab={activeTab1} handleTabChange={setActiveTab1} />
            {/* 탭 콘텐츠 */}
            <div className="w-full bg-muted">
              {activeTab1 === 0 && <CustomerInfo projectSwr={project} session={session} />}
              {activeTab1 === 1 && (
                <div className="px-6 py-4">
                  <p className="text-gray-600">문서 관련 내용이 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full hidden md:block overflow-hidden">
            {/* 일반 정보 탭 */}
            <Flattabs tabs={tabs2} activeTab={activeTab2} handleTabChange={handleDesktopTabChange} />
            {/* 탭 콘텐츠 */}
            <div className="w-full h-[calc(100%-41px)] overflow-y-auto">
              {activeTab2 === 0 && <FilesList projectSwr={project} session={session} />}
              {activeTab2 === 1 && (
                <ContractList
                  projectSwr={project}
                  selectedContract={selectedContract}
                  onContractSelect={handleContractSelect}
                  initialContractName={initialContractName}
                />
              )}
              {activeTab2 === 2 && <TeamsList projectSwr={project} session={session} />}
            </div>
          </div>
        </div>

        {/* 모바일 전체 화면 탭 인터페이스 */}
        <div className="md:hidden col-span-full h-full flex flex-col relative">
          {/* 상태 표시 탭 */}
          <Flattabs tabs={tabs1} activeTab={activeTab1} handleTabChange={setActiveTab1} />
          {/* 탭 콘텐츠 */}
          <div className="w-full bg-muted">
            {activeTab1 === 0 && <CustomerInfo projectSwr={project} session={session} />}
            {activeTab1 === 1 && (
              <div className="px-6 py-4">
                <p className="text-gray-600">문서 관련 내용이 여기에 표시됩니다.</p>
              </div>
            )}
          </div>

          {/* 모바일 탭 */}
          <Flattabs tabs={mobileTabs} activeTab={activeMobileTab} handleTabChange={handleMobileTabChange} />
          {/* 모바일 탭 콘텐츠 */}
          <div className="flex flex-col h-full w-full">
            {activeMobileTab === 0 && (
              <>
                <div className="pt-12 pb-5 px-4">
                  <ProjectHeader project={displayProject} />
                </div>
                <div className="px-4 py-6">
                  <ProjectBasicInfo project={displayProject} />
                </div>
                <ProjectStatus project={displayProject} session={session} setEditedProject={setEditedProject} />
                <div className="p-4">
                  <ProjectDetails project={displayProject} setEditedProject={setEditedProject} />
                </div>
                {level < 2 && <ProjectActions project={displayProject} />}
                <div className="px-4 pt-1 pb-5">
                  <ProjectNotices />
                </div>
              </>
            )}
            {activeMobileTab === 1 && <FilesList projectSwr={project} session={session} />}
            {activeMobileTab === 2 && (
              <ContractList
                projectSwr={project}
                selectedContract={selectedContract}
                onContractSelect={handleContractSelect}
                initialContractName={initialContractName}
              />
            )}
            {activeMobileTab === 3 && <TeamsList projectSwr={project} session={session} />}
          </div>
        </div>
      </div>

      <Sheet
        open={contractSheetOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleContractSheetClose();
          }
        }}
      >
        <SheetTrigger className="sr-only" />
        <SheetContent side="left" className="w-full h-full sm:max-w-full md:w-[45%] md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
          <SheetHeader className="sr-only">
            <SheetTitle>계약서</SheetTitle>
          </SheetHeader>
          <ContractSheet
            contract={selectedContract}
            session={session}
            setOpenSheet={(open: boolean) => {
              if (!open) {
                handleContractSheetClose();
              }
            }}
          />
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>

      {/* 시트 푸터 */}
      <div className="absolute bottom-0 w-full flex items-center justify-between h-12 border-t-1 border-t-sidebar-border px-4 bg-zinc-50 z-30">
        {displayProject.custom_project_status === "draft" ? (
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {editable
                ? displayProject.modified
                  ? `${dayjs(displayProject.modified).format("YYYY-MM-DD HH:mm:ss")} 수정됨`
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
        {displayProject.custom_project_status === "draft" ? (
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
