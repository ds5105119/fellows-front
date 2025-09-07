// =================================================================
// Contract API (Sub-resource of Project)
// =================================================================

import {
  ERPNextContractPaginatedResponse,
  erpNextContractPaginatedResponseSchema,
  ERPNextContractRequest,
  UpdateERPNextContract,
  UserERPNextContract,
  userERPNextContractSchema,
} from "@/@types/service/contract";
import { SWRConfiguration, SWRResponse } from "swr";
import useSWRImmutable from "swr/immutable";
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteKeyLoader } from "swr/infinite";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `API 요청 오류: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();

  return responseData;
};

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

    // project_id: string | string[] | null
    if (params.project_id) {
      const projectIds = Array.isArray(params.project_id) ? params.project_id : [params.project_id];
      projectIds.forEach((id) => searchParams.append("project_id", id));
    }

    // keyword: string | null
    if (params.keyword) {
      searchParams.append("keyword", params.keyword);
    }

    if (typeof params.docstatus === "number") searchParams.append("docstatus", `${params.docstatus}`);
    if (typeof params.is_signed === "boolean") searchParams.append("is_signed", params.is_signed ? "True" : "False");

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
  try {
    erpNextContractPaginatedResponseSchema.parse(data);
  } catch (err) {
    console.log(err);
  }
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

export const useContract = (contract_id?: string, options: SWRConfiguration<UserERPNextContract> = {}): SWRResponse<UserERPNextContract> => {
  const url = `/api/service/project/contract/${contract_id}`;
  return useSWRImmutable(contract_id ? url : null, async (url: string) => userERPNextContractSchema.parse(await fetcher(url)), options);
};

export const updateContracts = async (name: string, data: UpdateERPNextContract) => {
  const response = await fetch(`/api/service/project/contract/${name}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update issue");
  }
};
