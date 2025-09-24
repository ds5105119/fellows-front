"use client";

import Link from "next/link";
import { ArrowUpRight, WorkflowIcon } from "lucide-react";
import { SWRResponse } from "swr";
import { UserERPNextProject } from "@/@types/service/project";
import { Button } from "@/components/ui/button";
import SecretField from "@/components/ui/secret-field";

export function EnvironmentInfo({ projectSwr }: { projectSwr: SWRResponse<UserERPNextProject> }) {
  const project = projectSwr.data;

  return (
    <div className="w-full flex flex-col relative">
      <div className="w-full flex items-center justify-between border-b px-6 py-1 bg-white">
        <div className="text-sm font-medium">{project?.custom_environment_domain ? "프로젝트를 미리 볼 수 있어요" : "프로젝트 미리보기가 없어요"}</div>
        <Button size="icon" variant="ghost" className="!p-1">
          <WorkflowIcon className="!size-5 text-gray-500" />
        </Button>
      </div>
      <div className="w-full flex space-x-2.5 px-6 py-4">
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">도메인</div>
          <div className="text-sm font-medium">ID/이메일</div>
          <div className="text-sm font-medium">비밀번호</div>
        </div>
        <div className="flex flex-col space-y-2">
          {project?.custom_environment_domain ? (
            <Link href="/service/settings/profile" className="flex items-center select-none space-x-0.5">
              <p className="text-sm font-bold text-blue-500">{project.custom_environment_domain}</p>
              <ArrowUpRight className="!size-4 text-blue-500" />
            </Link>
          ) : (
            <div className="text-sm font-bold">등록되지 않았어요</div>
          )}
          {project?.custom_environment_id ? (
            <SecretField secret={project.custom_environment_id} />
          ) : (
            <div className="text-sm font-bold">없거나 등록되지 않았어요</div>
          )}
          {project?.custom_environment_password ? (
            <SecretField secret={project.custom_environment_password} />
          ) : (
            <div className="text-sm font-bold">없거나 등록되지 않았어요</div>
          )}
        </div>
      </div>
    </div>
  );
}
