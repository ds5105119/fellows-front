"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function MobileHeaderSignInButton() {
  return (
    <Button variant="default" type="submit" onClick={() => signIn("keycloak", { redirectTo: "/" })}>
      로그인
    </Button>
  );
}
