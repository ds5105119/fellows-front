import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_URL || "http://127.0.0.1:8000/api/project";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    const { searchParams } = new URL(request.url);

    // 모든 쿼리 파라미터를 그대로 전달
    const params = new URLSearchParams();

    // 페이지네이션 파라미터
    if (searchParams.get("page")) params.append("page", searchParams.get("page")!);
    if (searchParams.get("size")) params.append("size", searchParams.get("size")!);

    // 정렬 파라미터 (배열 처리)
    const orderBy = searchParams.getAll("order_by");
    orderBy.forEach((order) => params.append("order_by", order));

    // 필터 파라미터 (배열 처리)
    const issueTypes = searchParams.getAll("issue_type");
    issueTypes.forEach((type) => params.append("issue_type", type));

    const projectIds = searchParams.getAll("project_id");
    projectIds.forEach((id) => params.append("project_id", id));

    const statuses = searchParams.getAll("status");
    statuses.forEach((status) => params.append("status", status));

    // 날짜 및 키워드 파라미터
    if (searchParams.get("start")) params.append("start", searchParams.get("start")!);
    if (searchParams.get("end")) params.append("end", searchParams.get("end")!);
    if (searchParams.get("keyword")) params.append("keyword", searchParams.get("keyword")!);

    const response = await fetch(`${API_BASE_URL}/issue?${params.toString()}`, {
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/issue`, {
      method: "POST",
      body: JSON.stringify({ ...body, custom_sub: session?.sub }),
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to create issue", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
