import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const url = new URL(request.url);
  const params = new URLSearchParams();
  const session = await auth();
  const start_year = url.searchParams.get("start_year");
  const end_year = url.searchParams.get("end_year");

  if (start_year) params.append("start_year", start_year);
  if (end_year) params.append("end_year", end_year);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FISCAL_YEAR_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch welfare data" }, { status: 500 });
  }
}
