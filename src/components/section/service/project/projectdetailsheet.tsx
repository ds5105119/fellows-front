"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Flattabs from "@/components/ui/flattabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useProject, updateProject, acceptInviteProjectGroup, useProjectCustomer } from "@/hooks/fetch/project";
import { updateERPNextProjectSchema, type UserERPNextProject } from "@/@types/service/project";
import { cn } from "@/lib/utils";
import { CustomerInfo } from "./customer-info";
import { EnvironmentInfo } from "./environment-info";
import { FilesList } from "./files-list";
import { TeamsList } from "./teams-list";
import { ProjectHeader } from "./project-header";
import { ProjectBasicInfo } from "./project-basic-info";
import { ProjectStatus } from "./project-status";
import { ProjectDetails } from "./project-details";
import { ProjectActions } from "./project-actions";
import { ProjectNotices } from "./project-notices";
import { ContractList } from "./contract-list";
import { ContractSheet } from "../contract/contract-sheet";
import dayjs from "dayjs";
import type { UserERPNextContract } from "@/@types/service/contract";
import ProjectDetailSheetHeader from "./projectdetailsheet-header";
import { useContracts } from "@/hooks/fetch/contract";

interface ProjectDetailSheetProps {
  project_id?: string;
  onClose: () => void | Promise<void>;
  session: Session;
  registerBeforeClose?: (handler: (() => Promise<boolean>) | null) => void;
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

export default function ProjectDetailSheet({ project_id, onClose, session, registerBeforeClose }: ProjectDetailSheetProps) {
  const pathname = usePathname();

  // State 관리
  const projectSwr = useProject(project_id ?? null);

  const [editedProject, setEditedProject] = useState<UserERPNextProject | undefined>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [autosave, setAutosave] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<number>(0);
  const [activeTab1, setActiveTab1] = useState<number>(0);
  const [activeTab2, setActiveTab2] = useState<number>(0);
  const [level, setLevel] = useState<number>(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updatePromiseRef = useRef<Promise<boolean> | null>(null);
  const displayProject = editedProject || projectSwr.data;

  const customerSwr = useProjectCustomer(displayProject?.project_name ?? null);

  const contractsSwr = useContracts({ project_id });
  const [selectedContract, setSelectedContract] = useState<UserERPNextContract | undefined>(undefined);
  const [contractSheetOpen, setContractSheetOpen] = useState(false);
  const contractSheetClosingRef = useRef(false);
  const contractSheetCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!projectSwr.data?.custom_team || !session.sub) return false;
    const member = projectSwr.data.custom_team.find((member: TeamMember) => member.member === session.sub);
    return member ? member.level < 3 : false;
  }, [projectSwr.data?.custom_team, session.sub]);

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
      customerSwr.data?.name && customerSwr.data?.email && customerSwr.data?.phoneNumber ? (
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
        <span>프로젝트 환경</span>
      </div>,
    ],
    [projectSwr.data?.customer, customerSwr.data]
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

  const hasUnsavedChanges = useMemo(() => {
    if (!editable || !projectSwr.data || !editedProject) return false;

    try {
      return JSON.stringify(projectSwr.data) !== JSON.stringify(editedProject);
    } catch {
      return true;
    }
  }, [editable, projectSwr.data, editedProject]);

  const handleUpdateProject = useCallback(async (): Promise<boolean> => {
    if (!editable || !editedProject || !project_id) return !hasUnsavedChanges;
    if (!hasUnsavedChanges) return true;

    if (updatePromiseRef.current) {
      return updatePromiseRef.current;
    }

    const updatePromise = (async () => {
      setIsUpdating(true);
      try {
        await updateProject(project_id, updateERPNextProjectSchema.parse(editedProject));
        await projectSwr.mutate();
        return true;
      } catch {
        toast.error("프로젝트 저장에 실패했습니다.");
        return false;
      } finally {
        setIsUpdating(false);
        updatePromiseRef.current = null;
      }
    })();

    updatePromiseRef.current = updatePromise;
    return updatePromise;
  }, [editable, editedProject, project_id, projectSwr, hasUnsavedChanges]);

  const ensureSavedBeforeClose = useCallback(async () => {
    if (updatePromiseRef.current) {
      return updatePromiseRef.current;
    }

    if (!editable) {
      return true;
    }

    if (!hasUnsavedChanges) {
      return true;
    }

    return handleUpdateProject();
  }, [editable, handleUpdateProject, hasUnsavedChanges]);

  useEffect(() => {
    if (!registerBeforeClose) return;

    registerBeforeClose(ensureSavedBeforeClose);
    return () => {
      registerBeforeClose(null);
    };
  }, [registerBeforeClose, ensureSavedBeforeClose]);

  const handleRetry = useCallback(() => {
    projectSwr.mutate();
  }, [projectSwr]);

  const acceptInvite = useCallback(async () => {
    if (!project_id) return;

    try {
      await acceptInviteProjectGroup(project_id);
      await projectSwr.mutate();
    } catch {
      toast.error("초대 수락에 실패했습니다.");
    }
  }, [project_id, projectSwr]);

  const handleContractSelect = useCallback(
    (contract: UserERPNextContract) => {
      if (contractSheetClosingRef.current) return;
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
    contractSheetClosingRef.current = true;
    if (contractSheetCloseTimeoutRef.current) {
      clearTimeout(contractSheetCloseTimeoutRef.current);
    }
    setContractSheetOpen(false);
    setSelectedContract(undefined);

    const pathSegments = pathname.split("/");
    const contractsIndex = pathSegments.indexOf("contracts");

    if (contractsIndex !== -1 && pathSegments.length > contractsIndex + 1) {
      // 계약서 이름이 있는 경우, 계약서 이름만 제거
      const newPath = pathSegments.slice(0, contractsIndex + 1).join("/");
      window.history.replaceState(null, "", newPath);
    }

    contractSheetCloseTimeoutRef.current = setTimeout(() => {
      contractSheetClosingRef.current = false;
      contractSheetCloseTimeoutRef.current = null;
    }, 200);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (contractSheetCloseTimeoutRef.current) {
        clearTimeout(contractSheetCloseTimeoutRef.current);
        contractSheetCloseTimeoutRef.current = null;
      }
    };
  }, []);

  //  Simplified project data sync
  useEffect(() => {
    if (projectSwr.data) {
      setEditedProject(projectSwr.data);
    }
  }, [projectSwr.data]);

  //  Optimized autosave with better dependency management
  useEffect(() => {
    if (!autosave || !editable || !projectSwr.data || !editedProject) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (hasUnsavedChanges && !isUpdating) {
        void handleUpdateProject();
      }
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autosave, editable, projectSwr.data, editedProject, isUpdating, handleUpdateProject, hasUnsavedChanges]);

  //  Simplified level calculation
  useEffect(() => {
    if (projectSwr.data?.custom_team && session.sub) {
      const member = projectSwr.data.custom_team.find((member: TeamMember) => member.member === session.sub);
      setLevel(member?.level ?? 5);
    }
  }, [projectSwr.data?.custom_team, session.sub]);

  // 에러 상태 (404)
  if (projectSwr.error) {
    return <Project404 onClose={onClose} onRetry={handleRetry} />;
  }

  if (!displayProject) {
    return <ProjectLoading />;
  }

  //  Show loading only for initial load, not for every render
  if (projectSwr.isLoading && !projectSwr.data) {
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
      <ProjectDetailSheetHeader onClose={onClose} project={projectSwr} />

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:overflow-hidden overflow-x-hidden h-[calc(100%-48px)]">
        {/* 데스크톱 왼쪽 패널 */}
        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          <div className="flex flex-col h-full w-full">
            <div className="pt-12 pb-5 px-8">
              <ProjectHeader project={displayProject} />
            </div>
            <div className="px-8 py-6">
              <ProjectBasicInfo project={displayProject} setEditedProject={setEditedProject} />
            </div>
            <ProjectStatus projectSwr={projectSwr} project={displayProject} session={session} setEditedProject={setEditedProject} />
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
              {activeTab1 === 0 && <CustomerInfo projectSwr={projectSwr} session={session} />}
              {activeTab1 === 1 && <EnvironmentInfo projectSwr={projectSwr} />}
            </div>
          </div>
          <div className="w-full h-full hidden md:block overflow-hidden">
            {/* 일반 정보 탭 */}
            <Flattabs tabs={tabs2} activeTab={activeTab2} handleTabChange={handleDesktopTabChange} />
            {/* 탭 콘텐츠 */}
            <div className="w-full h-[calc(100%-41px)] overflow-y-auto">
              {activeTab2 === 0 && <FilesList projectSwr={projectSwr} session={session} />}
              {activeTab2 === 1 && (
                <ContractList
                  session={session}
                  contractsSwr={contractsSwr}
                  projectSwr={projectSwr}
                  selectedContract={selectedContract}
                  onContractSelect={handleContractSelect}
                  initialContractName={initialContractName}
                />
              )}
              {activeTab2 === 2 && <TeamsList projectSwr={projectSwr} session={session} />}
            </div>
          </div>
        </div>

        {/* 모바일 전체 화면 탭 인터페이스 */}
        <div className="md:hidden col-span-full h-full flex flex-col relative">
          {/* 상태 표시 탭 */}
          <Flattabs tabs={tabs1} activeTab={activeTab1} handleTabChange={setActiveTab1} />
          {/* 탭 콘텐츠 */}
          <div className="w-full bg-muted">
            {activeTab1 === 0 && <CustomerInfo projectSwr={projectSwr} session={session} />}
            {activeTab1 === 1 && <EnvironmentInfo projectSwr={projectSwr} />}
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
                  <ProjectBasicInfo project={displayProject} setEditedProject={setEditedProject} />
                </div>
                <ProjectStatus projectSwr={projectSwr} project={displayProject} session={session} setEditedProject={setEditedProject} />
                <div className="p-4">
                  <ProjectDetails project={displayProject} setEditedProject={setEditedProject} />
                </div>
                {level < 2 && <ProjectActions project={displayProject} />}
                <div className="px-4 pt-1 pb-5">
                  <ProjectNotices />
                </div>
              </>
            )}
            {activeMobileTab === 1 && <FilesList projectSwr={projectSwr} session={session} />}
            {activeMobileTab === 2 && (
              <ContractList
                session={session}
                contractsSwr={contractsSwr}
                projectSwr={projectSwr}
                selectedContract={selectedContract}
                onContractSelect={handleContractSelect}
                initialContractName={initialContractName}
              />
            )}
            {activeMobileTab === 3 && <TeamsList projectSwr={projectSwr} session={session} />}
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
            contractsSwr={contractsSwr}
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
