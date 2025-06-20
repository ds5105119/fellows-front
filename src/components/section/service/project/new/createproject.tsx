"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useRef } from "react";
import CreateProjectFormStep1 from "./createprojectstep1";
import CreateProjectFormStep2 from "./createprojectstep2";
import CreateProjectSide from "./createprojectside";
import { useProjectForm } from "@/hooks/create-project/use-project-form";
import { useFeatureRecommendation } from "@/hooks/create-project/use-feature-recommendation";
import { ProjectFormNavigation } from "./createformnavigation";
import { CreateProjectTermsSection } from "./createprojecttermssection";
import { RecommendationLoading } from "./recommandationloading";
import { useInView } from "framer-motion";

export default function CreateProject() {
  const targetRef = useRef<HTMLDivElement>(null);
  const isReachedEnd = useInView(targetRef, { margin: "3px 0px 0px 0px", amount: 0 });

  const { form, currentStep, totalSteps, currentStepMeta, isLoading, isStepping, isNextDisabled, isSubmitDisabled, handleNext, handlePrev, handleSubmitClick } =
    useProjectForm();

  const { isSuccess, isRecommending, handleRecommendAgain } = useFeatureRecommendation(form, currentStep);

  useEffect(() => {
    if (!isSuccess && !isRecommending) {
      handlePrev();
    }
  }, [isSuccess, isRecommending]);

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
    handleNext(event);
  };

  const handleSubmitWithScroll = () => {
    if (!isReachedEnd) {
      scrollToEnd();
      return;
    }
    handleSubmitClick();
  };

  if (isRecommending) {
    return (
      <div className="flex w-full h-full min-h-screen">
        <div className="hidden xl:flex h-full flex-col max-w-md shrink-0 scrollbar-hide pl-20 pr-10">
          <CreateProjectSide />
        </div>
        <div className="flex flex-col w-full mx-auto xl:mx-0 lg:w-xl h-full scrollbar-hide shrink-0">
          <RecommendationLoading currentStep={currentStep} totalSteps={totalSteps} />
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

          {currentStep === 1 && <CreateProjectTermsSection />}
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
        />
      </div>
    </div>
  );
}
