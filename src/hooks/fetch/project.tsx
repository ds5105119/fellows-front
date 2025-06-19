"use client";

import useSWR, { SWRResponse } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  ERPNextFile,
  erpNextFileSchema,
  ERPNextFilesResponse,
  erpNextFilesResponseSchema,
  ERPNextProject,
  erpNextProjectSchema,
  ERPNextTaskPaginatedResponse,
  erpNextTaskPaginatedResponseSchema,
  ProjectFeatureEstimateRequest,
  projectFeatureEstimateResponseSchema,
  ProjectsPaginatedResponse,
  projectsPaginatedResponseSchema,
  UpdateERPNextProject,
  UserERPNextProject,
} from "@/@types/service/project";

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
  return response.json();
};

// =================================================================
// PROJECT API
// =================================================================

// --- CREATE ---
export const createProject = async (payload: UserERPNextProject): Promise<ERPNextProject> => {
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
  return erpNextProjectSchema.parse(responseData);
};

// --- READ (Single) ---
export const useProject = (projectId: string | null): SWRResponse<ERPNextProject> => {
  const url = projectId ? `${API_BASE_URL}/${projectId}` : null;
  return useSWR(url, async (url: string) => erpNextProjectSchema.parse(await fetcher(url)));
};

// --- READ (List) ---
const projectsGetKeyFactory = (params: {
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
  });
};

// --- UPDATE ---
export const updateProject = async (projectId: string, payload: UpdateERPNextProject): Promise<ERPNextProject> => {
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
  return erpNextProjectSchema.parse(responseData);
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
export const submitProject = async (projectId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/submit`, { method: "POST" });
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
export const createFile = async (projectId: string, filePayload: Omit<ERPNextFile, "creation" | "modified">): Promise<ERPNextFile> => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/files`, {
    method: "PUT", // API 라우터에 따라 PUT 사용
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filePayload),
  });

  if (!response.ok) {
    toast.error("파일 업로드 중 오류가 발생했습니다.");
    throw new Error("Failed to upload file");
  }

  // API가 생성된 파일 객체를 반환한다고 가정
  const responseData = await response.json();
  return erpNextFileSchema.parse(responseData);
};

// --- READ (Single) ---
export const useFile = (projectId: string | null, fileKey: string | null): SWRResponse<ERPNextFile> => {
  const url = projectId && fileKey ? `${API_BASE_URL}/${projectId}/files/${fileKey}` : null;
  return useSWR(url, async (url: string) => erpNextFileSchema.parse(await fetcher(url)));
};

// --- READ (List) ---
const filesGetKeyFactory = (projectId: string): SWRInfiniteKeyLoader<ERPNextFilesResponse> => {
  return (pageIndex, previousPageData) => {
    if (!projectId) return null;
    if (previousPageData && !previousPageData.items.length) return null;
    return `${API_BASE_URL}/${projectId}/files?page=${pageIndex}`;
  };
};

export const useFiles = (projectId: string) => {
  const getKey = filesGetKeyFactory(projectId);
  return useSWRInfinite(getKey, async (url: string) => erpNextFilesResponseSchema.parse(await fetcher(url)));
};

// --- DELETE ---
export const deleteFile = async (projectId: string, fileKey: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${projectId}/files/${fileKey}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    toast.error("파일 삭제 중 오류가 발생했습니다.");
    throw new Error("Failed to delete file");
  }
  toast.success("파일이 삭제되었습니다.");
};

// =================================================================
// TASK API (Sub-resource of Project)
// =================================================================

const tasksGetKeyFactory = (projectId: string, params: { size?: number; order_by?: string }): SWRInfiniteKeyLoader<ERPNextTaskPaginatedResponse> => {
  return (pageIndex, previousPageData) => {
    if (!projectId) return null;
    if (previousPageData && !previousPageData.items.length) return null;

    const searchParams = new URLSearchParams();
    searchParams.append("page", `${pageIndex}`);
    if (params.size) searchParams.append("size", `${params.size}`);
    if (params.order_by) searchParams.append("order_by", params.order_by);

    return `${API_BASE_URL}/${projectId}/tasks?${searchParams.toString()}`;
  };
};

export const useTasks = (projectId: string, params: { size?: number; order_by?: string }) => {
  const getKey = tasksGetKeyFactory(projectId, params);
  return useSWRInfinite(getKey, async (url: string) => erpNextTaskPaginatedResponseSchema.parse(await fetcher(url)));
};

// =================================================================
// ESTIMATE API
// =================================================================

// --- Feature Estimate (SWR 사용으로 리팩토링) ---
const featureEstimateFetcher = async (url: string) => {
  const response = await fetch(url);
  const ratelimit = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");

  if (response.status === 429) {
    toast.warning("API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    throw new Error("Rate limit exceeded");
  }
  if (!response.ok) {
    toast.error("기능 추천 목록을 가져오는데 실패했습니다.");
    throw new Error("Failed to fetch features");
  }

  const responseData = await response.json();
  const parsedData = projectFeatureEstimateResponseSchema.parse(responseData);
  toast.success(`기능 추천 완료! (남은 횟수: ${ratelimit}회)`);
  return { data: parsedData, ratelimit };
};

export const useGetEstimateFeatures = (params: ProjectFeatureEstimateRequest | null) => {
  const getKey = () => {
    if (!params || !params.project_name || !params.project_summary || params.platforms.length === 0) {
      return null;
    }
    const searchParams = new URLSearchParams({
      project_name: params.project_name,
      project_summary: params.project_summary,
      readiness_level: params.readiness_level,
    });
    params.platforms.forEach((p) => searchParams.append("platforms", p));
    return `${API_BASE_URL}/estimate/feature?${searchParams.toString()}`;
  };

  return useSWR(getKey, featureEstimateFetcher, {
    shouldRetryOnError: false, // 429 에러 발생 시 자동 재시도 방지
  });
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
    setMarkdown(""); // 스트리밍 시작 시 내용 초기화

    fetchEventSource(`${API_BASE_URL}/${projectId}/estimate`, {
      method: "GET",
      signal: controller.signal,
      openWhenHidden: true,

      onopen: async (response) => {
        if (response.ok) {
          toast.info("AI 견적 생성을 시작합니다.");
          return;
        }
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");
          toast.warning(`API 한도 초과. ${retryAfter}초 후에 다시 시도하세요.`);
        } else {
          toast.error(`견적 생성 실패: ${response.statusText}`);
        }
        controller.abort(); // 에러 발생 시 스트림 중단
      },
      onmessage: (event: EventSourceMessage) => {
        if (event.event === "stream_done") {
          controller.abort(); // 서버에서 종료 신호를 보내면 연결을 중단
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
