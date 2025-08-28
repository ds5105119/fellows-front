"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import VariableFontHoverByLetter from "@/components/fancy/text/variable-font-hover-by-letter";
import AnimatedUnderlineTextarea from "@/components/ui/animatedunderlinetextarea";
import { getEstimateInfo } from "@/hooks/fetch/server/project";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

const INQUIRY_COOKIE_KEY = "pending_inquiry_data";

export default function MainInquerySection({ session }: { session: Session | null }) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const shouldAutoSubmit = searchParams.get("auto_submit") === "true";
      if (shouldAutoSubmit && session) {
        const savedData = getCookie(INQUIRY_COOKIE_KEY);
        if (savedData) {
          try {
            setSubmitting(true);
            const parsedData = JSON.parse(savedData);

            deleteCookie(INQUIRY_COOKIE_KEY);

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
            }
          } catch (err) {
            setSubmitting(false);
            console.error("Failed to parse saved inquiry data:", err);
            deleteCookie(INQUIRY_COOKIE_KEY);
          }
        }
      }
    };

    run();
  }, [session, searchParams]);

  const handleFormSubmit = async (formData: FormData) => {
    const description = formData.get("description");

    if (!session) {
      const inquiryData = {
        description,
        timestamp: Date.now(),
      };

      setCookie(INQUIRY_COOKIE_KEY, JSON.stringify(inquiryData), 7);

      signIn("keycloak", {
        redirectTo: "/?auto_submit=true#inquery",
      });

      return;
    }

    if (description) {
      try {
        setSubmitting(true);

        const state = await getEstimateInfo(description.toString());

        if (state?.success) {
          sessionStorage.setItem(
            "project_info",
            JSON.stringify({
              description: state.description,
              info: state.info,
            })
          );
          router.push(`/service/project/new?from=session`);
        }
      } catch (err) {
        setSubmitting(false);
        console.error("Failed to parse saved inquiry data:", err);
      }
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
    <div className="w-full">
      <div className="w-full pb-8 md:pb-10">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Tell us about your project ✽</h1>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
            <h4 className="text-base md:text-lg font-semibold text-foreground">우리가 잘 해낼 수 있는 프로젝트인지 검토 후 3일이내 연락 드리겠습니다.</h4>
          </div>
        </div>
      </div>
      <form ref={formRef} className="flex flex-col gap-6" action={handleFormSubmit}>
        <AnimatedUnderlineTextarea
          ref={textareaRef}
          name="description"
          className="!text-base md:!text-2xl min-h-[6em] md:min-h-[8em]"
          placeholder="자유롭게 메시지를 작성해주세요."
        />
        <button
          type="submit"
          onClick={() => setSubmitting(true)}
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
      </form>
    </div>
  );
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
