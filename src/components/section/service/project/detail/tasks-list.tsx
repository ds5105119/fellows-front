"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import type { SWRInfiniteResponse } from "swr/infinite";
import type { ERPNextTaskPaginatedResponse } from "@/@types/service/project";

import { TaskItem } from "./task-item";
import { TasksEmptyState } from "./task-empty";

interface TasksListProps {
  tasks: SWRInfiniteResponse<ERPNextTaskPaginatedResponse>;
  totalTasksCount: number;
  tasksLoading: boolean;
  onLoadMore: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.02,
    },
  },
};

export function TaskItemSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex space-x-2 px-4 py-4">
      <div className="mt-[5px] size-2.5 rounded-full shrink-0 bg-gray-200 animate-pulse" />
      <div className="flex flex-col space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
      </div>
    </motion.div>
  );
}

export function TasksListSkeleton() {
  return (
    <div className="flex flex-col space-y-2 pt-6">
      <div className="text-sm font-bold mx-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <TaskItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function TasksList({ tasks, totalTasksCount, tasksLoading, onLoadMore }: TasksListProps) {
  const taskInfRef = useRef<HTMLDivElement>(null);
  const isTaskInfRefView = useInView(taskInfRef, { margin: "100px" });

  // useEffect로 무한 스크롤 처리 (렌더링 중 setState 방지)
  useEffect(() => {
    if (isTaskInfRefView && !tasksLoading) {
      onLoadMore();
    }
  }, [isTaskInfRefView, tasksLoading, onLoadMore]);

  // 에러 상태
  if (tasks.error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <div className="w-6 h-6 bg-red-500 rounded-full" />
          </div>
          <p className="text-sm text-red-600 font-medium">테스크를 불러오는데 실패했습니다.</p>
          <p className="text-xs text-gray-500">잠시 후 다시 시도해주세요.</p>
        </div>
      </motion.div>
    );
  }

  const allTasks = tasks.data?.flatMap((page) => page.items) || [];
  const isEmpty = allTasks.length === 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col space-y-1 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mx-4 mb-2">
        <div className="text-sm font-bold text-gray-900">테스크: {totalTasksCount}개</div>
      </div>

      {tasks.isLoading && !tasks.data && <TasksListSkeleton />}

      {/* 태스크 리스트 */}
      <AnimatePresence mode="wait">
        {isEmpty ? (
          <TasksEmptyState />
        ) : (
          <motion.div key="tasks-list" className="space-y-1">
            {allTasks.map((task, index) => (
              <TaskItem key={task.subject || `task-${index}`} task={task} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 무한 스크롤 트리거 */}
      <div ref={taskInfRef} className="h-4" />
    </motion.div>
  );
}
