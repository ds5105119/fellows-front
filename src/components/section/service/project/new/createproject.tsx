"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProjectInfoSchema, ProjectInfoSchemaType, ProjectSchema, ProjectFileRecordsSchema, ProjectFileRecordsSchemaType } from "@/@types/service/project";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { TopProgressBar } from "@/components/animation/topprogressbar";
import { useGetEstimateFeatures } from "@/hooks/fetch/project";
import { stepsMeta } from "@/components/resource/project";
import { uploadFileToPresignedUrl, getPresignedPutUrl } from "@/hooks/fetch/presigned";
import CreateProjectFormStep1 from "./createprojectstep1";
import CreateProjectFormStep2 from "./createprojectstep2";
import CreateProjectFormStep3 from "./createprojectstep3";

export const getEnumValues = <T extends z.ZodEnum<[string, ...string[]]>>(enumType: T): z.infer<typeof enumType>[] => {
  return Object.values(enumType.Values) as z.infer<typeof enumType>[];
};

export default function CreateProject() {
  const router = useRouter();
  const initalProjectInfo = ProjectInfoSchema.parse({
    project_name: "",
    project_summary: "",
    platforms: [],
    readiness_level: "idea",
    feature_list: [],
    files: [],
    design_requirements: null,
    content_pages: null,
    preferred_tech_stack: null,
    start_date: null,
    desired_deadline: null,
    maintenance_required: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [firstInSecondStop, setFirstInSecondStop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const totalSteps = stepsMeta.length;

  const form = useForm<ProjectInfoSchemaType>({
    resolver: zodResolver(ProjectInfoSchema),
    defaultValues: initalProjectInfo,
    mode: "onChange",
  });
  const {
    setValue,
    reset,
    formState: { errors, isDirty, isValid: isFormValid },
    trigger,
    control,
    getValues,
    watch,
  } = form;

  const currentStepMeta = useMemo(() => stepsMeta[currentStep - 1], [currentStep]);
  const currentStepFields = useMemo(() => currentStepMeta?.fields || [], [currentStepMeta]);
  const watchedCurrentStepFields = watch(currentStepFields);

  // 페이지 로드/단계 변경 시 유효성 검사
  useEffect(() => {
    const validateCurrentStepOnLoad = async () => {
      if (currentStepFields.length > 0) {
        await trigger(currentStepFields, { shouldFocus: false });
      }
    };
    if (form.formState.isReady) {
      validateCurrentStepOnLoad();
    }
  }, [currentStep, currentStepFields, trigger, form.formState.isReady]);

  // isStepping 상태 관리 (스텝 변경 애니메이션 후 상태 복구, 고도화 가능)
  useEffect(() => {
    if (isStepping) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsStepping(false);
        });
      });
    }
  }, [currentStep, isStepping]);

  // 다음
  const handleNext = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    const isZodValid = await trigger(currentStepFields, { shouldFocus: true });
    let isUiValid = true;
    if (currentStepMeta?.uiRequiredFields) {
      for (const fieldName of currentStepMeta.uiRequiredFields) {
        const value = getValues(fieldName);
        if (value === undefined || value === null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) {
          isUiValid = false;
          break;
        }
      }
    }

    if (isZodValid && isUiValid) {
      if (currentStep < totalSteps) {
        setIsStepping(true);
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      if (!isZodValid) {
        toast.error("입력 내용을 다시 확인해주세요.");
      } else if (!isUiValid) {
        toast.error("현재 단계의 모든 필수 항목을 입력해주세요.");
      }
    }
  };

  // 이전
  const handlePrev = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (currentStep > 1) {
      setIsStepping(true);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const isNextButtonDisabled = useMemo(() => {
    if (isStepping) return true;

    const hasZodError = currentStepFields.some((field) => errors[field]);
    if (hasZodError) return true;

    if (currentStepMeta?.uiRequiredFields) {
      const formValues = getValues();
      const uiRequiredFieldsEmpty = currentStepMeta.uiRequiredFields.some((fieldName) => {
        const value = formValues[fieldName];
        return value === undefined || value === null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0);
      });
      if (uiRequiredFieldsEmpty) return true;
    }
    return false;
  }, [errors, currentStepMeta, currentStepFields, watchedCurrentStepFields, getValues, isStepping]);

  // 기능 추가 관련

  const [feature, setFeature] = useState<string[]>(initalProjectInfo.feature_list || []);

  // feature 배열에서 "기타:"로 시작하는 항목을 찾아 업데이트하거나, 새로 추가/제거
  const handleFeatureChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const prefix = "기타:";
    const newEtcValue = event.target.value;
    setFeature((prevFeature) => {
      let updatedFeature = [...prevFeature];
      const etcIndex = updatedFeature.findIndex((item) => item.startsWith(prefix));
      if (newEtcValue) {
        if (etcIndex !== -1) {
          updatedFeature[etcIndex] = `${prefix} ${newEtcValue}`;
        } else {
          updatedFeature.push(`${prefix} ${newEtcValue}`);
        }
      } else {
        if (etcIndex !== -1) {
          updatedFeature.splice(etcIndex, 1);
        }
      }
      return updatedFeature;
    });
  }, []);

  // feature 배열에 기능을 추가
  const handleFeatureButtonClick = useCallback((value: string) => {
    setFeature((prevFeature) => (prevFeature.includes(value) ? prevFeature.filter((item) => item !== value) : [...prevFeature, value]));
  }, []);

  // feature 상태 변경 감지
  useEffect(() => {
    setValue("feature_list", feature, { shouldDirty: true, shouldValidate: true });
  }, [feature, setValue]);

  // 날짜 선택 기능

  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });

  const handleDateSelect = useCallback(
    (range: DateRange) => {
      const start = range.from ? format(range.from, "yyyy-MM-dd") : undefined;
      const end = range.to ? format(range.to, "yyyy-MM-dd") : undefined;
      setValue("start_date", start, { shouldDirty: true, shouldValidate: true });
      setValue("desired_deadline", end, { shouldDirty: true, shouldValidate: true });
      setDateRange(range);
    },
    [setValue]
  );

  // 기능 예측 데이터 관련

  const [estimateFeaturesData, setEstimateFeaturesData] = useState<{ project_name: string; project_summary: string; readiness_level: string }>({
    project_name: "",
    project_summary: "",
    readiness_level: "",
  });
  const estimateFeatures = useGetEstimateFeatures(estimateFeaturesData);

  const mergeEstimateFeatures = useCallback(() => {
    setIsLoading(true);
    const project_name = getValues("project_name");
    const project_summary = getValues("project_summary");
    const readiness_level = getValues("readiness_level");
    setEstimateFeaturesData({ project_name, project_summary, readiness_level });
  }, [getValues, setEstimateFeaturesData]);

  useEffect(() => {
    if (estimateFeaturesData.project_name || estimateFeaturesData.project_summary || estimateFeaturesData.readiness_level) {
      estimateFeatures.fetchData();
    }
  }, [estimateFeaturesData, estimateFeatures.fetchData]);

  useEffect(() => {
    if (estimateFeatures.success) {
      setFeature(estimateFeatures.data?.feature_list || []);
    }
    setIsLoading(false);
  }, [estimateFeatures.data]);

  useEffect(() => {
    if (firstInSecondStop === true && currentStep === 2) {
      setFirstInSecondStop(false);
      mergeEstimateFeatures();
    }
  }, [firstInSecondStop, currentStep, setFirstInSecondStop, mergeEstimateFeatures]);

  // 파일 업로드 관련

  const [files, setFiles] = useState<{ record: ProjectFileRecordsSchemaType; name: string; size: number; progress: number }[]>([]);

  const uploadFiles = async (file: File) => {
    const isDuplicate = files.some((f) => f.name === file.name && f.size === file.size);
    if (isDuplicate) {
      toast.info("이미 업로드된 파일입니다.");
      return;
    }

    const presigned = await getPresignedPutUrl();
    const fileRecord = ProjectFileRecordsSchema.parse({ file_record_key: presigned.key });
    setFiles((prev) => [...prev, { record: fileRecord, name: file.name, size: file.size, progress: 0 }]);

    try {
      await uploadFileToPresignedUrl({
        file,
        presigned,
        onProgress: ({ percent }) => {
          setFiles((prev) => prev.map((f) => (f.name === file.name ? { ...f, progress: percent } : f)));
        },
      });
    } catch (err) {
      toast.warning("업로드에 실패했어요.");
    }
  };

  const handleChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFiles(file);
  };

  const handleDropupload = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFiles(file);
  };

  useEffect(() => {
    setValue(
      "files",
      files.map((f) => f.record),
      { shouldDirty: true, shouldValidate: true }
    );
  }, [files, setValue]);

  // 제출 관련

  const validateFormForSubmission = useCallback(async (): Promise<boolean> => {
    const isFormCompletelyValid = await trigger();

    // 유효성 검사 실패 시 스텝 이동
    if (!isFormCompletelyValid) {
      toast.error("입력 내용을 다시 확인해주세요. 일부 필수 항목이 누락된 것 같아요.");
      for (let i = 0; i < stepsMeta.length; i++) {
        const step = stepsMeta[i];
        const stepFields = step.fields;
        const hasErrorInStep = stepFields.some((field) => errors[field]);
        if (hasErrorInStep) {
          if (currentStep !== i + 1) {
            setIsStepping(true);
            setCurrentStep(i + 1);
          }
          window.scrollTo(0, 0);
          return false;
        }
      }
      return false;
    }

    // 유효성 검사 실패 시 스텝 이동
    for (const step of stepsMeta) {
      if (step.uiRequiredFields) {
        for (const fieldName of step.uiRequiredFields) {
          const value = getValues(fieldName);
          if (value === undefined || value === null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) {
            toast.error(`${step.title} 단계의 '${fieldName}' 필드를 포함한 모든 필수 항목을 입력해주세요.`);
            if (currentStep !== step.number) {
              setIsStepping(true);
              setCurrentStep(step.number);
            }
            window.scrollTo(0, 0);
            return false;
          }
        }
      }
    }
    return true;
  }, [trigger, errors, currentStep, getValues, setIsStepping, setCurrentStep]);

  const preparePayload = useCallback((values: ProjectInfoSchemaType): any => {
    const payload = { ...values };

    if (payload.feature_list) {
      const etcFeatureIndex = payload.feature_list.findIndex((f) => f.startsWith("기타:"));
      if (etcFeatureIndex > -1 && payload.feature_list[etcFeatureIndex].replace("기타:", "").trim() === "") {
        payload.feature_list.splice(etcFeatureIndex, 1);
      }
      if (payload.feature_list.length === 0) {
        payload.feature_list = null;
      }
    }

    return payload;
  }, []);

  const postProjectData = useCallback(async (payload: any): Promise<z.infer<typeof ProjectSchema>> => {
    const response = await fetch("/api/service/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "프로젝트 정보 저장 중 응답 분석에 실패했어요." }));
      throw new Error(errorData.message || "프로젝트 정보 저장에 문제가 밣생했어요.");
    }

    try {
      const responseData = await response.json();
      return ProjectSchema.parse(responseData);
    } catch {
      throw new Error("프로젝트 정보 저장에 문제가 밣생했어요.");
    }
  }, []);

  const handleSuccessfulSubmission = useCallback(
    (project: z.infer<typeof ProjectSchema>) => {
      toast.success("프로젝트 정보가 성공적으로 저장되었습니다.");
      router.push(`/service/project/${project.project_id}`);
      router.refresh();
      reset(initalProjectInfo);
      setFeature(initalProjectInfo.feature_list || []);
      setDateRange({ from: undefined, to: undefined });
      setIsStepping(true);
    },
    [router, reset, initalProjectInfo, setFeature, setDateRange, setIsStepping]
  );

  const onSubmit = async (values: ProjectInfoSchemaType) => {
    if (isStepping) return;

    const isFormValidForSubmission = await validateFormForSubmission();
    if (!isFormValidForSubmission) {
      return;
    }

    if (!isDirty && JSON.stringify(values) === JSON.stringify(initalProjectInfo)) {
      toast.info("변경된 내용이 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = preparePayload(values);
      const project = await postProjectData(payload);
      handleSuccessfulSubmission(project);
    } catch (error: any) {
      toast.error("프로젝트 업데이트 중 오류가 발생했어요", {
        description: "잠시 뒤 다시 시도해 주세요.",
      });
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-4 lg:grid-cols-12">
      <TopProgressBar className="col-span-full" progress={currentStep / totalSteps} />
      <div className="col-span-full lg:col-span-8 xl:col-span-6 lg:col-start-3 xl:col-start-4 w-full px-4 sm:px-8 py-10">
        <div className="mb-10 flex items-end justify-between">
          <div className="w-[80%]">
            <p className="text-sm font-medium text-blue-600">{`Step ${currentStep} / ${totalSteps}`}</p>
            <p className="text-3xl font-bold mt-3">{currentStepMeta?.title || "정보 입력"}</p>
            <p className="text-base font-normal text-muted-foreground mt-2 whitespace-pre-wrap">{currentStepMeta.description}</p>
          </div>
          {currentStep === 2 && (
            <Button type="button" onClick={mergeEstimateFeatures} disabled={estimateFeatures.loading} className="font-semibold text-background">
              {estimateFeatures.loading ? "기능 추천중..." : "다시 추천받기"}
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {currentStep === 1 && <CreateProjectFormStep1 form={form} />}
            {currentStep === 2 && (
              <CreateProjectFormStep2
                form={form}
                feature={feature}
                handleFeatureButtonClick={handleFeatureButtonClick}
                handleFeatureChange={handleFeatureChange}
              />
            )}
            {currentStep === 3 && (
              <CreateProjectFormStep3
                form={form}
                dateRange={dateRange}
                files={files}
                handleDateSelect={handleDateSelect}
                handleChangeUpload={handleChangeUpload}
                handleDropupload={handleDropupload}
              />
            )}

            <div className="sticky bottom-0 z-20">
              <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
              <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    className="flex-1 w-1/2 h-[3.75rem] rounded-2xl text-lg font-semibold"
                    variant="secondary"
                    onClick={(e) => handlePrev(e)}
                    disabled={isLoading || isStepping} // isStepping 추가
                  >
                    이전
                  </Button>
                )}
                {currentStep < totalSteps ? (
                  <Button
                    className="flex-1 w-1/2 h-[3.75rem] rounded-2xl text-lg font-semibold"
                    type="button"
                    onClick={(e) => handleNext(e)}
                    disabled={isLoading || isNextButtonDisabled} // isNextButtonDisabled에 isStepping 포함됨
                  >
                    다음
                  </Button>
                ) : (
                  <Button
                    className="flex-1 w-1/2 h-[3.75rem] rounded-2xl text-lg font-semibold"
                    type="submit"
                    disabled={isLoading || !isDirty || !isFormValid || isStepping} // isStepping 추가
                  >
                    {isLoading ? "저장 중..." : "프로젝트 만들기"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
