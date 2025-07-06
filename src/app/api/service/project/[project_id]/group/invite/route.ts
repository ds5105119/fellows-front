import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const project_id = (await params).project_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/group/invite?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to invite user" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to process invitation" }, { status: 500 });
  }
}
