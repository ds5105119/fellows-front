import { signIn } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const encoded = req.nextUrl.searchParams.get("callbackUrl");
  const callbackUrl = encoded ? decodeURIComponent(encoded) : "/";
  return signIn("keycloak", { redirectTo: callbackUrl });
}
