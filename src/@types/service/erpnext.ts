import { z } from "zod";

// --- Enums ---

export const PlatformEnumZod = z.enum(["web", "android", "ios"]);
export type PlatformEnumType = z.infer<typeof PlatformEnumZod>;

export const ReadinessLevelEnumZod = z.enum(["idea", "requirements", "wireframe"]);
export type ReadinessLevelEnumType = z.infer<typeof ReadinessLevelEnumZod>;

export const ERPNextProjectStatusEnumZod = z.enum(["Open", "Completed", "Cancelled"]);
export type ERPNextProjectStatusEnumType = z.infer<typeof ERPNextProjectStatusEnumZod>;

export const CustomProjectStatusEnumZod = z.enum(["draft", "process:1", "process:2", "complete", "maintenance"]);
export type CustomProjectStatusEnumType = z.infer<typeof CustomProjectStatusEnumZod>;

export const IsActiveEnumZod = z.enum(["Yes", "No"]);
export type IsActiveEnumType = z.infer<typeof IsActiveEnumZod>;

export const PercentCompleteMethodEnumZod = z.enum(["Manual", "Task Completion", "Task Progress", "Task Weight"]);
export type PercentCompleteMethodEnumType = z.infer<typeof PercentCompleteMethodEnumZod>;

export const PriorityEnumZod = z.enum(["Medium", "Low", "High"]);
export type PriorityEnumType = z.infer<typeof PriorityEnumZod>;

export const ERPNextTaskStatusEnumZod = z.enum(["Open", "Working", "Pending Review", "Overdue", "Template", "Completed", "Cancelled"]);
export type ERPNextTaskStatusEnumType = z.infer<typeof ERPNextTaskStatusEnumZod>;

export const ERPNextTaskPriorityEnumZod = z.enum(["Low", "Medium", "High", "Urgent"]);
export type ERPNextTaskPriorityEnumType = z.infer<typeof ERPNextTaskPriorityEnumZod>;

export const ERPNextToDoStatusEnumZod = z.enum(["Open", "Closed", "Cancelled"]);
export type ERPNextToDoStatusEnumType = z.infer<typeof ERPNextToDoStatusEnumZod>;

export const ERPNextToDoPriorityEnumZod = z.enum(["High", "Medium", "Low"]);
export type ERPNextToDoPriorityEnumType = z.infer<typeof ERPNextToDoPriorityEnumZod>;

// --- Child Table Zod Schemas for ERPNext ---

export const ERPNextProjectPlatformRowZod = z.object({
  doctype: z.string().default("Platforms"),
  platform: z.string(),
});
export type ERPNextProjectPlatformRowType = z.infer<typeof ERPNextProjectPlatformRowZod>;

export const ERPNextProjectFeatureRowZod = z.object({
  doctype: z.string().default("Features"),
  feature: z.string(),
});
export type ERPNextProjectFeatureRowType = z.infer<typeof ERPNextProjectFeatureRowZod>;

export const ERPNextProjectPreferredTechStackRowZod = z.object({
  doctype: z.string().default("Preferred Tech Stack"),
  stack: z.string(),
});
export type ERPNextProjectPreferredTechStackRowType = z.infer<typeof ERPNextProjectPreferredTechStackRowZod>;

export const ERPNextProjectDesignUrlRowZod = z.object({
  doctype: z.string().default("Project Design Url"),
  url: z.string(),
});
export type ERPNextProjectDesignUrlRowType = z.infer<typeof ERPNextProjectDesignUrlRowZod>;

export const ERPNextProjectFileRowZod = z.object({
  creation: z
    .string()
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  modified: z
    .string()
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),

  doctype: z.string().default("Files"),
  key: z.string(),
  file_name: z.string(),
  algorithm: z.string().default("AES256"),
  sse_key: z.string(),
  uploader: z.string(),
});
export type ERPNextProjectFileRowType = z.infer<typeof ERPNextProjectFileRowZod>;

export const ERPNextProjectUserRowZod = z.object({
  doctype: z.string().default("Project User"),
  user: z.string(),
  welcome_email_sent: z.boolean().nullish().default(false),
});
export type ERPNextProjectUserRowType = z.infer<typeof ERPNextProjectUserRowZod>;

// --- Task and ToDo Zod Schemas ---

export const ERPNextTaskDependsOnRowZod = z
  .object({
    doctype: z.string().default("Task Depends On"),
    task: z.string(),
  })
  .passthrough();
export type ERPNextTaskDependsOnRowType = z.infer<typeof ERPNextTaskDependsOnRowZod>;

export const ERPNextTaskRequestZod = z
  .object({
    subject: z.string(),
    project: z.string().nullish(),
    depends_on: z.array(ERPNextTaskDependsOnRowZod).nullish().default([]),
  })
  .passthrough();
export type ERPNextTaskRequestType = z.infer<typeof ERPNextTaskRequestZod>;

export const ERPNextTaskZod = z
  .object({
    subject: z.string(),
    project: z.string(),
    color: z.string().nullish(),
    status: ERPNextTaskStatusEnumZod.nullish(),
    exp_start_date: z.coerce.date().nullish(),
    expected_time: z.number().nullish().default(0.0),
    exp_end_date: z.coerce.date().nullish(),
    progress: z.number().default(0.0),
    description: z.string().nullish(),
    closing_date: z.coerce.date().nullish(),
  })
  .passthrough();
export type ERPNextTaskType = z.infer<typeof ERPNextTaskZod>;

// ERPNextTaskForUser is identical to ERPNextTask in this Pydantic structure
export const ERPNextTaskForUserZod = ERPNextTaskZod.extend({}); // Or define separately if they diverge
export type ERPNextTaskForUserType = z.infer<typeof ERPNextTaskForUserZod>;

export const ERPNextTaskPaginatedResponseZod = z.object({
  items: z.array(ERPNextTaskForUserZod),
});
export type ERPNextTaskPaginatedResponseType = z.infer<typeof ERPNextTaskPaginatedResponseZod>;

export const ERPNextToDoZod = z
  .object({
    status: ERPNextToDoStatusEnumZod.default(ERPNextToDoStatusEnumZod.Enum.Open),
    priority: ERPNextToDoPriorityEnumZod.default(ERPNextToDoPriorityEnumZod.Enum.Medium),
    color: z.string().nullish(),
    date: z.coerce.date().nullish(),
    allocated_to: z.string().nullish(),
    description: z.string(),
    reference_type: z.string().nullish(),
    reference_name: z.string().nullish(),
    role: z.string().nullish(),
    assigned_by: z.string().nullish(),
  })
  .passthrough();
export type ERPNextToDoType = z.infer<typeof ERPNextToDoZod>;

// --- Main Project Zod Schema ---

export const ERPNextProjectZod = z.object({
  creation: z
    .string()
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  modified: z
    .string()
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),

  naming_series: z.string().nullish().default("PROJ-.####"),
  project_name: z.string(),
  status: ERPNextProjectStatusEnumZod.nullish().default(ERPNextProjectStatusEnumZod.Enum.Open),
  project_type: z.string().nullish(),
  is_active: IsActiveEnumZod.nullish(),
  percent_complete_method: PercentCompleteMethodEnumZod.nullish().default(PercentCompleteMethodEnumZod.Enum["Task Completion"]),
  percent_complete: z.number().nullish(),
  custom_deletable: z.boolean().nullish().default(true),
  tasks: z.array(ERPNextTaskZod).nullish().default([]),

  project_template: z.string().nullish(),
  expected_start_date: z.coerce.date().nullish(),
  expected_end_date: z.coerce.date().nullish(),
  actual_start_date: z.coerce.date().nullish(),
  actual_end_date: z.coerce.date().nullish(),
  actual_time: z.number().nullish(),

  priority: PriorityEnumZod.nullish(),
  department: z.string().nullish(),

  custom_project_title: z.string().nullish(),
  custom_project_summary: z.string().nullish(),
  custom_project_status: CustomProjectStatusEnumZod.nullish().default(CustomProjectStatusEnumZod.Enum.draft),
  custom_ai_estimate: z.string().nullish(),
  custom_emoji: z.string().nullish(),
  custom_design_requirements: z.string().nullish(),
  custom_readiness_level: ReadinessLevelEnumZod.nullish(),
  custom_content_pages: z.number().int().nullish(),
  custom_maintenance_required: z.boolean().nullish().default(false),

  custom_sub: z.string().nullish(),
  custom_platforms: z.array(ERPNextProjectPlatformRowZod).nullish().default([]),
  custom_files: z.array(ERPNextProjectFileRowZod).nullish().default([]),
  custom_features: z.array(ERPNextProjectFeatureRowZod).nullish().default([]),
  custom_preferred_tech_stacks: z.array(ERPNextProjectPreferredTechStackRowZod).nullish().default([]),
  custom_design_urls: z.array(ERPNextProjectDesignUrlRowZod).nullish().default([]),

  estimated_costing: z.number().nullish(),
  total_costing_amount: z.number().nullish(),
  total_expense_claim: z.number().nullish(),
  total_purchase_cost: z.number().nullish(),
  company: z.string().default("Fellows"),
  cost_center: z.string().nullish(),

  total_sales_amount: z.number().nullish(),
  total_billable_amount: z.number().nullish(),
  total_billed_amount: z.number().nullish(),
  total_consumed_material_cost: z.number().nullish(),

  gross_margin: z.number().nullish(),
  per_gross_margin: z.number().nullish(),

  users: z.array(ERPNextProjectUserRowZod).nullish().default([]),
});
export type ERPNextProjectType = z.infer<typeof ERPNextProjectZod>;

export const ERPNextProjectPageSchema = z.object({
  items: z.array(ERPNextProjectZod),
});
export type ERPNextProjectPageType = z.infer<typeof ERPNextProjectPageSchema>;

export const UserERPNextProjectZod = z.object({
  custom_project_title: z.string(),
  custom_project_summary: z.string(),
  custom_readiness_level: ReadinessLevelEnumZod.default(ReadinessLevelEnumZod.Enum.idea),

  expected_start_date: z.string().nullish(),
  expected_end_date: z.string().nullish(),

  custom_content_pages: z.number().int().nullish(),
  custom_maintenance_required: z.boolean().nullish().default(false),

  custom_platforms: z.array(ERPNextProjectPlatformRowZod).nullish().default([]),
  custom_files: z.array(ERPNextProjectFileRowZod).nullish().default([]),
  custom_features: z.array(ERPNextProjectFeatureRowZod).nullish().default([]),
  custom_preferred_tech_stacks: z.array(ERPNextProjectPreferredTechStackRowZod).nullish().default([]),
  custom_design_urls: z.array(ERPNextProjectDesignUrlRowZod).nullish().default([]),
});
export type UserERPNextProjectType = z.infer<typeof UserERPNextProjectZod>;

export const ProjectsRequestZod = z.object({
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().min(1).max(20).default(10),
  keyword: z.string().nullish(),
  order_by: z.string().default("updated_at"),
  status: z.string().nullish(),
});
export type ProjectsRequestType = z.infer<typeof ProjectsRequestZod>;

export const ProjectsPaginatedResponseZod = z.object({
  total: z.number().int(),
  items: z.array(ERPNextProjectZod),
});
export type ProjectsPaginatedResponseType = z.infer<typeof ProjectsPaginatedResponseZod>;
