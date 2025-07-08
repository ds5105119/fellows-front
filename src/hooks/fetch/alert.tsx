import { AlertPaginatedResponseSchema } from "@/@types/accounts/alert";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

// READ

const alertsGetKeyFactory = ({ size }: { size?: number }): SWRInfiniteKeyLoader => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;
    const params = new URLSearchParams();

    params.append("page", `${pageIndex}`);
    if (size) params.append("size", `${size}`);

    return `/api/user/alert/?${params.toString()}`;
  };
};

const alertsFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  const data = await res.json();
  return AlertPaginatedResponseSchema.parse(data);
};

export const useAlerts = (size?: number) => {
  const getKey = alertsGetKeyFactory({ size });
  return useSWRInfinite(getKey, alertsFetcher, {
    refreshInterval: 60000,
    initialSize: 2,
  });
};

// UPDATE

export const markAlertAsRead = async (alertId: string[]) => {
  const searchParams = new URLSearchParams();
  alertId.forEach((alert) => searchParams.append("alert_id", alert));

  const res = await fetch(`/api/user/alert/read/${searchParams.toString()}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to mark alert as read");
  return res.json();
};

// DELETE

export const deleteAlert = async (alertId: string) => {
  const res = await fetch(`/api/user/alert/${alertId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete alert");
  return res.json();
};
