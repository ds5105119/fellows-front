/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * Auth.js의 미들웨어입니다.
 */

import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && !req.nextUrl.pathname.startsWith("/api/user/login")) {
    const loginUrl = new URL("/api/user/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", encodeURIComponent(req.nextUrl.href));
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/service/:path*"],
};
