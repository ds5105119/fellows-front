"use client";

import Link from "next/link";
import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import ProjectContainer from "./projectcontainer";
import useSWRInfinite, { SWRInfiniteKeyLoader, SWRInfiniteResponse } from "swr/infinite";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { ProjectPageSchema, ProjectPageSchemaType } from "@/@types/service/project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Files, Users } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
dayjs.extend(relativeTime);
dayjs.locale("ko");

interface getKeyFactoryProps {
  size?: number;
  keyword?: string;
  order_by?: string;
  status?: string;
}

type Status = "draft" | "process" | "complete" | "maintenance";

const statuses: Status[] = ["draft", "process", "complete", "maintenance"];

const containerProps = {
  draft: { name: "계획 중", bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-300", className: "col-span-1" },
  process: { name: "진행 중", bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-300", className: "col-span-1" },
  complete: { name: "완료", bg: "bg-green-500/10", text: "text-green-500", border: "border-green-300", className: "col-span-1" },
  maintenance: { name: "유지보수", bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-300", className: "col-span-1" },
};

const orders = [
  { label: "최신순", value: "updated_at.desc" },
  { label: "이름순", value: "project_info.project_name" },
  { label: "생성일순", value: "created_at.desc" },
];

export type SWRMeta = {
  swr: SWRInfiniteResponse<ProjectPageSchemaType>;
  data: ProjectPageSchemaType;
  isLoading?: boolean;
  totalItems: number;
  totalPages: number;
};

const getKeyFactory = ({ size, keyword, order_by, status }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.items.length === 0) return null;

    const params = new URLSearchParams();
    params.append("page", `${pageIndex}`);

    if (size) params.append("size", `${size}`);
    if (keyword) params.append("keyword", keyword);
    if (order_by) params.append("order_by", order_by);
    if (status) params.append("status", status);

    return `/api/service/project/?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("Fetch failed") as any;
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return ProjectPageSchema.parse(data);
};

export function useInfiniteObserver({
  target,
  onIntersect,
  enabled = true,
  error = false,
  threshold = 1.0,
  rootMargin = "0px",
}: {
  target: React.RefObject<HTMLElement | undefined>;
  onIntersect: () => void;
  enabled?: boolean;
  error: boolean;
  threshold?: number;
  rootMargin?: string;
}) {
  useEffect(() => {
    if (!enabled || error || !target.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(target.current);

    return () => {
      if (target.current) observer.unobserve(target.current);
      observer.disconnect();
    };
  }, [enabled, error, target.current]);
}

export default function ProjectMainSection() {
  const pageSize = 20;
  const [activeRightTab, setActiveRightTab] = useState("대시보드");
  const [orderBy, setOrderBy] = useState<string>(orders[0].value);
  const [inputText, setInputText] = useState<string>("");
  const [statusError, setStatusError] = useState<Record<Status, boolean>>({ draft: false, process: false, complete: false, maintenance: false });
  const refs = useRef<Record<Status, HTMLDivElement | undefined>>({ draft: undefined, process: undefined, complete: undefined, maintenance: undefined });
  const keyword = useThrottle(inputText, 700);

  const getKeyByStatus = (status: string) => getKeyFactory({ size: pageSize, keyword, order_by: orderBy, status });
  const data: Record<Status, SWRInfiniteResponse<ProjectPageSchemaType>> = statuses.reduce((acc, status) => {
    acc[status] = useSWRInfinite<ProjectPageSchemaType>(getKeyByStatus(status), fetcher, {
      onError: () => {
        setStatusError((prev) => ({ ...prev, [status]: true }));
      },
      refreshInterval: 60000,
    });
    return acc;
  }, {} as Record<Status, SWRInfiniteResponse<ProjectPageSchemaType>>);

  const getMeta = (status: Status): SWRMeta => {
    const swr = data[status];
    const pages = swr.data?.flatMap((page) => page.items) || [];
    const totalItems = swr.data?.[0]?.total ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    const isLoading = swr.isLoading || (swr.size > 0 && swr.data && typeof swr.data[swr.size - 1] === "undefined");

    return {
      swr: swr,
      data: {
        total: totalItems,
        items: pages,
      },
      isLoading,
      totalItems,
      totalPages,
    };
  };

  statuses.forEach((status) => {
    const meta = getMeta(status);

    useInfiniteObserver({
      target: { current: refs.current[status] },
      enabled: !meta.isLoading && meta.swr.data && meta.swr.size < meta.totalPages,
      error: statusError[status],
      onIntersect: () => meta.swr.setSize((s) => s + 1),
    });
  });

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="w-full flex flex-col">
        {/* 선택 탭 */}
        <div className="flex w-full h-12 px-4 md:px-8 border-b-1 border-b-sidebar-border space-x-2">
          <button
            className={cn(
              "flex items-center space-x-2 px-4 h-12 text-base font-bold border-b-2 transition-colors",
              activeRightTab === "대시보드" ? "border-black" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveRightTab("대시보드")}
          >
            <LayoutDashboard />
            <span>대시보드</span>
          </button>
          <button
            className={cn(
              "flex items-center space-x-2 px-4 h-12 text-base font-bold border-b-2 transition-colors",
              activeRightTab === "문서" ? "border-black" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveRightTab("문서")}
          >
            <Files />
            <span>문서</span>
          </button>
          <button
            className={cn(
              "flex items-center space-x-2 px-4 h-12 text-base font-bold border-b-2 transition-colors",
              activeRightTab === "팀원" ? "border-black" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveRightTab("팀원")}
          >
            <Users />
            <span>팀원</span>
          </button>
        </div>

        {/* 정렬, 검색 및 새로 만들기 탭 */}
        <div className="flex w-full h-12 justify-between items-center px-4 md:px-8 border-b-1 border-b-sidebar-border space-x-2">
          <div className="flex grow md:max-w-1/2 space-x-2">
            <ComboBoxResponsive statuses={orders} initial="updated_at.desc" callback={setOrderBy} />
            <Input
              placeholder="검색어를 입력하세요"
              className="max-w-96 px-4 border-0 shadow-none rounded-full focus-visible:ring-0 bg-muted"
              onChange={(e) => setInputText(e.target.value)}
            />
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

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 px-4 md:px-8">
        {statuses.map((status, index) => (
          <div key={index} className="flex flex-col">
            <ProjectContainer
              meta={getMeta(status)}
              status={status}
              name={containerProps[status].name}
              bg={containerProps[status].bg}
              text={containerProps[status].text}
              border={containerProps[status].border}
              className={containerProps[status].className}
            />
            {/* 무한 로딩 컴포넌트 */}
            <div
              className="w-full h-1"
              ref={(el: HTMLDivElement | null) => {
                refs.current[status] = el ?? undefined;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
