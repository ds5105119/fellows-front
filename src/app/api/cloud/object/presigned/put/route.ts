import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  const url = new URL(request.url);
  const params = new URLSearchParams();
  const name = url.searchParams.get("name");
  const suffix = url.searchParams.get("suffix");

  if (name) params.append("name", name);
  if (suffix) params.append("suffix", suffix);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_URL}/presigned/put?${params.toString()}`, {
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
