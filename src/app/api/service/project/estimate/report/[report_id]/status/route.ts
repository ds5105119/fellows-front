import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_URL || "http://127.0.0.1:8000/api/project";

export async function GET(request: Request, { params }: { params: Promise<{ report_id: string }> }) {
  const session = await auth();
  const report_id = (await params).report_id;

  try {
    const response = await fetch(`${API_BASE_URL}/estimate/report/${report_id}/status`, {
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

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch issues" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
