"use client";

import { ERPNextProject } from "@/@types/service/project";
import Flattabs from "@/components/ui/flattabs";
import { useState } from "react";
import ProjectEstimator from "@/components/section/service/project/detail/projectestimator";

export default function ProjectDetailSide({ project }: { project: ERPNextProject }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    <div className="flex space-x-1 items-center" key="task-status">
      <span>AI 견적</span>
    </div>,
    <div className="flex space-x-1 items-center" key="task-status">
      <span>작업 현황</span>
      <span className="text-xs">{10}</span>
    </div>,
    <div className="flex space-x-1 items-center" key="overview">
      <span>파일</span>
    </div>,
  ];

  return (
    <>
      <Flattabs tabs={tabs} activeTab={activeTab} handleTabChange={setActiveTab} />
      {/* 탭 콘텐츠 */}
      <div className="w-full p-4 md:p-8">
        {activeTab === 0 && <ProjectEstimator project={project} />}
        {activeTab === 1 && <ProjectEstimator project={project} />}
      </div>
    </>
  );
}
