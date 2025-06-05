import React from "react";
import SelectLogo from "../resource/selectlogo";
import NavButtonGroup from "./navbuttongroup";
import { auth } from "@/auth";
import MobileHeader from "./mobileheader";

export default async function MainHeader() {
  const session = await auth();

  return (
    <div className="sticky top-0 z-50">
      <nav className="hidden min-md:flex items-center justify-between px-6 absolute left-1/2 top-6 z-10 h-[60px] w-[584px] rounded-full bg-[hsla(0,0%,93%,0.42)] backdrop-blur-xl -translate-x-1/2 overflow-hidden">
        <SelectLogo />
        <NavButtonGroup session={session} />
      </nav>
      <MobileHeader session={session} />
    </div>
  );
}
