"use client";

import { motion } from "framer-motion";
import { Check, X, DownloadCloud } from "lucide-react";
import { fileIconMap } from "@/components/form/fileinput";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function TasksEmptyState() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col w-full px-4 mt-3">
      <motion.div
        variants={itemVariants}
        className="flex flex-col space-y-3 items-center w-full rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 px-8 py-12 mb-1 text-sm select-none backdrop-blur-sm border border-blue-100/50"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-2 w-full rounded-xl bg-white/80 backdrop-blur-sm px-3 py-2 text-xs font-medium shadow-sm border border-white/50"
        >
          <fileIconMap.default className="!size-4" />
          <p className="grow">Business Identity.zip</p>
          <DownloadCloud className="!size-4 text-blue-500" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 30 }}>
            <Check className="!size-4 text-emerald-500 ml-1" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-2 w-full rounded-xl bg-white/80 backdrop-blur-sm px-3 py-2 text-xs font-medium shadow-sm border border-white/50"
        >
          <fileIconMap.default className="!size-4" />
          <p className="grow">디자인 레퍼런스.docs</p>
          <DownloadCloud className="!size-4 text-blue-500" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: "spring", stiffness: 500, damping: 30 }}>
            <X className="!size-4 text-red-500 ml-1" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col space-y-2 pt-4 pb-2 text-center">
        <motion.div variants={itemVariants} className="text-base font-semibold text-gray-900">
          프로젝트 문의 시작하기
        </motion.div>
        <motion.div variants={itemVariants} className="text-sm font-medium text-gray-600">
          계약을 문의하고 프로젝트 현황을 파악해보세요.
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
