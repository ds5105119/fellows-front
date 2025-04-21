/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * 바닥에 위치하는 세로 방향 Mobile 환경의 NavBar 안의 Item 컴포넌트입니다.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function NavItem({ href, icon: Icon, label }: NavItemProps) {
  const pathname = usePathname();

  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col items-center justify-center gap-1 px-2 py-1 text-xs transition-colors",
        isActive ? "text-[#4E47F5]" : "text-muted-foreground hover:text-[#4E47F5]"
      )}
    >
      <Icon
        size={24}
        className={cn(
          "transition-colors",
          isActive ? "text-[#4E47F5]" : "text-muted-foreground group-hover:text-[#4E47F5]"
        )}
      />
      <span>{label}</span>
    </Link>
  );
}
