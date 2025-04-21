import { Session } from "next-auth";
import { WelfareSchema, Welfare } from "@/@types/openApi/welfare";

interface getWelfareProps {
  id: number | string;
  session: Session | null;
}

export const getWelfare = async ({ id, session }: getWelfareProps): Promise<Welfare> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WELFARE_URL}?id=${id}`, {
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

    const responseData = await response.json();
    const parsedData = WelfareSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};
