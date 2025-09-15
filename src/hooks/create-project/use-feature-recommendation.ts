import { useState, useEffect, useRef } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useGetEstimateFeatures } from "@/hooks/fetch/project";
import { CreateERPNextProject } from "@/@types/service/project";
import { categorizedFeatures } from "@/components/resource/project";

export function useFeatureRecommendation(form: UseFormReturn<CreateERPNextProject>) {
  const [isRecommending, setIsRecommending] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const timeoutRefs = useRef<{
    completion?: NodeJS.Timeout;
    recommending?: NodeJS.Timeout;
  }>({});

  const fetchStartTime = useRef<number | null>(null);

  const watchedFields = useWatch({
    name: ["custom_project_title", "custom_project_summary", "custom_readiness_level", "custom_platforms", "custom_project_method", "custom_nocode_platform"],
    control: form.control,
  });

  const estimateFeatures = useGetEstimateFeatures({
    project_name: watchedFields[0] || "",
    project_summary: watchedFields[1] || "",
    readiness_level: watchedFields[2] || "idea",
    platforms: watchedFields[3]?.map((p) => p.platform) || [],
    project_method: watchedFields[4] || "",
    nocode_platform: watchedFields[5] || "",
  });

  const handleRecommend = async () => {
    setIsRecommending(false);
    setHasCompleted(false);
    Object.values(timeoutRefs.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
    timeoutRefs.current = {};
    fetchStartTime.current = null;

    fetchStartTime.current = Date.now();
    await estimateFeatures.fetchData();
  };

  // Handle loading state
  useEffect(() => {
    if (estimateFeatures?.loading && !hasCompleted) {
      setIsRecommending(true);
      window.scrollTo(0, 0);
    }
  }, [estimateFeatures?.loading, hasCompleted]);

  // Handle completion and subsequent state changes
  useEffect(() => {
    if (!estimateFeatures?.loading && isRecommending && fetchStartTime.current) {
      const fetchEndTime = Date.now();
      const fetchDuration = fetchEndTime - fetchStartTime.current;
      const remainingTime = Math.max(0, 3500 - fetchDuration);

      timeoutRefs.current.completion = setTimeout(() => {
        setHasCompleted(true);

        timeoutRefs.current.recommending = setTimeout(() => {
          setIsRecommending(false);
        }, 3500);
      }, remainingTime);
    }
  }, [estimateFeatures?.loading, isRecommending]);

  // Apply recommendations to form
  useEffect(() => {
    if (hasCompleted && estimateFeatures?.data?.feature_list?.length) {
      if (estimateFeatures.data.feature_list.length === 1 && estimateFeatures.data.feature_list[0] === "false") {
        setIsSuccess(false);
        toast.warning(`프로젝트 이름 및 설명이 부족해요.`);
      } else {
        setIsSuccess(true);
        const features = estimateFeatures.data.feature_list.map((feature) => ({
          doctype: "Features",
          feature,
        }));
        const project_method = form.getValues("custom_project_method");
        const nocode_platform = form.getValues("custom_nocode_platform");

        const alwaysOn = categorizedFeatures.flatMap((category) => {
          if (!category) return [];

          if (project_method === "code") {
            return category.items.filter((item) => item.alwaysOn.code).map((item) => ({ doctype: "Features", feature: item.title }));
          } else if (project_method === "nocode") {
            return nocode_platform
              ? category.items
                  .filter((item) => item.alwaysOn.nocode[nocode_platform as "imweb" | "framer" | "webflow" | "wordpress" | "bubble"])
                  .map((item) => ({ doctype: "Features", feature: item.title }))
              : category.items.filter((item) => item.alwaysOn.nocode.other).map((item) => ({ doctype: "Features", feature: item.title }));
          } else if (project_method === "shop") {
            return nocode_platform
              ? category.items
                  .filter((item) => item.alwaysOn.shop[nocode_platform as "shopify" | "imweb" | "cafe24"])
                  .map((item) => ({ doctype: "Features", feature: item.title }))
              : category.items.filter((item) => item.alwaysOn.shop.other).map((item) => ({ doctype: "Features", feature: item.title }));
          }

          return [];
        });

        const allFeatures = [...features, ...alwaysOn];
        form.setValue("custom_features", []);
        form.setValue("custom_features", allFeatures);
      }
    }
  }, [hasCompleted, estimateFeatures?.data?.feature_list, form]);

  // Handle success message visibility
  useEffect(() => {
    if (!isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(true);
      }, 100); // Consider making this duration more meaningful if needed
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Cleanup timeouts
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
    hasCompleted,
    handleRecommend,
  };
}
