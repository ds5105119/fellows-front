"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col w-full h-full space-y-4 overflow-x-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="w-full max-w-full h-full flex flex-col p-8 space-y-6">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold">AI 견적</h2>
            <Button onClick={startEstimate} disabled={isLoading} className="bg-black hover:bg-neutral-700 transition-colors duration-200">
              <BreathingSparkles />
              견적 다시 작성하기
            </Button>
          </div>
          <MarkdownPreview loading={isLoading}>{markdown}</MarkdownPreview>
        </div>
      </div>
    </div>
  );
}
