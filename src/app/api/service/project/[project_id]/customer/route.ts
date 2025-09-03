import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();

  const project_id = (await params).project_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/customer`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch issues" }, { status: response.status });
    }

    const data = (await response.json()) ?? {};

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
