import { ReportResponse, ReportResponseSchema } from "@/@types/service/report";
import { toast } from "sonner";
import { SWRResponse } from "swr";
import useSWRImmutable from "swr/immutable";
import dayjs from "@/lib/dayjs";

const API_BASE_URL = "/api/service/project";

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

export const useDailyReport = (project_id: string, date: Date): SWRResponse<ReportResponse> => {
  const url = `${API_BASE_URL}/${project_id}/report/daily?date=${dayjs(date).format("YYYY-MM-DD")}`;
  return useSWRImmutable(url, async (url: string) => ReportResponseSchema.parse(await fetcher(url)));
};

export const useDailyReportAISummary = (report_id?: string): SWRResponse<ReportResponse> => {
  const url = `${API_BASE_URL}/estimate/report/daily/${report_id}`;
  return useSWRImmutable(report_id ? url : null, async (url: string) => ReportResponseSchema.parse(await fetcher(url)));
};
