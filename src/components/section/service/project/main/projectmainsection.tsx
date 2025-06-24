"use client";

import Link from "next/link";
import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import ProjectContainer from "./projectcontainer";
import ProjectDetailSheet from "./projectdetailsheet";
import { SWRInfiniteResponse } from "swr/infinite";
import { useCallback, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Info } from "lucide-react";
import { ProjectsPaginatedResponse, ERPNextProject, erpNextProjectSchema } from "@/@types/service/project";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useProjects } from "@/hooks/fetch/project";
dayjs.extend(relativeTime);
dayjs.locale("ko");

// --- 타입 및 상수 정의 ---

type Status = "draft" | "process" | "complete" | "maintenance";

const statuses: Status[] = ["draft", "process", "complete", "maintenance"];

const containerProps = {
  draft: { name: "계획 중", bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-300", className: "col-span-1" },
  process: { name: "진행 중", bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-300", className: "col-span-1" },
  complete: { name: "완료", bg: "bg-green-500/10", text: "text-green-500", border: "border-green-300", className: "col-span-1" },
  maintenance: { name: "유지보수", bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-300", className: "col-span-1" },
};

const orders = [
  { label: "최신순", value: "modified.desc" },
  { label: "이름순", value: "custom_project_title" },
  { label: "생성일순", value: "creation.desc" },
];

export type SWRMeta = {
  swr: SWRInfiniteResponse<ProjectsPaginatedResponse>;
  data: ProjectsPaginatedResponse;
  isLoading?: boolean;
  isReachedEnd?: boolean;
};

/**
 * 헬퍼 컴포넌트: 각 상태(status)별 컬럼을 담당합니다.
 */
const ProjectStatusColumn = ({
  status,
  keyword,
  orderBy,
  setSelectedProject,
  onProcessCountChange,
}: {
  status: Status;
  keyword: string;
  orderBy: string;
  setSelectedProject: (project: ERPNextProject | null) => void;
  onProcessCountChange?: (count: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageSize = 20;

  const swr = useProjects({ size: pageSize, keyword, order_by: orderBy, status });
  const pages = swr.data?.flatMap((page) => page.items) || [];
  const isReachedEnd = swr.data && swr.data.length > 0 && swr.data[swr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && swr.data && (swr.isLoading || (swr.size > 0 && typeof swr.data[swr.size - 1] === "undefined"));

  const meta: SWRMeta = {
    swr,
    data: { items: pages },
    isLoading,
    isReachedEnd,
  };

  // 무한 스크롤을 위한 useEffect
  useEffect(() => {
    if (inView && !isLoading && !isReachedEnd) {
      swr.setSize((s) => s + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isLoading, isReachedEnd]); // FIX: 의존성 배열에서 swr 객체를 제거하여 무한 루프를 방지합니다.

  // 'process' 상태의 아이템 개수를 부모 컴포넌트로 전달하기 위한 useEffect
  useEffect(() => {
    if (status === "process" && onProcessCountChange) {
      onProcessCountChange(pages.length);
    }
  }, [pages.length, status, onProcessCountChange]);

  return (
    <div className="flex flex-col">
      <ProjectContainer meta={meta} status={status} {...containerProps[status]} setSelectedProject={setSelectedProject} />
      <div className="w-full h-1" ref={ref} />
    </div>
  );
};

export default function ProjectMainSection({ session, project_id }: { session: Session; project_id?: string }) {
  const [orderBy, setOrderBy] = useState<string>(orders[0].value);
  const [inputText, setInputText] = useState<string>("");
  const [processCount, setProcessCount] = useState(0);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<ERPNextProject | null>(null);
  const [openSheet, setOpenSheet] = useState(project_id ? true : false);
  const keyword = useThrottle(inputText, 700);
  const pathname = usePathname();
  const router = useRouter();
  const project = useProjects({ size: 1 });

  // URL에서 project_id를 추출하는 헬퍼 함수
  const getProjectIdFromUrl = useCallback((pathname: string): string | null => {
    const segments = pathname.split("/");
    if (segments.length > 3 && segments[segments.length - 2] === "project") {
      return segments[segments.length - 1];
    }
    return null;
  }, []);

  // 프로젝트 데이터를 찾는 함수 (실제 구현 필요)
  const findProjectById = useCallback((projectId: string): ERPNextProject | null => {
    try {
      return erpNextProjectSchema.parse({
        project_name: projectId,
      });
    } catch {
      return null;
    }
  }, []);

  // 프로젝트 선택 핸들러
  const handleProjectSelect = useCallback(
    (project: ERPNextProject | null) => {
      if (!project) {
        console.log("Project deselected");
        setSelectedProject(null);
        setOpenSheet(false);
        return;
      }

      console.log("Project selected:", project.project_name);

      setSelectedProject(project);
      setOpenSheet(true);

      // URL 업데이트
      const currentProjectId = getProjectIdFromUrl(pathname);
      if (currentProjectId !== project.project_name) {
        const segments = pathname.split("/");
        let newPath;

        if (segments[segments.length - 1] === "project") {
          newPath = `${pathname}/${project.project_name}`;
        } else if (segments[segments.length - 2] === "project") {
          segments[segments.length - 1] = project.project_name;
          newPath = segments.join("/");
        } else {
          newPath = `/service/project/${project.project_name}`;
        }

        router.replace(newPath);
      }
    },
    [pathname, router, getProjectIdFromUrl]
  );

  // 시트 닫기 핸들러
  const handleSheetClose = useCallback(() => {
    console.log("Sheet closing");

    setOpenSheet(false);
    setSelectedProject(null);

    // URL에서 프로젝트 ID 제거
    const projectIdFromUrl = getProjectIdFromUrl(pathname);
    if (projectIdFromUrl) {
      const segments = pathname.split("/");
      const newPath = segments.slice(0, -1).join("/");
      router.replace(newPath);
    }
  }, [pathname, router, getProjectIdFromUrl]);

  // 초기 로드 시 URL에서 프로젝트 복원
  useEffect(() => {
    const projectIdFromUrl = getProjectIdFromUrl(pathname);

    if (projectIdFromUrl && !selectedProject) {
      console.log("Restoring project from URL:", projectIdFromUrl);

      const foundProject = findProjectById(projectIdFromUrl);
      if (foundProject) {
        setSelectedProject(foundProject);
        setOpenSheet(true);
      } else {
        // 프로젝트를 찾을 수 없으면 목록 페이지로 리다이렉트
        router.replace("/service/project");
      }
    }
  }, [pathname, selectedProject, findProjectById, getProjectIdFromUrl, router]);

  useEffect(() => {
    if (
      !project.isLoading &&
      !project.error &&
      !project.isValidating &&
      project.data &&
      project.data.length > 0 &&
      project.data[0].items.length == 0 &&
      !project_id
    ) {
      router.push("/service/project/new");
    }
  }, [project]);

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      {/* 상단 탭 */}
      <div className="sticky z-30 top-24 md:top-32 bg-background w-full flex flex-col">
        <div className="flex w-full justify-between h-12 items-center px-6 border-b-1 border-b-sidebar-border space-x-2">
          <div className="flex items-center grow md:max-w-1/2 space-x-2">
            <Input
              placeholder="검색어를 입력하세요"
              className="w-full max-w-96 h-8 px-4 border-0 shadow-none rounded-md focus-visible:ring-0 bg-muted font-medium"
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="hidden lg:block">
              <ComboBoxResponsive statuses={orders} initial={orderBy} callback={setOrderBy} />
            </div>
          </div>
          <div className="flex">
            <Button size="sm" className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-500 transition-colors duration-200 focus-visible:ring-0" asChild>
              <Link href="./project/new">
                새로 만들기 <Plus />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 프로젝트 의뢰 수 프로그레스 바 */}
      <div className="w-full px-6">
        <div className="flex flex-col justify-center w-full h-20 rounded-lg space-y-1 bg-muted px-4 md:px-6">
          <div className="flex w-full items-center space-x-4">
            <div className="text-sm font-semibold">최대 프로젝트 의뢰 수</div>
            <div className="grow">
              <Progress value={(processCount / 15) * 100} />
            </div>
            <div className="text-sm font-semibold">{processCount}/15</div>
          </div>
          <div className="flex w-full items-center space-x-1.5 text-muted-foreground">
            <Info className="!size-3.5" />
            <div className="text-sm">최대 15개의 프로젝트를 의뢰할 수 있어요.</div>
          </div>
        </div>
      </div>

      {/* PC 프로젝트 컬럼 그리드 */}
      <div className="w-full hidden lg:grid lg:grid-cols-[repeat(auto-fit,minmax(16rem,16rem))] gap-4 px-6">
        {statuses.map((status) => (
          <div key={status} className="w-full space-y-1">
            <div className="w-full flex items-center space-x-2 text-sm font-light rounded-sm py-2 px-2">
              {containerProps[status].name == "계획 중" ? (
                <div className="size-3 rounded-full border-2 border-dashed border-gray-400" />
              ) : (
                <div className={containerProps[status].text}>●</div>
              )}
              <div className="grow">
                <h2 className="text-base font-bold text-muted-foreground">{containerProps[status].name}</h2>
              </div>
            </div>

            <ProjectStatusColumn
              status={status}
              keyword={keyword}
              orderBy={orderBy}
              setSelectedProject={handleProjectSelect}
              onProcessCountChange={status === "process" ? setProcessCount : undefined}
            />
          </div>
        ))}
      </div>

      {/* 모바일 프로젝트 컬럼 그리드 */}
      <div className="flex flex-col w-full lg:hidden px-6 space-y-4">
        <div className="flex h-full space-x-1 overflow-x-auto scrollbar-hide">
          <ComboBoxResponsive statuses={orders} initial={orderBy} callback={setOrderBy} />

          {statuses.map((status) => (
            <button
              key={status}
              className={cn(
                "shrink-0 flex items-center space-x-2 text-sm font-light rounded-sm py-1.5 px-3",
                status === statuses[tabIndex] ? `${containerProps[statuses[tabIndex]].text} ${containerProps[statuses[tabIndex]].bg}` : "hover:bg-muted/50"
              )}
              onClick={() => setTabIndex(statuses.indexOf(status))}
            >
              <div className="grow">
                <h2 className="text-base font-bold">{containerProps[status].name}</h2>
              </div>
            </button>
          ))}
        </div>

        <ProjectStatusColumn
          status={statuses[tabIndex]}
          keyword={keyword}
          orderBy={orderBy}
          setSelectedProject={handleProjectSelect}
          onProcessCountChange={statuses[tabIndex] === "process" ? setProcessCount : undefined}
        />
      </div>

      {/* 프로젝트 선택 시 팝업 */}
      <Sheet open={openSheet} onOpenChange={handleSheetClose}>
        <SheetContent className="w-full sm:max-w-full md:w-3/5 md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{selectedProject?.custom_project_title ?? "프로젝트가 선택되지 않았습니다."}</SheetTitle>
          </SheetHeader>
          <ProjectDetailSheet project={selectedProject} onClose={handleSheetClose} session={session} />
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
