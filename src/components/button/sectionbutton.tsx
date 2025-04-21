/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * 바닥에 위치하는 세로 방향 Mobile 환경의 NavBar 안의 Item 컴포넌트입니다.
 */
import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  icon?: LucideIcon;
  text?: string;
  label?: string;
  className?: string;
  showChevron?: boolean;
}

export default function SectionButton({ href, icon: Icon, text, label, className, type, showChevron }: SectionButtonProps) {
  return href ? (
    <Link href={href}>
      <Button variant="ghost" className="h-11 w-full !px-2.5 text-lg font-bold cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className={`flex items-center space-x-1.5 ${className}`}>
            {Icon ? <Icon className="!size-6" strokeWidth={2.5} /> : <></>}
            {text ? <p>{text}</p> : <></>}
          </div>
          <div className="flex items-center space-x-1.5">
            <p className="text-base font-medium">{label}</p>
            {showChevron !== false && <ChevronRight className="!size-6 text-muted-foreground" strokeWidth={2.5} />}
          </div>
        </div>
      </Button>
    </Link>
  ) : (
    <Button variant="ghost" className="h-11 w-full !px-2.5 text-lg font-bold cursor-pointer" type={type}>
      <div className="flex items-center justify-between w-full">
        <div className={`flex items-center space-x-1.5 ${className}`}>
          {Icon ? <Icon className="!size-6" strokeWidth={2.5} /> : <></>}
          {text ? <p>{text}</p> : <></>}
        </div>
        <div className="flex items-center space-x-1.5">
          <p className="text-base font-medium">{label}</p>
          {showChevron !== false && <ChevronRight className="!size-6 text-muted-foreground" strokeWidth={2.5} />}
        </div>
      </div>
    </Button>
  );
}
