"use client";

import type React from "react";

import { useEffect, useState, useRef, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { type EstimateFormState, getEstimateInfo } from "@/hooks/fetch/server/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import { motion, AnimatePresence } from "framer-motion";

const placeholderTexts = ["3분만에 AI 견적을 받아보세요.", "의뢰하려는 사이트에 대해 설명해주세요."];

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

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 80; // minimum height in pixels
      textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    adjustTextareaHeight();
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [description]);

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
      router.push(`/service/project/new?from=session`);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-black hover:bg-black/65 text-white transition-colors duration-200 focus-visible:ring-0">
          <BreathingSparkles /> AI로 만들기
        </Button>
      </DialogTrigger>
      <DialogContent
        className="!max-w-7xl !w-[calc(100vw-2rem)] !h-4/5 rounded-3xl px-4"
        overlayClassName="backdrop-blur-sm bg-black/10"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">새 프로젝트 생성</DialogTitle>
        </DialogHeader>

        <motion.div
          className="w-full h-full flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <form action={handleFormSubmit} className="w-full h-full flex flex-col relative">
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-full max-w-4xl relative">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {!description && (
                      <motion.div
                        key={placeholderIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 dark:text-gray-500 text-base md:text-lg font-semibold text-center z-10"
                      >
                        {placeholderTexts[placeholderIdx]}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Textarea
                    ref={textareaRef}
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder=""
                    onWheel={(e) => e.stopPropagation()}
                    className="w-full bg-transparent border-none focus-visible:ring-0 outline-none
                            shadow-none resize-none scrollbar-hide leading-relaxed text-foreground
                            overflow-hidden text-base md:text-lg font-semibold
                            placeholder:text-transparent p-8 text-center min-h-[80px]"
                    spellCheck="false"
                    style={{
                      textAlign: "center",
                      lineHeight: "1.5",
                      height: "auto",
                      caretColor: description ? "currentColor" : "transparent",
                    }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {description.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.4,
                  }}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-lg"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <Button
                      size="lg"
                      type="submit"
                      className="relative bg-black hover:bg-black/80 text-white rounded-full px-8 py-3 font-semibold shadow-lg transition-all duration-200"
                      disabled={isParentLoading}
                    >
                      {isParentLoading ? (
                        <>
                          <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                          AI가 분석중...
                        </>
                      ) : (
                        <>
                          견적 받기
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {isParentLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl"
              >
                <div className="text-center">
                  <motion.div
                    className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">AI가 견적을 생성하고 있습니다...</p>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
