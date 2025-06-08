import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const keyword = url.searchParams.get("keyword");
  const order_by = url.searchParams.get("order_by");
  const status = url.searchParams.get("status");

  params.append("page", url.searchParams.get("page") || "0");
  params.append("size", url.searchParams.get("size") || "10");
  if (keyword) params.append("keyword", keyword);
  if (order_by) params.append("order_by", order_by);
  if (status) params.append("status", status);

  console.log(session, session?.access_token);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}?${params.toString()}`, {
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

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(body),
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
