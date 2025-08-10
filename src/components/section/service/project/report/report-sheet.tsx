"use client";

import { useMemo, useRef } from "react";
import { useDailyReport } from "@/hooks/fetch/report";
import type { ERPNextTaskForUser, OverviewERPNextProject } from "@/@types/service/project";
import { cn } from "@/lib/utils";
import { Clock, ListTodo, CheckCircle2, ArrowLeft, FileText, Copy, Download } from "lucide-react";
import { ERPNextReport, ReportResponse } from "@/@types/service/report";
import { ERPNextTimeSheetForUser } from "@/@types/service/timesheet";
import { Button } from "@/components/ui/button";
import dayjs from "@/lib/dayjs";
import generatePDF, { Margin } from "react-to-pdf";
import parse from "html-react-parser";

export default function ReportSheet({
  project,
  date,
  dailyReport,
  onClose,
}: {
  project: OverviewERPNextProject;
  date: Date;
  dailyReport: boolean;
  onClose: () => void;
}) {
  // for ref to target element for PDF generation
  const targetRef = useRef<HTMLDivElement>(null);

  // Use the hook exactly as given
  const report = useDailyReport(project.project_name, date);
  const data: ReportResponse | undefined = report.data;
  const isReportLoading = !report.data && report.isLoading;

  // Schema change: report is now a single object
  const reportDoc: ERPNextReport | undefined = data?.report;
  const tasks: ERPNextTaskForUser[] = data?.tasks ?? [];
  const timesheets: ERPNextTimeSheetForUser[] = data?.timesheets ?? [];

  const totalHours = useMemo(
    () =>
      timesheets.reduce((acc, t) => {
        const h = typeof t.total_hours === "number" ? t.total_hours : 0;
        return acc + h;
      }, 0),
    [timesheets]
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    []
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  const title = dailyReport ? "일일 리포트" : "월간 리포트";

  // Group tasks by status for structured, readable lists
  const groupedTasks = useMemo(() => {
    const g = new Map<string, ERPNextTaskForUser[]>();
    for (const t of tasks) {
      const k = String(t?.status ?? "기타");
      if (!g.has(k)) g.set(k, []);
      g.get(k)!.push(t);
    }
    return Array.from(g.entries());
  }, [tasks]);

  const downloadPDF = () => {
    generatePDF(targetRef, {
      method: "save",
      filename: `${project.custom_project_title} 일일 레포트 - ${dayjs(reportDoc?.end_date).format("YYYY-MM-DD")}`,
      resolution: 5,
      page: { margin: Margin.MEDIUM },
    });
  };

  return (
    <div className="w-full">
      {/* 네비게이션 */}
      <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4 bg-background z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
            <ArrowLeft className="!size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent">
            이용 가이드
          </Button>
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent" onClick={downloadPDF}>
            <Download />
            PDF
          </Button>
        </div>
      </div>

      <div className="block w-full overflow-y-auto scrollbar-hide" ref={targetRef}>
        <div className="flex flex-col h-full w-full">
          {/* 레포트 헤더 */}
          <div className="pt-12 pb-5 px-4 md:px-8">
            <div className="w-full flex items-center space-x-3">
              <div className="flex items-center justify-center size-8 md:size-9 rounded-sm bg-blue-500/15">
                <FileText className="!size-5 md:!size-6 text-blue-500" strokeWidth={2.2} />
              </div>
              <span className="text-base font-bold text-blue-500">{title}</span>
              <span className="text-xs font-normal text-muted-foreground">{dayjs(reportDoc?.creation).format("YY.MM.DD HH시 mm분")} 생성</span>
            </div>
          </div>
          {/* 레포트 제목 */}
          <div className="px-4 md:px-8 py-6">
            <div className="w-full flex flex-col space-y-3">
              <h2 className="text-4xl font-bold break-keep">{project.custom_project_title}</h2>
              <div className="w-full flex items-center space-x-2 pt-2">
                <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">계약 번호</div>
                <div className="ml-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">{project.project_name}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(project.project_name)}
                  className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-300/40 transition-colors duration-200"
                >
                  <Copy className="text-muted-foreground !size-4" strokeWidth={2.7} />
                </button>
              </div>
              <div className="w-full flex items-center space-x-2">
                <div className="px-2 py-1 rounded-sm bg-muted text-xs font-bold">보고 일자</div>
                <div className="ml-1 text-xs font-medium text-muted-foreground truncate overflow-hidden whitespace-nowrap">{reportDoc?.start_date}</div>
              </div>
            </div>
          </div>
          {/* Tasks */}
          <section className="px-4 md:px-8 py-6">
            <div className="mb-3 flex items-center gap-2">
              <ListTodo className="size-5 text-zinc-500" aria-hidden="true" />
              <h2 className="text-base font-semibold tracking-tight">작업</h2>
              <span className="text-sm text-zinc-500">총 {tasks.length.toLocaleString()}건</span>
            </div>

            {isReportLoading ? (
              <TaskSkeleton />
            ) : tasks.length === 0 ? (
              <EmptyRow label="표시할 작업이 없어요." />
            ) : (
              <div className="rounded-lg">
                {groupedTasks.map(([status, list], i) => (
                  <div key={status} className={cn(i > 0 && "mt-6")}>
                    <div className="mb-2 flex items-center gap-2">
                      <StatusDot status={status} />
                      <div className="text-sm font-medium text-zinc-600">
                        {status} · {list.length.toLocaleString()}건
                      </div>
                    </div>
                    <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white/40">
                      {list.map((t, idx) => {
                        const plannedStart = t?.exp_start_date !== undefined && t?.exp_start_date !== null ? new Date(t.exp_start_date) : null;
                        const plannedEnd = t?.exp_end_date !== undefined && t?.exp_end_date !== null ? new Date(t.exp_end_date) : null;
                        const progress = typeof t?.progress === "number" ? Math.max(0, Math.min(100, Math.round(t.progress))) : null;

                        return (
                          <li key={`${status}-${idx}`} className="px-3 md:px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="truncate text-sm font-semibold">{t?.subject ?? "제목 없음"}</div>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                                  {typeof t?.expected_time === "number" && <span>예상: {t.expected_time}h</span>}
                                  {plannedStart && (
                                    <span>
                                      계획: {dateFormatter.format(plannedStart)}
                                      {plannedEnd ? ` ~ ${dateFormatter.format(plannedEnd)}` : ""}
                                    </span>
                                  )}
                                </div>

                                {t?.description && <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">{t.description}</div>}

                                {progress !== null ? (
                                  <div className="mt-2 h-1.5 w-full rounded bg-zinc-200">
                                    <div className="h-full rounded bg-zinc-800 transition-[width] duration-300" style={{ width: `${progress}%` }} />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Timesheets */}
          <section className="px-4 md:px-8 py-6">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="size-4 text-zinc-500" aria-hidden="true" />
              <h2 className="text-sm font-semibold tracking-tight">타임시트</h2>
              <span className="text-xs text-zinc-500">
                총 {timesheets.length.toLocaleString()}건 · {Math.round(totalHours * 10) / 10}h
              </span>
            </div>

            {isReportLoading ? (
              <TimeSkeleton />
            ) : timesheets.length === 0 ? (
              <EmptyRow label="기록된 타임시트가 없어요." />
            ) : (
              <ol className="relative pl-4 border-l border-zinc-300">
                {timesheets
                  .slice()
                  .sort((a, b) => {
                    const da = new Date(a?.creation ?? a?.start_date ?? 0).getTime();
                    const db = new Date(b?.creation ?? b?.start_date ?? 0).getTime();
                    return db - da;
                  })
                  .map((ts, i) => {
                    const started =
                      ts?.start_date !== undefined && ts?.start_date !== null
                        ? new Date(ts.start_date)
                        : ts?.creation !== undefined && ts?.creation !== null
                        ? new Date(ts.creation)
                        : null;
                    const ended = ts?.end_date !== undefined && ts?.end_date !== null ? new Date(ts.end_date) : null;

                    const range =
                      started && ended
                        ? `${dateFormatter.format(started)} ${timeFormatter.format(started)} ~ ${timeFormatter.format(ended)}`
                        : started
                        ? `${dateFormatter.format(started)} ${timeFormatter.format(started)}`
                        : "시간 정보 없음";

                    return (
                      <li key={i} className="relative mb-5">
                        <div className="absolute -left-[22px] top-1">
                          <div className="size-3 rounded-full bg-zinc-300 ring-2 ring-white" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-medium truncate">{ts.name ?? "제목 없음"}</div>
                            {typeof ts?.status === "string" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">{ts.status}</span>
                            ) : null}
                            {typeof ts?.customer === "string" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">고객: {ts.customer}</span>
                            ) : null}
                            {typeof ts?.parent_project === "string" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">프로젝트: {ts.parent_project}</span>
                            ) : null}
                          </div>
                          <div className="mt-0.5 text-xs text-zinc-600">{range}</div>
                          {typeof ts?.total_hours === "number" ? <div className="mt-0.5 text-xs text-zinc-600">{ts.total_hours}h</div> : null}
                          {typeof ts?.note === "string" && ts.note ? <div className="mt-0.5 text-xs text-zinc-600">{parse(ts.note)}</div> : null}
                        </div>
                      </li>
                    );
                  })}
              </ol>
            )}
          </section>

          {/* Final Summary */}
          <section className="px-4 md:px-8 py-6">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-zinc-500" aria-hidden="true" />
              <h2 className="text-sm font-semibold tracking-tight">요약</h2>
            </div>

            {isReportLoading ? (
              <div className="h-4 w-2/3 max-w-[520px] rounded bg-zinc-200 animate-pulse" />
            ) : (
              <p className="text-sm text-zinc-700 leading-relaxed">{reportDoc?.summary ? String(reportDoc.summary) : "요약을 생성해 보세요"}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 py-4">
      <CheckCircle2 className="size-4 opacity-60" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 bg-zinc-200 rounded mb-3" />
      <div className="space-y-2 rounded-md border border-zinc-200 bg-white/50 p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 bg-zinc-100 rounded" />
        ))}
      </div>
    </div>
  );
}

function TimeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-zinc-200" />
            <div className="h-4 flex-1 bg-zinc-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Neutral status dot
function StatusDot({ status }: { status: string }) {
  const color = /done|complete|완료/i.test(status)
    ? "bg-emerald-500"
    : /in.?progress|진행/i.test(status)
    ? "bg-blue-500"
    : /pending|todo|대기/i.test(status)
    ? "bg-amber-500"
    : "bg-zinc-400";
  return (
    <span className={cn("inline-flex items-center justify-center", "size-2 rounded-full", color)}>
      <span className="sr-only">{status}</span>
    </span>
  );
}
