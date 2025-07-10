"use client";

import type { UserERPNextProject } from "@/@types/service/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, UserPlus } from "lucide-react";
import { Session } from "next-auth";
import { SWRResponse } from "swr";
import { useContracts } from "@/hooks/fetch/contract";

export function ContractList({ projectSwr }: { projectSwr: SWRResponse<UserERPNextProject>; session: Session }) {
  const { data: project } = projectSwr;
  const project_id = project?.project_name ?? "";
  const { data: contractsSwr, isLoading } = useContracts({ project_id });
  const contracts = contractsSwr?.flatMap((page) => page.items) ?? [];

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="text-sm font-bold">계약서: {}</div>
      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
        <Info className="!size-4" />
        <p>프로젝트에 참여하는 팀 멤버들을 관리하세요.</p>
      </div>

      {project?.custom_team && project?.custom_team.length >= 5 && (
        <div className="flex items-center space-x-1.5 w-full rounded-sm bg-red-100 px-4 py-2 mb-1 text-sm">
          <Info className="!size-4" />
          <p>무료 플랜에서는 최대 5명의 팀원을 초대할 수 있어요.</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-2">
        {contracts.map((contract) => (
          <div key={contract.name} className="flex items-center space-x-4 p-2 rounded-sm">
            {contract.custom_name}
          </div>
        ))}
      </section>

      {contracts.length === 0 && (
        <div className="flex flex-col w-full">
          <div className="h-44 flex flex-col justify-center space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#e6ffed] via-[#daffe5] to-[#e6ffec] px-8 mb-1 text-sm select-none">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-1.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-2.png" alt="@leerob" />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-3.png" alt="@evilrabbit" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/" alt="@evilrabbit" />
                <AvatarFallback>· · ·</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
            <div className="text-base font-semibold">팀원과 함께 작업하기</div>
            <div className="text-sm font-medium text-muted-foreground">팀원과 프로젝트, 작업 현황, 이슈를 공유할 수 있습니다.</div>
          </div>
        </div>
      )}

      <button className="flex items-center justify-center space-x-1.5 mt-1 w-full rounded-sm bg-blue-200 hover:bg-blue-300 text-blue-500 font-bold px-4 py-3 mb-1 text-sm transition-colors duration-200 cursor-pointer">
        <UserPlus className="!size-5" strokeWidth={2} />
        <p>팀원 초대하기</p>
      </button>
    </div>
  );
}
