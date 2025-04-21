import { z } from "zod";

export const ProfileSchema = z.object({
  sex: z.number().int().nullable().optional(),
  birthday: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" })
    .nullable()
    .optional(),
  profile: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  link: z.string().url().nullable().optional(),
});

export const LoginUserSchema = z.object({
  username: z.string(),
  email: z.string({ required_error: "이메일을 입력해주세요." }).email("올바른 이메일 형식이 아닙니다.").optional(),
  resignation_reason: z.string().nullable().optional(),
  profile: ProfileSchema,
});

export type ProfileProps = z.infer<typeof ProfileSchema>;
export type LoginUserProps = z.infer<typeof LoginUserSchema>;
