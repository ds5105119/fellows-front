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
  interface User {
    email: string;
    username: string;
    name: string;
    bio: string;
    phoneNumber: string;
    birthdate: string;
    sub_locality: string;
    email_verified: boolean;
    address: {
      formatted: string;
      street_address: string;
      locality: string;
      region: string;
      postal_code: string;
      country: string;
    };
    gender: string;
    groups: string[];
  }

  interface Session {
    exp: number;
    iat: number;
    jti: string;
    sub: string;
    user: User;
    access_token: string;
    expires_at: number;
    github_access_token?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    exp: number;
    iat: number;
    jti: string;
    sub: string;
    email: string;
    username: string;
    name: string;
    phoneNumber: string;
    bio: string;
    birthdate: string;
    sub_locality: string;
    email_verified: boolean;
    address: {
      formatted: string;
      street_address: string;
      locality: string;
      region: string;
      postal_code: string;
      country: string;
    };
    gender: string;
    groups: string[];
    access_token: string;
    expires_at: number;
    refresh_token: string;
    refresh_token_expires_at: number;
    github_access_token?: string;
    error?: "RefreshTokenError";
  }
}

const expiresIntoAt = (expiresIn: number | undefined) => (typeof expiresIn == "number" ? Date.now() / 1000 + expiresIn - 10 : 0);

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

  const access_token = refreshedTokens.access_token;
  const refresh_token = refreshedTokens.refresh_token || token.refresh_token;
  const expires_at = expiresIntoAt(refreshedTokens.expires_in);
  const refresh_token_expires_at = refreshedTokens.refresh_token_expires_at;

  return {
    ...token,
    access_token,
    expires_at,
    refresh_token,
    refresh_token_expires_at,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      account(account) {
        return account;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        if (account.provider === "keycloak") {
          token = profile as JWT;
          token.access_token = account.access_token || "";
          token.refresh_token = account.refresh_token || "";
          token.expires_at = account.expires_at || 0;
          token.refresh_token_expires_at = expiresIntoAt(
            typeof account.refresh_token_expires_at === "undefined" ? 0 : (account.refresh_token_expires_at as number)
          );
        }
      } else {
        if (Date.now() >= (token.expires_at || 0) * 1000) {
          try {
            return await refreshAccessToken(token);
          } catch {
            token.error = "RefreshTokenError";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.error === "RefreshTokenError") {
        session.error = "RefreshTokenError";
        redirect("/api/auth/signout");
      }
      session.exp = token.exp;
      session.iat = token.iat;
      session.jti = token.jti;
      session.sub = token.sub;
      session.user.address = token.address;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.bio = token.bio;
      session.user.phoneNumber = token.phoneNumber;
      session.user.birthdate = token.birthdate;
      session.user.sub_locality = token.sub_locality;
      session.user.email_verified = token.email_verified;
      session.user.groups = token.groups;
      session.access_token = token.access_token;
      session.expires_at = token.expires_at;
      return session;
    },
  },
});
