"use client";

import type { Session } from "next-auth";
import type { OverviewERPNextProject } from "@/@types/service/project";
import WheelDatePicker from "@/components/resource/wheeldatepicker/datepicker";
import { useMemo } from "react";
import dayjs from "@/lib/dayjs";

const dailyProjectDateFilter = (project: OverviewERPNextProject, date: Date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const startStr = project.expected_start_date ? dayjs(project.expected_start_date).format("YYYY-MM-DD") : null;
  const endStr = project.expected_end_date ? dayjs(project.expected_end_date).format("YYYY-MM-DD") : null;

  return (
    (!startStr || dayjs(startStr).isBefore(dateStr) || dayjs(startStr).isSame(dateStr)) &&
    (!endStr || dayjs(endStr).isAfter(dateStr) || dayjs(endStr).isSame(dateStr))
  );
};

const monthlyProjectDateFilter = (project: OverviewERPNextProject, date: Date) => {
  const monthStart = dayjs(date).startOf("month").format("YYYY-MM-DD");
  const monthEnd = dayjs(date).endOf("month").format("YYYY-MM-DD");

  const startStr = project.expected_start_date ? dayjs(project.expected_start_date).format("YYYY-MM-DD") : null;
  const endStr = project.expected_end_date ? dayjs(project.expected_end_date).format("YYYY-MM-DD") : null;

  return (
    (!startStr || dayjs(startStr).isBefore(monthEnd) || dayjs(startStr).isSame(monthEnd)) &&
    (!endStr || dayjs(endStr).isAfter(monthStart) || dayjs(endStr).isSame(monthStart))
  );
};

export default function ReportList({
  session,
  project,
  dailyReport,
  overviewProjects,
  setSelectedProject,
  selectedDate,
  setSelectedDate,
}: {
  session: Session;
  project: OverviewERPNextProject | null;
  dailyReport: boolean;
  overviewProjects: OverviewERPNextProject[];
  setSelectedProject: (project: OverviewERPNextProject | null) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const startDate = useMemo(() => {
    if (project) {
      return project.expected_start_date ?? dayjs(new Date()).subtract(1, "day").toDate();
    }
    const sorted = [...overviewProjects].sort(
      (a, b) =>
        (a.expected_start_date ?? dayjs(new Date()).subtract(1, "day").toDate()).getTime() -
        (b.expected_start_date ?? dayjs(new Date()).subtract(1, "day").toDate()).getTime()
    );
    return sorted[0]?.expected_start_date ?? dayjs(new Date()).subtract(1, "day").toDate();
  }, [project, overviewProjects]);

  const projectDateFilter = dailyReport ? dailyProjectDateFilter : monthlyProjectDateFilter;

  const projectsToDisplay = project
    ? projectDateFilter(project, selectedDate)
      ? [project]
      : []
    : overviewProjects
        .filter((project) => project.custom_team.filter((member) => member.member == session.sub).some((member) => member.level < 3))
        .filter((project) => project.custom_project_status !== "draft")
        .filter((project) => projectDateFilter(project, selectedDate));

  const handleProjectSelect = (selectedProject: OverviewERPNextProject) => {
    setSelectedProject(selectedProject);
  };

  return (
    <div className="w-full h-full border-r">
      <div className="w-full p-4 flex flex-col gap-4">
        <WheelDatePicker
          minDate={startDate}
          maxDate={dayjs(new Date()).subtract(1, "day").toDate()}
          startDate={selectedDate}
          precision={dailyReport ? "day" : "month"}
          onChange={(d) => setSelectedDate(d)}
        />

        {/* Responsive table/card layout */}
        <div className="overflow-hidden">
          {/* Desktop table - hidden on small screens */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-blue-300/60 backdrop-blur supports-[backdrop-filter]:bg-blue-300/60">
                <tr className="border-b border-black/5">
                  <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
                    프로젝트
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
                    상태
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
                    시작일
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
                    마감일
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
                    생성일
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
                    수정일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {projectsToDisplay.map((project) => (
                  <tr
                    key={project.project_name}
                    className="hover:bg-gray-100/80 transition-colors even:bg-gray-100/40 cursor-pointer"
                    onClick={() => handleProjectSelect(project)}
                  >
                    <td className="px-5 py-3 text-gray-900 font-medium">{project.custom_project_title}</td>
                    <td className="px-5 py-3 text-gray-700">{project.custom_project_status}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {project.expected_start_date ? dayjs(project.expected_start_date).format("LL") : "정해지지 않았어요"}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {project.expected_end_date ? dayjs(project.expected_end_date).format("LL") : "정해지지 않았어요"}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{dayjs(project.creation).format("LL")}</td>
                    <td className="px-5 py-3 text-gray-700">{dayjs(project.modified).format("LL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout - visible only on small screens */}
          <div className="lg:hidden divide-y divide-black/5">
            {projectsToDisplay.map((project) => (
              <div key={project.project_name} className="p-4 hover:bg-gray-50/80 transition-colors" onClick={() => handleProjectSelect(project)}>
                <h3 className="text-base font-medium text-gray-900 mb-2">{project.custom_project_title}</h3>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase block">상태</span>
                    <span className="text-gray-700">{project.custom_project_status}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase block">시작일</span>
                    <span className="text-gray-700">{dayjs(project.expected_start_date).format("LL")}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase block">마감일</span>
                    <span className="text-gray-700">{dayjs(project.expected_end_date).format("LL")}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase block">생성일</span>
                    <span className="text-gray-700">{dayjs(project.creation).format("LL")}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase block">수정일</span>
                    <span className="text-gray-700">{dayjs(project.modified).format("LL")}</span>
                  </div>
                </div>
              </div>
            ))}

            {projectsToDisplay.length === 0 && <div className="p-4 text-center text-gray-500">표시할 프로젝트가 없습니다.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
