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

export const UserBusinessDataSchema = z.object({
  id: z.number().optional(),
  sub: z.string().optional(),

  ja1101: z.boolean().nullable(), // 예비창업자
  ja1102: z.boolean().nullable(), // 영업중
  ja1103: z.boolean().nullable(), // 생계곤란/폐업예정자

  ja1201: z.boolean().nullable(), // 음식적업
  ja1202: z.boolean().nullable(), // 제조업
  ja1299: z.boolean().nullable(), // 기타업종

  ja2101: z.boolean().nullable(), // 중소기업
  ja2102: z.boolean().nullable(), // 사회복지시설
  ja2103: z.boolean().nullable(), // 기관/단체

  ja2201: z.boolean().nullable(), // 제조업
  ja2202: z.boolean().nullable(), // 농업,임업 및 어업
  ja2203: z.boolean().nullable(), // 정보통신업
  ja2299: z.boolean().nullable(), // 기타업종
});
export const UserBusinessDataNullableSchema = UserBusinessDataSchema.nullable();

export type UserData = z.infer<typeof UserDataSchema>;
export type PartialUserData = z.infer<typeof PartialUserDataSchema>;
export type UserBusinessData = z.infer<typeof UserBusinessDataSchema>;
export type UserBusinessDataNullable = z.infer<typeof UserBusinessDataNullableSchema>;
