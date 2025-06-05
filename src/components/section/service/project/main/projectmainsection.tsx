"use client";

import Link from "next/link";
import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import ProjectContainer from "./projectcontainer";
import useSWRInfinite, { SWRInfiniteKeyLoader, SWRInfiniteResponse } from "swr/infinite";
import { useState, useEffect, useRef, RefObject } from "react";
import { Session } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Info } from "lucide-react";
import { ERPNextProjectPageSchema, ERPNextProjectPageType } from "@/@types/service/erpnext";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useInView } from "framer-motion";
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
  return ERPNextProjectPageSchema.parse(data);
};

export default function ProjectMainSection({ session }: { session: Session | null }) {
  const [orderBy, setOrderBy] = useState<string>(orders[0].value);
  const [inputText, setInputText] = useState<string>("");
  const [statusError, setStatusError] = useState<Record<Status, boolean>>({ draft: false, process: false, complete: false, maintenance: false });
  const refs = statuses.reduce((acc, status) => ({ ...acc, [status]: useRef<HTMLDivElement>(null) }), {} as Record<Status, RefObject<HTMLDivElement>>);
  const inViews = statuses.reduce((acc, status) => ({ ...acc, [status]: useInView(refs[status]) }), {} as Record<Status, boolean>);
  const keyword = useThrottle(inputText, 700);
  const pageSize = 20;

  const getKeyByStatus = (status: string) => getKeyFactory({ size: pageSize, keyword, order_by: orderBy, status });
  const data: Record<Status, SWRInfiniteResponse<ERPNextProjectPageType>> = statuses.reduce((acc, status) => {
    acc[status] = useSWRInfinite<ERPNextProjectPageType>(getKeyByStatus(status), fetcher, {
      onError: () => {
        setStatusError((prev) => ({ ...prev, [status]: true }));
      },
      refreshInterval: 60000,
    });
    return acc;
  }, {} as Record<Status, SWRInfiniteResponse<ERPNextProjectPageType>>);

  const getMeta = (status: Status): SWRMeta => {
    const swr = data[status];
    const pages = swr.data?.flatMap((page) => page.items) || [];
    const isReachedEnd = swr.data && swr.data.length > 0 && swr.data[swr.data.length - 1].items.length === 0;
    const isLoading = !isReachedEnd && swr.data && (swr.isLoading || (swr.size > 0 && data && typeof swr.data[swr.size - 1] === "undefined"));

    return {
      swr: swr,
      data: { items: pages },
      isLoading,
      isReachedEnd,
    };
  };

  statuses.forEach((status) => {
    const meta = getMeta(status);

    useEffect(() => {
      if (!!meta.isLoading || !meta.isReachedEnd || statusError[status]) return;

      if (inViews[status]) meta.swr.setSize((s) => s + 1);
    }, [meta.isLoading, meta.swr.data, meta.isReachedEnd, statusError[status], inViews[status]]);
  });

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* 상단 탭 */}
      <div className="sticky z-30 top-16 bg-background w-full flex flex-col">
        <div className="flex w-full h-12 justify-between items-center px-4 md:px-8 border-b-1 border-b-sidebar-border space-x-2">
          <div className="flex grow md:max-w-1/2 space-x-2">
            <ComboBoxResponsive statuses={orders} initial={orderBy} callback={setOrderBy} />
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

      <div className="w-full px-4 md:px-8">
        <div className="flex flex-col justify-center w-full h-20 rounded-lg space-y-1 bg-muted px-4 md:px-6">
          <div className="flex w-full items-center space-x-4">
            <div className="text-sm font-semibold">최대 프로젝트 의뢰 수</div>
            <div className="grow">
              <Progress value={(getMeta("process").data.items.length / 15) * 100} />
            </div>
            <div className="text-sm font-semibold">{getMeta("process").data.items.length}/15</div>
          </div>
          <div className="flex w-full items-center space-x-1.5 text-muted-foreground">
            <Info className="!size-3.5" />
            <div className="text-sm">최대 15개의 프로젝트를 의뢰할 수 있어요.</div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-4 px-4 md:px-8">
        {statuses.map((status, index) => (
          <div key={index} className="flex flex-col">
            <ProjectContainer meta={getMeta(status)} status={status} session={session} {...containerProps[status]} />
            {/* 무한 로딩 컴포넌트 */}
            <div className="w-full h-1" ref={refs[status]} />
          </div>
        ))}
      </div>
    </div>
  );
}
