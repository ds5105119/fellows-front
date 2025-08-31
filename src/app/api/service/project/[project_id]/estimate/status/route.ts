import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_URL || "http://127.0.0.1:8000/api/project";

export async function GET(request: NextRequest, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const project_id = (await params).project_id;

  try {
    const response = await fetch(`${API_BASE_URL}/${project_id}/estimate/status`, {
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
