"use client";

import useSWR, { SWRResponse } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ERPNextProjectFileRowType,
  ERPNextProjectPageSchema,
  ERPNextProjectType,
  ERPNextProjectZod,
  ERPNextTaskPaginatedResponseZod,
  ProjectEstimateFeatureSchema,
  ProjectEstimateFeatureSchemaType,
  UserERPNextProjectType,
} from "@/@types/service/project";

// CREATE

export const createProject = async (payload: UserERPNextProjectType): Promise<ERPNextProjectType | undefined> => {
  const response = await fetch("/api/service/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error("프로젝트 저장 중 오류가 발생했어요");
  }

  try {
    const responseData = await response.json();
    return ERPNextProjectZod.parse(responseData);
  } catch {
    toast.error("프로젝트 저장 중 오류가 발생했어요");
  }
};

// READ

export const useProject = (project_id: string): SWRResponse<ERPNextProjectType | undefined> => {
  const fetcher = async (url: string) => {
    if (!url) return undefined;

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const parsedData = ERPNextProjectZod.parse(responseData);

      return parsedData;
    } catch (error) {
      throw error;
    }
  };

  return useSWR(`/api/service/project/${project_id}`, fetcher);
};

const projectsGetKeyFactory = ({
  size,
  keyword,
  order_by,
  status,
}: {
  size?: number;
  keyword?: string;
  order_by?: string;
  status?: string;
}): SWRInfiniteKeyLoader => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;
    const params = new URLSearchParams();
    params.append("page", `${pageIndex}`);
    if (size) params.append("size", `${size}`);
    if (keyword) params.append("keyword", keyword);
    if (order_by) params.append("order_by", order_by);
    if (status) params.append("status", status);
    return `/api/service/project?${params.toString()}`;
  };
};

const projectsFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  const data = await res.json();
  return ERPNextProjectPageSchema.parse(data);
};

export const useProjects = (size?: number, keyword?: string, order_by?: string, status?: string) => {
  const getKey = projectsGetKeyFactory({ size, keyword, order_by, status });
  return useSWRInfinite(getKey, projectsFetcher, {
    refreshInterval: 60000,
  });
};

// PUT

export const submitProject = async (project_id: string) => {
  await fetch(`/api/service/project/${project_id}/submit`, {
    method: "POST",
  });
};

export const cancelSubmitProject = async (project_id: string) => {
  await fetch(`/api/service/project/${project_id}/submit/cancel`, {
    method: "POST",
  });
};

export const addFileToProject = async (project_id: string, file_record: ERPNextProjectFileRowType) => {
  await fetch(`/api/service/project/${project_id}/files`, {
    method: "PUT",
    body: JSON.stringify(file_record),
  });
};

// DELETE

export const deleteProject = async (project_id: string) => {
  await fetch(`/api/service/project/${project_id}`, {
    method: "DELETE",
  });
};

// 테스크

const tasksGetKeyFactory = ({ size, project_id }: { project_id: string; size?: string }): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index * Number(size || 20)}`);

    if (size) params.append("size", size);

    return `/api/service/project/${project_id}/tasks?${params.toString()}`;
  };
};

const tasksFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return ERPNextTaskPaginatedResponseZod.parse(data);
};

export const useTasks = (size: string, project_id: string) => {
  const getKey = tasksGetKeyFactory({ size, project_id });
  return useSWRInfinite(getKey, tasksFetcher);
};

// 기능 추천

const getEstimateFeatures = async ({
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
  });

  const ratelimit = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
  const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");

  if (response.ok) {
    const initalProject = await response.json();
    const projectEstimateFeature = ProjectEstimateFeatureSchema.parse(initalProject);
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
  const [data, setData] = useState<ProjectEstimateFeatureSchemaType | null>(null);
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

// 예상 견적 작성

export const useEstimateProject = (project_id: string, _markdown: string) => {
  const [ctrl, setCtrl] = useState<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>(_markdown);
  const [lastMarkdown, setLastMarkdown] = useState<string>(_markdown);
  const [remaining, setRemaining] = useState<number>(1);

  const url = `/api/service/project/${project_id}/estimate`;

  const estimate = () => {
    const newCtrl = new AbortController();

    setIsLoading(true);
    setMarkdown("");
    setCtrl(newCtrl);

    fetchEventSource(url, {
      method: "GET",
      signal: newCtrl.signal,
      openWhenHidden: true,

      onopen: async (response) => {
        const ratelimit = parseInt(response.headers.get("x-ratelimit-remaining") ?? "1");
        const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");
        setRemaining(ratelimit);

        if (response.ok) {
          toast.info("AI 견적이 생성 중 입니다.");
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          toast.error("API 호출에 실패했습니다.");
          newCtrl.abort();
        } else if (response.status === 429) {
          toast.warning(`${format(Date.now() + retryAfter * 1000, "yyyy-MM-dd:HH:mm:ss")} 부터 사용 가능합니다.`);
          newCtrl.abort();
        } else {
          toast.error("API 호출에 실패했습니다.");
          newCtrl.abort();
        }

        if (!response.ok) {
          setMarkdown(lastMarkdown);
          setIsLoading(false);
        }
      },
      onmessage: (event: EventSourceMessage) => {
        if (event.data === "") {
          setMarkdown((prev) => prev + "\n");
        } else {
          setMarkdown((prev) => prev + event.data);
        }
      },
      onclose: () => {
        setIsLoading(false);
        setLastMarkdown(markdown);
        setCtrl(null);
      },
      onerror: (err) => {
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          toast("네트워크 오류로 견적을 생성할 수 없습니다.");
        } else {
          toast("AI 견적 생성 중 오류가 발생했습니다.");
        }
        setIsLoading(false);
        newCtrl.abort();
        setCtrl(null);

        throw err;
      },
    });
  };

  return { ctrl, setCtrl, isLoading, markdown, remaining, estimate };
};
