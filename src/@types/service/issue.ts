import { z } from "zod";

export const IssueTypeEnum = z.enum(["Design", "Feature", "ETC"], {
  errorMap: () => ({ message: "이슈 유형을 선택해주세요" }),
});
export const TaskStatusEnum = z.enum(["Open", "Working", "Pending Review", "Overdue", "Template", "Completed", "Cancelled"]);

export const IssueSchema = z.object({
  name: z.string(),
  subject: z.string(),
  customer: z.string(),
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
  response_by: z.string().datetime().nullable(),
  sla_resolution_by: z.string().datetime().nullable(),
  first_response_time: z.number().nullable(),
  first_responded_on: z.string().datetime().nullable(),
  status: z.string().nullable(),
  priority: z.string().nullable(),
  issue_type: IssueTypeEnum.nullable(),
  description: z.string().nullable(),
  on_hold_since: z.string().datetime().nullable(),
  total_hold_time: z.number().nullable(),
  avg_response_time: z.number().nullable(),
  project: z.string().nullable(),
  company: z.string().nullable(),
  custom_task: z.string().nullable().optional(),
});

export const IssueListResponseSchema = z.object({
  items: z.array(IssueSchema),
});

export const CreateIssueSchema = z.object({
  subject: z.string().min(1, "제목을 입력해주세요"),
  project: z.string().min(1, "프로젝트를 선택해주세요"),
  priority: z.string().optional(),
  issue_type: IssueTypeEnum,
  description: z.string().min(1, "설명을 입력해주세요"),
  custom_task: z.string().optional(),
});

export const UpdateIssueSchema = z.object({
  subject: z.string().optional(),
  project: z.string().optional(),
  priority: z.string().optional(),
  issue_type: IssueTypeEnum.optional(),
  description: z.string().optional(),
  custom_task: z.string().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;
export type IssueType = z.infer<typeof IssueTypeEnum>;
export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export type CreateIssueData = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueData = z.infer<typeof UpdateIssueSchema>;
export type IssueListResponse = z.infer<typeof IssueListResponseSchema>;
