import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const requestUrl = new URL(request.url);
  const queryParams = new URLSearchParams();

  const project_id = (await params).project_id;

  const date = requestUrl.searchParams.get("date");
  if (date) {
    queryParams.append("date", date);
  } else {
    return NextResponse.json({ error: "Missing date query parameter" }, { status: 400 });
  }

  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/report/monthly?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
