"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ZapIcon } from "lucide-react"
import DynamicFcIcon from "@/components/resource/dynamicfcicon"

interface EmptyStateProps {
  hasTasks: boolean
  hasTaskIsLoading: boolean
  isLoading: boolean
  tasksLength: number
}

export function EmptyState({ hasTasks, hasTaskIsLoading, isLoading, tasksLength }: EmptyStateProps) {
  // Not have Tasks
  if (!hasTasks && !hasTaskIsLoading && !isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-84 md:w-[512px] flex flex-col justify-center items-center space-y-4 text-center text-sm">
          <div>아직 할당된 테스크가 없습니다</div>
          <div className="text-2xl font-bold line-clamp-2">
            가장 앞선 SI에 합리적인 비용으로
            <br />
            외주 개발을 의뢰해보세요
          </div>
          <Button size="lg" asChild>
            <Link href="/service/project">
              <ZapIcon />
              지금 의뢰하기
            </Link>
          </Button>
          <div className="mt-8 w-full rounded-2xl overflow-hidden border border-zinc-300">
            <AspectRatio ratio={1600 / 1150} className="w-full">
              <Image src="/task-empty.png" alt="테스크가 없습니다" fill />
            </AspectRatio>
          </div>
        </div>
      </div>
    )
  }

  // There is not Tasks with Filters
  if (hasTasks && !hasTaskIsLoading && !isLoading && tasksLength === 0) {
    return (
      <div className="flex justify-center items-center py-24 border-b border-b-sidebar-border">
        <div className="w-84 md:w-[512px] flex flex-col justify-center items-center space-y-4 text-center text-sm">
          <DynamicFcIcon name="FcQuestions" className="size-10" />
          <div className="text-2xl font-bold">조회된 항목이 없어요</div>
          <div>조건을 변경하여 다시 시도해주세요.</div>
        </div>
      </div>
    )
  }

  return null
}
