import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  // 요청 정보
  const session = await auth();
  const project_id = (await params).project_id;

  const url = new URL(request.url);
  const queryParams = new URLSearchParams();

  const order_by = url.searchParams.get("order_by");
  const task = url.searchParams.get("task");
  const issue = url.searchParams.get("issue");

  queryParams.append("page", url.searchParams.get("page") || "0");
  queryParams.append("size", url.searchParams.get("size") || "20");
  if (order_by) queryParams.append("order_by", order_by);
  if (task) queryParams.append("task", task);
  if (issue) queryParams.append("issue", issue);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/files?${queryParams.toString()}`, {
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

export async function PUT(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const body = await request.json();

  const project_id = (await params).project_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/files`;

  try {
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(body),
      redirect: "follow",
      credentials: "include",
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
