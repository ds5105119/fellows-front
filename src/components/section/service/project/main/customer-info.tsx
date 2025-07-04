"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Session } from "next-auth";

interface CustomerInfoProps {
  session: Session;
}

export function CustomerInfo({ session }: CustomerInfoProps) {
  return (
    <div className="w-full flex space-x-2.5 px-6 py-4">
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium">성함</div>
        <div className="text-sm font-medium">휴대전화</div>
        <div className="text-sm font-medium">이메일</div>
      </div>
      <div className="flex flex-col space-y-2">
        {!session?.user.name ? (
          <Link href="/service/settings/profile" className="flex items-center select-none space-x-0.5">
            <p className="text-sm font-bold text-blue-500">이름을 등록해주세요</p>
            <ArrowUpRight className="!size-4 text-blue-500" />
          </Link>
        ) : (
          <div className="text-sm font-bold">{session.user.name}</div>
        )}
        {!session?.user.phoneNumber ? (
          <Link href="/service/settings/profile" className="flex items-center select-none space-x-0.5">
            <p className="text-sm font-bold text-blue-500">전화번호를 등록해주세요</p>
            <ArrowUpRight className="!size-4 text-blue-500" />
          </Link>
        ) : (
          <div className="text-sm font-bold">{session.user.phoneNumber}</div>
        )}
        {!session?.user.email ? (
          <Link href="/service/settings/profile" className="flex items-center select-none space-x-0.5">
            <p className="text-sm font-bold text-blue-500">이메일을 등록해주세요</p>
            <ArrowUpRight className="!size-4 text-blue-500" />
          </Link>
        ) : (
          <div className="text-sm font-bold">{session.user.email}</div>
        )}
      </div>
    </div>
  );
}
