"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import { ArrowRight, Loader2 } from "lucide-react";

import VariableFontHoverByLetter from "@/components/fancy/text/variable-font-hover-by-letter";
import AnimatedUnderlineTextarea from "@/components/ui/animatedunderlinetextarea";
import { getEstimateInfo } from "@/hooks/fetch/server/project";

const INQUIRY_COOKIE_KEY = "pending_inquiry_data";

export default function MainInquirySection({ session }: { session: Session | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const didRun = useRef(false);

  // 로그인 후 자동 제출 처리
  useEffect(() => {
    const shouldAutoSubmit = searchParams.get("auto_submit") === "true";

    if (!shouldAutoSubmit || !session || didRun.current) return;
    didRun.current = true;

    (async () => {
      setSubmitting(true);
      const savedData = getCookie(INQUIRY_COOKIE_KEY);

      if (!savedData) {
        setSubmitting(false);
        return;
      }

      try {
        const parsedData = JSON.parse(savedData);
        deleteCookie(INQUIRY_COOKIE_KEY);

        // URL에서 auto_submit 파라미터 제거
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("auto_submit");
        window.history.replaceState({}, "", newUrl.toString());

        const state = await getEstimateInfo(parsedData.description);

        if (state?.success) {
          sessionStorage.setItem(
            "project_info",
            JSON.stringify({
              description: state.description,
              info: state.info,
            })
          );
          router.push(`/service/project/new?from=session`);
        } else {
          setSubmitting(false);
        }
      } catch (err) {
        console.error("Failed to parse saved inquiry data:", err);
        deleteCookie(INQUIRY_COOKIE_KEY);
        setSubmitting(false);
      }
    })();
  }, [session, searchParams, router]);

  const handleFormSubmit = async (formData: FormData) => {
    const description = formData.get("description")?.toString().trim();
    if (!description) return;

    if (!session) {
      // 로그인 전이라면 쿠키에 저장
      const inquiryData = { description, timestamp: Date.now() };
      setCookie(INQUIRY_COOKIE_KEY, JSON.stringify(inquiryData), 7);

      signIn("keycloak", {
        redirectTo: "/?auto_submit=true#inquery",
      });
      return;
    }

    try {
      setSubmitting(true);
      const state = await getEstimateInfo(description);

      if (state?.success) {
        sessionStorage.setItem(
          "project_info",
          JSON.stringify({
            description: state.description,
            info: state.info,
          })
        );
        router.push(`/service/project/new?from=session`);
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to handle inquiry:", err);
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
          <h4 className="text-base md:text-lg font-semibold text-foreground">우리가 잘 해낼 수 있는 프로젝트인지 검토 후 3일 이내 연락 드리겠습니다.</h4>
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

// Cookie Utils
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
  }
  return null;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
