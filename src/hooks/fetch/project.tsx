"use client";

import { ProjectEstimateFeatureSchema, ProjectEstimateFeatureSchemaType } from "@/@types/service/project";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ERPNextProjectType, ERPNextProjectZod } from "@/@types/service/erpnext";
import useSWR, { SWRResponse } from "swr";

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
