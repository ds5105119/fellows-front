import { Metadata } from "next";
import RecommendWelfareSection from "@/components/section/recommendwelfare";
import SectionButton from "@/components/button/sectionbutton";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="mx-auto flex w-full flex-col justify-start space-y-6 p-8">
        <SectionButton href="/explore/welfare" text="모든 추천 정책 확인하기" />
        <RecommendWelfareSection />
      </div>
      <div className="mx-auto flex w-full flex-col justify-start space-y-6 p-8">
        <SectionButton href={`/explore/fiscal/${currentYear}`} text="예산 데이터 확인하기" />
      </div>
      <Footer />
    </div>
  );
}
