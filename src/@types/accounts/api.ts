import { z } from "zod";
import { ProfileSchema, LoginUserSchema } from "./user";

export const LoginRequestSchema = z.object({
  username: z.string().optional(),
  email: z.string({ required_error: "이메일을 입력해주세요." }).email("올바른 이메일 형식이 아닙니다.").optional(),
  password: z.string({ required_error: "비밀번호를 입력해주세요." }),
});

export const LoginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string().nullable().optional(),
  user: LoginUserSchema,
});

export const RegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password1: z.string(),
  password2: z.string(),
  profile: ProfileSchema,
});

export const TokenRefreshSchema = z.object({
  access: z.string(),
  refresh: z.string().optional(),
});

export type LoginRequestProps = z.infer<typeof LoginRequestSchema>;
export type LoginResponseProps = z.infer<typeof LoginResponseSchema>;
export type RegistrationProps = z.infer<typeof RegistrationSchema>;
export type TokenRefreshProps = z.infer<typeof TokenRefreshSchema>;
