import { z } from "zod";
import { FileRecordSchema } from "../accounts/cloud";

export const Platform = z.enum(["web", "android", "ios"]);
export type Platform = z.infer<typeof Platform>;

export const ReadinessLevel = z.enum(["idea", "requirements", "wireframe"]);
export type ReadinessLevel = z.infer<typeof ReadinessLevel>;

export const ProjectFileRecordsSchema = z.object({
  file_record_key: z.string(),
  project_info_id: z.number().optional().nullable(),
  file_record: FileRecordSchema.nullable().optional(),
});

export const ProjectInfoSchema = z.object({
  project_name: z.string().describe("프로젝트 이름 (예: 'ABC 쇼핑몰 구축')"),
  project_summary: z.string().describe("프로젝트의 주요 목표 및 기능에 대한 간략한 설명 (2-3 문장)"),
  platforms: z.array(Platform).describe("개발 대상 플랫폼"),
  readiness_level: ReadinessLevel.describe("사전 준비도"),

  // --- 기술 및 환경 (선택적 정보) ---
  feature_list: z.array(z.string()).nullable().optional(),
  content_pages: z.number().int().nonnegative().nullable().optional(),
  preferred_tech_stack: z.array(z.string()).nullable().optional(),

  // --- 디자인 요구사항 ---
  design_requirements: z.string().nullable().optional(),
  reference_design_url: z.array(z.string().url()).nullable().optional(),
  files: z.array(ProjectFileRecordsSchema).nullable().optional(),

  // --- 일정 및 기타 ---
  start_date: z.string().date().nullable().optional(),
  desired_deadline: z.string().date().nullable().optional(),
  maintenance_required: z.boolean().default(false),
});

export const GetProjectsRequestSchema = z.object({
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().min(1).max(20).default(10),
  keyword: z.string().nullable().optional(),
  order_by: z.string().default("updated_at.desc"),
});

export const ProjectGroupLinkSchema = z.object({
  group_id: z.string(),
});

export const ProjectSchema = z.object({
  id: z.number().int(),
  sub: z.string(),
  project_id: z.string(),
  status: z.string(),
  groups: z.array(z.string()).default([]),
  ai_estimate: z.string().nullable().optional(),
  emoji: z.string().nullable().optional(),
  total_amount: z.number().nullable().optional(),
  created_at: z.preprocess((val) => {
    if (typeof val === "string") {
      return /([+\-]\d{2}:\d{2}|Z)$/.test(val) ? val : val + "Z";
    }
    return val;
  }, z.coerce.date()),
  updated_at: z.coerce.date(),
  deletable: z.boolean().nullable().optional(),

  project_info: ProjectInfoSchema,
  group_links: z.array(ProjectGroupLinkSchema).default([]),
});

export const ProjectListSchema = z.array(ProjectSchema);
export const ProjectPageSchema = z.object({
  total: z.number().int(),
  items: ProjectListSchema,
});

export const ProjectEstimateFeatureSchema = z.object({
  feature_list: z.array(z.string()),
});

export type ProjectFileRecordsSchemaType = z.infer<typeof ProjectFileRecordsSchema>;
export type ProjectInfoSchemaType = z.infer<typeof ProjectInfoSchema>;
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
export type ProjectListSchemaType = z.infer<typeof ProjectListSchema>;
export type ProjectPageSchemaType = z.infer<typeof ProjectPageSchema>;
export type GetProjectsRequestType = z.infer<typeof GetProjectsRequestSchema>;
export type ProjectGroupLinkSchemaType = z.infer<typeof ProjectGroupLinkSchema>;
export type ProjectEstimateFeatureSchemaType = z.infer<typeof ProjectEstimateFeatureSchema>;
