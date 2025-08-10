import { z } from "zod";

export const TimeSheetRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(40),
  start_date: z.string().date().nullable().optional(),
  end_date: z.string().date().nullable().optional(),
  project_id: z.string(),
});

export const TimeSheetStatusSchema = z.enum(["Draft", "Submitted", "Cancelled", "Billed"]);

export const TimeSheetDocStatusSchema = z
  .enum(["0", "1", "2"])
  .transform((v) => parseInt(v, 10))
  .or(z.number().int().min(0).max(2));

export const ERPNextTimeSheetSchema = z
  .object({
    // 기본 정보
    name: z.string(),
    owner: z.string(),
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
    modified_by: z.string(),
    docstatus: TimeSheetDocStatusSchema.default(0),
    idx: z.number().int(),
    title: z.string(),
    naming_series: z.string(),
    status: TimeSheetStatusSchema.default("Draft"),

    // 연결 정보
    company: z.string().nullable().optional(),
    customer: z.string().nullable().optional(),
    sales_invoice: z.string().nullable().optional(),
    salary_slip: z.string().nullable().optional(),
    parent_project: z.string().nullable().optional(),
    amended_from: z.string().nullable().optional(),

    // 직원 정보
    employee: z.string().nullable().optional(),
    employee_name: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    user: z.string().nullable().optional(),

    // 날짜 및 시간
    start_date: z.string().date().nullable().optional(),
    end_date: z.string().date().nullable().optional(),
    total_hours: z.number().nullable().optional(),
    total_billable_hours: z.number().nullable().optional(),
    total_billed_hours: z.number().nullable().optional(),

    // 금액 정보
    currency: z.string().nullable().optional(),
    exchange_rate: z.number().nullable().optional(),
    total_billable_amount: z.number().nullable().optional(),
    total_billed_amount: z.number().nullable().optional(),
    total_costing_amount: z.number().nullable().optional(),
    base_total_billable_amount: z.number().nullable().optional(),
    base_total_billed_amount: z.number().nullable().optional(),
    base_total_costing_amount: z.number().nullable().optional(),
    per_billed: z.number().nullable().optional(),

    // 추가 정보
    note: z.string().nullable().optional(),
  })
  .passthrough();

export const ERPNextTimeSheetForUserSchema = z
  .object({
    // 기본 정보
    name: z.string(),
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
    idx: z.number().int(),
    title: z.string(),
    status: TimeSheetStatusSchema.default("Draft"),

    // 연결 정보
    customer: z.string().nullable().optional(),
    parent_project: z.string().nullable().optional(),

    // 날짜 및 시간
    start_date: z.string().date().nullable().optional(),
    end_date: z.string().date().nullable().optional(),
    total_hours: z.number().nullable().optional(),

    // 추가 정보
    note: z.string().nullable().optional(),
  })
  .passthrough();

export const ERPNextTimeSheetForUserListSchema = z.object({
  items: z.array(ERPNextTimeSheetForUserSchema),
});

export type TimeSheetRequest = z.infer<typeof TimeSheetRequestSchema>;
export type ERPNextTimeSheet = z.infer<typeof ERPNextTimeSheetSchema>;
export type ERPNextTimeSheetForUser = z.infer<typeof ERPNextTimeSheetForUserSchema>;
export type ERPNextTimeSheetForUserList = z.infer<typeof ERPNextTimeSheetForUserListSchema>;
