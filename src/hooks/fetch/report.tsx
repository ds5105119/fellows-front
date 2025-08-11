import { ReportResponse, ReportResponseSchema } from "@/@types/service/report";
import { toast } from "sonner";
import { SWRConfiguration, SWRResponse } from "swr";
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

export const useDailyReport = (data?: { project_id: string; date: Date }, options: SWRConfiguration<ReportResponse> = {}): SWRResponse<ReportResponse> => {
  const url = `${API_BASE_URL}/${data?.project_id}/report/daily?date=${dayjs(data?.date).format("YYYY-MM-DD")}`;
  return useSWRImmutable(data ? url : null, async (url: string) => ReportResponseSchema.parse(await fetcher(url)), options);
};

export const useMonthlyReport = (data?: { project_id: string; date: Date }, options: SWRConfiguration<ReportResponse> = {}): SWRResponse<ReportResponse> => {
  const url = `${API_BASE_URL}/${data?.project_id}/report/monthly?date=${dayjs(data?.date).format("YYYY-MM-DD")}`;
  return useSWRImmutable(data ? url : null, async (url: string) => ReportResponseSchema.parse(await fetcher(url)), options);
};

export const useReportAISummary = (report_id?: string, options: SWRConfiguration<ReportResponse> = {}): SWRResponse<ReportResponse> => {
  const url = `${API_BASE_URL}/estimate/report/${report_id}`;
  return useSWRImmutable(report_id ? url : null, async (url: string) => ReportResponseSchema.parse(await fetcher(url)), options);
};
