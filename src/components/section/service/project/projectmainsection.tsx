"use client";

import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import ProjectContainer from "./projectcontainer";
import ProjectDetailSheet from "./projectdetailsheet";
import Link from "next/link";
import { SWRInfiniteResponse } from "swr/infinite";
import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Info, MessageCircleQuestion, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { ProjectsPaginatedResponse, UserERPNextProject } from "@/@types/service/project";
import { useProjects } from "@/hooks/fetch/project";
import { Button } from "@/components/ui/button";
import { ProjectAINewButton } from "./project-new-button2";

// --- 타입 및 상수 정의 ---

type Status = "draft" | "process" | "complete" | "maintenance";

const statuses: Status[] = ["draft", "process", "complete", "maintenance"];

interface ContainerProps {
  name: string;
  bg: string;
  text: string;
  border: string;
  className: string;
}

const containerProps: Record<Status, ContainerProps> = {
  draft: { name: "계획 중", bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-300", className: "col-span-1" },
  process: { name: "진행 중", bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-300", className: "col-span-1" },
  complete: { name: "완료", bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-300", className: "col-span-1" },
  maintenance: { name: "유지보수", bg: "bg-[#fff3ed]", text: "text-amber-500", border: "border-amber-300", className: "col-span-1" },
};

interface OrderOption {
  label: string;
  value: string;
}

const orders: OrderOption[] = [
  { label: "최신순", value: "modified.desc" },
  { label: "이름순", value: "custom_project_title" },
  { label: "생성일순", value: "creation.desc" },
];

export interface SWRMeta {
  swr: SWRInfiniteResponse<ProjectsPaginatedResponse>;
  data: ProjectsPaginatedResponse;
  isLoading?: boolean;
  isReachedEnd?: boolean;
}

interface ProjectStatusColumnProps {
  session: Session;
  status: Status;
  keyword: string;
  orderBy: string;
  setSelectedProject: (project: UserERPNextProject | null) => void;
  onProcessCountChange?: (count: number) => void;
}

interface ProjectMainSectionProps {
  session: Session;
  project_id?: string;
}

/**
 * 헬퍼 컴포넌트: 각 상태(status)별 컬럼을 담당합니다.
 */
const ProjectStatusColumn = ({ session, status, keyword, orderBy, setSelectedProject, onProcessCountChange }: ProjectStatusColumnProps) => {
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
  }, [inView, isLoading, isReachedEnd]);

  // 'process' 상태의 아이템 개수를 부모 컴포넌트로 전달하기 위한 useEffect
  useEffect(() => {
    if (status === "process" && onProcessCountChange) {
      onProcessCountChange(pages.filter((page) => (page.custom_team.find((member) => member.member == session.sub)?.level ?? 4) < 2).length);
    }
  }, [pages.length, status, onProcessCountChange]);

  return (
    <div className="flex flex-col">
      <ProjectContainer meta={meta} session={session} status={status} {...containerProps[status]} setSelectedProject={setSelectedProject} />
      <div className="w-full h-1" ref={ref} />
    </div>
  );
};

export default function ProjectMainSection({ session, project_id }: ProjectMainSectionProps) {
  const [orderBy, setOrderBy] = useState<string>(orders[0].value);
  const [inputText, setInputText] = useState<string>("");
  const [processCount, setProcessCount] = useState<number>(0);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const keyword = useThrottle(inputText, 1000);
  const router = useRouter();

  //  Optimized project selection handler
  const handleProjectSelect = useCallback(
    (project: UserERPNextProject | null) => {
      if (project) {
        router.push(`/service/project/${project.project_name}`, { scroll: false });
      }
    },
    [router]
  );

  //  Optimized sheet close handler
  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.push("/service/project", { scroll: false });
      }
    },
    [router]
  );

  //  Memoized process count change handler
  const handleProcessCountChange = useCallback((count: number) => {
    setProcessCount(count);
  }, []);

  //  Memoized order change handler
  const handleOrderChange = useCallback((newOrder: string) => {
    setOrderBy(newOrder);
  }, []);

  //  Memoized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }, []);

  //  Memoized tab change handler
  const handleTabChange = useCallback((index: number) => {
    setTabIndex(index);
  }, []);

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      {/* 상단 탭 */}
      <div className="sticky z-30 top-24 md:top-32 bg-background w-full flex flex-col">
        <div className="flex w-full justify-between h-12 items-center px-4 md:px-6 border-b-1 border-b-sidebar-border space-x-2">
          <div className="flex items-center grow md:max-w-1/2 space-x-2">
            <div className="hidden lg:block">
              <ComboBoxResponsive statuses={orders} initial={orderBy} callback={handleOrderChange} />
            </div>
            <div className="relative w-full max-w-96 h-fit rounded-full bg-muted">
              <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요"
                className="ml-4 h-8 px-4 border-0 shadow-none focus-visible:ring-0 font-medium"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="focus-visible:ring-0 text-blue-500 hover:text-blue-600" onClick={() => setIsDialogOpen(true)}>
              <MessageCircleQuestion />
              <p className="hidden md:inline-block">이용 가이드</p>
            </Button>
            <Button size="sm" className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-500 transition-colors duration-200 focus-visible:ring-0" asChild>
              <Link href="/service/project/new">
                <PlusIcon />
                <p className="hidden md:inline-block">새로 만들기</p>
              </Link>
            </Button>
            <ProjectAINewButton session={session} />
          </div>
        </div>
      </div>

      {/* 프로젝트 의뢰 수 프로그레스 바 */}
      <div className="w-full px-4 md:px-6">
        <div className="flex flex-col justify-center w-full h-20 rounded-lg space-y-1 bg-muted px-4 md:px-6">
          <div className="flex w-full items-center space-x-4">
            <div className="text-sm font-semibold">최대 프로젝트 의뢰 수</div>
            <div className="grow">
              <Progress value={(processCount / 10) * 100} />
            </div>
            <div className="text-sm font-semibold">{processCount}/10</div>
          </div>
          <div className="flex w-full items-center space-x-1.5 text-muted-foreground">
            <Info className="!size-3.5" />
            <div className="text-sm">최대 10개의 프로젝트를 의뢰할 수 있어요.</div>
          </div>
        </div>
      </div>

      {/* PC 프로젝트 컬럼 그리드 */}
      <div className="w-full hidden lg:grid lg:grid-cols-[repeat(auto-fit,minmax(16rem,16rem))] gap-4 px-4 md:px-6">
        {statuses.map((status) => (
          <div key={status} className="w-full space-y-1">
            <div className="w-full flex items-center space-x-2 text-sm font-light rounded-sm py-2 px-2">
              {containerProps[status].name === "계획 중" ? (
                <div className="size-3 rounded-full border-2 border-dashed border-gray-400" />
              ) : (
                <div className={containerProps[status].text}>●</div>
              )}
              <div className="grow">
                <h2 className="text-base font-bold text-muted-foreground">{containerProps[status].name}</h2>
              </div>
            </div>

            <ProjectStatusColumn
              session={session}
              status={status}
              keyword={keyword}
              orderBy={orderBy}
              setSelectedProject={handleProjectSelect}
              onProcessCountChange={status === "process" ? handleProcessCountChange : undefined}
            />
          </div>
        ))}
      </div>

      {/* 모바일 프로젝트 컬럼 그리드 */}
      <div className="flex flex-col w-full lg:hidden px-4 space-y-4">
        <div className="flex h-full space-x-1 overflow-x-auto scrollbar-hide">
          <ComboBoxResponsive statuses={orders} initial={orderBy} callback={handleOrderChange} />

          {statuses.map((status) => (
            <button
              key={status}
              className={cn(
                "shrink-0 flex items-center space-x-2 text-sm font-light rounded-sm py-1.5 px-3",
                status === statuses[tabIndex] ? `${containerProps[statuses[tabIndex]].text} ${containerProps[statuses[tabIndex]].bg}` : "hover:bg-muted/50"
              )}
              onClick={() => handleTabChange(statuses.indexOf(status))}
            >
              <div className="grow">
                <h2 className="text-base font-bold">{containerProps[status].name}</h2>
              </div>
            </button>
          ))}
        </div>

        <ProjectStatusColumn
          session={session}
          status={statuses[tabIndex]}
          keyword={keyword}
          orderBy={orderBy}
          setSelectedProject={handleProjectSelect}
          onProcessCountChange={statuses[tabIndex] === "process" ? handleProcessCountChange : undefined}
        />
      </div>

      {/*  Sheet opens immediately without waiting for data */}
      <Sheet open={!!project_id} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="overflow-hidden h-full w-full sm:max-w-full md:w-3/5 md:min-w-[728px] [&>button:first-of-type]:hidden gap-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus:outline-none focus:border-none">
          <SheetHeader className="sr-only">
            <SheetTitle>프로젝트 상세</SheetTitle>
          </SheetHeader>
          {project_id && <ProjectDetailSheet project_id={project_id} onClose={() => handleSheetOpenChange(false)} session={session} />}
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle className="text-xl font-bold">Fellows SaaS 프로젝트 만들기 가이드</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground" />
        </DialogHeader>
        <DialogContent
          data-lenis-prevent
          className="bg-white !w-full md:!w-[calc(100%-2rem)] !max-w-7xl !top-full !translate-y-[-100%] md:!top-1/2 md:!translate-y-[-50%] h-[calc(100%-2.5rem)] md:h-4/5 !rounded-b-none !rounded-t-2xl md:!rounded-2xl !overflow-y-auto !border-0 !shadow-3xl p-0"
          overlayClassName="backdrop-blur-sm"
          showCloseButton={false}
        >
          <div className="h-full w-full flex flex-col">
            <div className="sticky top-0 w-full px-5 py-5 font-bold grid grid-cols-2 items-center z-50 border-b">
              <div className="h-full flex items-center justify-start"></div>
              <div className="h-full flex items-center justify-end">
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="focus-visible:ring-0 rounded-full bg-zinc-800 hover:bg-zinc-700">
                    <XIcon className="size-5 text-zinc-50" strokeWidth={3} />
                  </Button>
                </DialogClose>
              </div>
            </div>

            <div className="grow">
              <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <iframe
                  src="http://localhost:3000/help/4810bda37814442fa70d214f0a5cdd45"
                  title="새 프로젝트 생성하기"
                  loading="lazy"
                  allowFullScreen
                  allow="clipboard-write"
                  style={{ width: "100%", height: "100%", colorScheme: "light" }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
