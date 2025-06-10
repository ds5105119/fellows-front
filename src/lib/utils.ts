import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num?: number) => {
  if (!num) return "0";

  if (num < 1000) {
    return new Intl.NumberFormat("ko-KR").format(num); // 1~999는 그대로 표시
  } else if (num < 1_000_000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`; // 1,000 이상 1,000,000 미만은 K로 표시
  } else if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`; // 1,000,000 이상 1,000,000,000 미만은 M으로 표시
  } else {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`; // 1,000,000,000 이상은 B로 표시
  }
};

export const isIOS = (): boolean => {
  const ua = navigator.userAgent;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const iOSDevices = /iPad|iPhone|iPod/.test(ua);
  const iPadOS13Up = /MacIntel/.test(ua) && maxTouchPoints > 1;
  const isWebKit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);

  return (iOSDevices || iPadOS13Up) && isWebKit;
};
