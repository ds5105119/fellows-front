import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  // 요청 정보
  const session = await auth();
  const project_id = (await params).project_id;

  const url = new URL(request.url);
  const queryParams = new URLSearchParams();

  queryParams.append("page", url.searchParams.get("page") || "0");
  queryParams.append("size", url.searchParams.get("size") || "20");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}${project_id}/tasks?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = (await response.json()) ?? {};

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
