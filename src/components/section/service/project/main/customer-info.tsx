"use client";

import Link from "next/link";
import { ArrowUpRight, WorkflowIcon } from "lucide-react";
import type { Session } from "next-auth";
import { SWRResponse } from "swr";
import { UserERPNextProject } from "@/@types/service/project";
import { useUsers } from "@/hooks/fetch/user";
import { Button } from "@/components/ui/button";

export function CustomerInfo({ projectSwr }: { projectSwr: SWRResponse<UserERPNextProject>; session: Session }) {
  const project = projectSwr.data;
  const customerSwr = useUsers(project?.customer ? [project.customer] : []);
  const customer = customerSwr.data ? customerSwr.data[0] : null;

  return (
    <div className="w-full flex flex-col relative">
      <div className="w-full flex items-center justify-between border-b px-6 py-1 bg-white">
        <div className="text-sm font-medium">계약자 정보가 연동되었어요</div>
        <Button size="icon" variant="ghost" className="!p-1">
          <WorkflowIcon className="!size-5 text-gray-500" />
        </Button>
      </div>
      <div className="w-full flex space-x-2.5 px-6 py-4">
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">성함</div>
          <div className="text-sm font-medium">이메일</div>
        </div>
        <div className="flex flex-col space-y-2">
          {!customer?.name ? (
            <Link href="/service/settings/profile" className="flex items-center select-none space-x-0.5">
              <p className="text-sm font-bold text-blue-500">이름을 등록해주세요</p>
              <ArrowUpRight className="!size-4 text-blue-500" />
            </Link>
          ) : (
            <div className="text-sm font-bold">{customer.name}</div>
          )}
          {!customer?.name ? (
            <Link href="/service/settings/profile" className="flex items-center select-none space-x-0.5">
              <p className="text-sm font-bold text-blue-500">이메일을 등록해주세요</p>
              <ArrowUpRight className="!size-4 text-blue-500" />
            </Link>
          ) : (
            <div className="text-sm font-bold">{customer.email}</div>
          )}
        </div>
      </div>
    </div>
  );
}
