"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ProjectFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  isStepping: boolean;
  isNextDisabled: boolean;
  isSubmitDisabled: boolean;
  onNext: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
  onSubmit: () => void;
  showTermsPrompt?: boolean;
  onTermsAgreeAndNext?: () => void;
}

export function ProjectFormNavigation({
  currentStep,
  totalSteps,
  isLoading,
  isStepping,
  isNextDisabled,
  isSubmitDisabled,
  onNext,
  onPrev,
  onSubmit,
  showTermsPrompt = false,
  onTermsAgreeAndNext,
}: ProjectFormNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (showTermsPrompt && currentStep === 1) {
          if (onTermsAgreeAndNext) {
            onTermsAgreeAndNext();
          }
        } else if (currentStep < totalSteps) {
          onNext();
        } else {
          onSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTermsPrompt, currentStep, onTermsAgreeAndNext, onNext, onSubmit]);

  return (
    <div className="w-full sticky bottom-0 z-20 px-5 sm:px-8">
      <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />

      <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
        {currentStep > 1 && (
          <Button
            type="button"
            className="flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold"
            variant="secondary"
            onClick={onPrev}
            disabled={isLoading || isStepping}
          >
            이전
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            className="flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold"
            type="button"
            onClick={showTermsPrompt ? onTermsAgreeAndNext : onNext}
            disabled={isLoading || isNextDisabled}
          >
            {showTermsPrompt && currentStep === 1 ? "약관에 동의한 뒤 계속하기" : "다음"}
          </Button>
        ) : (
          <Button
            className="flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold"
            type="button"
            disabled={isSubmitDisabled}
            onClick={onSubmit}
          >
            {isLoading ? "저장 중..." : "프로젝트 만들기"}
          </Button>
        )}
      </div>
    </div>
  );
}
