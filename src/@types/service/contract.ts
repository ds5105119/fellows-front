import { z } from "zod";

export const userERPNextContractSchema = z.object({
  name: z.string(),
  owner: z.string(),
  custom_name: z.string().nullable().optional(),
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
  signed_on: z
    .string()
    .transform((v, ctx) => {
      const d = new Date(v.replace(" ", "T"));
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: "custom", message: "Invalid datetime" });
        return z.NEVER;
      }
      return d;
    })
    .nullable()
    .optional(),
  modified_by: z.string(),
  docstatus: z.number().int(),
  idx: z.number().int(),
  party_name: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  start_date: z.string().date().nullable().optional(),
  end_date: z.string().date().nullable().optional(),
  custom_subscribe: z.boolean().nullable().optional(),
  custom_fee: z.number().int().nullable().optional(),
  custom_down_payment: z.number().nullable().optional(),
  custom_balance: z.number().nullable().optional(),
  custom_maintenance: z.number().int().default(0).nullable().optional(),
  is_signed: z.boolean().nullable().optional(),
  signee: z.string().nullable().optional(),
  signee_company: z.string().nullable().optional(),
  ip_address: z.string().nullable().optional(),
  contract_template: z.string().nullable().optional(),
  contract_terms: z.string().nullable().optional(),
  document_type: z.string().nullable().optional(),
  document_name: z.string().nullable().optional(),
});

export type UserERPNextContract = z.infer<typeof userERPNextContractSchema>;

export const updateERPNextContractSchema = z.object({
  signee: z.string().nullable().optional(),
  signed_on: z.string().datetime().nullable().optional(),
  signee_company: z.string().nullable().optional(),
  ip_address: z.string().nullable().optional(),
  is_signed: z.boolean().nullable().optional(),
});

export type UpdateERPNextContract = z.infer<typeof updateERPNextContractSchema>;

export const erpNextContractRequestSchema = z.object({
  size: z.coerce.number().int().min(1).max(20).default(10).nullable().optional(),
  project_id: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  keyword: z.string().nullable().optional(),
  order_by: z
    .union([z.string(), z.array(z.string())])
    .default("modified")
    .nullable()
    .optional(),
  status: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  start: z.string().date().nullable().optional(),
  end: z.string().date().nullable().optional(),
});

export type ERPNextContractRequest = z.infer<typeof erpNextContractRequestSchema>;

export const erpNextContractPaginatedResponseSchema = z.object({
  items: z.array(userERPNextContractSchema),
});

export type ERPNextContractPaginatedResponse = z.infer<typeof erpNextContractPaginatedResponseSchema>;
