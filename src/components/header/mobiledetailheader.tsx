"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  children?: React.ReactNode;
}

export default function MobileDetailHeader({ text, children }: TopDetailHeaderProps) {
  const router = useRouter();

  const handleOnClick = () => {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;
    const canGoBack = referrerDomain ? referrerDomain === currentDomain : false;

    if (canGoBack && window.history.length > 1) {
      window.history.back();
    } else if (referrer) {
      window.location.href = referrer;
    } else {
      router.push("/");
    }
  };

  return (
    <header className="z-50 w-full border-b bg-background/90 backdrop-blur-xs supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex h-14 max-w-screen-md items-center justify-center">
        <div className="absolute left-4">
          <Button variant="ghost" size="icon" onClick={handleOnClick}>
            <ArrowLeft className="!size-7" />
          </Button>
        </div>
        <p className="text-xl font-bold">{text}</p>
        <div className="absolute right-4 flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
