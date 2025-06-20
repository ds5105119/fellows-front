"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useRef } from "react";
import { ERPNextProject } from "@/@types/service/project";
import { useEstimateProject } from "@/hooks/fetch/project";

interface Props {
  project: ERPNextProject;
}

export default function ProjectEstimator({ project }: Props) {
  const initialized = useRef(false);
  const { markdown, isLoading, startEstimate } = useEstimateProject(project.project_name, project.custom_ai_estimate || "");

  useEffect(() => {
    if (!initialized.current && !project.custom_ai_estimate) {
      initialized.current = true;
      startEstimate();
    }
  }, [project.custom_ai_estimate, startEstimate]);

  return (
    <div className="w-full max-w-full flex flex-col space-y-6">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI 견적</h2>
        <button
          onClick={startEstimate}
          disabled={isLoading}
          className="flex items-center space-x-2 text-white text-sm font-medium bg-black hover:bg-neutral-700 transition-colors rounded-md duration-200 h-9 px-3"
        >
          <BreathingSparkles size={18} />
          <p>견적 다시 작성하기</p>
        </button>
      </div>
      <MarkdownPreview loading={isLoading}>{markdown}</MarkdownPreview>
    </div>
  );
}
