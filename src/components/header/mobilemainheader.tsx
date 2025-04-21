import React from "react";
import Link from "next/link";

interface TopDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  href?: string;
  children?: React.ReactNode;
}

export default function MobileMainHeader({ text, href, children }: TopDetailHeaderProps) {
  return (
    <header className="z-50 w-full border-b bg-background/90 backdrop-blur-xs supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-md items-center justify-between px-4">
        <div className="text-xl font-bold pl-2">{href ? <Link href="href">{text}</Link> : text}</div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
