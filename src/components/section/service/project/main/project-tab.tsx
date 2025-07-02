"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SquareGanttChart, TableProperties } from "lucide-react";

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
        <div className="flex items-center space-x-2 group">
          <Button variant="ghost" size="icon" onClick={() => setTaskView && setTaskView(!taskView)}>
            {taskView ? (
              <SquareGanttChart className="size-6 text-muted-foreground group-hover:text-zinc-800 transition-colors duration-200" />
            ) : (
              <TableProperties className="size-6 text-muted-foreground group-hover:text-zinc-800 transition-colors duration-200" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
