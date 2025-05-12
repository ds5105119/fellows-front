import { ProjectEstimateFeatureSchema, ProjectEstimateFeatureSchemaType } from "@/@types/service/project";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export const getEstimateFeatures = async ({
  project_name,
  project_summary,
  readiness_level,
}: {
  project_name: string;
  project_summary: string;
  readiness_level: string;
}) => {
  const params = new URLSearchParams();
  params.append("project_name", project_name);
  params.append("project_summary", project_summary);
  params.append("readiness_level", readiness_level);

  const url = `/api/service/project/estimate/feature?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const ratelimit = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
  const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");

  if (response.ok) {
    const initalProject = await response.json();
    const projectEstimateFeature = ProjectEstimateFeatureSchema.parse(initalProject);
    return { projectEstimateFeature, ratelimit, retryAfter };
  } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
    const errorData = await response.json().catch(() => ({ message: "Client error" }));
    toast.error("API 호출에 실패했습니다.", {
      description: errorData.message,
    });
  } else if (response.status === 429) {
    toast.warning("API 한도를 초과했습니다.", {
      description: `${format(Date.now() + retryAfter * 1000, "yyyy-MM-dd:HH:mm:ss")} 부터 사용 가능합니다.`,
    });
  } else {
    toast.error("API 호출에 실패했습니다.", {
      description: "알 수 없는 에러가 발생했습니다.",
    });
  }

  throw new Error("API 호출에 실패했습니다.");
};

export const useGetEstimateFeatures = ({
  project_name,
  project_summary,
  readiness_level,
}: {
  project_name: string;
  project_summary: string;
  readiness_level: string;
}) => {
  const [data, setData] = useState<ProjectEstimateFeatureSchemaType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ratelimit, setRatelimit] = useState(0);
  const [retryAfter, setRetryAfter] = useState(0);

  const fetchData = useCallback(async () => {
    if (!project_name || !project_summary || !readiness_level) {
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
      const result = await getEstimateFeatures({ project_name, project_summary, readiness_level });
      setData(result.projectEstimateFeature);
      setRatelimit(result.ratelimit);
      setRetryAfter(result.retryAfter);
      setSuccess(true);
      console.log("3");
    } catch (err) {
      setError("An unexpected error occurred");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [project_name, project_summary]);

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
