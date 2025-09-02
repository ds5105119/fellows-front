"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getEstimateInfo } from "@/hooks/fetch/server/project";

function InqueryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (autoSubmittedRef.current) return;

    const descParam = searchParams.get("description");

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
        const state = await getEstimateInfo(description);

        if (state?.success) {
          try {
            sessionStorage.setItem(
              "project_info",
              JSON.stringify({
                description: state.description,
                info: state.info,
              })
            );
          } catch {
            router.replace("/");
            return;
          }

          router.push(`/service/project/new?from=session`);
          return;
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">분석 중...</p>
        </div>
      </div>
    </div>
  );
}

export default function InqueryPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-black flex items-center justify-center p-4">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        </div>
      }
    >
      <InqueryContent />
    </Suspense>
  );
}
