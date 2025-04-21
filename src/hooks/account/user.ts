import { loginApi, registrationApi } from "@/hooks/account/api/user";
import { LoginRequestSchema, LoginRequestProps, RegistrationSchema, RegistrationProps } from "@/@types/accounts/api";

export const login = async (
  currentState: {
    code: string;
    message: string;
  },
  formData: FormData
) => {
  const formDataEntries = Object.fromEntries(formData.entries());
  const parseResult = LoginRequestSchema.safeParse(formDataEntries);

  if (!parseResult.success) {
    return { code: "PARSE_ERROR", message: "Validation error", error: parseResult.error.errors };
  }

  try {
    const data: LoginRequestProps = parseResult.data;
    const response = await loginApi(data);
    return { code: "SUCCESS", message: "Login success", data: response, error: undefined };
  } catch (e) {
    return { code: "SERVER_ERROR", message: "Failed to login", error: e };
  }
};

export const registration = async (
  currentState: {
    code: string;
    message: string;
  },
  formData: FormData
) => {
  const formDataEntries = Object.fromEntries(formData.entries());
  const parseResult = RegistrationSchema.safeParse(formDataEntries);

  if (!parseResult.success) {
    return { code: "PARSE_ERROR", message: "Validation error", error: parseResult.error.errors };
  }

  try {
    const data: RegistrationProps = parseResult.data;
    const response = await registrationApi(data);
    return { code: "SUCCESS", message: "registration success", data: response, error: undefined };
  } catch (e) {
    return { code: "SERVER_ERROR", message: "Failed to registration", error: e };
  }
};
