"use client";

import { motion } from "framer-motion";
import dayjs from "dayjs";
import type { ERPNextTaskForUser } from "@/@types/service/project";

const DEFAULT_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

function getRandomDefaultColor(): string {
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
}

interface TaskItemProps {
  task: ERPNextTaskForUser;
  index: number;
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.05,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function TaskItem({ task, index }: TaskItemProps) {
  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
        },
      }}
      className="flex space-x-3 px-4 py-4 cursor-pointer rounded-md mx-2 hover:bg-black/5 transition-colors duration-200"
    >
      <motion.div
        className="mt-[6px] size-2.5 rounded-full shrink-0 shadow-sm"
        style={{ backgroundColor: task.color ?? getRandomDefaultColor() }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: index * 0.05 + 0.2,
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
      <div className="flex flex-col space-y-2 flex-1 min-w-0">
        <motion.div
          className="text-sm font-semibold text-gray-900 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          {task.subject}
        </motion.div>

        {task.description && (
          <motion.div
            className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            {task.description}
          </motion.div>
        )}

        {task.exp_start_date && (
          <motion.div
            className="text-xs text-gray-500 flex space-x-1.5 items-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <span>예상 마감일:</span>
            <span className="font-semibold">{dayjs(task.exp_start_date).format("YYYY년 MM월 DD일")}</span>
            {task.exp_end_date && (
              <>
                <span>-</span>
                <span className="font-semibold">{dayjs(task.exp_end_date).format("YYYY년 MM월 DD일")}</span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
