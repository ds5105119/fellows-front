"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetEstimateFeatures } from "@/hooks/fetch/project";
import { stepsMeta } from "@/components/resource/project";
import { useInView } from "framer-motion";
import { Session } from "next-auth";
import { UserERPNextProjectType, UserERPNextProjectZod, ERPNextProjectType, ERPNextProjectZod } from "@/@types/service/erpnext";
import AIRecommendSkeleton from "@/components/skeleton/airecommendskeleton";
import CreateProjectFormStep1 from "./createprojectstep1";
import CreateProjectFormStep2 from "./createprojectstep2";
import CreateProjectFormStep3 from "./createprojectstep3";
import CreateProjectSide from "./createprojectside";

export default function CreateProject({ session }: { session: Session | null }) {
  const router = useRouter();
  const initalProjectInfo = UserERPNextProjectZod.parse({ custom_project_title: "", custom_project_summary: "" });
  const form = useForm<UserERPNextProjectType>({
    resolver: zodResolver(UserERPNextProjectZod),
    defaultValues: initalProjectInfo,
    mode: "onChange",
  });
  const {
    setValue,
    reset,
    formState: { errors, isDirty, isValid: isFormValid },
    trigger,
    getValues,
    handleSubmit,
  } = form;

  const [currentStep, setCurrentStep] = useState(1);
  const [firstInSecondStop, setFirstInSecondStop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const isReachedEnd = useInView(targetRef, { margin: "-92px 0px 0px 0px" });

  const totalSteps = stepsMeta.length;
  const currentStepMeta = useMemo(() => stepsMeta[currentStep - 1], [currentStep]);
  const currentStepFields = useMemo(() => currentStepMeta?.fields || [], [currentStepMeta]);
  const watchedCurrentStepFields = useWatch({ name: currentStepFields, control: form.control });

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

  const scrollToEnd = () => {
    const target = targetRef.current;
    if (!target) return;

    const maxScroll = target.offsetTop + target.offsetHeight - window.innerHeight + 93;
    const nextScrollTop = Math.min(window.scrollY + 500, maxScroll);

    window.scrollTo({
      top: nextScrollTop,
      left: 0,
      behavior: "smooth",
    });
  };

  // 다음
  const handleNext = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!isReachedEnd) {
      return scrollToEnd();
    }

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
      const uiRequiredFieldsEmpty = watchedCurrentStepFields.some((value) => {
        return value === undefined || value === null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0);
      });
      if (uiRequiredFieldsEmpty) return true;
    }
    return false;
  }, [errors, currentStepMeta, currentStepFields, watchedCurrentStepFields, isStepping]);

  // 기능 추가 관련

  const [isRecommend, setIsRecommend] = useState(false);
  const [isRecommandFetch, setIsRecommandFetch] = useState(false);

  const loadingStartRef = useRef<number | null>(null);
  const recommendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [estimateFeaturesData, setEstimateFeaturesData] = useState<{
    project_name: string;
    project_summary: string;
    readiness_level: string;
    platforms: string[];
  }>({
    project_name: "",
    project_summary: "",
    readiness_level: "",
    platforms: [],
  });
  const estimateFeatures = useGetEstimateFeatures({ session, ...estimateFeaturesData });
  const estimateFeaturesFields = useWatch({
    name: ["custom_project_title", "custom_project_summary", "custom_readiness_level", "custom_platforms"],
    control: form.control,
  });
  const { fetchData: estimateFeturesFetch } = estimateFeatures;

  const mergeEstimateFeatures = useCallback(() => {
    const [project_name, project_summary, readiness_level, platforms] = estimateFeaturesFields;
    const platformsList = (platforms || []).map((platform) => platform.platform);
    setEstimateFeaturesData({ project_name, project_summary, readiness_level, platforms: platformsList });
  }, [setEstimateFeaturesData, estimateFeaturesFields]);

  useEffect(() => {
    if (
      estimateFeaturesData.project_name ||
      estimateFeaturesData.project_summary ||
      estimateFeaturesData.readiness_level ||
      estimateFeaturesData.platforms.length > 0
    ) {
      estimateFeturesFetch();
    }
  }, [estimateFeaturesData, estimateFeturesFetch]);

  useEffect(() => {
    if (!isRecommend) {
      setValue("custom_features", []);

      const timer = setTimeout(() => {
        const docValue = estimateFeatures.data?.feature_list.map((p) => ({ doctype: "Features", feature: p }));
        setValue("custom_features", docValue || []);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isRecommend, estimateFeatures.data?.feature_list, setValue]);

  useEffect(() => {
    if (firstInSecondStop === true && currentStep === 2) {
      setFirstInSecondStop(false);
      mergeEstimateFeatures();
    }
  }, [firstInSecondStop, currentStep, setFirstInSecondStop, mergeEstimateFeatures]);

  useEffect(() => {
    if (estimateFeatures.loading) {
      loadingStartRef.current = Date.now();

      setIsRecommend(true);
      setIsRecommandFetch(true);
      window.scrollTo(0, 0);

      if (recommendTimeoutRef.current) clearTimeout(recommendTimeoutRef.current);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    } else {
      const now = Date.now();
      const startedAt = loadingStartRef.current ?? now;

      const elapsed = now - startedAt;
      const remainingForRecommend = Math.max(7500 - elapsed, 0);
      const remainingForFetch = Math.max(3500 - elapsed, 0);

      recommendTimeoutRef.current = setTimeout(() => {
        setIsRecommend(false);
      }, remainingForRecommend);

      fetchTimeoutRef.current = setTimeout(() => {
        setIsRecommandFetch(false);
      }, remainingForFetch);
    }
  }, [estimateFeatures.loading]);

  useEffect(() => {
    return () => {
      if (recommendTimeoutRef.current) clearTimeout(recommendTimeoutRef.current);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

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

  const preparePayload = useCallback((values: UserERPNextProjectType) => {
    const payload = { ...values };

    if (payload.custom_features) {
      const etcFeatureIndex = payload.custom_features.findIndex((f) => f.feature.startsWith("기타:"));
      if (etcFeatureIndex > -1 && payload.custom_features[etcFeatureIndex].feature.replace("기타:", "").trim() === "") {
        payload.custom_features.splice(etcFeatureIndex, 1);
      }
      if (payload.custom_features.length === 0) {
        payload.custom_features = null;
      }
    }

    return payload;
  }, []);

  const postProjectData = useCallback(async (payload: UserERPNextProjectType): Promise<ERPNextProjectType> => {
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
      return ERPNextProjectZod.parse(responseData);
    } catch {
      throw new Error("프로젝트 정보 저장에 문제가 밣생했어요.");
    }
  }, []);

  const handleSuccessfulSubmission = useCallback(
    (project: ERPNextProjectType) => {
      toast.success("프로젝트 정보가 성공적으로 저장되었습니다.");
      router.push(`/service/project/${project.project_name}`);
      router.refresh();
      reset(initalProjectInfo);
      setIsStepping(true);
    },
    [router, reset, initalProjectInfo, setIsStepping]
  );

  const onSubmit = async (values: UserERPNextProjectType) => {
    if (isStepping) return;

    if (!isReachedEnd) {
      return scrollToEnd();
    }

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
    } catch {
      toast.error("프로젝트 업데이트 중 오류가 발생했어요", {
        description: "잠시 뒤 다시 시도해 주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="hidden xl:flex h-full flex-col max-w-md shrink-0 scrollbar-hide pl-20 pr-10">
        <CreateProjectSide />
      </div>

      <div className="w-full mx-auto xl:mx-0 lg:w-xl h-full scrollbar-hide shrink-0 flex flex-col items-center">
        {!isRecommend ? (
          <div className="w-full px-5 sm:px-8 py-16 sm:py-10">
            <div className="mb-10 flex items-end justify-between">
              <div className="w-full">
                <p className="text-sm font-medium text-blue-600">{`Step ${currentStep} / ${totalSteps}`}</p>
                <p className="text-3xl font-bold mt-3">{currentStepMeta?.title || "정보 입력"}</p>
                <p className="text-base font-normal text-muted-foreground mt-2 whitespace-pre-wrap">{currentStepMeta.description}</p>
              </div>
              {currentStep === 2 && (
                <Button type="button" onClick={mergeEstimateFeatures} disabled={isRecommend} className="font-semibold text-background">
                  다시 추천받기
                </Button>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {currentStep === 1 && <CreateProjectFormStep1 form={form} />}
                {currentStep === 2 && <CreateProjectFormStep2 form={form} />}
                {currentStep === 3 && <CreateProjectFormStep3 form={form} />}
              </form>
            </Form>
          </div>
        ) : (
          <div className="w-full h-full px-5 sm:px-8 py-16 sm:py-10 flex flex-col items-center">
            <div className="mb-10 flex items-end justify-between">
              <div className="w-[80%]">
                <p className="text-sm font-medium text-blue-600">{`Step ${currentStep} / ${totalSteps}`}</p>
                <p className="text-3xl font-bold mt-3">구현에 필요한 기능을 추천하고 있어요.</p>
                <p className="text-base font-normal text-muted-foreground mt-2 whitespace-pre-wrap">프로젝트에 꼭 필요한 기능만 추천해드릴께요.</p>
              </div>
            </div>

            <div className="flex mt-24 md:mt-28 mb-64 md:mb-64">
              <AIRecommendSkeleton isLoading={isRecommandFetch} />
            </div>
          </div>
        )}

        <div ref={targetRef} />

        {!isRecommend && (
          <div className="w-full sticky bottom-0 z-20 px-5 sm:px-8">
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
                  disabled={isLoading || !isDirty || !isFormValid || isStepping} // isStepping 추가
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoading ? "저장 중..." : "프로젝트 만들기"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
