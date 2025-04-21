import { Session } from "next-auth";
import { FiscalByYearResponse, FiscalByYearResponseSchema } from "@/@types/openApi/fiscal";

interface getFiscalByYearProps {
  session: Session | null;
}

export const getFiscalByYear = async ({ session }: getFiscalByYearProps): Promise<FiscalByYearResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FISCAL_YEAR_URL}`, {
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
    const parsedData = FiscalByYearResponseSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};
