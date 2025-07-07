import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();

    const alert_ids = searchParams.getAll("alert_id");
    alert_ids.forEach((id) => params.append("alert_id", id));

    const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/alert/read?${params.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch issues" }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
