"use client"

import { Fullscreen } from "lucide-react"
import { Button } from "@/components/ui/button"
import BreathingSparkles from "@/components/resource/breathingsparkles"
import MarkdownPreview from "@/components/ui/markdownpreview"
import type { ERPNextProject } from "@/@types/service/project"

interface AIEstimateProps {
  project: ERPNextProject
  onFullscreen: () => void
}

export function AIEstimate({ project, onFullscreen }: AIEstimateProps) {
  return (
    <div className="w-full items-center justify-between pt-4 pb-3 px-5 md:px-8 flex">
      <div className="w-full flex flex-col space-y-3 pt-2">
        <div className="w-full flex justify-between">
          <div className="w-full flex items-center space-x-2">
            <BreathingSparkles />
            <span className="text-lg font-bold">AI 견적</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreen}
            className="hover:bg-blue-500/10 border-0 focus-visible:ring-0"
          >
            <Fullscreen className="!size-5" />
          </Button>
        </div>

        <div className="w-full">
          {project.custom_ai_estimate && (
            <div className="w-full max-w-full pt-2 prose prose-h2:text-base prose-p:text-sm prose-a:text-sm">
              <MarkdownPreview loading={false}>{project.custom_ai_estimate}</MarkdownPreview>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
