"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useRef, useState, useCallback } from "react";
import CreateProjectFormStep1 from "./createprojectstep1";
import CreateProjectFormStep2 from "./createprojectstep2";
import CreateProjectSide from "./createprojectside";
import { useProjectForm } from "@/hooks/create-project/use-project-form";
import { useFeatureRecommendation } from "@/hooks/create-project/use-feature-recommendation";
import { ProjectFormNavigation } from "./createformnavigation";
import { CreateProjectTermsSection } from "./createprojecttermssection";
import { RecommendationLoading } from "./recommandationloading";
import { Loader2 } from "lucide-react";
import { ProjectInfoEstimateResponse } from "@/@types/service/project";

export default function CreateProject({ description, info }: { description?: string; info?: ProjectInfoEstimateResponse }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isReachedEnd, setIsReachedEnd] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPrompt, setShowTermsPrompt] = useState(false);

  const { form, currentStep, totalSteps, currentStepMeta, isLoading, isStepping, isNextDisabled, isSubmitDisabled, handleNext, handlePrev, handleSubmitClick } =
    useProjectForm(description, info);

  const { isSuccess, isRecommending, hasCompleted, handleRecommendAgain } = useFeatureRecommendation(form, currentStep);

  // 직접 Intersection Observer 구현
  const checkVisibility = useCallback(() => {
    const target = targetRef.current;
    if (!target) {
      setIsReachedEnd(false);
      return;
    }
    const rect = target.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight - 92;
    setIsReachedEnd(isVisible);
  }, []);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      checkVisibility();
    };
    const handleResize = () => {
      checkVisibility();
    };

    // 초기 체크
    checkVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkVisibility]);

  // 스텝 변경 시 강제로 재체크
  useEffect(() => {
    const timer = setTimeout(() => {
      checkVisibility();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, checkVisibility]);

  useEffect(() => {
    if (!isSuccess && !isRecommending) {
      handlePrev();
    }
  }, [isSuccess, isRecommending]);

  useEffect(() => {
    if (isLoading) window.scrollTo(0, 0);
  }, [isLoading]);

  const scrollToEnd = () => {
    const target = targetRef.current;
    if (!target) return;
    const maxScroll = target.offsetTop + target.offsetHeight - window.innerHeight + 95;
    const nextScrollTop = Math.min(window.scrollY + 500, maxScroll);
    window.scrollTo({
      top: nextScrollTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleNextWithScroll = (event?: React.MouseEvent) => {
    if (!isReachedEnd) {
      scrollToEnd();
      return;
    }

    // 약관 미동의 시 프롬프트 표시
    if (termsAccepted === false && currentStep === 1) {
      setShowTermsPrompt(true);
      return;
    }

    handleNext(event);
  };

  const handleTermsAgreeAndNext = () => {
    setTermsAccepted(true);
    setShowTermsPrompt(false);
    // 약간의 딜레이 후 다음 단계로
    setTimeout(() => {
      handleNext();
    }, 100);
  };

  const handleSubmitWithScroll = () => {
    if (!isReachedEnd) {
      scrollToEnd();
      return;
    }
    handleSubmitClick();
  };

  if (isLoading) {
    return (
      <div className="fixed w-full h-full top-0 left-0 z-50 bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          {/* Loading */}
          <div className="space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">저장 중</p>
          </div>
        </div>
      </div>
    );
  }

  if (isRecommending) {
    return (
      <div className="flex w-full h-full min-h-screen">
        <div className="hidden xl:flex h-full flex-col max-w-md shrink-0 scrollbar-hide pl-20 pr-10">
          <CreateProjectSide />
        </div>
        <div className="flex flex-col w-full mx-auto xl:mx-0 lg:w-xl h-full scrollbar-hide shrink-0">
          <RecommendationLoading currentStep={currentStep} totalSteps={totalSteps} isRecommanding={isRecommending} hasCompleted={hasCompleted} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full min-h-screen">
      <div className="hidden xl:flex h-full flex-col max-w-md shrink-0 scrollbar-hide pl-20 pr-10">
        <CreateProjectSide />
      </div>
      <div className="flex flex-col w-full mx-auto xl:mx-0 lg:w-xl h-full scrollbar-hide shrink-0">
        <div className="w-full px-5 md:px-8 py-6 md:py-10">
          <div className="mb-10 flex items-end justify-between">
            <div className="w-full">
              <p className="text-sm font-medium text-blue-600">{`Step ${currentStep} / ${totalSteps}`}</p>
              <p className="text-2xl md:text-3xl font-bold mt-3">{currentStepMeta?.title || "정보 입력"}</p>
              <p className="text-sm md:text-base font-normal text-muted-foreground mt-2 whitespace-pre-wrap">{currentStepMeta.description}</p>
            </div>
            {currentStep === 2 && (
              <Button type="button" onClick={handleRecommendAgain} disabled={isRecommending} className="font-semibold text-background">
                다시 추천받기
              </Button>
            )}
          </div>

          <Form {...form}>
            <form className="flex flex-col gap-6">
              {currentStep === 1 && <CreateProjectFormStep1 form={form} />}
              {currentStep === 2 && <CreateProjectFormStep2 form={form} />}
            </form>
          </Form>

          {currentStep === 1 && <CreateProjectTermsSection termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />}
        </div>

        <div ref={targetRef} className="relative grow h-1" />

        <ProjectFormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLoading={isLoading}
          isStepping={isStepping}
          isNextDisabled={isNextDisabled}
          isSubmitDisabled={isSubmitDisabled}
          onNext={handleNextWithScroll}
          onPrev={handlePrev}
          onSubmit={handleSubmitWithScroll}
          showTermsPrompt={showTermsPrompt}
          onTermsAgreeAndNext={handleTermsAgreeAndNext}
        />
      </div>
    </div>
  );
}
