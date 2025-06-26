import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  const session = await auth();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/overview}`, {
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
