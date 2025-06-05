import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  // 요청 정보
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const key = url.searchParams.get("key");
  const sse_key = url.searchParams.get("sse_key");

  if (!key || !sse_key) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (key) params.append("key", key);
  if (sse_key) params.append("sse_key", sse_key);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_URL}?${params.toString()}`, {
      method: "DELETE",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch file data");
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch file data" }, { status: 400 });
  }

  return NextResponse.json({ message: "File deleted successfully" });
}
