import { z } from "zod";

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, "사용자 아이디는 4자 이상이어야 합니다.")
      .regex(
        /^[a-zA-Z0-9._]{1,15}$/,
        "사용자 아이디는 15자 이하여야 하며, 공백 없이 문자, 숫자, 밑줄(_), 점(.)만 사용할 수 있습니다."
      ),
    email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
        "영문, 숫자를 포함하여 8자 이상 입력해주세요."
      ),
    confirmPassword: z.string().min(1, "비밀번호를 한번 더 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
