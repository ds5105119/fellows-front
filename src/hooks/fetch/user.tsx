import useSWR from "swr";
import { ExternalUsersAttributesSchema, ExternalUsersAttributes } from "@/@types/accounts/userdata";

const fetcher = async (url: string): Promise<ExternalUsersAttributes> => {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  const data = await response.json();
  return ExternalUsersAttributesSchema.parse(data);
};

export const useUsers = (sub: string[]) => {
  const params = new URLSearchParams();
  const validIds = sub ? sub.filter((id) => id) : [];
  validIds.forEach((id) => params.append("sub", id));

  const shouldFetch = validIds.length > 0;

  return useSWR(shouldFetch ? `/api/user/data?${params.toString()}` : null, fetcher);
};
