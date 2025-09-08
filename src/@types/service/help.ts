import { z } from "zod";

export const HelpCreateSchema = z.object({
  title: z.string(),
  title_image: z.string(),
  content: z.string(),
  summary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type HelpCreate = z.infer<typeof HelpCreateSchema>;

export const HelpReadSchema = z.object({
  id: z.string(),
  title: z.string(),
  title_image: z.string(),
  content: z.string(),
  summary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type HelpRead = z.infer<typeof HelpReadSchema>;

export const HelpsReadSchema = z.object({
  items: z.array(HelpReadSchema),
});

export type HelpsRead = z.infer<typeof HelpsReadSchema>;

export const HelpUpdateSchema = z.object({
  title: z.string(),
  title_image: z.string(),
  content: z.string(),
  summary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type HelpUpdate = z.infer<typeof HelpUpdateSchema>;
