"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ERPNextProjectType } from "@/@types/service/project";
import { useEstimateProject } from "@/hooks/fetch/project";

interface Props {
  project: ERPNextProjectType;
}

export default function ProjectEstimator({ project }: Props) {
  const initialized = useRef(false);
  const { ctrl, setCtrl, markdown, isLoading, remaining, estimate } = useEstimateProject(project.project_name, project.custom_ai_estimate || "");

  useEffect(() => {
    if (!initialized.current && !project.custom_ai_estimate) {
      initialized.current = true;
      estimate();
    }
  }, [project.custom_ai_estimate, estimate]);

  useEffect(() => {
    return () => {
      if (ctrl) {
        ctrl.abort();
        setCtrl(null);
      }
    };
  }, [ctrl, setCtrl]);

  return (
    <div className="flex flex-col w-full h-full space-y-4 overflow-x-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-full flex flex-col p-8 space-y-6">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold">AI 견적</h2>
            <Button onClick={estimate} disabled={isLoading || remaining <= 0} className="bg-black hover:bg-neutral-700 transition-colors duration-200">
              <BreathingSparkles />
              {remaining <= 0 ? "제한 초과" : isLoading ? "견적 생성 중..." : "견적 다시 작성하기"}
            </Button>
          </div>
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
            <MarkdownPreview loading={isLoading}>{markdown}</MarkdownPreview>
          </div>
        </div>
      </div>
    </div>
  );
}
