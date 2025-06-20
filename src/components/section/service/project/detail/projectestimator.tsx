"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ERPNextProject } from "@/@types/service/project";
import { useEstimateProject } from "@/hooks/fetch/project";
import { cn } from "@/lib/utils";

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
          <div
            className={cn(
              "prose prose-sm md:prose-base max-w-none",
              "prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
              "prose-a:text-primary prose-img:rounded-md",
              "prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl",
              "[&_pre]:whitespace-pre-wrap [&_pre]:break-words",
              "[&_code]:break-words",
              "[&_*]:max-w-full [&_*]:break-words [&_*]:overflow-hidden",
              "min-w-0 break-words overflow-x-hidden"
            )}
          >
            <MarkdownPreview loading={isLoading}>{markdown}</MarkdownPreview>
          </div>
        </div>
      </div>
    </div>
  );
}
