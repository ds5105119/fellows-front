import { Metadata } from "next";
import { auth } from "@/auth";
import DetailRecommendWelfareSection from "@/components/section/detailrecommendwelfare";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="px-8 mt-6">
        <span className="text-lg font-semibold leading-tight">{session?.user?.name}님을 위한 복지 정보를 모아봤어요</span>
      </div>
      <div className="flex w-full flex-col justify-start space-y-6 px-8 mt-6">
        <DetailRecommendWelfareSection />
      </div>
      <Footer />
    </div>
  );
}
