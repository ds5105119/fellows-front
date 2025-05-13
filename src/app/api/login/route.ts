import { signIn } from "@/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  return signIn("keycloak", { redirectTo: callbackUrl });
}
