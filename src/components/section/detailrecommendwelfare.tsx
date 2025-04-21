"use client";

import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import WelfareCard from "@/components/card/welfarecard";
import DragScrollContainer from "./dragscrollcontainer";
import { useState } from "react";
import { WelfareResponseSchema } from "@/@types/openApi/welfare";
import { WelfareCardSkeleton } from "@/components/skeleton/welfarecardskeleton";
import { Button } from "@/components/ui/button";

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

    return `/api/welfare/recommend?${params.toString()}`;
  };
};
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return WelfareResponseSchema.parse(data);
};

export default function DetailRecommendWelfareSection() {
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
      <DragScrollContainer className="whitespace-nowrap flex space-x-3 w-full">
        {tags.map((value) => (
          <Button key={value.value} size="sm" variant={tag === value.value ? "default" : "outline"} onClick={() => onTagButtonClick(value.value)}>
            {value.name}
          </Button>
        ))}
      </DragScrollContainer>

      <div className="flex flex-col space-x-0.5 mt-4 space-y-4">
        {data?.map((pages) => {
          return pages.map((value) => <WelfareCard key={value.id} data={value} />);
        })}
      </div>

      {isLoading && (
        <div className="flex flex-col space-y-4">
          <WelfareCardSkeleton /> <WelfareCardSkeleton /> <WelfareCardSkeleton />
        </div>
      )}

      <div className="flex flex-col w-full items-center my-4">
        <Button variant="outline" onClick={() => setSize(size + 1)}>
          더보기
        </Button>
      </div>
    </div>
  );
}
