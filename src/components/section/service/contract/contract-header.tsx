"use client";

import { useState, useEffect } from "react";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import { SearchIcon } from "lucide-react";
import { ContractFilters } from "./contract-main";
import { Input } from "@/components/ui/input";
import useThrottle from "@/lib/useThrottle";

export default function ContractHeader({ filters, setFilters }: { filters: ContractFilters; setFilters: (filters: ContractFilters) => void }) {
  const [inputValue, setInputValue] = useState("");
  const keyword = useThrottle(inputValue, 1000);

  useEffect(() => {
    setFilters({ ...filters, keyword });
  }, [keyword]);

  return (
    <div className="sticky z-30 top-24 md:top-32 bg-background w-full flex flex-col">
      <div className="flex w-full justify-between h-12 items-center px-4 md:px-6 border-b-1 border-b-sidebar-border space-x-2">
        <div className="flex items-center grow md:max-w-1/2 space-x-2">
          <div className="hidden lg:block">
            <ComboBoxResponsive
              statuses={[
                { label: "전체", value: "0" },
                { label: "사인 전", value: "1" },
                { label: "결제 대기", value: "2" },
                { label: "진행중", value: "3" },
                { label: "취소됨", value: "4" },
              ]}
              initial={filters.type ?? "0"}
              callback={(value: string) => {
                setFilters({ ...filters, type: value });
              }}
            />
          </div>
          <div className="relative w-full max-w-96 h-fit rounded-full bg-muted">
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="검색어를 입력하세요"
              className="ml-4 h-8 px-4 border-0 shadow-none focus-visible:ring-0 font-medium"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
    </div>
  );
}
