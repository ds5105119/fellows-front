"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useProjectOverView } from "@/hooks/fetch/project";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { OverviewERPNextProject } from "@/@types/service/project";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { InfoIcon } from "lucide-react";

export default function ReportSidebar({ session }: { session: Session }) {
  const projectsOverview = useProjectOverView();
  const overviewProjects = projectsOverview?.data?.items || [];

  const [dailyReport, setDailyReport] = useState(true);
  const [project, setProject] = useState<OverviewERPNextProject | null>(null);

  return (
    <div className="w-full md:w-72 h-full p-4 border-r">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">리포트</h2>
        <motion.div className="bg-zinc-200 p-[3px] rounded-sm inline-flex items-center relative">
          <div className="relative">
            <motion.button
              onClick={() => setDailyReport(true)}
              className={`relative z-10 px-2 py-1 text-xs flex items-center justify-center font-medium rounded-sm transition-colors whitespace-nowrap ${
                dailyReport ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              일별
              {dailyReport && (
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
              onClick={() => setDailyReport(false)}
              className={`relative z-10 px-2 py-1 text-xs flex items-center justify-center font-medium rounded-sm transition-colors whitespace-nowrap ${
                !dailyReport ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              월별
              {!dailyReport && (
                <motion.div
                  layoutId="projectTabBackground"
                  className="absolute inset-0 bg-black rounded-[3px] shadow-sm -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 text-sm mt-4">
        <InfoIcon className="!size-4" />
        <p>진행 중인 프로젝트만 표시되요.</p>
      </div>

      <div className="mt-4">
        <Command className="rounded-sm bg-zinc-50">
          <CommandInput placeholder="프로젝트 이름 또는 ID 입력" />
          <CommandList className="overflow-y-auto scrollbar-hide">
            <CommandEmpty>결과가 없어요</CommandEmpty>
            <CommandGroup>
              {overviewProjects
                .filter((project) => project.custom_team.filter((member) => member.member == session.sub).some((member) => member.level < 3))
                .filter((project) => project.custom_project_status !== "draft")
                .map((val, idx) => {
                  return (
                    <CommandItem
                      key={idx}
                      className={cn(
                        "flex items-center space-x-2 cursor-pointer",
                        project?.project_name === val.project_name ? "bg-zinc-200 hover:!bg-zinc-200 data-[selected=true]:bg-zinc-200" : ""
                      )}
                      value={val.project_name + " " + val.custom_project_title}
                      onSelect={() => (project == val ? setProject(null) : setProject(val))}
                    >
                      <p className="w-3/4 truncate font-semibold">{val.custom_project_title}</p>
                      <p className="grow truncate text-xs">{val.project_name}</p>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
