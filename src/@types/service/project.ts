// zodSchemas.ts
import { z } from "zod";

// --- Enums ---

export const platformEnum = z.enum(["web", "android", "ios"]);
export const readinessLevelEnum = z.enum(["idea", "requirements", "wireframe"]);
export const erpNextProjectStatusEnum = z.enum(["Open", "Completed", "Cancelled"]);
export const customProjectStatusEnum = z.enum(["draft", "process:1", "process:2", "complete", "maintenance"]);
export const isActiveEnum = z.enum(["Yes", "No"]);
export const percentCompleteMethodEnum = z.enum(["Manual", "Task Completion", "Task Progress", "Task Weight"]);
export const priorityEnum = z.enum(["Medium", "Low", "High"]);
export const erpNextTaskStatusEnum = z.enum(["Open", "Working", "Pending Review", "Overdue", "Template", "Completed", "Cancelled"]);
export const erpNextTaskPriorityEnum = z.enum(["Low", "Medium", "High", "Urgent"]);
export const erpNextToDoStatusEnum = z.enum(["Open", "Closed", "Cancelled"]);
export const erpNextToDoPriorityEnum = z.enum(["High", "Medium", "Low"]);
export type ERPNextTaskStatus = z.infer<typeof erpNextTaskStatusEnum>;

// --- Child Table Models for ERPNext ---

export const erpNextProjectPlatformRowSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Platforms"),
    platform: z.string(),
  })
  .passthrough();
export type ERPNextProjectPlatformRow = z.infer<typeof erpNextProjectPlatformRowSchema>;

export const erpNextProjectFeatureRowSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Features"),
    feature: z.string(),
  })
  .passthrough();
export type ERPNextProjectFeatureRow = z.infer<typeof erpNextProjectFeatureRowSchema>;

export const erpNextProjectPreferredTechStackRowSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Preferred Tech Stack"),
    stack: z.string(),
  })
  .passthrough();
export type ERPNextProjectPreferredTechStackRow = z.infer<typeof erpNextProjectPreferredTechStackRowSchema>;

export const erpNextProjectDesignUrlRowSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Project Design Url"),
    url: z.string().url(),
  })
  .passthrough();
export type ERPNextProjectDesignUrlRow = z.infer<typeof erpNextProjectDesignUrlRowSchema>;

export const erpNextProjectUserRowSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Project User"),
    user: z.string(),
    welcome_email_sent: z.boolean().optional().nullable().default(false),
  })
  .passthrough();
export type ERPNextProjectUserRow = z.infer<typeof erpNextProjectUserRowSchema>;

// --- Main Project Model ---

export const erpNextProjectSchema = z
  .object({
    creation: z.coerce.date().optional().nullable(),
    modified: z.coerce.date().optional().nullable(),
    naming_series: z.string().default("PROJ-.####"),
    project_name: z.string(),
    status: erpNextProjectStatusEnum.optional().nullable().default("Open"),
    project_type: z.string().optional().nullable(),
    is_active: isActiveEnum.optional().nullable(),
    percent_complete_method: percentCompleteMethodEnum.optional().nullable().default("Task Completion"),
    percent_complete: z.number().optional().nullable(),
    custom_deletable: z.boolean().optional().nullable().default(true),
    project_template: z.string().optional().nullable(),
    expected_start_date: z.coerce.date().optional().nullable(),
    expected_end_date: z.coerce.date().optional().nullable(),
    actual_start_date: z.coerce.date().optional().nullable(),
    actual_end_date: z.coerce.date().optional().nullable(),
    actual_time: z.number().optional().nullable(),
    priority: priorityEnum.optional().nullable(),
    department: z.string().optional().nullable(),
    custom_project_title: z.string().optional().nullable(),
    custom_project_summary: z.string().optional().nullable(),
    custom_project_status: customProjectStatusEnum.optional().nullable().default("draft"),
    custom_ai_estimate: z.string().optional().nullable(),
    custom_emoji: z.string().optional().nullable(),
    custom_readiness_level: readinessLevelEnum.optional().nullable(),
    custom_content_pages: z.number().int().optional().nullable(),
    custom_maintenance_required: z.boolean().optional().nullable().default(false),
    custom_sub: z.string().optional().nullable(),
    custom_platforms: z.array(erpNextProjectPlatformRowSchema).optional().nullable().default([]),
    custom_features: z.array(erpNextProjectFeatureRowSchema).optional().nullable().default([]),
    custom_preferred_tech_stacks: z.array(erpNextProjectPreferredTechStackRowSchema).optional().nullable().default([]),
    custom_design_urls: z.array(erpNextProjectDesignUrlRowSchema).optional().nullable().default([]),
    estimated_costing: z.number().optional().nullable(),
    total_costing_amount: z.number().optional().nullable(),
    total_expense_claim: z.number().optional().nullable(),
    total_purchase_cost: z.number().optional().nullable(),
    company: z.string().default("Fellows"),
    cost_center: z.string().optional().nullable(),
    total_sales_amount: z.number().optional().nullable(),
    total_billable_amount: z.number().optional().nullable(),
    total_billed_amount: z.number().optional().nullable(),
    total_consumed_material_cost: z.number().optional().nullable(),
    gross_margin: z.number().optional().nullable(),
    per_gross_margin: z.number().optional().nullable(),
    users: z.array(erpNextProjectUserRowSchema).optional().nullable().default([]),
  })
  .passthrough();
export type ERPNextProject = z.infer<typeof erpNextProjectSchema>;

export const userERPNextProjectSchema = z.object({
  creation: z.coerce.date().optional().nullable(),
  modified: z.coerce.date().optional().nullable(),

  project_name: z.string(),
  status: erpNextProjectStatusEnum.optional().nullable().default("Open"),
  project_type: z.string().optional().nullable(),
  is_active: isActiveEnum.optional().nullable(),
  percent_complete: z.number().optional().nullable(),
  custom_deletable: z.boolean().optional().nullable().default(true),

  expected_start_date: z.coerce.date().optional().nullable(),
  expected_end_date: z.coerce.date().optional().nullable(),
  actual_start_date: z.coerce.date().optional().nullable(),
  actual_end_date: z.coerce.date().optional().nullable(),
  actual_time: z.number().optional().nullable(),

  custom_project_title: z.string().optional().nullable(),
  custom_project_summary: z.string().optional().nullable(),
  custom_project_status: customProjectStatusEnum.optional().nullable().default("draft"),
  custom_ai_estimate: z.string().optional().nullable(),
  custom_emoji: z.string().optional().nullable(),
  custom_readiness_level: readinessLevelEnum.optional().nullable(),
  custom_content_pages: z.number().int().optional().nullable(),
  custom_maintenance_required: z.boolean().optional().nullable().default(false),

  custom_sub: z.string().optional().nullable(),
  custom_platforms: z.array(erpNextProjectPlatformRowSchema).optional().nullable().default([]),
  custom_features: z.array(erpNextProjectFeatureRowSchema).optional().nullable().default([]),
  custom_preferred_tech_stacks: z.array(erpNextProjectPreferredTechStackRowSchema).optional().nullable().default([]),
  custom_design_urls: z.array(erpNextProjectDesignUrlRowSchema).optional().nullable().default([]),

  estimated_costing: z.number().optional().nullable(),
  users: z.array(erpNextProjectUserRowSchema).optional().nullable().default([]),
});
export type UserERPNextProject = z.infer<typeof userERPNextProjectSchema>;

export const overviewERPNextProjectSchema = z.object({
  creation: z.coerce.date().optional().nullable(),
  modified: z.coerce.date().optional().nullable(),

  project_name: z.string(),
  custom_project_title: z.string().optional().nullable(),
  custom_project_status: customProjectStatusEnum.optional().nullable().default("draft"),

  custom_sub: z.string().optional().nullable(),
});

export type OverviewERPNextProject = z.infer<typeof overviewERPNextProjectSchema>;

export const createERPNextProjectSchema = z.object({
  custom_project_title: z.string(),
  custom_project_summary: z.string(),
  custom_readiness_level: z.string(),

  expected_start_date: z.string().optional().nullable(),
  expected_end_date: z.string().optional().nullable(),

  custom_content_pages: z.number().int().optional().nullable(),
  custom_maintenance_required: z.boolean().optional().nullable(),

  custom_platforms: z.array(erpNextProjectPlatformRowSchema).optional().default([]),
  custom_features: z.array(erpNextProjectFeatureRowSchema).optional().nullable().default([]),
  custom_preferred_tech_stacks: z.array(erpNextProjectPreferredTechStackRowSchema).optional().nullable().default([]),
  custom_design_urls: z.array(erpNextProjectDesignUrlRowSchema).optional().nullable().default([]),
});
export type CreateERPNextProject = z.infer<typeof createERPNextProjectSchema>;

export const updateERPNextProjectSchema = z.object({
  custom_project_title: z.string().optional().nullable(),
  custom_project_summary: z.string().optional().nullable(),
  custom_readiness_level: readinessLevelEnum.optional().nullable(),
  is_active: isActiveEnum.optional().nullable(),
  expected_start_date: z.coerce.date().optional().nullable(),
  expected_end_date: z.coerce.date().optional().nullable(),
  custom_content_pages: z.number().int().optional().nullable(),
  custom_maintenance_required: z.boolean().optional().nullable(),
  custom_project_status: customProjectStatusEnum.optional().nullable(),
  custom_platforms: z.array(erpNextProjectPlatformRowSchema).optional().default([]),
  custom_features: z.array(erpNextProjectFeatureRowSchema).optional().nullable().default([]),
  custom_preferred_tech_stacks: z.array(erpNextProjectPreferredTechStackRowSchema).optional().nullable().default([]),
  custom_design_urls: z.array(erpNextProjectDesignUrlRowSchema).optional().nullable().default([]),
});
export type UpdateERPNextProject = z.infer<typeof updateERPNextProjectSchema>;

export const erpNextProjectsRequestSchema = z.object({
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().min(1).max(20).default(10),
  keyword: z.string().optional().nullable(),
  order_by: z.string().default("modified"),
  status: z.string().optional().nullable(),
});
export type ERPNextProjectsRequest = z.infer<typeof erpNextProjectsRequestSchema>;

export const projectsPaginatedResponseSchema = z.object({
  items: z.array(userERPNextProjectSchema),
});
export type ProjectsPaginatedResponse = z.infer<typeof projectsPaginatedResponseSchema>;

export const overviewProjectsPaginatedResponseSchema = z.object({
  items: z.array(overviewERPNextProjectSchema),
});
export type OverviewProjectsPaginatedResponse = z.infer<typeof overviewProjectsPaginatedResponseSchema>;

// --- Task Models ---

export const erpNextTaskDependsOnRowSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Task Depends On"),
    task: z.string(),
  })
  .passthrough();
export type ERPNextTaskDependsOnRow = z.infer<typeof erpNextTaskDependsOnRowSchema>;

export const erpNextTaskRequestSchema = z
  .object({
    subject: z.string(),
    project: z.string().optional().nullable(),
    depends_on: z.array(erpNextTaskDependsOnRowSchema).optional().nullable().default([]),
  })
  .passthrough();
export type ERPNextTaskRequest = z.infer<typeof erpNextTaskRequestSchema>;

export const erpNextTasksRequestSchema = z.object({
  page: z.number().int().min(0).nullable().optional(),
  size: z.number().int().min(0).max(100).nullable().optional(),
  order_by: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
  status: z
    .union([erpNextTaskStatusEnum, z.array(erpNextTaskStatusEnum)])
    .nullable()
    .optional(),
  project_id: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
  keyword: z.string().nullable().optional(),
  start: z.coerce.date().nullable().optional(),
  end: z.coerce.date().nullable().optional(),
});
export type ERPNextTasksRequest = z.infer<typeof erpNextTasksRequestSchema>;

export const erpNextTaskSchema = z
  .object({
    subject: z.string(),
    project: z.string(),
    issue: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    is_group: z.boolean().default(false),
    is_template: z.boolean().default(false),
    custom_is_user_visible: z.boolean().default(false),
    custom_sub: z.string().optional().nullable(),
    status: erpNextTaskStatusEnum.optional().nullable(),
    priority: erpNextTaskPriorityEnum.optional().nullable(),
    task_weight: z.number().optional().nullable(),
    parent_task: z.string().optional().nullable(),
    completed_by: z.string().optional().nullable(),
    completed_on: z.coerce.date().optional().nullable(),
    exp_start_date: z.coerce.date().optional().nullable(),
    expected_time: z.number().default(0.0),
    start: z.number().int().optional().nullable(),
    exp_end_date: z.coerce.date().optional().nullable(),
    progress: z.number().optional().nullable(),
    duration: z.number().int().optional().nullable(),
    is_milestone: z.boolean().default(false),
    description: z.string().optional().nullable(),
    depends_on: z.array(erpNextTaskDependsOnRowSchema).optional().nullable().default([]),
    review_date: z.coerce.date().optional().nullable(),
    closing_date: z.coerce.date().optional().nullable(),
    department: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
  })
  .passthrough();
export type ERPNextTask = z.infer<typeof erpNextTaskSchema>;

const baseTaskSchema = z.object({
  name: z.string(),
  subject: z.string(),
  project: z.string(),
  color: z.string().optional().nullable(),
  status: erpNextTaskStatusEnum.optional().nullable(),
  exp_start_date: z.coerce.date().optional().nullable(),
  expected_time: z.number().default(0.0),
  exp_end_date: z.coerce.date().optional().nullable(),
  parent_task: z.string().optional().nullable(),
  progress: z.number().default(0.0),
  description: z.string().optional().nullable(),
  closing_date: z.coerce.date().optional().nullable(),
});

type BaseTask = z.infer<typeof baseTaskSchema>;

export type ERPNextTaskForUser = BaseTask & {
  subRows?: ERPNextTaskForUser[];
};

export const erpNextTaskForUserSchema = baseTaskSchema
  .extend({
    subRows: z.array(z.lazy(() => erpNextTaskForUserSchema)).optional(),
  })
  .passthrough() as z.ZodType<ERPNextTaskForUser>;

export const erpNextTaskPaginatedResponseSchema = z.object({
  items: z.array(erpNextTaskForUserSchema),
});
export type ERPNextTaskPaginatedResponse = z.infer<typeof erpNextTaskPaginatedResponseSchema>;

export const erpNextToDoSchema = z
  .object({
    status: erpNextToDoStatusEnum.default("Open"),
    priority: erpNextToDoPriorityEnum.default("Medium"),
    color: z.string().optional().nullable(),
    date: z.coerce.date().optional().nullable(),
    allocated_to: z.string().optional().nullable(),
    description: z.string(),
    reference_type: z.string().optional().nullable(),
    reference_name: z.string().optional().nullable(),
    role: z.string().optional().nullable(),
    assigned_by: z.string().optional().nullable(),
  })
  .passthrough();
export type ERPNextToDo = z.infer<typeof erpNextToDoSchema>;

// --- File Models ---

export const erpNextFileSchema = z
  .object({
    doctype: z.string().optional().nullable().default("Files"),
    creation: z.coerce.date().optional().nullable(),
    modified: z.coerce.date().optional().nullable(),
    file_name: z.string(),
    key: z.string(),
    uploader: z.string(),
    algorithm: z.string().default("AES256"),
    sse_key: z.string().optional().nullable(),
    project: z.string().optional().nullable(),
    task: z.string().optional().nullable(),
    issue: z.string().optional().nullable(),
  })
  .passthrough();
export type ERPNextFile = z.infer<typeof erpNextFileSchema>;

export const erpNextFileRequestSchema = z.object({
  size: z.number().int().min(0).max(100).default(20),
  order_by: z.string().optional().nullable(),
  task: z.string().optional().nullable(),
  issue: z.string().optional().nullable(),
});
export type ERPNextFileRequest = z.infer<typeof erpNextFileRequestSchema>;

// Note: The Pydantic model for ERPNextFilesResponse was likely a typo.
// A response should contain a list of file objects (ERPNextFile), not a list of request objects.
export const erpNextFilesResponseSchema = z.object({
  items: z.array(erpNextFileSchema),
});
export type ERPNextFilesResponse = z.infer<typeof erpNextFilesResponseSchema>;

// --- Estimate Models ---

export const projectFeatureEstimateRequestSchema = z.object({
  project_name: z.string(),
  project_summary: z.string(),
  readiness_level: readinessLevelEnum,
  platforms: z.array(platformEnum),
});
export type ProjectFeatureEstimateRequest = z.infer<typeof projectFeatureEstimateRequestSchema>;

export const projectFeatureEstimateResponseSchema = z.object({
  feature_list: z.array(z.string()),
});
export type ProjectFeatureEstimateResponse = z.infer<typeof projectFeatureEstimateResponseSchema>;
