"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { getEstimateInfo } from "@/hooks/fetch/server/project";

const INQUIRY_COOKIE_KEY = "pending_inquiry_data";

export default function InqueryPage() {
  const router = useRouter();

  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (autoSubmittedRef.current) return;

    const savedData = getCookie(INQUIRY_COOKIE_KEY);
    if (!savedData) {
      router.replace("/");
      return;
    }

    const parsed = safeJSONParse<{ description: string; timestamp: number }>(savedData);
    if (!parsed?.description) {
      deleteCookie(INQUIRY_COOKIE_KEY);
      router.replace("/");
      return;
    }

    autoSubmittedRef.current = true;

    (async () => {
      try {
        const state = await withTimeout(getEstimateInfo(parsed.description), 45000);

        if (state?.success) {
          sessionStorage.setItem(
            "project_info",
            JSON.stringify({
              description: state.description,
              info: state.info,
            })
          );
          deleteCookie(INQUIRY_COOKIE_KEY);
          router.push(`/service/project/new?from=session`);
          return;
        }

        console.log("씨발");
      } catch (err) {
        console.log(err);
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

function safeJSONParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.startsWith(nameEQ)) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
}
