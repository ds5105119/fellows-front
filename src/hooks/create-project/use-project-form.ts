"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createFile, createProject } from "@/hooks/fetch/project";
import { stepsMeta } from "@/components/resource/project";
import {
  type CreateERPNextProject,
  createERPNextProjectSchema,
  ProjectInfoEstimateResponse,
  erpNextFileSchema,
  type ERPNextFile,
} from "@/@types/service/project";
import { getSSECPresignedPutUrl, uploadFileToSSECPresignedUrl } from "@/hooks/fetch/presigned";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const isFulfilled = <T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> => result.status === "fulfilled";
const isRejected = <T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult => result.status === "rejected";

export function useProjectForm(description?: string, info?: ProjectInfoEstimateResponse) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const form = useForm<CreateERPNextProject>({
    resolver: zodResolver(createERPNextProjectSchema),
    defaultValues: createERPNextProjectSchema.parse({
      custom_project_title: info?.custom_project_title ?? "",
      custom_project_summary: description ?? "",
      custom_readiness_level: info?.custom_readiness_level ?? "idea",
      custom_platforms: info?.custom_platforms?.map((p) => ({ platform: p })) ?? [],
      custom_project_method: info?.custom_project_method,
      custom_nocode_platform: info?.custom_nocode_platform,
      custom_features: [],
      custom_preferred_tech_stacks: [],
      custom_design_urls: [],
      custom_maintenance_required: false,
    }),
    mode: "onChange",
  });

  useEffect(() => {
    if (info || description) {
      form.reset(
        createERPNextProjectSchema.parse({
          custom_project_title: info?.custom_project_title ?? "",
          custom_project_summary: description ?? "",
          custom_readiness_level: info?.custom_readiness_level ?? "idea",
          custom_platforms: info?.custom_platforms?.map((p) => ({ platform: p })) ?? [],
          custom_project_method: info?.custom_project_method,
          custom_nocode_platform: info?.custom_nocode_platform,
          custom_features: [],
          custom_preferred_tech_stacks: [],
          custom_design_urls: [],
          custom_maintenance_required: false,
        })
      );
    }
  }, [info, description]);

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
    const isZodValid = await trigger(currentStepFields, { shouldFocus: true });

    if (!currentStepMeta?.uiRequiredFields) return isZodValid;

    const currentValues = getValues();
    const isUiValid = currentStepMeta.uiRequiredFields.every((fieldName) => {
      const value = currentValues[fieldName];
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
    async (values: CreateERPNextProject) => {
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
        const project = await createProject(values);
        if (!project) throw new Error("Project creation failed");

        const persistFileMetadata = async (
          projectName: string,
          payload: Omit<ERPNextFile, "creation" | "modified"> & Record<string, unknown>,
          attempt = 0
        ): Promise<void> => {
          try {
            await createFile({ projectId: projectName, filePayload: payload });
          } catch (metadataError) {
            if (attempt >= 2) {
              throw metadataError;
            }
            await persistFileMetadata(projectName, payload, attempt + 1);
          }
        };

        const uploadResults = pendingFiles.length
          ? await Promise.allSettled(
              pendingFiles.map(async (file, index) => {
                try {
                  const presigned = await getSSECPresignedPutUrl("project", project.custom_project_title ?? "None");
                  const baseFileRecord = erpNextFileSchema.parse({
                    file_name: file.name,
                    key: presigned.key,
                    algorithm: "AES256",
                    sse_key: presigned.sse_key,
                    uploader: "user",
                    project: project.project_name,
                  });

                  await uploadFileToSSECPresignedUrl({ file, presigned });
                  const fileRecord = {
                    ...baseFileRecord,
                    file_size: file.size,
                    content_type: file.type || undefined,
                    attached_to_doctype: "Project",
                    attached_to_name: project.project_name,
                    folder: "Home/Attachments",
                    is_private: 1,
                  };

                  await persistFileMetadata(project.project_name, fileRecord);
                  return { index, name: file.name };
                } catch (error) {
                  console.error(`File upload error (${file.name}):`, error);
                  throw { index, name: file.name, error };
                }
              })
            )
          : [];

        const successfulResults = uploadResults.filter(isFulfilled).map((result) => result.value);
        const failedResults = uploadResults.filter(isRejected).map((result) => result.reason as { index: number; name: string });

        if (failedResults.length > 0) {
          const failedFileNames = failedResults.map((item, idx) => item?.name ?? `파일 ${idx + 1}`);
          toast.error(`다음 파일은 업로드에 실패했어요: ${failedFileNames.join(", ")}`);
        }

        if (successfulResults.length > 0) {
          toast.success(`${successfulResults.length}개의 파일이 업로드되었습니다.`);
        }

        if (pendingFiles.length === 0 || successfulResults.length > 0) {
          toast.success("프로젝트 정보가 성공적으로 저장되었습니다.");
        }

        reset();
        const failedIndexSet = new Set(failedResults.map((result) => result.index));
        setPendingFiles(failedIndexSet.size > 0 ? pendingFiles.filter((_, idx) => failedIndexSet.has(idx)) : []);

        router.push(`/service/project/${project.project_name}`);
        router.refresh();
      } catch (error) {
        console.error("Project creation error:", error);
        toast.error("프로젝트 저장 중 오류가 발생했어요");
      } finally {
        setIsLoading(false);
      }
    },
    [isStepping, trigger, router, reset, pendingFiles]
  );

  // 제출 버튼 클릭 핸들러
  const handleSubmitClick = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  const isNextDisabled = isStepping || currentStepFields.some((field) => errors[field as keyof CreateERPNextProject]);

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
    pendingFiles,
    setPendingFiles,
  };
}
