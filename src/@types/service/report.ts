import { z } from "zod";
import { erpNextTaskForUserSchema } from "./project";
import { ERPNextTimeSheetForUserSchema } from "./timesheet";

export const DailyReportRequestSchema = z.object({
  date: z.string().date().nullable().optional(),
});

export const MonthlyReportRequestSchema = z.object({
  date: z.string().date().nullable().optional(),
});

export const ERPNextReportSchema = z
  .object({
    name: z.number(),
    creation: z.string().transform((v, ctx) => {
      const d = new Date(v.replace(" ", "T"));
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: "custom", message: "Invalid datetime" });
        return z.NEVER;
      }
      return d;
    }),
    modified: z.string().transform((v, ctx) => {
      const d = new Date(v.replace(" ", "T"));
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: "custom", message: "Invalid datetime" });
        return z.NEVER;
      }
      return d;
    }),

    project: z.string(),
    start_date: z.string().date().nullable().optional(),
    end_date: z.string().date().nullable().optional(),

    summary: z.string().nullable().optional(),
  })
  .passthrough();

export const ReportResponseSchema = z.object({
  report: ERPNextReportSchema,
  tasks: z.array(erpNextTaskForUserSchema),
  timesheets: z.array(ERPNextTimeSheetForUserSchema),
});

export type DailyReportRequest = z.infer<typeof DailyReportRequestSchema>;
export type MonthlyReportRequest = z.infer<typeof MonthlyReportRequestSchema>;
export type ERPNextReport = z.infer<typeof ERPNextReportSchema>;
export type ReportResponse = z.infer<typeof ReportResponseSchema>;
