"use client";

import { usePathname } from "next/navigation";
import MobileMainHeader from "./mobilemainheader";
import { Session } from "next-auth";

interface MobileHeader {
  text?: string;
  session: Session | null;
}

export default function MobileHeader({ text, session }: MobileHeader) {
  const pathname = usePathname();

  if (pathname == "/") {
    return <MobileMainHeader session={session} />;
  } else if (pathname == "/service/offer/general") {
    return <MobileMainHeader session={session} />;
  } else return <MobileMainHeader session={session} />;
}
