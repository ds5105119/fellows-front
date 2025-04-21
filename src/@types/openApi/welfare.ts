import { z } from "zod";

export const WelfareRequestSchema = z.object({
  page: z.number().transform((val) => val.toString()), // number → string 변환
  size: z.number().transform((val) => val.toString()), // number → string 변환
});

export const WelfareSchema = z.object({
  id: z.number(),
  created_at: z.string().datetime({ local: true }).nullable().optional(),
  updated_at: z.string().datetime({ local: true }).nullable().optional(),
  views: z.number(),

  service_id: z.string(),
  service_name: z.string(),
  service_summary: z.string().nullable().optional(),
  service_category: z.string().nullable().optional(),
  service_conditions: z.string().nullable().optional(),
  service_description: z.string().nullable().optional(),

  offc_name: z.string().nullable().optional(),
  dept_name: z.string().nullable().optional(),
  dept_type: z.string().nullable().optional(),
  dept_code: z.string().nullable().optional(),

  apply_period: z.string().nullable().optional(),
  apply_method: z.string().nullable().optional(),
  apply_url: z.string().url().nullable().optional(),
  document: z.string().nullable().optional(),
  receiving_agency: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),

  support_details: z.string().nullable().optional(),
  support_targets: z.string().nullable().optional(),
  support_type: z.string().nullable().optional(),

  detail_url: z.string().url().nullable().optional(),
  law: z.string().nullable().optional(),
});

export const WelfareResponseSchema = z.array(WelfareSchema);

export type WelfareRequest = z.input<typeof WelfareRequestSchema>;
export type Welfare = z.infer<typeof WelfareSchema>;
export type WalfareResponse = z.infer<typeof WelfareResponseSchema>;
