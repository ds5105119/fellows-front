import { NextResponse } from "next/server";
import { update } from "@/auth";

export async function GET() {
  try {
    const refreshed = await update({});
    return NextResponse.json({ success: true, token: refreshed });
  } catch {
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}
