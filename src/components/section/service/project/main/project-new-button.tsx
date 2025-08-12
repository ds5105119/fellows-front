"use client";

import { useEffect, useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2Icon, PlusIcon } from "lucide-react";
import { type EstimateFormState, getEstimateInfo } from "@/hooks/fetch/server/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const placeholderTexts = ["3분만에 AI 견적을 받아보세요.", "의뢰하려는 사이트에 대해 설명해주세요."];

function SubmitButton({ isParentLoading }: { isParentLoading: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isParentLoading;

  return (
    <Button size="icon" type="submit" variant="default" className="rounded-full size-8 md:size-9" disabled={isLoading}>
      {isLoading ? <Loader2Icon className="animate-spin" /> : <ChevronRight />}
    </Button>
  );
}

export default function ProjectNewButton({ session, initialDescription }: { session: Session | null; initialDescription: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [description, setDescription] = useState(initialDescription);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [state, formAction] = useActionState<EstimateFormState, FormData>(getEstimateInfo, null);

  const isParentLoading = isNavigating || isAutoSubmitting;
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholderTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (formData: FormData) => {
    if (!session) {
      document.cookie = `pendingDescription=${encodeURIComponent(description)}; path=/; max-age=300; SameSite=Lax`;
      signIn("keycloak", { redirectTo: "/?from=cookie" });
    }

    setIsNavigating(false);
    setIsAutoSubmitting(false);

    if (session) {
      formAction(formData);
    }
  };

  useEffect(() => {
    if (state?.success) {
      setIsNavigating(true);
      toast.success("견적 생성에 성공했습니다!");
      sessionStorage.setItem(
        "project_info",
        JSON.stringify({
          description: state.description,
          info: state.info,
        })
      );
      router.push(`/service/project/new`);
    } else if (state?.error) {
      setIsNavigating(false);
      setIsAutoSubmitting(false);
      toast.error(state.error);
    }
  }, [state, router]);

  useEffect(() => {
    const fromCookie = searchParams.get("from") === "cookie";
    if (session && initialDescription && fromCookie) {
      setIsAutoSubmitting(true);
      router.replace("/");
      router.refresh();

      const formData = new FormData();
      formData.append("description", initialDescription);
      formAction(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, initialDescription, searchParams, formAction, router]);

  useEffect(() => {
    return () => {
      setIsNavigating(false);
      setIsAutoSubmitting(false);
    };
  }, []);

  // 가장 표준적이고 안정적인 높이 조절 로직으로 변경
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      if (window.innerWidth >= 768) {
        el.style.height = "100%";
        return;
      }

      // --- 모바일 뷰 ---
      const MAX_HEIGHT_PX = 144;
      // 1. 높이를 'auto'로 초기화하여 textarea가 스스로 줄어들 수 있도록 합니다. (가장 중요!)
      el.style.height = "auto";
      // 2. 초기화된 상태에서 계산된 scrollHeight를 기반으로 새로운 높이를 설정합니다.
      el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    }
  }, [description]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-500 transition-colors duration-200 focus-visible:ring-0">
          새로 만들기 <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">새 프로젝트 생성</DialogTitle>
        </DialogHeader>

        <form action={handleFormSubmit} className="w-full max-w-4xl mx-auto flex flex-col gap-4">
          <div
            className="w-full min-h-10 max-h-36 md:min-h-36 md:max-h-36 px-4 pr-1.5 md:pl-5 md:py-4 md:pr-3
        flex items-center md:items-stretch justify-center gap-2 
        relative rounded-[24px] md:rounded-2xl 
        bg-foreground/2 backdrop-blur-xl border border-foreground/10"
          >
            <Textarea
              ref={textareaRef}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={1}
              placeholder={placeholderTexts[placeholderIdx]}
              onWheel={(e) => e.stopPropagation()}
              className="w-full grow self-center md:self-auto p-0 min-h-0 bg-transparent border-none focus-visible:ring-0 outline-none
                      shadow-none resize-none scrollbar-hide leading-snug text-foreground
                     md:h-full 
                      overflow-y-auto
                     overscroll-behavior-contain"
              spellCheck="false"
            />
            <div className="flex items-end h-full py-1.5 md:py-0">
              <SubmitButton isParentLoading={isParentLoading} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
