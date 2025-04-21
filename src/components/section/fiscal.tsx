"use client";

import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import FiscalDetailCard from "../card/fiscaldetailcard";
import DragScrollContainer from "./dragscrollcontainer";
import { useState } from "react";
import { FiscalResponseSchema } from "@/@types/openApi/fiscal";
import { WelfareCardSkeleton } from "@/components/skeleton/welfarecardskeleton";
import { Button } from "@/components/ui/button";
import { StringValidation } from "zod";

interface getKeyFactoryProps {
  start_year: string;
  end_year: string;
  order_by: string;
  dept_code: string;
}

interface FiscalSectionProps {
  year: string;
  code: string;
}

const getKeyFactory = ({ start_year, end_year, order_by, dept_code }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index}`);

    if (start_year) params.append("start_year", start_year);
    if (end_year) params.append("end_year", end_year);
    if (order_by) params.append("order_by", order_by);
    if (dept_code) params.append("dept_code", dept_code);

    return `/api/fiscal?${params.toString()}`;
  };
};
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return FiscalResponseSchema.parse(data);
};

export default function FiscalSection({ year, code }: FiscalSectionProps) {
  const [orderBy, setOrderBy] = useState<string>("Y_YY_DFN_MEDI_KCUR_AMT");
  const getKey = getKeyFactory({ start_year: year, end_year: year, order_by: orderBy, dept_code: code });
  const { data, error, isLoading: _isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const isLoading = _isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const offc = data?.[0]?.[0]?.OFFC_NM;

  if (error) return "error";

  return (
    <div className="flex flex-col w-full">
      <div className="mt-6">
        <span className="text-lg font-semibold">
          {offc}의 {year}년의 예산 정보에요
        </span>
      </div>

      <div className="flex flex-col space-x-0.5 mt-4 space-y-4">
        {data?.map((pages, count) => {
          return pages.map((value, index) => <FiscalDetailCard key={value.id} index={20 * count + index + 1} data={value} />);
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
