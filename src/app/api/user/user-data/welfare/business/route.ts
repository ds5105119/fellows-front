import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  // 요청 정보
  const session = await auth();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/welfare/business`, {
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

    return NextResponse.json({ error: "Failed to fetch welfare data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/welfare/business`, {
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

    return NextResponse.json({ error: "Failed to fetch welfare data" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // 요청 정보
  const session = await auth();
  const body = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BUSINESS_DATA_URL}/welfare/business`, {
      method: "PATCH",
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

    return NextResponse.json({ error: "Failed to fetch welfare data" }, { status: 500 });
  }
}
