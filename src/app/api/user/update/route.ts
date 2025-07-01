import { NextResponse } from "next/server";
import { update } from "@/auth";

export async function POST(req: any) {
  try {
    await update({ forceRefresh: true });
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
