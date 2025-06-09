"use client";

import Link from "next/link";
import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import ProjectContainer from "./projectcontainer";
import useSWRInfinite, { SWRInfiniteKeyLoader, SWRInfiniteResponse } from "swr/infinite";
import { useState, useEffect, useRef } from "react";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Info } from "lucide-react";
import { ERPNextProjectPageSchema, ERPNextProjectPageType } from "@/@types/service/erpnext";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
dayjs.extend(relativeTime);
dayjs.locale("ko");

// --- 타입 및 상수 정의 (기존과 동일) ---
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
  { label: "최신순", value: "modified.desc" },
  { label: "이름순", value: "custom_project_title" },
  { label: "생성일순", value: "creation.desc" },
];

export type SWRMeta = {
  swr: SWRInfiniteResponse<ERPNextProjectPageType>;
  data: ERPNextProjectPageType;
  isLoading?: boolean;
  isReachedEnd?: boolean;
};

const getKeyFactory = ({ size, keyword, order_by, status }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;
    const params = new URLSearchParams();
    params.append("page", `${pageIndex}`);
    if (size) params.append("size", `${size}`);
    if (keyword) params.append("keyword", keyword);
    if (order_by) params.append("order_by", order_by);
    if (status) params.append("status", status);
    return `/api/service/project?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  const data = await res.json();
  return ERPNextProjectPageSchema.parse(data);
};

/**
 * 헬퍼 컴포넌트: 각 상태(status)별 컬럼을 담당합니다.
 */
const ProjectStatusColumn = ({
  status,
  keyword,
  orderBy,
  session,
  onProcessCountChange,
}: {
  status: Status;
  keyword: string;
  orderBy: string;
  session: Session | null;
  onProcessCountChange?: (count: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageSize = 20;
  const [hasError, setHasError] = useState(false);

  const swr = useSWRInfinite<ERPNextProjectPageType>(getKeyFactory({ size: pageSize, keyword, order_by: orderBy, status }), fetcher, {
    onError: () => setHasError(true),
    refreshInterval: 60000,
  });

  const pages = swr.data?.flatMap((page) => page.items) || [];
  const isReachedEnd = hasError || (swr.data && swr.data.length > 0 && swr.data[swr.data.length - 1].items.length === 0);
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
      <ProjectContainer meta={meta} status={status} session={session} {...containerProps[status]} />
      <div className="w-full h-1" ref={ref} />
    </div>
  );
};

export default function ProjectMainSection({ session }: { session: Session | null }) {
  const [orderBy, setOrderBy] = useState<string>(orders[0].value);
  const [inputText, setInputText] = useState<string>("");
  const [processCount, setProcessCount] = useState(0);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const keyword = useThrottle(inputText, 700);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* 상단 탭 */}
      <div className="sticky z-30 top-16 bg-background w-full flex flex-col">
        <div className="flex w-full h-12 justify-between items-center px-4 md:px-8 border-b-1 border-b-sidebar-border space-x-2">
          <div className="flex grow md:max-w-1/2 space-x-2">
            <div className="hidden lg:block">
              <ComboBoxResponsive statuses={orders} initial={orderBy} callback={setOrderBy} />
            </div>
            <Input
              placeholder="검색어를 입력하세요"
              className="w-full max-w-96 h-9 px-4 border-0 shadow-none rounded-full focus-visible:ring-0 bg-muted text-sm font-medium"
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

      {/* 프로젝트 의뢰 수 프로그레스 바 */}
      <div className="w-full px-4 md:px-8">
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
      <div className="w-full hidden lg:grid lg:grid-cols-[repeat(auto-fit,minmax(16rem,16rem))] gap-4 px-4 md:px-8">
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
              session={session}
              onProcessCountChange={status === "process" ? setProcessCount : undefined}
            />
          </div>
        ))}
      </div>

      {/* 모바일 프로젝트 컬럼 그리드 */}
      <div className="flex flex-col w-full lg:hidden px-4 md:px-8 space-y-4">
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
          session={session}
          onProcessCountChange={statuses[tabIndex] === "process" ? setProcessCount : undefined}
        />
      </div>
    </div>
  );
}
