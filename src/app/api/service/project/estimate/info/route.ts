import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const project_summary = url.searchParams.get("project_summary");

  if (!project_summary) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append("project_summary", project_summary);

  const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/estimate/info?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
