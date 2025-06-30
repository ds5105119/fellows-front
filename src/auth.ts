import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { UserData, userData } from "@/@types/accounts/userdata";

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
    userData: UserData;
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
    userData?: string;
    groups: string[];
    access_token: string;
    expires_at: number;
    refresh_token: string;
    refresh_token_expires_at: number;
    github_access_token?: string;
    error?: "RefreshTokenError";
  }
}

const expiresIntoAt = (expiresIn: number | undefined) => (typeof expiresIn === "number" ? Date.now() / 1000 + expiresIn - 10 : 0);

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

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  providers: [
    Keycloak({
      account(account) {
        return account;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account, profile, trigger, session }) {
      if (account) {
        // 최초 로그인 시
        token = profile as JWT;
        token.access_token = account.access_token || "";
        token.refresh_token = account.refresh_token || "";
        token.expires_at = account.expires_at || 0;
        token.refresh_token_expires_at = expiresIntoAt(
          typeof account.refresh_token_expires_at === "undefined" ? 0 : (account.refresh_token_expires_at as number)
        );
      } else {
        // 만료되었을 경우 또는 update 호출 시 refresh
        if (Date.now() >= (token.expires_at || 0) * 1000) {
          try {
            return await refreshAccessToken(token);
          } catch {
            token.error = "RefreshTokenError";
          }
        }
      }

      // 세션 업데이트 처리
      if (trigger === "update" && session) {
        console.log("씨발");

        try {
          return await refreshAccessToken(token);
        } catch {
          token.error = "RefreshTokenError";
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
      session.user.userData = userData.parse(JSON.parse(token.userData || "{}"));
      session.user.groups = token.groups;
      session.access_token = token.access_token;
      session.expires_at = token.expires_at;

      return session;
    },
  },
});
