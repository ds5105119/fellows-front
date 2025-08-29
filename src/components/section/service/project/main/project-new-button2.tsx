"use client";
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "@/components/ui/morphing-popover";
import { motion } from "motion/react";
import { useActionState, useEffect, useId, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { GlowEffect } from "@/components/ui/glow-effect";
import { Session } from "next-auth";
import { type EstimateFormState, getEstimateInfoAction } from "@/hooks/fetch/server/project";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProjectAINewButton({ session }: { session: Session | null }) {
  const router = useRouter();
  const uniqueId = useId();
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [state, formAction] = useActionState<EstimateFormState, FormData>(getEstimateInfoAction, null);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = (formData: FormData) => {
    if (session) {
      formAction(formData);
    }
  };

  useEffect(() => {
    if (state?.success) {
      sessionStorage.setItem(
        "project_info",
        JSON.stringify({
          description: state.description,
          info: state.info,
        })
      );
      router.push(`/service/project/new?from=session`);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <MorphingPopover
      transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
      open={isOpen}
      onOpenChange={setIsOpen}
      variants={{
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      }}
    >
      <MorphingPopoverTrigger className="h-8 items-center rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-black text-white hover:bg-black/65 transition-colors duration-200 focus-visible:ring-0 hidden md:inline-flex">
        <motion.span layoutId={`popover-label-${uniqueId}`} className="text-sm">
          AI로 만들기
        </motion.span>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        style={{ transformOrigin: "top right" }}
        className="overflow-visible absolute top-0 right-0 origin-top-right rounded-xl border border-zinc-950/10 bg-white p-0 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] dark:bg-zinc-700"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10"
          animate={{
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <GlowEffect colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]} mode="colorShift" blur="medium" duration={4} />
        </motion.div>
        <div className="relative h-[200px] w-[364px]">
          <form action={handleFormSubmit} className="flex h-full flex-col">
            <motion.span
              layoutId={`popover-label-${uniqueId}`}
              aria-hidden="true"
              style={{
                opacity: note ? 0 : 1,
              }}
              className="absolute top-3 left-4 text-sm text-zinc-500 select-none pointer-events-none dark:text-zinc-400"
            >
              만들고 싶은 앱/웹의 구체적인 설명 혹은 요구사항을 적어주세요.
            </motion.span>
            <textarea
              name="description"
              className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
              autoFocus
              onChange={(e) => setNote(e.target.value)}
            />
            <div key="close" className="flex justify-between py-3 pr-4 pl-2">
              <button
                type="button"
                className="flex items-center rounded-lg bg-white px-2 py-1 text-sm text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
                onClick={closeMenu}
                aria-label="Close popover"
              >
                <ArrowLeftIcon size={16} className="text-zinc-900 dark:text-zinc-100" />
              </button>
              <button
                className="relative ml-1 flex h-8 shrink-0 scale-100 appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors select-none hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
                type="submit"
                aria-label="Submit note"
                onClick={() => {
                  setIsVisible(true);
                }}
              >
                제출
              </button>
            </div>
          </form>
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}
