import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 요청 정보
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const name = url.searchParams.get("name") || "None";
  const suffix = url.searchParams.get("suffix") || session?.sub;

  if (!name || !suffix) {
    return NextResponse.json({ error: "Suffix and Name is required" }, { status: 400 });
  }

  params.append("name", name);
  params.append("suffix", suffix);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_URL}/presigned/put/sse/c?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const headers = new Headers(response.headers);
    const data = (await response.json()) ?? {};

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
