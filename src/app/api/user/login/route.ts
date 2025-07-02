import { signIn } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const callbackParam = req.nextUrl.searchParams.get("callbackUrl") || "/";
  const callbackUrl = new URL(callbackParam, req.nextUrl.origin).toString();

  return signIn("keycloak", { callbackUrl, redirect: true });
}
