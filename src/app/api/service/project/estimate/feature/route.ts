import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const project_name = url.searchParams.get("project_name");
  const project_summary = url.searchParams.get("project_summary");
  const readiness_level = url.searchParams.get("readiness_level");
  const platforms = url.searchParams.getAll("platforms");

  if (!project_name || !project_summary || !readiness_level || platforms.length === 0) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  params.append("project_name", project_name);
  params.append("project_summary", project_summary);
  params.append("readiness_level", readiness_level);
  platforms.forEach((platform) => params.append("platforms", platform));

  const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/estimate/feature?${params.toString()}`, {
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
