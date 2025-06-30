import { type Issue, type CreateIssueData, type UpdateIssueData, IssueSchema, IssueListResponseSchema, IssueListResponse } from "@/@types/service/issue";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

const API_BASE_URL = "/api/service/project";

export interface IssueFilters {
  page?: number;
  size?: number;
  order_by?: string[];
  issue_type?: string[];
  project_id?: string[];
  status?: string[];
  start?: string;
  end?: string;
  keyword?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data = await response.json();
  IssueListResponseSchema.parse(data);
  return data;
};

const issuesGetKeyFactory = (params: IssueFilters): SWRInfiniteKeyLoader<IssueListResponse> => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null; // 마지막 페이지

    const searchParams = new URLSearchParams();
    searchParams.append("page", `${pageIndex}`);
    if (params.size !== undefined) searchParams.append("size", params.size.toString());
    if (params.order_by) params.order_by.forEach((order) => searchParams.append("order_by", order));
    if (params.issue_type) params.issue_type.forEach((type) => searchParams.append("issue_type", type));
    if (params.project_id) params.project_id.forEach((id) => searchParams.append("project_id", id));
    if (params.status) params.status.forEach((id) => searchParams.append("status", id));
    if (params.start) searchParams.append("start", params.start);
    if (params.end) searchParams.append("end", params.end);
    if (params.keyword) searchParams.append("keyword", params.keyword);

    return `${API_BASE_URL}/issue?${searchParams.toString()}`;
  };
};

export function useIssues(params: IssueFilters = {}) {
  const getKey = issuesGetKeyFactory(params);
  return useSWRInfinite(getKey, async (url: string) => IssueListResponseSchema.parse(await fetcher(url)), {
    refreshInterval: 60000,
    focusThrottleInterval: 60000,
  });
}

export async function createIssue(data: CreateIssueData): Promise<Issue> {
  const response = await fetch(`${API_BASE_URL}/issue`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create issue");
  }

  const result = await response.json();
  return IssueSchema.parse(result);
}

export async function updateIssue(name: string, data: UpdateIssueData): Promise<Issue> {
  const response = await fetch(`${API_BASE_URL}/issue/${name}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update issue");
  }

  const result = await response.json();
  return IssueSchema.parse(result);
}

export async function deleteIssue(name: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/issue/${name}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete issue");
  }
}
