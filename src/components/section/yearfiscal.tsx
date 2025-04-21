"use client";

import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import FiscalCard from "@/components/card/fiscalcard";
import { useState } from "react";
import { FiscalByYearOffcResponseSchema } from "@/@types/openApi/fiscal";
import { WelfareCardSkeleton } from "@/components/skeleton/welfarecardskeleton";
import { Button } from "@/components/ui/button";

interface getKeyFactoryProps {
  start_year: string;
  end_year: string;
  order_by: string;
}

interface YearFiscalSectionProps {
  year: string;
}

const getKeyFactory = ({ start_year, end_year, order_by }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index}`);

    if (start_year) params.append("start_year", start_year);
    if (end_year) params.append("end_year", end_year);
    if (order_by) params.append("order_by", order_by);

    return `/api/fiscal/by-year-offc?${params.toString()}`;
  };
};
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return FiscalByYearOffcResponseSchema.parse(data);
};

export default function YearFiscalSection({ year }: YearFiscalSectionProps) {
  const [orderBy, setOrderBy] = useState<string>("Y_YY_DFN_MEDI_KCUR_AMT");
  const getKey = getKeyFactory({ start_year: year, end_year: year, order_by: orderBy });
  const { data, error, isLoading: _isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const isLoading = _isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 20);

  if (error) return "error";

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col space-x-0.5 space-y-4">
        {data?.map((pages, count) => {
          return pages.map((value, index) => <FiscalCard key={value.id} index={20 * count + index + 1} data={value} />);
        })}
      </div>

      {isLoading && data && <div className="mt-4" />}

      {isLoading && (
        <div className="flex flex-col space-y-4">
          <WelfareCardSkeleton /> <WelfareCardSkeleton /> <WelfareCardSkeleton />
        </div>
      )}

      {isReachingEnd ? (
        <div className="my-4" />
      ) : (
        <div className="flex flex-col w-full items-center my-4">
          <Button variant="outline" onClick={() => setSize(size + 1)}>
            더보기
          </Button>
        </div>
      )}
    </div>
  );
}
