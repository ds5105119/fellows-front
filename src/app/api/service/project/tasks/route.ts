import { ERPNextTasksRequest } from "@/@types/service/project";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params: _params }: { params: Promise<ERPNextTasksRequest> }) {
  // 요청 정보
  const session = await auth();
  const params = await _params;

  const queryParams = new URLSearchParams();

  queryParams.append("page", queryParams.get("page") || "0");
  queryParams.append("size", queryParams.get("size") || "20");

  // Handle order_by: string | string[]
  if (params?.order_by) {
    const orderByValues = Array.isArray(params.order_by) ? params.order_by : [params.order_by];
    orderByValues.forEach((value) => queryParams.append("order_by", value));
  }

  // Handle status: enum | enum[]
  if (params?.status) {
    const statusValues = Array.isArray(params.status) ? params.status : [params.status];
    statusValues.forEach((value) => queryParams.append("status", value));
  }

  if (params?.project_id) {
    queryParams.append("project_id", params.project_id);
  }

  if (params?.start) {
    queryParams.append("start", params.start.toISOString().split("T")[0]);
  }

  if (params?.end) {
    queryParams.append("end", params.end.toISOString().split("T")[0]);
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
