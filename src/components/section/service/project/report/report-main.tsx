"use client";

import { useState } from "react";
import { useProjectOverView } from "@/hooks/fetch/project";
import { OverviewERPNextProject } from "@/@types/service/project";
import { Session } from "next-auth";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ReportSidebar from "./report-sidebar";
import ReportList from "./report-list";
import ReportSheet from "./report-sheet";
import dayjs from "@/lib/dayjs";

export default function ReportMain({ session }: { session: Session }) {
  const projectsOverview = useProjectOverView();
  const overviewProjects = projectsOverview?.data?.items || [];

  const [project, setProject] = useState<OverviewERPNextProject | null>(null);

  const [dailyReport, setDailyReport] = useState(true);
  const [selectedProject, setSelectedProject] = useState<OverviewERPNextProject | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(dayjs(new Date()).subtract(1, "day").toDate());

  return (
    <div className="w-full h-full flex flex-col xl:flex-row">
      <ReportSidebar
        session={session}
        project={project}
        setProject={setProject}
        dailyReport={dailyReport}
        setDailyReport={setDailyReport}
        overviewProjects={overviewProjects}
      />

      <ReportList
        session={session}
        project={project}
        dailyReport={dailyReport}
        overviewProjects={overviewProjects}
        selectedDate={selectedDate}
        setSelectedProject={setSelectedProject}
        setSelectedDate={setSelectedDate}
      />

      <Sheet open={!!selectedProject && !!selectedDate} onOpenChange={() => setSelectedProject(null)}>
        <SheetContent className="w-full sm:max-w-full md:w-2/5 md:min-w-[728px] [&>button:first-of-type]:hidden gap-0 overflow-x-hidden focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus:outline-none focus:border-none">
          <SheetHeader className="sr-only">
            <SheetTitle>프로젝트 상세</SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only" />
          {selectedProject && <ReportSheet project={selectedProject} date={selectedDate} dailyReport={dailyReport} onClose={() => setSelectedProject(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
