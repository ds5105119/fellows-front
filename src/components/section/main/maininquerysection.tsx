"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { signIn, useSession } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";

import VariableFontHoverByLetter from "@/components/fancy/text/variable-font-hover-by-letter";
import AnimatedUnderlineTextarea from "@/components/ui/animatedunderlinetextarea";
import { getEstimateInfo } from "@/hooks/fetch/server/project";

const INQUIRY_COOKIE_KEY = "pending_inquiry_data";
const AUTO_SUBMIT_INFLIGHT_KEY = "auto_submit_inflight";

export default function MainInquerySection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: sessionHook, status } = useSession();
  const session = sessionHook ?? null;
  const isAuthed = !!session || status === "authenticated";

  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const shouldAutoSubmit = useMemo(() => searchParams.get("auto_submit") === "true", [searchParams]);

  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (!shouldAutoSubmit) return;
    if (!isAuthed) return;
    if (autoSubmittedRef.current) return;

    const inflight = sessionStorage.getItem(AUTO_SUBMIT_INFLIGHT_KEY);
    if (inflight === "1") return;

    setSubmitting(true);

    const savedData = getCookie(INQUIRY_COOKIE_KEY);
    if (!savedData) {
      setSubmitting(false);
      removeAutoSubmitParam();
      return;
    }

    const parsed = safeJSONParse<{ description: string; timestamp: number }>(savedData);
    if (!parsed?.description) {
      deleteCookie(INQUIRY_COOKIE_KEY);
      setSubmitting(false);
      removeAutoSubmitParam();
      return;
    }

    autoSubmittedRef.current = true;
    sessionStorage.setItem(AUTO_SUBMIT_INFLIGHT_KEY, "1");

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
          removeAutoSubmitParam();
          router.push(`/service/project/new?from=session`);
          return;
        }

        setSubmitting(false);
      } catch (err) {
        console.error("Auto submit failed:", err);
        setSubmitting(false);
      } finally {
        sessionStorage.removeItem(AUTO_SUBMIT_INFLIGHT_KEY);
      }
    })();
  }, [shouldAutoSubmit, isAuthed, router]);

  const handleFormSubmit = async (formData: FormData) => {
    const description = formData.get("description")?.toString().trim();
    if (!description) return;

    if (!isAuthed) {
      setCookie(INQUIRY_COOKIE_KEY, JSON.stringify({ description, timestamp: Date.now() }), 7);
      signIn("keycloak", { redirectTo: "/?auto_submit=true#inquery" });
      return;
    }

    try {
      setSubmitting(true);
      const state = await withTimeout(getEstimateInfo(description), 45000);

      if (state?.success) {
        sessionStorage.setItem(
          "project_info",
          JSON.stringify({
            description: state.description,
            info: state.info,
          })
        );
        // 성공 시 쿠키가 남아있다면 정리
        deleteCookie(INQUIRY_COOKIE_KEY);
        removeAutoSubmitParam();
        router.push(`/service/project/new?from=session`);
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Manual submit failed:", err);
      setSubmitting(false);
    }
  };

  if (submitting) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">분석 중</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="w-full px-4">
      <div className="w-full pb-8 md:pb-10">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Tell us about your project ✽</h1>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
            <h4 className="text-base md:text-lg font-semibold text-foreground">우리가 잘 해낼 수 있는 프로젝트인지 검토 후 3일이내 연락 드리겠습니다.</h4>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <AnimatedUnderlineTextarea
          ref={textareaRef}
          name="description"
          className="!text-base md:!text-2xl min-h-[6em] md:min-h-[8em]"
          placeholder="자유롭게 메시지를 작성해주세요."
        />
        <button
          onClick={() => {
            const fd = new FormData();
            fd.append("description", textareaRef.current?.value ?? "");
            handleFormSubmit(fd);
          }}
          className="w-fit flex items-center justify-center gap-1.5 text-2xl font-light rounded-full bg-white"
        >
          <ArrowRight strokeWidth={1} size={32} />
          <VariableFontHoverByLetter
            label="Send"
            staggerDuration={0.03}
            fromFontVariationSettings="'wght' 400, 'slnt' 0"
            toFontVariationSettings="'wght' 900, 'slnt' -10"
          />
        </button>
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

function removeAutoSubmitParam() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.has("auto_submit")) {
    url.searchParams.delete("auto_submit");
    window.history.replaceState({}, "", url.toString());
  }
}

function safeJSONParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // 값은 인코딩해서 저장(특수문자 안전)
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
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
