"use client";

import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { WelfareResponseSchema } from "@/@types/openApi/welfare";

const getKey: SWRInfiniteKeyLoader = (index, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null;
  return `/api/welfare/recommend?page=${index}&size=3`;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return WelfareResponseSchema.parse(data);
};

export default function RecommendWelfareSection() {
  const { data, error, isLoading: _isLoading, size } = useSWRInfinite(getKey, fetcher);
  const isLoading = _isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  if (error) return "error";

  return (
    <div className="space-x-0.5 w-full">
      {data?.map((pages) => {
        return pages.map((value) => JSON.stringify(value));
      })}
      {isLoading && <div className="flex flex-col space-x-0.5 mt-4 space-y-3 w-full">로딩중이랑께</div>}
    </div>
  );
}
