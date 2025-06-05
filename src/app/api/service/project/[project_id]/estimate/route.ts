// app/api/projects/[project_id]/estimate/route.ts
export const runtime = "edge";

import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const project_id = (await params).project_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/estimate`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
  });
  const headers = new Headers(response.headers);

  if (!response.ok || !response.body) {
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ error: "견적 생성 중 오류가 발생했습니다." }), { status: response.status, headers });
  }

  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");

  return new Response(response.body, { headers });
}
