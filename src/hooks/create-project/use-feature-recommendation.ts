import { useState, useEffect, useRef } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useGetEstimateFeatures } from "@/hooks/fetch/project";
import { CreateERPNextProject } from "@/@types/service/project";

export function useFeatureRecommendation(form: UseFormReturn<CreateERPNextProject>, currentStep: number) {
  const [isRecommending, setIsRecommending] = useState(false);
  const [isFirstTimeInStep2, setIsFirstTimeInStep2] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const timeoutRefs = useRef<{
    recommend?: NodeJS.Timeout;
    success?: NodeJS.Timeout;
    fetch?: NodeJS.Timeout;
  }>({});

  const watchedFields = useWatch({
    name: ["custom_project_title", "custom_project_summary", "custom_readiness_level", "custom_platforms"],
    control: form.control,
  });

  const estimateFeatures = useGetEstimateFeatures({
    project_name: watchedFields[0] || "",
    project_summary: watchedFields[1] || "",
    readiness_level: watchedFields[2] || "idea",
    platforms: watchedFields[3]?.map((p) => p.platform) || [],
  });

  const handleRecommendAgain = async () => {
    setIsRecommending(false);
    setHasCompleted(false);
    Object.values(timeoutRefs.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
    timeoutRefs.current = {};

    await estimateFeatures.fetchData();
  };

  // Start recommendation when entering step 2 for the first time
  useEffect(() => {
    if (isFirstTimeInStep2 && currentStep === 2) {
      setIsFirstTimeInStep2(false);
      estimateFeatures.fetchData();
    }
  }, [isFirstTimeInStep2, currentStep]);

  // Handle loading state
  useEffect(() => {
    if (estimateFeatures?.loading && !isRecommending && !hasCompleted) {
      setIsRecommending(true);
      window.scrollTo(0, 0);
    }
  }, [estimateFeatures?.loading, isRecommending, hasCompleted]);

  // Handle completion
  useEffect(() => {
    if (!estimateFeatures?.loading && isRecommending && estimateFeatures?.data) {
      timeoutRefs.current.recommend = setTimeout(() => {
        setIsRecommending(false);
        setHasCompleted(true);
      }, 3500);
    }
  }, [estimateFeatures?.loading, estimateFeatures?.data, isRecommending]);

  // Apply recommendations to form
  useEffect(() => {
    if (hasCompleted && estimateFeatures?.data?.feature_list?.length && estimateFeatures.data.feature_list.length > 0) {
      if (estimateFeatures.data.feature_list.length == 1 && estimateFeatures.data.feature_list[0] == "false") {
        setIsSuccess(false);
        toast.warning(`프로젝트 이름 및 설명이 부족해요.`);
      } else {
        setIsSuccess(true);

        const features = estimateFeatures.data.feature_list.map((feature) => ({
          doctype: "Features" as const,
          feature,
        }));

        form.setValue("custom_features", features);
      }
    }
  }, [hasCompleted, estimateFeatures?.data?.feature_list, form]);

  // Handle completion
  useEffect(() => {
    if (!isSuccess) {
      timeoutRefs.current.success = setTimeout(() => {
        setIsSuccess(true);
      }, 100);
    }
  }, [isSuccess]);

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  return {
    isSuccess,
    isRecommending,
    handleRecommendAgain,
  };
}
