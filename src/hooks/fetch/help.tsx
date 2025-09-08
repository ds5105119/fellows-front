"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { toast } from "sonner";
import { HelpCreate, HelpsRead, HelpsReadSchema, HelpUpdate } from "@/@types/service/help";

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

export const createHelp = async (payload: HelpCreate): Promise<undefined> => {
  const response = await fetch("/api/help", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error("프로젝트 저장 중 오류가 발생했어요");
  }
};

export const useHelps = (options: SWRConfiguration<HelpsRead> = {}): SWRResponse<HelpsRead> => {
  return useSWR(`/api/help`, async (url: string) => HelpsReadSchema.parse(await fetcher(url)), options);
};

export const updateHelp = async (id: string, payload: HelpUpdate) => {
  await fetch(`/api/help/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const deleteHelp = async (id: string) => {
  await fetch(`/api/help/${id}`, {
    method: "DELETE",
  });
};
