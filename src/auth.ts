/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * Auth.js를 사용하여 Keycloak 인증 서버와 연동합니다.
 * Access Token을 자동으로 갱신하려 시도하고, 실패하는 경우 로그아웃합니다.
 */

import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { redirect } from "next/navigation";

declare module "next-auth" {
  interface Session {
    access_token: string;
    expires_at: number;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    refresh_expires_at?: number;
    error?: "RefreshTokenError";
  }
}

const expiresIntoAt = (expiresIn: any) => (typeof expiresIn == "number" ? Date.now() + expiresIn * 1000 : 0);

async function refreshAccessToken(token: JWT) {
  if (!token.refresh_token) throw new TypeError("Missing refresh_token");

  const response = await fetch(`${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.AUTH_KEYCLOAK_ID!,
      client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    }),
  });

  const refreshedTokens = await response.json();

  if (!response.ok) throw refreshedTokens;

  token.access_token = refreshedTokens.access_token!;
  token.expires_at = expiresIntoAt(refreshedTokens.expires_in!);
  token.refresh_token = refreshedTokens.refresh_token!;
  token.refresh_expires_at = expiresIntoAt(refreshedTokens.refresh_expires_in!);

  return token;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      account(account) {
        return {
          ...account,
          access_token: account.access_token,
          expires_at: expiresIntoAt(account.expires_in),
          refresh_token: account.refresh_token,
          refresh_expires_at: expiresIntoAt(account.refresh_expires_in),
        };
      },
      checks: [process.env.NODE_ENV === "production" ? "pkce" : "none"],
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      if (account) {
        token.access_token = account.access_token!;
        token.expires_at = account.expires_at!;
        token.refresh_token = account.refresh_token!;
        token.refresh_expires_at = account.refresh_expires_at! as number;
        return token;
      } else if (Date.now() < token.expires_at) {
        return token;
      } else {
        try {
          return await refreshAccessToken(token);
        } catch (error) {
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },
    async session({ session, token }) {
      if (token.error === "RefreshTokenError") {
        redirect("/api/auth/signout");
      }
      session.error = token.error;
      session.access_token = token.access_token;
      session.expires_at = token.expires_at;
      return session;
    },
  },
});
