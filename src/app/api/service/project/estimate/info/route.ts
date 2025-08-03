import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const project_summary = url.searchParams.get("project_summary");

  if (!project_summary) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  params.append("project_summary", project_summary);

  const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/estimate/info?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  try {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status, headers: response.headers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: response.status, headers: response.headers });
  }
}
