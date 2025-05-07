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

export const formatNumberKoreanWon = (num?: number) => {
  if (!num) return "0";

  if (num < 10) {
    return new Intl.NumberFormat("ko-KR").format(num * 1000);
  } else if (num < 10_000) {
    return `${(num / 10).toFixed(1).replace(/\.0$/, "")}만`;
  } else if (num < 1_000_000_000) {
    return `${(num / 100_000).toFixed(0)}억 ${((num % 100_000) / 100).toFixed(0)}만`;
  } else {
    return `${(num / 1_000_000_000).toFixed(0)}조 ${((num % 1_000_000_000) / 100_000).toFixed(0)}억`;
  }
};

export const formatNumberKoreanWontoFixed = (num?: number) => {
  if (!num) return "0";

  if (num < 10) {
    return new Intl.NumberFormat("ko-KR").format(num * 1000);
  } else if (num < 10_000) {
    return `${(num / 10).toFixed(1).replace(/\.0$/, "")}만`;
  } else if (num < 1_000_000_000) {
    return `${(num / 100_000).toFixed(1)}억`;
  } else {
    return `${(num / 1_000_000_000).toFixed(1)}조`;
  }
};

export const formatSmartDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  if (totalSeconds < 60) {
    return `${totalSeconds}초 전`;
  }

  if (totalMinutes < 60) {
    const seconds = totalSeconds % 60;
    return `${totalMinutes}분${seconds ? ` ${seconds}초` : ""} 전`;
  }

  if (totalHours < 24) {
    const minutes = totalMinutes % 60;
    let result = `${totalHours}시간`;
    if (minutes) result += ` ${minutes}분`;
    return result + " 전";
  }

  if (totalDays <= 100) {
    return `${totalDays}일 전`;
  }

  // 100일 초과 → yy/mm/dd
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};
