"use client";

import useSWR, { SWRResponse } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteKeyLoader } from "swr/infinite";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ERPNextFile,
  ERPNextFileRequest,
  erpNextFileSchema,
  ERPNextFilesResponse,
  erpNextFilesResponseSchema,
  userERPNextProjectSchema,
  CreateERPNextProject,
  UserERPNextProject,
  erpNextTaskPaginatedResponseSchema,
  ProjectFeatureEstimateResponse,
  projectFeatureEstimateResponseSchema,
  ProjectsPaginatedResponse,
  projectsPaginatedResponseSchema,
  UpdateERPNextProject,
  ERPNextTasksRequest,
  overviewProjectsPaginatedResponseSchema,
  OverviewProjectsPaginatedResponse,
  ERPNextTaskPaginatedResponse,
  QuoteSlots,
  quoteSlotsSchema,
  ERPNextProjectTeam,
} from "@/@types/service/project";
import dayjs from "@/lib/dayjs";

const API_BASE_URL = "/api/service/project";

// --- Generic Fetcher ---
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `API 요청 오류: ${response.statusText}`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  const responseData = await response.json();

  return responseData;
};

// =================================================================
// PROJECT API
// =================================================================

// --- CREATE ---
export const createProject = async (payload: CreateERPNextProject): Promise<UserERPNextProject> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error("프로젝트 생성 중 오류가 발생했습니다.");
    throw new Error("Failed to create project");
  }

  const responseData = await response.json();
  return userERPNextProjectSchema.parse(responseData);
};

// --- READ (Single) ---
export const useProject = (projectId: string | null): SWRResponse<UserERPNextProject> => {
  const url = projectId ? `${API_BASE_URL}/${projectId}` : null;
  return useSWR(
    url,
    async (url: string) => {
      try {
        return userERPNextProjectSchema.parse(await fetcher(url));
      } catch (error) {
        throw error;
      }
    },
    { shouldRetryOnError: false }
  );
};

// --- READ (List) ---

export const useProjectOverView = (): SWRResponse<OverviewProjectsPaginatedResponse> => {
  const url = `${API_BASE_URL}/overview`;
  return useSWR(url, async (url: string) => overviewProjectsPaginatedResponseSchema.parse(await fetcher(url)));
};

export const projectsGetKeyFactory = (params: {
  size?: number;
  keyword?: string;
  order_by?: string;
  status?: string;
}): SWRInfiniteKeyLoader<ProjectsPaginatedResponse> => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null; // 마지막 페이지

    const searchParams = new URLSearchParams();
    searchParams.append("page", `${pageIndex}`);
    if (params.size) searchParams.append("size", `${params.size}`);
    if (params.keyword) searchParams.append("keyword", params.keyword);
    if (params.order_by) searchParams.append("order_by", params.order_by);
    if (params.status) searchParams.append("status", params.status);

    return `${API_BASE_URL}?${searchParams.toString()}`;
  };
};

export const useProjects = (params: { size?: number; keyword?: string; order_by?: string; status?: string }) => {
  const getKey = projectsGetKeyFactory(params);
  return useSWRInfinite(getKey, async (url: string) => projectsPaginatedResponseSchema.parse(await fetcher(url)), {
    refreshInterval: 60000,
    focusThrottleInterval: 60000,
  });
};

// --- UPDATE ---
export const updateProject = async (projectId: string, payload: UpdateERPNextProject): Promise<UserERPNextProject> => {
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error("프로젝트 업데이트 중 오류가 발생했습니다.");
    throw new Error("Failed to update project");
  }
  const responseData = await response.json();
  return userERPNextProjectSchema.parse(responseData);
};

export const inviteProjectGroup = async (projectId: string, email: string) => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/group/invite?email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    toast.error("초대에 실패했어요.");
  }
};

export const acceptInviteProjectGroup = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/group/invite/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    toast.error("초대를 수락할 수 없어요.");
  }
};
export const updateProjectGroup = async (projectId: string, payload: ERPNextProjectTeam) => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/group`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error("팀원을 업데이트 할 수 없어요.");
  }
};

// --- DELETE ---
export const deleteProject = async (projectId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    toast.error("프로젝트 삭제 중 오류가 발생했습니다.");
    throw new Error("Failed to delete project");
  }
  toast.success("프로젝트가 삭제되었습니다.");
};

// --- SUBMIT ---
export const submitProject = async (projectId: string, params?: { date?: Date; inbound?: boolean }): Promise<void> => {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.append("date", `${dayjs(params.date).format("YYYY-MM-DD")}`);
  if (params?.inbound) searchParams.append("inbound", `${params.inbound}`);

  const response = await fetch(`${API_BASE_URL}/${projectId}/submit?${searchParams.toString()}`, { method: "POST" });
  if (!response.ok) {
    toast.error("프로젝트 제출 중 오류가 발생했습니다.");
    throw new Error("Failed to submit project");
  }
  toast.success("프로젝트가 제출되었습니다.");
};

export const cancelSubmitProject = async (projectId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/submit/cancel`, { method: "POST" });
  if (!response.ok) {
    toast.error("제출 취소 중 오류가 발생했습니다.");
    throw new Error("Failed to cancel project submission");
  }
  toast.success("프로젝트 제출이 취소되었습니다.");
};

// =================================================================
// FILE API (Sub-resource of Project)
// =================================================================

// --- CREATE ---
export const createFile = async ({ projectId, filePayload }: { projectId: string; filePayload: Omit<ERPNextFile, "creation" | "modified"> }) => {
  await fetch(`${API_BASE_URL}/${projectId}/files`, {
    method: "POST", // API 라우터에 따라 PUT 사용
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filePayload),
  });
};

// --- READ (Single) ---
export const useFile = ({ projectId, key }: { projectId: string; key: string }): SWRResponse<ERPNextFile> => {
  const url = projectId && key ? `${API_BASE_URL}/${projectId}/files/${key}` : null;
  return useSWR(url, async (url: string) => erpNextFileSchema.parse(await fetcher(url)));
};

// --- READ (List) ---
const filesGetKeyFactory = ({ projectId, params }: { projectId: string; params: ERPNextFileRequest }): SWRInfiniteKeyLoader<ERPNextFilesResponse> => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;

    const searchParams = new URLSearchParams([
      ["page", `${pageIndex}`],
      ["size", `${params.size}`],
    ]);
    if (params.order_by) searchParams.append("order_by", params.order_by);
    if (params.task) searchParams.append("task", params.task);
    if (params.issue) searchParams.append("issue", params.issue);

    return `${API_BASE_URL}/${projectId}/files?${searchParams.toString()}`;
  };
};

export const useFiles = ({ projectId, params }: { projectId: string; params: ERPNextFileRequest }) => {
  const getKey = filesGetKeyFactory({ projectId, params });
  return useSWRInfinite(getKey, async (url: string) => erpNextFilesResponseSchema.parse(await fetcher(url)));
};

// --- DELETE ---
export const deleteFile = async ({ projectId, key }: { projectId: string; key: string }): Promise<void> => {
  await fetch(`${API_BASE_URL}/${projectId}/files/${key}`, {
    method: "DELETE",
  });
};

// =================================================================
// TASK API (Sub-resource of Project)
// =================================================================

const tasksGetKeyFactory = (params: ERPNextTasksRequest): SWRInfiniteKeyLoader<ERPNextTaskPaginatedResponse> => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;

    const searchParams = new URLSearchParams();
    searchParams.append("page", `${pageIndex}`);
    searchParams.append("size", `${params.size ?? 20}`);

    // Handle order_by: string | string[]
    if (params.order_by) {
      const orderByValues = Array.isArray(params.order_by) ? params.order_by : [params.order_by];
      orderByValues.forEach((value) => searchParams.append("order_by", value));
    }

    // Handle status: enum | enum[]
    if (params.status) {
      const statusValues = Array.isArray(params.status) ? params.status : [params.status];
      statusValues.forEach((value) => searchParams.append("status", value));
    }

    if (params.project_id) {
      const projectIdValues = Array.isArray(params.project_id) ? params.project_id : [params.project_id];
      projectIdValues.forEach((value) => searchParams.append("project_id", value));
    }

    if (params.keyword) {
      searchParams.append("keyword", params.keyword);
    }

    if (params.start) {
      searchParams.append("start", params.start.toISOString().split("T")[0]);
    }

    if (params.end) {
      searchParams.append("end", params.end.toISOString().split("T")[0]);
    }

    return `${API_BASE_URL}/task?${searchParams.toString()}`;
  };
};

export const useTasks = (params: ERPNextTasksRequest, options: SWRInfiniteConfiguration | undefined = {}) => {
  const getKey = tasksGetKeyFactory(params);
  return useSWRInfinite(getKey, async (url: string) => erpNextTaskPaginatedResponseSchema.parse(await fetcher(url)), {
    refreshInterval: 60000,
    focusThrottleInterval: 60000,
    ...options,
  });
};

// =================================================================
// ESTIMATE API
// =================================================================

export const getEstimateFeatures = async ({
  project_name,
  project_summary,
  readiness_level,
  platforms,
}: {
  project_name: string;
  project_summary: string;
  readiness_level: string;
  platforms: string[];
}) => {
  const params = new URLSearchParams();
  params.append("project_name", project_name);
  params.append("project_summary", project_summary);
  params.append("readiness_level", readiness_level);
  platforms.forEach((platform) => params.append("platforms", platform));

  const url = `/api/service/project/estimate/feature?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  });

  const ratelimit = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
  const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");

  if (response.ok) {
    const initalProject = await response.json();
    const projectEstimateFeature = projectFeatureEstimateResponseSchema.parse(initalProject);
    toast.success(`${ratelimit}회 남았어요.`);
    return { projectEstimateFeature, ratelimit, retryAfter };
  } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
    toast.error("API 호출에 실패했습니다.");
  } else if (response.status === 429) {
    toast.warning("API 한도를 초과했습니다.");
  } else {
    toast.error("API 호출에 실패했습니다.");
  }

  throw new Error("API 호출에 실패했습니다.");
};

export const useGetEstimateFeatures = ({
  project_name,
  project_summary,
  readiness_level,
  platforms,
}: {
  project_name: string;
  project_summary: string;
  readiness_level: string;
  platforms: string[];
}) => {
  const [data, setData] = useState<ProjectFeatureEstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ratelimit, setRatelimit] = useState(0);
  const [retryAfter, setRetryAfter] = useState(0);

  const fetchData = useCallback(async () => {
    if (!project_name || !project_summary || !readiness_level || platforms.length === 0) {
      setData(null);
      setLoading(false);
      setError(null);
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setData(null);

    try {
      const result = await getEstimateFeatures({ project_name, project_summary, readiness_level, platforms });
      setData(result.projectEstimateFeature);
      setRatelimit(result.ratelimit);
      setRetryAfter(result.retryAfter);
      setSuccess(true);
    } catch {
      setError("An unexpected error occurred");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [project_name, project_summary, platforms, readiness_level]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        if (success) setSuccess(false);
        if (error) setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return { data, loading, error, success, ratelimit, retryAfter, fetchData };
};

// --- Project Estimate (Streaming) ---
export const useEstimateProject = (projectId: string | null, initialMarkdown: string = "") => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const startEstimate = useCallback(() => {
    if (!projectId) return;

    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);
    setMarkdown("");

    fetchEventSource(`${API_BASE_URL}/${projectId}/estimate`, {
      method: "GET",
      signal: controller.signal,
      openWhenHidden: true,

      onopen: async (response) => {
        if (response.ok) {
          return;
        }
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");
          toast.warning(`API 한도 초과. ${retryAfter}초 후에 다시 시도하세요.`);
        } else {
          toast.error(`견적 생성 실패: ${response.statusText}`);
        }
        setIsLoading(false);
        controller.abort(); // 에러 발생 시 스트림 중단
      },
      onmessage: (event: EventSourceMessage) => {
        if (event.event === "stream_done") {
          controller.abort();
          setIsLoading(false);
          setAbortController(null);
          toast.success("AI 견적이 완료되었습니다.");
          return;
        }

        setMarkdown((prev) => prev + (event.data === "" ? "\n" : event.data));
      },
      onclose: () => {
        setIsLoading(false);
        setAbortController(null);
        toast.success("AI 견적이 완료되었습니다.");
      },
      onerror: (err) => {
        setIsLoading(false);
        setAbortController(null);
        if (err.name !== "AbortError") {
          toast.error("견적 생성 중 알 수 없는 오류가 발생했습니다.");
          throw err;
        }
      },
    });
  }, [projectId]);

  const stopEstimate = useCallback(() => {
    if (abortController) {
      abortController.abort();
      toast.info("견적 생성을 중단했습니다.");
    }
  }, [abortController]);

  return { markdown, isLoading, startEstimate, stopEstimate };
};

export const useQuoteSlots = (): SWRResponse<QuoteSlots> => {
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/slots/quote`;
  return useSWR(url, async (url: string) => quoteSlotsSchema.parse(await fetcher(url)));
};
