import { Session } from "next-auth";
import { UserData, UserDataSchema, PartialUserData } from "@/@types/accounts/userdata";

interface getUserDataProps {
  session: Session;
}

interface patchUSerDataProps {
  session: Session;
  data: PartialUserData;
}

export const getUserData = async ({ session }: getUserDataProps): Promise<UserData> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_USERDATA_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = (await response.json()) ?? {};
    const parsedData = UserDataSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};

export const patchUserData = async ({ session, data }: patchUSerDataProps): Promise<UserData | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_USERDATA_URL}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(data),
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};
