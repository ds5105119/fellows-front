import React from "react";
import Image from "next/image";
import NavButtonGroup from "./navbuttongroup";

interface TopDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  href?: string;
  children?: React.ReactNode;
}

export default function MobileMainHeader({ text, href, children }: TopDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-50">
      <nav className="hidden min-md:flex absolute left-1/2 top-6 z-10 h-[60px] w-[584px] rounded-full bg-[hsla(0,0%,93%,0.72)] backdrop-blur-xl -translate-x-1/2 items-center gap-x-6 px-6 overflow-hidden">
        <div className="flex grow items-center px-2">
          <Image src="/fellows.svg" width={100} height={100} alt="fellows" />
        </div>
        <NavButtonGroup />
      </nav>
      <nav className="flex min-md:hidden absolute left-1/2 top-2 z-10 h-14 w-[calc(100vw-48px)] rounded-full bg-[hsla(0,0%,93%,0.72)] backdrop-blur-xl -translate-x-1/2 items-center gap-x-6 px-6">
        <div className="flex grow items-center px-2">
          <Image src="/fellows.svg" width={100} height={100} alt="fellows" />
        </div>
        <NavButtonGroup />
      </nav>
    </div>
  );
}
