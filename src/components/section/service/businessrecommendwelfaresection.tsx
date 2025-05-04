"use client";

import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import DragScrollContainer from "../../resource/dragscrollcontainer";
import Link from "next/link";
import { useState } from "react";
import { WelfareResponseSchema } from "@/@types/openApi/welfare";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface getKeyFactoryProps {
  tag?: string;
  order_by?: string;
}

const tags = [
  { name: "전체", value: "" },
  { name: "현금", value: "현금" },
  { name: "현물", value: "현물" },
  { name: "이용권", value: "이용권" },
  { name: "시설이용", value: "시설이용" },
  { name: "문화·여가", value: "문화" },
  { name: "서비스", value: "서비스" },
  { name: "의료지원", value: "의료지원" },
  { name: "기술지원", value: "기술지원" },
  { name: "기타", value: "기타" },
] as const;

const getKeyFactory = ({ tag, order_by }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index}`);

    if (tag) params.append("tag", tag);
    if (order_by) params.append("order_by", order_by);

    return `/api/welfare/business?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return WelfareResponseSchema.parse(data);
};

export default function BusinessRecommendWelfareSection() {
  const [tag, setTag] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");
  const getKey = getKeyFactory({ tag, order_by: orderBy });
  const { data, error, isLoading: _isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const isLoading = _isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  if (error) return "error";

  const onTagButtonClick = (tag: string) => {
    setTag(tag);
  };

  return (
    <div className="flex flex-col w-full">
      <DragScrollContainer className="whitespace-nowrap flex space-x-2 w-full">
        {tags.map((value) => (
          <Button
            key={value.value}
            size="sm"
            variant={tag === value.value ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onTagButtonClick(value.value)}
          >
            {value.name}
          </Button>
        ))}
      </DragScrollContainer>

      <div className="flex flex-col w-full space-x-0.5 mt-4 space-y-4">
        <Table className="table-fixed w-full">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="w-[10%] text-center">분류</TableHead>
              <TableHead className="w-[25%] truncate text-center">사업명</TableHead>
              <TableHead className="w-[35%] truncate text-center">지원 위치</TableHead>
              <TableHead className="w-[20%] truncate text-center">지원 시기</TableHead>
              <TableHead className="w-[5%] text-center">조회수</TableHead>
              <TableHead className="w-[5%] text-center">링크</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((pages) => {
              return pages.map((val, idx) => (
                <TableRow key={idx}>
                  <TableCell className="truncate text-center">{val.service_category}</TableCell>
                  <TableCell className="truncate">{val.service_name}</TableCell>
                  <TableCell className="truncate">{val.service_summary}</TableCell>
                  <TableCell className="truncate">{val.apply_period}</TableCell>
                  <TableCell className="text-center">{val.views}</TableCell>
                  <TableCell className="text-center">
                    {val.apply_url ?? val.detail_url ? (
                      <Link href={val.apply_url ?? val.detail_url ?? ""} className="">
                        🔗
                      </Link>
                    ) : (
                      <>없어요</>
                    )}
                  </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex flex-col w-full items-center my-4">
        <Button variant="outline" onClick={() => setSize(size + 1)}>
          더보기
        </Button>
      </div>
    </div>
  );
}
