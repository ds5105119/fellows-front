"use client";

import { useMemo } from "react";
import { useDailyReport } from "@/hooks/fetch/report";
import type { OverviewERPNextProject } from "@/@types/service/project";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarDays, Clock, ListTodo, CheckCircle2 } from "lucide-react";

export default function ReportSheet({ project, date, dailyReport }: { project: OverviewERPNextProject; date: Date; dailyReport: boolean }) {
  // Use the hook exactly as given
  const report = useDailyReport(project.project_name, date);
  const data = report.data;

  // Schema change: report is now a single object
  const reportDoc = data?.report;
  const tasks = data?.tasks ?? [];
  const timesheets = data?.timesheets ?? [];

  const totalHours = useMemo(
    () =>
      (timesheets as any[]).reduce((acc, t) => {
        const h = typeof t?.total_hours === "number" ? t.total_hours : 0;
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
  const displayDate = dateFormatter.format(date);

  // Group tasks by status for structured, readable lists
  const groupedTasks = useMemo(() => {
    const g = new Map<string, any[]>();
    for (const t of tasks as any[]) {
      const k = (t?.status ?? "기타") as string;
      if (!g.has(k)) g.set(k, []);
      g.get(k)!.push(t);
    }
    return Array.from(g.entries());
  }, [tasks]);

  // Optional: a compact computed highlight string if summary is absent
  const computedHighlight = useMemo(() => {
    const done = (tasks as any[]).filter((t) => /done|완료/i.test(String(t?.status || ""))).length;
    const inProgress = (tasks as any[]).filter((t) => /progress|진행/i.test(String(t?.status || ""))).length;
    const pending = (tasks as any[]).filter((t) => /todo|pending|대기/i.test(String(t?.status || ""))).length;
    return `작업 ${tasks.length}건 (완료 ${done}, 진행 ${inProgress}, 대기 ${pending}), 기록 ${Math.round(totalHours * 10) / 10}h`;
  }, [tasks, totalHours]);

  // Period display: prefer API range, fallback to selected date
  const startStr = reportDoc?.start_date ? dateFormatter.format(new Date(reportDoc.start_date as any)) : displayDate;
  const endStr = !dailyReport && reportDoc?.end_date ? dateFormatter.format(new Date(reportDoc.end_date as any)) : undefined;

  return (
    <div className="w-full">
      {/* Header: generous spacing, no heavy cards */}
      <header className="px-4 md:px-6 pt-6 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h1>
          <span className="inline-flex items-center gap-1 text-sm text-zinc-600">
            <CalendarDays className="size-4 text-zinc-500" aria-hidden="true" />
            {dailyReport ? startStr : endStr ? `${startStr} ~ ${endStr}` : startStr}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-zinc-600">
            <Clock className="size-4 text-zinc-500" aria-hidden="true" />총 {Math.round(totalHours * 10) / 10}h
          </span>
        </div>

        {/* AI Summary from API (preferred), otherwise computed highlight */}
        {report.isLoading ? (
          <div className="mt-2 h-4 w-2/3 max-w-[520px] rounded bg-zinc-200 animate-pulse" />
        ) : (
          <p className="mt-2 text-sm text-zinc-700 leading-relaxed">{reportDoc?.summary ? String(reportDoc.summary) : computedHighlight}</p>
        )}
      </header>

      <Separator className="bg-zinc-200" />

      {/* Meta, typography-first */}
      <section className="px-4 md:px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="min-w-0">
            <div className="text-zinc-500">프로젝트</div>
            <div className="font-medium truncate">{project?.custom_project_title ?? project?.project_name}</div>
            <div className="text-xs text-zinc-500 truncate">{project?.project_name}</div>
          </div>
          <div className="min-w-0">
            <div className="text-zinc-500">{dailyReport ? "날짜" : "기간"}</div>
            <div className="font-medium">{dailyReport ? startStr : endStr ? `${startStr} ~ ${endStr}` : startStr}</div>
          </div>
          <div className="min-w-0">
            <div className="text-zinc-500">요약</div>
            <div className="font-medium">
              작업 {tasks.length.toLocaleString()}건, 타임시트 {(timesheets as any[]).length.toLocaleString()}건
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-zinc-200" />

      {/* Tasks: minimal, rich rows with subtle metadata */}
      <section className="px-4 md:px-6 py-5">
        <div className="mb-3 flex items-center gap-2">
          <ListTodo className="size-4 text-zinc-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold tracking-tight">작업</h2>
          <span className="text-xs text-zinc-500">총 {tasks.length.toLocaleString()}건</span>
        </div>

        {report.isLoading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyRow label="표시할 작업이 없어요." />
        ) : (
          <div className="rounded-lg">
            {groupedTasks.map(([status, list], i) => (
              <div key={status} className={cn(i > 0 && "mt-6")}>
                <div className="mb-2 flex items-center gap-2">
                  <StatusDot status={status} />
                  <div className="text-xs font-medium text-zinc-600">
                    {status} · {list.length.toLocaleString()}건
                  </div>
                </div>

                {/* Clean list with subtle borders */}
                <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white/40">
                  {list.map((t: any, idx: number) => {
                    const plannedStart = t?.exp_start_date ? new Date(t.exp_start_date) : null;
                    const plannedEnd = t?.exp_end_date ? new Date(t.exp_end_date) : null;
                    const completedOn = t?.completed_on ? new Date(t.completed_on) : null;
                    const progress = typeof t?.progress === "number" ? Math.max(0, Math.min(100, Math.round(t.progress))) : null;

                    return (
                      <li key={`${status}-${idx}`} className="px-3 md:px-4 py-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="truncate text-sm font-medium">{t?.subject ?? "제목 없음"}</div>
                              {t?.type ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">{t.type}</span> : null}
                              {t?.issue ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">Issue</span> : null}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                              {typeof t?.priority === "string" && <span>우선순위: {t.priority}</span>}
                              {typeof t?.expected_time === "number" && <span>예상: {t.expected_time}h</span>}
                              {plannedStart && (
                                <span>
                                  계획: {dateFormatter.format(plannedStart)}
                                  {plannedEnd ? ` ~ ${dateFormatter.format(plannedEnd)}` : ""}
                                </span>
                              )}
                              {completedOn && <span>완료: {dateFormatter.format(completedOn)}</span>}
                            </div>

                            {progress !== null ? (
                              <div className="mt-2 h-1.5 w-full rounded bg-zinc-200">
                                <div className="h-full rounded bg-zinc-800 transition-[width] duration-300" style={{ width: `${progress}%` }} />
                              </div>
                            ) : null}
                          </div>

                          {completedOn ? (
                            <Badge variant="secondary" className="rounded-full text-xs whitespace-nowrap">
                              완료
                            </Badge>
                          ) : null}
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

      <Separator className="bg-zinc-200" />

      {/* Timesheets: timeline-like with richer detail */}
      <section className="px-4 md:px-6 py-5">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="size-4 text-zinc-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold tracking-tight">타임시트</h2>
          <span className="text-xs text-zinc-500">
            총 {(timesheets as any[]).length.toLocaleString()}건 · {Math.round(totalHours * 10) / 10}h
          </span>
        </div>

        {report.isLoading ? (
          <TimeSkeleton />
        ) : (timesheets as any[]).length === 0 ? (
          <EmptyRow label="기록된 타임시트가 없어요." />
        ) : (
          <ol className="relative ml-3 pl-4 border-l border-zinc-200">
            {(timesheets as any[])
              .slice()
              .sort((a: any, b: any) => {
                const da = new Date(a?.creation ?? a?.start_date ?? 0).getTime();
                const db = new Date(b?.creation ?? b?.start_date ?? 0).getTime();
                return db - da;
              })
              .map((ts: any, i: number) => {
                const started = ts?.start_date ? new Date(ts.start_date) : ts?.creation ? new Date(ts.creation) : null;
                const ended = ts?.end_date ? new Date(ts.end_date) : null;
                const range =
                  started && ended
                    ? `${dateFormatter.format(started)} ${timeFormatter.format(started)} ~ ${timeFormatter.format(ended)}`
                    : started
                    ? `${dateFormatter.format(started)} ${timeFormatter.format(started)}`
                    : "시간 정보 없음";

                return (
                  <li key={i} className="mb-5">
                    <div className="absolute -left-[7px] top-1">
                      <div className="size-3 rounded-full bg-zinc-300 ring-2 ring-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-medium truncate">{ts?.title ?? "제목 없음"}</div>
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
                      <div className="mt-0.5 text-xs text-zinc-500">{range}</div>
                      {typeof ts?.total_hours === "number" ? <div className="mt-0.5 text-xs text-zinc-600">{ts.total_hours}h</div> : null}
                      {typeof ts?.note === "string" && ts.note ? <div className="mt-1 text-xs text-zinc-700 leading-relaxed">{ts.note}</div> : null}
                    </div>
                  </li>
                );
              })}
          </ol>
        )}
      </section>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 px-2 py-4">
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
