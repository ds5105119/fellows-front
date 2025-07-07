"use client";

import { useAlerts } from "@/hooks/fetch/alert";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function AlertMain() {
  const alertSwr = useAlerts(50);

  // 데이터 처리
  const alerts = alertSwr.data?.flatMap((issue) => issue.items) ?? [];
  const isReachedEnd = alertSwr.data && alertSwr.data.length > 0 && alertSwr.data[alertSwr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && (alertSwr.isLoading || (alertSwr.data && alertSwr.size > 0 && typeof alertSwr.data[alertSwr.size - 1] === "undefined"));

  // 무한 스크롤
  const infinitRef = useRef<HTMLDivElement>(null);
  const isReachingEnd = useInView(infinitRef, {
    once: false,
    margin: "-50px 0px -50px 0px",
  });

  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd) {
      alertSwr.setSize((s) => s + 1);
    }
  }, [isReachingEnd, isLoading, isReachedEnd]);

  return (
    <div className="w-full">
      {alerts.map((alert, idx) => {
        return <div key={idx}>{alert.message}</div>;
      })}
      <div ref={infinitRef} />
    </div>
  );
}
