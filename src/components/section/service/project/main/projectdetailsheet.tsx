"use client";

import type { Session } from "next-auth";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, LinkIcon, Fullscreen } from "lucide-react";
import Flattabs from "@/components/ui/flattabs";
import { useProject, useTasks } from "@/hooks/fetch/project";
import { type ERPNextProject } from "@/@types/service/project";

// 분리된 컴포넌트들 import
import { CustomerInfo } from "../detail/customer-info";
import { TasksList } from "../detail/tasks-list";
import { FilesList } from "../detail/files-list";
import { ProjectHeader } from "../detail/project-header";
import { ProjectBasicInfo } from "../detail/project-basic-info";
import { ProjectStatus } from "../detail/project-status";
import { ProjectDetails } from "../detail/project-details";
import { ProjectActions } from "../detail/project-actions";
import { ProjectNotices } from "../detail/project-notices";

interface ProjectDetailSheetProps {
  project: ERPNextProject | null;
  onClose: () => void;
  session: Session;
}

export default function ProjectDetailSheet({ project, onClose, session }: ProjectDetailSheetProps) {
  if (!project) return null;

  return <ProjectDetailSheetInner project={project} onClose={onClose} session={session} />;
}

interface ProjectDetailSheetInnerProps {
  project: ERPNextProject;
  onClose: () => void;
  session: Session;
}

function ProjectDetailSheetInner({ project: initialProject, onClose, session }: ProjectDetailSheetInnerProps) {
  // State 관리
  const [project, setProject] = useState<ERPNextProject>(initialProject);
  const [activeMobileTab, setActiveMobileTab] = useState(0);
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);

  // 데이터 페칭
  const detailedProject = useProject(initialProject.project_name);
  const tasks = useTasks(project.project_name, { size: 20 });

  // 계산된 값들
  const tasksIsReachedEnd = useMemo(() => tasks.data && tasks.data.length > 0 && tasks.data[tasks.data.length - 1]?.items.length === 0, [tasks.data]);

  const tasksLoading = useMemo(
    () => !tasksIsReachedEnd && (tasks.isLoading || (tasks.size > 0 && tasks.data && typeof tasks.data[tasks.size - 1] === "undefined")),
    [tasksIsReachedEnd, tasks.isLoading, tasks.size, tasks.data]
  );

  const totalTasksCount = useMemo(() => tasks.data?.reduce((sum, page) => sum + (page.items?.length ?? 0), 0) ?? 0, [tasks.data]);

  // 탭 구성
  const mobileTabs = useMemo(
    () => [
      <div className="flex space-x-1 items-center" key="overview">
        <span>개요</span>
      </div>,
      <div className="flex space-x-1 items-center" key="task-status">
        <span>작업 현황</span>
        <span className="text-xs">{totalTasksCount}</span>
      </div>,
      <div className="flex space-x-1 items-center" key="overview">
        <span>파일</span>
      </div>,
    ],
    [totalTasksCount]
  );

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
    ],
    [session?.user, project]
  );

  const tabs2 = useMemo(
    () => [
      <div className="flex space-x-1 items-center" key="task-status">
        <span>작업 현황</span>
        <span className="text-xs">{totalTasksCount}</span>
      </div>,
      <div className="flex space-x-1 items-center" key="overview">
        <span>파일</span>
      </div>,
    ],
    [totalTasksCount]
  );

  // 이벤트 핸들러들
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("프로젝트 링크가 복사되었습니다.");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("프로젝트 링크 복사에 실패했습니다.");
    }
  }, []);

  const handleLoadMoreTasks = useCallback(() => {
    if (!tasksIsReachedEnd && !tasksLoading) {
      tasks.setSize((s) => s + 1);
    }
  }, [tasksIsReachedEnd, tasksLoading, tasks]);

  // Effects
  useEffect(() => {
    if (!initialProject || !session || !detailedProject.data) return;
    setProject(detailedProject.data);
  }, [initialProject, detailedProject.data, session]);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto md:overflow-hidden">
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
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
            이용 가이드
          </Button>
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none">
            <Download className="h-4 w-4" />
            내보내기
          </Button>
          <Button variant="outline" size="icon" className="size-8 font-semibold rounded-sm border-gray-200 shadow-none" asChild>
            <Link href={`./${project.project_name}/detail`}>
              <Fullscreen className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:overflow-hidden">
        {/* 데스크톱 왼쪽 패널 */}
        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto scrollbar-hide border-r-1 border-b-sidebar-border">
          <div className="flex flex-col h-full w-full">
            <div className="pt-12 pb-5 px-8">
              <ProjectHeader project={project} />
            </div>

            <div className="px-8 py-6">
              <ProjectBasicInfo project={project} />
            </div>

            <ProjectStatus project={project} session={session}/>

            <div className="p-8">
              <ProjectDetails project={project} />
            </div>

            <ProjectActions project={project} />

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
              {activeTab2 === 0 && (
                <TasksList tasks={tasks} totalTasksCount={totalTasksCount} tasksLoading={tasksLoading ?? false} onLoadMore={handleLoadMoreTasks} />
              )}
              {activeTab2 === 1 && project && <FilesList project={project} />}
            </div>
          </div>
        </div>

        {/* 모바일 전체 화면 탭 인터페이스 */}
        <div className="md:hidden col-span-full h-full flex flex-col">
          {/* 모바일 탭 */}
          <Flattabs tabs={mobileTabs} activeTab={activeMobileTab} handleTabChange={setActiveMobileTab} />

          {/* 모바일 탭 콘텐츠 */}
          <div className="w-full grow scrollbar-hide">
            {activeMobileTab === 0 && (
              <div className="flex flex-col h-full w-full">
                <div className="pt-12 pb-5 px-4">
                  <ProjectHeader project={project} />
                </div>

                <div className="px-4 py-6">
                  <ProjectBasicInfo project={project} />
                </div>

                <ProjectStatus project={project} session={session}/>

                <div className="p-4">
                  <ProjectDetails project={project} />
                </div>

                <ProjectActions project={project} />

                <div className="px-4 pt-1 pb-5">
                  <ProjectNotices />
                </div>
              </div>
            )}
            {activeMobileTab === 1 && (
              <TasksList tasks={tasks} totalTasksCount={totalTasksCount} tasksLoading={tasksLoading ?? false} onLoadMore={handleLoadMoreTasks} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
