import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("sub");

    if (ids.length === 0) {
      return NextResponse.json({ error: "No user IDs provided" }, { status: 400 });
    }

    const params = new URLSearchParams();
    ids.forEach((id) => params.append("sub", id));

    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to fetch user data", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to update user", details: errorData }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
