import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_URL || "http://127.0.0.1:8000/api/project";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const session = await auth();
    const body = await request.json();

    const { name } = await params;

    const response = await fetch(`${API_BASE_URL}/issue/${encodeURIComponent(name)}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to update issue", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const session = await auth();

    const { name } = await params;

    const response = await fetch(`${API_BASE_URL}/issue/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to delete issue", details: errorData }, { status: response.status });
    }

    // DELETE는 보통 204 No Content를 반환하므로 빈 응답 처리
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
