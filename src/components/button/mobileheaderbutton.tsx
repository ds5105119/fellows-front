/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * 상단 헤더의 버튼 컴포넌트
 */
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  href?: string;
  size?: number;
}

export default function MobileHeaderButton({ icon: Icon, href, size, onClick }: MobileHeaderButtonProps) {
  return href ? (
    <Link href={href}>
      <Button variant="ghost" size="icon" onClick={onClick}>
        <Icon className={size ? `!size-${size}` : "!size-7"} />
      </Button>
    </Link>
  ) : (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Icon className={size ? `!size-${size}` : "!size-7"} />
    </Button>
  );
}
