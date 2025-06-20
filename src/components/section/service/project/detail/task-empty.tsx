"use client";

import { Check, ArrowRight } from "lucide-react";

export function TasksEmptyState() {
  return (
    <div className="flex flex-col w-full px-4 mt-3">
      <div className="flex flex-col space-y-3 items-center w-full rounded-sm bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 px-8 py-12 mb-1 text-sm select-none backdrop-blur-sm border border-blue-100/50">
        <div className="flex items-center space-x-2 w-full rounded-xl bg-white/80 backdrop-blur-sm px-3 py-2 text-xs font-medium shadow-sm border border-white/50">
          <div className="!size-2 rounded-full bg-amber-500" />
          <p className="grow">프로젝트 요구사항 파악</p>
          <div className="flex items-center space-x-2">
            <p className="text-xs">완료</p>
            <Check className="!size-3 text-emerald-500" strokeWidth={2.8} />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full rounded-xl bg-white/80 backdrop-blur-sm px-3 py-2 text-xs font-medium shadow-sm border border-white/50">
          <div className="!size-2 rounded-full bg-amber-500" />
          <p className="grow">Next.js 프론트엔드 개발</p>
          <div className="flex items-center space-x-2">
            <p className="text-xs">2025-05-04</p>
            <ArrowRight className="!size-3 text-gray-500" strokeWidth={2.8} />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
        <div className="text-base font-semibold text-gray-900">프로젝트 문의 시작하기</div>
        <div className="text-sm font-medium text-gray-600">계약을 문의하고 프로젝트 현황을 파악해보세요.</div>
      </div>
    </div>
  );
}
