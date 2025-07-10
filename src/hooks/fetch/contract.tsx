// =================================================================
// Contract API (Sub-resource of Project)
// =================================================================

import { ERPNextContractPaginatedResponse, erpNextContractPaginatedResponseSchema, ERPNextContractRequest } from "@/@types/service/contract";
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteKeyLoader } from "swr/infinite";

const contractsGetKeyFactory = (params: ERPNextContractRequest): SWRInfiniteKeyLoader<ERPNextContractPaginatedResponse> => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;

    const searchParams = new URLSearchParams();

    // 페이지 번호 (Zod 기본값은 0인데 SWR Infinite는 pageIndex를 관리하므로 이걸 우선시함)
    searchParams.append("page", `${pageIndex}`);

    // 사이즈 (Zod 기본값은 10)
    searchParams.append("size", `${params.size ?? 10}`);

    // order_by: string | string[] | null
    if (params.order_by) {
      const orderByValues = Array.isArray(params.order_by) ? params.order_by : [params.order_by];
      orderByValues.forEach((value) => searchParams.append("order_by", value));
    }

    // status: string | string[] | null
    if (params.status) {
      const statusValues = Array.isArray(params.status) ? params.status : [params.status];
      statusValues.forEach((value) => searchParams.append("status", value));
    }

    // project_id: string | string[] | null
    if (params.project_id) {
      const projectIds = Array.isArray(params.project_id) ? params.project_id : [params.project_id];
      projectIds.forEach((id) => searchParams.append("project_id", id));
    }

    // keyword: string | null
    if (params.keyword) {
      searchParams.append("keyword", params.keyword);
    }

    // start, end: Date | null
    if (params.start) searchParams.append("start", params.start);
    if (params.end) searchParams.append("end", params.end);

    return `/api/service/project/contract?${searchParams.toString()}`;
  };
};

const contractsFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  const data = await res.json();
  return erpNextContractPaginatedResponseSchema.parse(data);
};

export const useContracts = (params: ERPNextContractRequest, options: SWRInfiniteConfiguration<ERPNextContractPaginatedResponse> = {}) => {
  const getKey = contractsGetKeyFactory(params);
  const swrOptions = {
    refreshInterval: 60000,
    focusThrottleInterval: 60000,
    ...options,
  };
  return useSWRInfinite(getKey, contractsFetcher, swrOptions);
};
