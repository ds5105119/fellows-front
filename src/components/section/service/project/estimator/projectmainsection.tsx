"use client";

import Link from "next/link";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import useThrottle from "@/lib/useThrottle";
import { useState } from "react";
import { ProjectListSchema } from "@/@types/service/project";
import { formatSmartDate } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface getKeyFactoryProps {
  keyword?: string;
  order_by?: string;
}

const getKeyFactory = ({ keyword, order_by }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index}`);

    if (keyword) params.append("keyword", keyword);
    if (order_by) params.append("order_by", order_by);

    return `/api/service/project?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return ProjectListSchema.parse(data);
};

export default function ProjectMainSection() {
  const [inputText, setInputText] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");
  const keyword = useThrottle(inputText, 1000);
  const getKey = getKeyFactory({ keyword: keyword, order_by: orderBy });
  const { data, error, isLoading: _isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const isLoading = _isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  if (error) return "error";

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="w-full grid grid-cols-12 gap-2"></div>

      <Table className="w-full">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[6%] truncate break-all text-center">상태</TableHead>
            <TableHead className="w-[14%] truncate break-all text-center">플랫폼</TableHead>
            <TableHead className="w-[60%] truncate break-all text-center">이름</TableHead>
            <TableHead className="w-[20%] truncate break-all text-center">업데이트</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((pages) => {
            return pages.map((val, idx) => (
              <Link key={val.project_id} href={`/service/project/${val.project_id}`} className="w-full">
                <TableRow>
                  <TableCell className="truncate break-all text-center font-medium">{val.status}</TableCell>
                  <TableCell className="truncate break-all text-center">{val.project_info.platforms}</TableCell>
                  <TableCell className="truncate break-all text-left">{val.project_info.project_name}</TableCell>
                  <TableCell className="truncate break-all text-center">{formatSmartDate(val.updated_at)}</TableCell>
                </TableRow>
              </Link>
            ));
          })}
        </TableBody>
      </Table>
    </div>
  );
}
