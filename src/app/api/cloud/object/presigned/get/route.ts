import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const headers = new Headers(request.headers);

  const algorithm = url.searchParams.get("algorithm");
  const key = url.searchParams.get("key");
  const sse_key = url.searchParams.get("sse_key");

  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  params.append("algorithm", algorithm || "AES256");
  params.append("key", key);
  if (sse_key) params.append("sse_key", sse_key);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_PRESIGNED_GET_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        ...headers,
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = (await response.json()) ?? {};

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
