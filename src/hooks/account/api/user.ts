import {
  LoginRequestProps,
  LoginResponseSchema,
  LoginRequestSchema,
  RegistrationSchema,
  LoginResponseProps,
  RegistrationProps,
} from "@/@types/accounts/api";

export const loginApi = async (credentials: LoginRequestProps): Promise<LoginResponseProps> => {
  try {
    LoginRequestSchema.parse(credentials);

    const response = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      redirect: "manual",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const parsedData = LoginResponseSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};

export const registrationApi = async (credentials: RegistrationProps): Promise<LoginResponseProps> => {
  try {
    RegistrationSchema.parse(credentials);

    const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRATION_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      redirect: "manual",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const parsedData = LoginResponseSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};
