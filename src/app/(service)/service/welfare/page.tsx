import { Metadata } from "next";
import { auth } from "@/auth";
import { UserBusinessDataSchema } from "@/@types/accounts/userdata";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import BusinessRecommendWelfareSection from "@/components/section/service/businessrecommendwelfaresection";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BUSINESS_DATA_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  const businessData = UserBusinessDataSchema.parse(data);

  return (
    <div className="flex flex-col w-full h-full items-center space-y-10">
      <div className="flex justify-between items-center w-full h-24 rounded-2xl bg-yellow-400/15 outline-1 outline-yellow-400/50 mt-10 hover:bg-yellow-300/15 transition-colors duration-200">
        <div className="flex flex-col space-y-1 mx-5">
          <div className="flex items-center space-x-2">
            <div className="px-2 py-1 rounded-md bg-amber-400 text-xs font-bold">혜택</div>
            <span className="text-xl font-bold">맞춤 지원 찾기</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">기업 정보를 입력하고 기업 위주에 맞는 혜택을 받아보세요.</span>
        </div>
        <Link href="/service/settings/data/business" className="flex space-x-1 mx-5 items-center cursor-pointer">
          <span className="text-lg font-semibold text-amber-500">기업 정보 입력하기</span>
          <ChevronRight className="text-amber-500" />
        </Link>
      </div>

      <BusinessRecommendWelfareSection />
    </div>
  );
}
