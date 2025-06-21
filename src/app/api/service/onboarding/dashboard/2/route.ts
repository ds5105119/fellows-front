import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();

  // 쿠키 설정
  cookieStore.set("onboarding_2_done", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 100,
  });

  // 원래 페이지로 리다이렉트
  const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
  redirect(redirectUrl);
}
