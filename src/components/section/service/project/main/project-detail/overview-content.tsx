"use client"

import { ProjectHeader } from "./project-header"
import { ProjectBasicInfo } from "./project-basic-info"
import { ProjectStatus } from "./project-status"
import { ProjectDetails } from "./project-details"
import { AIEstimate } from "./ai-estimate"
import { ProjectActions } from "./project-actions"
import { ProjectNotices } from "./project-notices"
import type { ERPNextProject } from "@/@types/service/project"

interface OverviewContentProps {
  project: ERPNextProject
  valueToggle: boolean
  onValueToggle: () => void
  onCopy: () => void
  onFullscreen: () => void
  onSubmit: () => void
  onCancelSubmit: () => void
}

export function OverviewContent({
  project,
  valueToggle,
  onValueToggle,
  onCopy,
  onFullscreen,
  onSubmit,
  onCancelSubmit,
}: OverviewContentProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <ProjectHeader project={project} />
      <ProjectBasicInfo project={project} onCopy={onCopy} />
      <ProjectStatus project={project} />
      <ProjectDetails project={project} valueToggle={valueToggle} onValueToggle={onValueToggle} />
      <AIEstimate project={project} onFullscreen={onFullscreen} />
      <ProjectActions project={project} onSubmit={onSubmit} onCancelSubmit={onCancelSubmit} />
      <ProjectNotices />
    </div>
  )
}
