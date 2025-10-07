import { auth } from "@/auth";
import { NextResponse } from "next/server";

const DEFAULT_FILE_ERROR_MESSAGE = "Failed to persist file metadata";
const DEFAULT_FILE_SUCCESS_BODY = { message: "File Created successfully" } as const;

const extractErrorMessage = (raw: string | null): string => {
  if (!raw) {
    return DEFAULT_FILE_ERROR_MESSAGE;
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.message === "string" && parsed.message.trim()) {
      return parsed.message;
    }
    if (typeof parsed?.detail === "string" && parsed.detail.trim()) {
      return parsed.detail;
    }
    if (typeof parsed === "string" && parsed.trim()) {
      return parsed;
    }

    return JSON.stringify(parsed);
  } catch {
    return raw;
  }
};

const parseSuccessBody = (raw: string | null): unknown => {
  if (!raw) {
    return DEFAULT_FILE_SUCCESS_BODY;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
};

export async function GET(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  // 요청 정보
  const session = await auth();
  const project_id = (await params).project_id;

  const url = new URL(request.url);
  const queryParams = new URLSearchParams();

  const order_by = url.searchParams.get("order_by");
  const task = url.searchParams.get("task");
  const issue = url.searchParams.get("issue");

  queryParams.append("page", url.searchParams.get("page") || "0");
  queryParams.append("size", url.searchParams.get("size") || "20");
  if (order_by) queryParams.append("order_by", order_by);
  if (task) queryParams.append("task", task);
  if (issue) queryParams.append("issue", issue);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/files?${queryParams.toString()}`, {
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

export async function POST(request: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const session = await auth();
  const body = await request.json();

  const project_id = (await params).project_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}/files`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(body),
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = extractErrorMessage(errorText);

      console.error("Upstream file creation failed:", errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const dataText = await response.text();
    return NextResponse.json(parseSuccessBody(dataText));
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
