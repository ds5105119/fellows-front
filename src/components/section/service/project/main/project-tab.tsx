"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ProjectTab({ taskView, setTaskView }: { taskView?: boolean; setTaskView?: (value: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = ["개요", "작업 현황", "이슈"] as const;
  const tabMapping: Record<"개요", ""> & Record<"작업 현황", "task"> & Record<"이슈", "issue"> = { 개요: "", "작업 현황": "task", 이슈: "issue" };

  const handleTabChange = (tab: "개요" | "작업 현황" | "이슈") => {
    router.push("/service/project/" + tabMapping[tab]);
  };

  const tab = pathname.startsWith("/service/project/task") ? "작업 현황" : pathname.startsWith("/service/project/issue") ? "이슈" : "개요";

  return (
    <div className="sticky w-full top-12 md:top-16 flex items-center justify-between min-h-12 h-12 md:min-h-16 md:h-16 px-6 md:px-6 bg-background z-20 border-b border-b-sidebar-border">
      <div className="flex items-center space-x-5">
        {tabs.map((t, index) => {
          return (
            <button
              key={index}
              onClick={() => handleTabChange(t)}
              className={cn("text-base md:text-xl font-bold", t === tab ? "text-black" : "text-muted-foreground")}
            >
              {t}
            </button>
          );
        })}
      </div>
      {tab === "작업 현황" && (
        <motion.div className="bg-zinc-200 p-[3px] rounded-sm inline-flex items-center relative">
          <div className="relative">
            <motion.button
              onClick={() => setTaskView && setTaskView(true)}
              className={`relative z-10 px-2 py-1 text-xs flex items-center justify-center font-medium rounded-sm transition-colors whitespace-nowrap ${
                taskView ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              테이블
              {taskView && (
                <motion.div
                  layoutId="projectTabBackground"
                  className="absolute inset-0 bg-black rounded-[3px] shadow-sm -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          </div>
          <div className="relative">
            <motion.button
              onClick={() => setTaskView && setTaskView(false)}
              className={`relative z-10 px-2 py-1 text-xs flex items-center justify-center font-medium rounded-sm transition-colors whitespace-nowrap ${
                !taskView ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              간트
              {!taskView && (
                <motion.div
                  layoutId="projectTabBackground"
                  className="absolute inset-0 bg-black rounded-[3px] shadow-sm -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
