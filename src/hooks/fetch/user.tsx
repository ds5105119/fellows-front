import useSWR, { SWRResponse } from "swr";
import { ExternalUsersAttributesSchema, ExternalUsersAttributes } from "@/@types/accounts/userdata";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `API 요청 오류: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();

  return responseData;
};

export const useUsers = (sub: string[]): SWRResponse<ExternalUsersAttributes> => {
  const params = new URLSearchParams();
  const validIds = sub ? sub.filter((id) => id) : [];
  validIds.forEach((id) => params.append("sub", id));

  const shouldFetch = validIds.length > 0;

  return useSWR(shouldFetch ? `/api/user/data?${params.toString()}` : null, async (url: string) => ExternalUsersAttributesSchema.parse(await fetcher(url)));
};
