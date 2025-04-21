import { z } from "zod";

export const UserDataSchema = z.object({
  id: z.number().optional(),
  sub: z.string().optional(),

  overcome: z.number().default(0),
  household_size: z.number().default(0),

  multicultural: z.boolean().default(false),
  north_korean: z.boolean().default(false),
  single_parent_or_grandparent: z.boolean().default(false),
  homeless: z.boolean().default(false),
  new_resident: z.boolean().default(false),
  multi_child_family: z.boolean().default(false),
  extend_family: z.boolean().default(false),

  disable: z.boolean().default(false),
  veteran: z.boolean().default(false),
  disease: z.boolean().default(false),

  prospective_parents_or_infertility: z.boolean().default(false),
  pregnant: z.boolean().default(false),
  childbirth_or_adoption: z.boolean().default(false),

  farmers: z.boolean().default(false),
  fishermen: z.boolean().default(false),
  livestock_farmers: z.boolean().default(false),
  forestry_workers: z.boolean().default(false),

  unemployed: z.boolean().default(false),
  employed: z.boolean().default(false),

  academic_status: z.number().default(0),
});
export const PartialUserDataSchema = UserDataSchema.partial();

export type UserData = z.infer<typeof UserDataSchema>;
export type PartialUserData = z.infer<typeof PartialUserDataSchema>;
