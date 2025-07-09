import { z } from "zod";

// AlertDto
export const AlertDtoSchema = z.object({
  id: z.number(),
  sub: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.preprocess((value) => {
    if (typeof value === "string" && !value.endsWith("Z")) {
      return new Date(value + "Z");
    }
    return new Date(value as string);
  }, z.date()),
  link: z.string(),
});

export type AlertDto = z.infer<typeof AlertDtoSchema>;

// UpdateAlertDto
export const UpdateAlertDtoSchema = z.object({
  is_read: z.boolean().optional(),
});

export type UpdateAlertDto = z.infer<typeof UpdateAlertDtoSchema>;

// AlertListQueryDto
export const AlertListQueryDtoSchema = z.object({
  page: z.number(),
  size: z.number(),
});

export type AlertListQueryDto = z.infer<typeof AlertListQueryDtoSchema>;

// AlertPaginatedResponse
export const AlertPaginatedResponseSchema = z.object({
  items: z.array(AlertDtoSchema),
  total: z.number(),
});

export type AlertPaginatedResponse = z.infer<typeof AlertPaginatedResponseSchema>;
