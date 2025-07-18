import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const session = await auth();

  const post_id = (await params).post_id;
  const url = `${process.env.NEXT_PUBLIC_BLOG_URL}/${post_id}`;

  try {
    const response = await fetch(url, {
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

export async function PUT(request: Request, { params }: { params: Promise<{ post_id: string }> }) {
  const session = await auth();
  const body = await request.json();

  const post_id = (await params).post_id;
  const url = `${process.env.NEXT_PUBLIC_BLOG_URL}/${post_id}`;

  try {
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(body),
      redirect: "follow",
      credentials: "include",
    });
    revalidatePath(`/blog/${post_id}`);

    return NextResponse.json("sucess");
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
  const session = await auth();

  const post_id = (await params).post_id;
  const url = `${process.env.NEXT_PUBLIC_BLOG_URL}/${post_id}`;

  try {
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    return NextResponse.json("sucess");
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
