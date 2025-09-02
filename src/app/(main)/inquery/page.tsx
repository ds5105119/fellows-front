"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getEstimateInfo } from "@/hooks/fetch/server/project";

export default function InqueryPage() {
  const router = useRouter();
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (autoSubmittedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const descParam = params.get("description");

    if (!descParam) {
      router.replace("/");
      return;
    }

    if (descParam.length > 10000) {
      router.replace("/");
      return;
    }

    const description = descParam;
    autoSubmittedRef.current = true;

    (async () => {
      try {
        const state = await withTimeout(getEstimateInfo(description), 45000);
        if (state?.success) {
          sessionStorage.setItem("project_info", JSON.stringify({ description: state.description, info: state.info }));
          router.push(`/service/project/new?from=session`);
          return;
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">프로젝트 분석 중...</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- utils -------------------- */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
