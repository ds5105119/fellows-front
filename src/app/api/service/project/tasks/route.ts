import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const session = await auth();
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "20";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const project_id = searchParams.get("project_id");
  const order_by = searchParams.getAll("order_by");
  const status = searchParams.getAll("status");
  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;

  const queryParams = new URLSearchParams();

  queryParams.append("page", page ?? "0");
  queryParams.append("size", size ?? "20");

  // Handle order_by: string | string[]
  if (order_by) {
    const orderByValues = Array.isArray(order_by) ? order_by : [order_by];
    orderByValues.forEach((value) => queryParams.append("order_by", value));
  }

  // Handle status: enum | enum[]
  if (status) {
    const statusValues = Array.isArray(status) ? status : [status];
    statusValues.forEach((value) => queryParams.append("status", value));
  }

  if (project_id) {
    queryParams.append("project_id", project_id);
  }

  if (startDate) {
    queryParams.append("start", startDate.toISOString().split("T")[0]);
  }

  if (endDate) {
    queryParams.append("end", endDate.toISOString().split("T")[0]);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/tasks?${queryParams.toString()}`, {
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
