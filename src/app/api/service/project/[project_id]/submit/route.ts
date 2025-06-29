import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();

  const project_id = (await params).project_id;

  const url = new URL(request.url);
  const queryParams = new URLSearchParams();
  const date = url.searchParams.get("date");
  const inbound = url.searchParams.get("inbound");

  if (date) queryParams.append("date", date);
  if (inbound) queryParams.append("inbound", inbound);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/submit?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
