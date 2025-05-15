import React from "react";
import SelectLogo from "../resource/selectlogo";
import NavButtonGroup from "./navbuttongroup";
import { Session } from "next-auth";

interface TopDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export default function MobileMainHeader({ session }: TopDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-50">
      <nav className="hidden min-md:flex items-center justify-between px-6 absolute left-1/2 top-6 z-10 h-[60px] w-[584px] rounded-full bg-[hsla(0,0%,93%,0.42)] backdrop-blur-xl -translate-x-1/2 overflow-hidden">
        <SelectLogo />
        <NavButtonGroup session={session} />
      </nav>
      <nav className="flex min-md:hidden items-center justify-between absolute left-1/2 top-2 z-10 h-14 w-[calc(100vw-48px)] rounded-full bg-[hsla(0,0%,93%,0.42)] backdrop-blur-xl -translate-x-1/2 gap-x-6 px-6">
        <SelectLogo />
        <NavButtonGroup session={session} />
      </nav>
    </div>
  );
}
