import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ report_id: string }> }) {
  const session = await auth();
  const report_id = (await params).report_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/estimate/report/${report_id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
