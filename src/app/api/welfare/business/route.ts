import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const url = new URL(request.url);
  const params = new URLSearchParams();
  const session = await auth();
  const tag = url.searchParams.get("tag");
  const order_by = url.searchParams.get("order_by");
  const keyword = url.searchParams.get("keyword");

  params.append("page", url.searchParams.get("page") || "0");
  params.append("size", url.searchParams.get("size") || "20");
  if (tag) params.append("tag", tag);
  if (order_by) params.append("order_by", order_by);
  if (keyword) params.append("keyword", keyword);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RECOMMEND_BUSINESS_WELFARE_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch welfare data" }, { status: 500 });
  }
}
