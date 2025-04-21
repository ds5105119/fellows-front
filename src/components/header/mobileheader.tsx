"use client";

import { usePathname } from "next/navigation";
import MobileDetailHeader from "./mobiledetailheader";
import MobileMainHeader from "./mobilemainheader";
import MobileHeaderButton from "@/components/button/mobileheaderbutton";
import MobileHeaderShareButton from "../button/mobileheadersharebutton";
import MobileHeaderSignInButton from "../button/mobileheadersigninbutton";
import { Search, Settings } from "lucide-react";
import { Session } from "next-auth";

interface MobileHeader {
  text?: string;
  session: Session | null;
}

export default function MobileHeader({ text, session }: MobileHeader) {
  const pathname = usePathname();

  if (pathname == "/") {
    return (
      <MobileMainHeader text={text}>
        <MobileHeaderButton icon={Search} />
      </MobileMainHeader>
    );
  } else if (pathname == "/explore") {
    return (
      <MobileMainHeader text={text}>
        <MobileHeaderButton icon={Search} />
      </MobileMainHeader>
    );
  } else if (pathname == "/explore/welfare") {
    return <MobileDetailHeader text={text} />;
  } else if (pathname.startsWith("/explore/welfare/")) {
    return (
      <MobileDetailHeader text={"정책 세부"}>
        <MobileHeaderShareButton />
      </MobileDetailHeader>
    );
  } else if (pathname == "/accounts") {
    return <MobileMainHeader text={"내 정보"}>{session?.user ? <MobileHeaderButton icon={Settings} /> : <MobileHeaderSignInButton />}</MobileMainHeader>;
  } else if (pathname == "/accounts/welfare/data") {
    return <MobileDetailHeader text="내 가구 정보" />;
  } else if (pathname == "/explore/fiscal") {
    return (
      <MobileMainHeader text={"예산 확인하기"}>
        <MobileHeaderButton icon={Search} />
      </MobileMainHeader>
    );
  } else if (pathname.startsWith("/explore/fiscal")) {
    return <MobileDetailHeader text="세부 예산 정보" />;
  }
}
