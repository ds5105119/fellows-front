"use client";

import { Info } from "lucide-react";

export function ProjectNotices() {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex space-x-1 text-muted-foreground">
        <div className="pt-[1.4px]">
          <Info className="!size-3.5" />
        </div>
        <p className="text-xs break-keep">
          계약 문의 취소하기는 계약이 진행중이지 않은 상태에서만 신청할 수 있어요. 진행 중인 계약을 종료하고 싶은 경우 문의하기를 사용해주세요.
        </p>
      </div>
      <div className="flex space-x-1 text-muted-foreground">
        <div className="pt-[1.4px]">
          <Info className="!size-3.5" />
        </div>
        <p className="text-xs break-keep">
          세금계산서 발행은 6개월 이하로 진행되는 경우 프로젝트 완료 이후, 6개월 이상 진행되는 경우 계약금과 잔금 지급 후 각각 발행할 수 있어요.
        </p>
      </div>
    </div>
  );
}
