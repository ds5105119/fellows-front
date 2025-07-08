import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(_request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();

  const { project_id } = await params;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/group/invite/accept`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({ success: true }, { status: response.status });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
