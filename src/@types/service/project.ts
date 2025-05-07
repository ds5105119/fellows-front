import { z } from "zod";

export const Platform = z.enum(["web", "android", "ios"]);
export type Platform = z.infer<typeof Platform>;

export const ReadinessLevel = z.enum(["idea", "requirements", "wireframe"]);
export type ReadinessLevel = z.infer<typeof ReadinessLevel>;

export const ProjectInfoSchema = z.object({
  project_name: z.string().describe("프로젝트 이름 (예: 'ABC 쇼핑몰 구축')"),
  project_summary: z.string().describe("프로젝트의 주요 목표 및 기능에 대한 간략한 설명 (2-3 문장)"),
  platforms: z.array(Platform).describe("개발 대상 플랫폼"),
  readiness_level: ReadinessLevel.describe("사전 준비도"),

  // --- 디자인 요구사항 ---
  design_requirements: z
    .string()
    .nullable()
    .optional()
    .describe("디자인 관련 구체적인 요구사항 (예: '제공된 Figma 시안 기반 개발', '애니메이션 효과 중요', '브랜드 가이드라인 준수')"),

  // --- 기능 요구사항 (선택적이지만 구체적일수록 좋음) ---
  feature_list: z
    .array(z.string())
    .nullable()
    .optional()
    .describe("구현해야 할 주요 기능 키워드 목록 (예: 실시간 채팅, 대시보드, 푸시 메시지, 알림톡, PG 연동(토스 등), AWS, GA, 로그 등)"),
  i18n_support: z.boolean().default(false).describe("다국어 지원 필요 여부"),
  content_pages: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .optional() // ge=0 -> nonnegative
    .describe("단순 콘텐츠 페이지 예상 개수"),

  // --- 기술 및 환경 (선택적 정보) ---
  preferred_tech_stack: z.array(z.string()).nullable().optional().describe("선호하는 기술 스택 목록 (예: ['React', 'Node.js', 'PostgreSQL', 'AWS'])"),
  security_compliance: z.array(z.string()).default([]).describe("반드시 준수해야 할 보안 표준 또는 컴플라이언스 목록 (예: 'ISMS', '개인정보보호법')"),

  // --- 일정 및 기타 ---
  start_date: z.string().date().nullable().optional().default(new Date().toISOString().split("T")[0]).describe("희망 시작일 (YYYY-MM-DD)"),
  desired_deadline: z.string().date().nullable().optional().describe("희망 완료일 (YYYY-MM-DD)"),
  maintenance_required: z.boolean().default(false).describe("출시 후 별도의 기술 지원 또는 유지보수 계약 필요 여부"),
});

export const GetProjectsRequestSchema = z.object({
  page: z.number().int().nonnegative().default(0).describe("Page number"), // ge=0
  size: z.number().int().min(1).max(20).default(10).describe("Page size"), // ge=1, le=20
  keyword: z.string().nullable().optional(),
  order_by: z.string().default("updated_at"),
});

export const ProjectGroupLinkSchema = z.object({
  group_id: z.string(),
});

export const ProjectSchema = z.object({
  id: z.number().int(),
  sub: z.string(),
  project_id: z.string(),
  status: z.string(),
  ai_estimate: z.string().nullable().optional(),
  created_at: z.preprocess((val) => {
    if (typeof val === "string") {
      return /([+\-]\d{2}:\d{2}|Z)$/.test(val) ? val : val + "Z";
    }
    return val;
  }, z.coerce.date()),
  updated_at: z.preprocess((val) => {
    if (typeof val === "string") {
      return /([+\-]\d{2}:\d{2}|Z)$/.test(val) ? val : val + "Z";
    }
    return val;
  }, z.coerce.date()),

  project_info: ProjectInfoSchema,
  group_links: z.array(ProjectGroupLinkSchema).default([]),
});

export const ProjectListSchema = z.array(ProjectSchema);

export type ProjectInfoSchemaType = z.infer<typeof ProjectInfoSchema>;
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
export type ProjectListSchemaType = z.infer<typeof ProjectListSchema>;
export type GetProjectsRequestType = z.infer<typeof GetProjectsRequestSchema>;
export type ProjectGroupLinkSchemaType = z.infer<typeof ProjectGroupLinkSchema>;
