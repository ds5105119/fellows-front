"use client";

import Link from "next/link";
import useThrottle from "@/lib/useThrottle";
import useIntersect from "@/lib/useIntersect";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import AnimatedGradientButton from "@/components/animation/animatedgradientbutton";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { useState, useMemo } from "react";
import { ProjectPageSchema, ProjectSchemaType } from "@/@types/service/project";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight, Plus, EllipsisVertical, Edit2, UserPlus, Trash2 } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
dayjs.extend(relativeTime);
dayjs.locale("ko");

interface getKeyFactoryProps {
  size?: number;
  keyword?: string;
  order_by?: string;
}

const getKeyFactory = ({ size, keyword, order_by }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.items.length === 0) return null;

    const params = new URLSearchParams();
    params.append("page", `${pageIndex}`);

    if (size) params.append("size", `${size}`);
    if (keyword) params.append("keyword", keyword);
    if (order_by) params.append("order_by", order_by);

    return `/api/service/project/?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return ProjectPageSchema.parse(data);
};

const ProjectDropdownMenu = ({
  openMenu,
  setOpenMenu,
  val,
}: {
  openMenu: string | null;
  setOpenMenu: (val: string | null) => void;
  val: ProjectSchemaType;
}) => (
  <DropdownMenu
    open={openMenu === val.project_id}
    onOpenChange={(isOpen) => {
      setOpenMenu(isOpen ? val.project_id : null);
    }}
  >
    <DropdownMenuTrigger asChild>
      <div
        className={cn(
          "rounded-sm z-20 h-6 w-6 flex items-center justify-center pointer-events-auto hover:bg-neutral-200",
          openMenu === val.project_id && "bg-neutral-100 hover:bg-neutral-200"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <EllipsisVertical className="!size-5" />
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="z-30">
      <DropdownMenuLabel className="font-semibold">{val.project_info.project_name}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="flex items-center space-x-2 font-medium" asChild>
        <Link href={`/service/project/${val.project_id}?p=edit`}>
          <Edit2 className="size-4" />
          <span>수정</span>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem className="flex items-center space-x-2 font-medium" asChild>
        <Link href={`/service/project/${val.project_id}?p=edit`}>
          <UserPlus className="size-4" />
          <span>수정</span>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem className="flex items-center space-x-2 font-medium" asChild>
        <Link href={`/service/project/${val.project_id}?p=edit`}>
          <Trash2 className="size-4 !text-red-600" />
          <span className="!text-red-600">삭제</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const orders = [
  { label: "최신순", value: "updated_at.desc" },
  { label: "이름순", value: "project_info.project_name" },
  { label: "생성일순", value: "created_at.desc" },
  { label: "상태순", value: "status" },
];

export default function ProjectMainSection() {
  const [pageSize, setPageSize] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<string>(orders[0].value);
  const [inputText, setInputText] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const keyword = useThrottle(inputText, 700);

  const getKey = getKeyFactory({ size: pageSize, keyword: keyword, order_by: orderBy });
  const { data, error, isLoading: _isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const changePage = () => {
    if (!isLoading && totalPages > 0 && size < totalPages) {
      setSize((prev) => {
        return prev + 1;
      });
    }
  };
  const bottomRef = useIntersect(changePage);

  const isLoading = _isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const projects = useMemo(() => data?.flatMap((page) => page.items || []) ?? [], [data]);
  const totalItems = useMemo(() => (data && data[0] ? data[0].total : 0), [data]);
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  if (error) return "error";

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 검색어 입력, 선택, 버튼 */}
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center justify-between">
          <div className="flex space-x-2">
            <Select defaultValue="created_at">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="created_at">10개씩</SelectItem>
                  <SelectItem value="project_name">20개씩</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input placeholder="검색어를 입력하세요" className="w-80" />
          </div>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href="/service/project/new">
                새로 만들기 <Plus />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex w-full justify-between mt-6">
          <ComboBoxResponsive statuses={orders} initial="updated_at.desc" callback={setOrderBy} />
        </div>
      </div>

      {/* 프로젝트 리스트 */}
      <div className="w-full flex flex-col space-y-2">
        <div className="w-full flex text-sm font-light text-muted-foreground px-2">
          <div className="w-24 truncate break-all text-center">상태</div>
          <div className="w-48 truncate break-all text-center">플랫폼</div>
          <div className="grow truncate break-all text-center">이름</div>
          <div className="w-24 truncate break-all text-center">업데이트</div>
          <div className="w-24 truncate break-all text-center">메뉴</div>
        </div>
        <div className="w-full flex flex-col space-y-2.5 rounded-sm bg-gray-50 p-2">
          {projects?.map((project, idx) => (
            <div key={idx} className="w-full pointer-events-none">
              <div className="relative not-visited:w-full flex rounded-xs text-sm font-semibold outline outline-neutral-200 bg-background hover:bg-muted py-2 items-center">
                <Link href={`/service/project/${project.project_id}`} className="absolute inset-0 z-10 pointer-events-auto" />
                <div className="w-24 truncate break-all text-center font-medium">
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <div className="w-48 truncate break-all text-center">{project.project_info.platforms}</div>
                <div className="grow truncate break-all text-left">{project.project_info.project_name}</div>
                <div className="w-24 truncate break-all text-center">{dayjs(project.updated_at).fromNow()}</div>
                <div className="w-24 text-center flex items-center justify-center">
                  <ProjectDropdownMenu openMenu={openMenu} setOpenMenu={setOpenMenu} val={project} />
                </div>
              </div>
            </div>
          ))}
          {(data?.length == 0 || (data?.length == 1 && data[0].total == 0)) && (
            <div className="w-full h-80 flex flex-col items-center justify-center space-y-2">
              <AnimatedGradientButton href="/service/project/new" text="프로젝트를 새로 만들어보세요!" />
              <div className="text-sm text-muted-foreground">처음이신가요?</div>
            </div>
          )}
        </div>
      </div>

      {/* 무한 로딩 컴포넌트 */}
      <div ref={bottomRef} className="w-full h-1" />
    </div>
  );
}
