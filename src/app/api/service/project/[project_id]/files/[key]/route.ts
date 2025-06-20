import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ project_id: string; key: string }> }) {
  // 요청 정보
  const session = await auth();
  const { project_id, key } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/files/${key}`, {
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

export async function DELETE(request: Request, { params }: { params: Promise<{ project_id: string; key: string }> }) {
  const session = await auth();
  const { project_id, key } = await params;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/files/${key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }

  return NextResponse.json({ message: "File deleted successfully" });
}
