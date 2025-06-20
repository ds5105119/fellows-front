"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/hooks/fetch/project";
import { stepsMeta } from "@/components/resource/project";
import { type UserERPNextProject, userERPNextProjectSchema } from "@/@types/service/project";

const initialProjectInfo = userERPNextProjectSchema.parse({
  custom_project_title: "",
  custom_project_summary: "",
  custom_readiness_level: "idea",
  custom_platforms: [],
  custom_features: [],
  custom_preferred_tech_stacks: [],
  custom_design_urls: [],
  custom_maintenance_required: false,
  custom_project_status: "draft",
});

export function useProjectForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepping, setIsStepping] = useState(false);

  const form = useForm<UserERPNextProject>({
    resolver: zodResolver(userERPNextProjectSchema),
    defaultValues: initialProjectInfo,
    mode: "onChange",
  });

  const {
    trigger,
    getValues,
    reset,
    formState: { errors, isDirty, isValid },
  } = form;

  const totalSteps = stepsMeta.length;
  const currentStepMeta = stepsMeta[currentStep - 1];
  const currentStepFields = currentStepMeta?.fields || [];

  const validateCurrentStep = useCallback(async () => {
    const isZodValid = await trigger(currentStepFields as string[], { shouldFocus: true });

    if (!currentStepMeta?.uiRequiredFields) return isZodValid;

    const currentValues = getValues();
    const isUiValid = currentStepMeta.uiRequiredFields.every((fieldName) => {
      const value = currentValues[fieldName as keyof UserERPNextProject];
      return value !== undefined && value !== null && (typeof value !== "string" || value.trim() !== "") && (!Array.isArray(value) || value.length > 0);
    });

    return isZodValid && isUiValid;
  }, [trigger, currentStepFields, currentStepMeta, getValues]);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setIsStepping(true);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);

      setTimeout(() => setIsStepping(false), 100);
    }
  }, [currentStep, totalSteps]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setIsStepping(true);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);

      setTimeout(() => setIsStepping(false), 100);
    }
  }, [currentStep]);

  const handleNext = useCallback(
    async (event?: React.MouseEvent) => {
      event?.preventDefault();

      const isValid = await validateCurrentStep();

      if (isValid) {
        goToNextStep();
      } else {
        toast.error("입력 내용을 다시 확인해주세요.");
      }
    },
    [validateCurrentStep, goToNextStep]
  );

  const handlePrev = useCallback(
    (event?: React.MouseEvent) => {
      event?.preventDefault();
      goToPrevStep();
    },
    [goToPrevStep]
  );

  // 폼 제출 함수 - react-hook-form의 handleSubmit과 함께 사용
  const onSubmit = useCallback(
    async (values: UserERPNextProject) => {
      if (isStepping) {
        return;
      }

      // isDirty 체크를 제거하거나 완화 - 사용자가 데이터를 입력했다면 제출 허용
      const hasRequiredData = values.custom_project_title && values.custom_project_summary;
      if (!hasRequiredData) {
        toast.error("프로젝트 제목과 요약을 입력해주세요.");
        return;
      }

      const isFormValid = await trigger();
      if (!isFormValid) {
        toast.error("입력 내용을 다시 확인해주세요.");
        return;
      }

      setIsLoading(true);
      try {
        console.log("Creating project with values:", values);
        const project = await createProject(values);
        if (!project) throw new Error("Project creation failed");

        toast.success("프로젝트 정보가 성공적으로 저장되었습니다.");
        router.push(`/service/project/${project.project_name}/detail`);
        router.refresh();
        reset(initialProjectInfo);
      } catch (error) {
        console.error("Project creation error:", error);
        toast.error("프로젝트 저장 중 오류가 발생했어요");
      } finally {
        setIsLoading(false);
      }
    },
    [isStepping, trigger, router, reset]
  );

  // 제출 버튼 클릭 핸들러
  const handleSubmitClick = useCallback(() => {
    console.log("Submit button clicked");
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  const isNextDisabled = isStepping || currentStepFields.some((field) => errors[field as keyof UserERPNextProject]);

  // 제출 버튼 비활성화 조건을 완화
  const isSubmitDisabled = isLoading || isStepping || !isValid;

  return {
    form,
    currentStep,
    totalSteps,
    currentStepMeta,
    isLoading,
    isStepping,
    isNextDisabled,
    isSubmitDisabled,
    isDirty,
    isValid,
    handleNext,
    handlePrev,
    handleSubmitClick,
    onSubmit,
  };
}
