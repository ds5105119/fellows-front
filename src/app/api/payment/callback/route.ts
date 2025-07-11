import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_URL}/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify(body),
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
