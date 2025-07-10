import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_URL || "http://127.0.0.1:8000/api/project";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();

    params.set("page", searchParams.get("page") ?? "0");
    params.set("size", searchParams.get("size") ?? "10");

    const handleArrayParam = (key: string, fallback?: string) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        values.forEach((v) => params.append(key, v));
      } else if (fallback) {
        params.set(key, fallback);
      }
    };

    handleArrayParam("project_id");
    handleArrayParam("order_by", "modified");
    handleArrayParam("status");

    ["keyword", "start", "end"].forEach((key) => {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    });

    const response = await fetch(`${API_BASE_URL}/contract?${params.toString()}`, {
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
