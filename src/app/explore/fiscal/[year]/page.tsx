import { Metadata } from "next";
import { auth } from "@/auth";
import { getFiscalByYear } from "@/hooks/openApi/api/fiscal";
import FiscalDrawer from "@/components/section/fiscaldrawer";
import YearFiscalSection from "@/components/section/yearfiscal";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page({ params }: { params: Promise<{ year?: string }> }) {
  const { year } = await params;
  const session = await auth();
  const data = await getFiscalByYear({ session });

  return (
    <div className="relative flex flex-col w-full min-h-full" id="maindiv">
      <div className="flex space-x-1 items-baseline px-8 mt-12">
        <span className="text-2xl font-bold">한 눈에 보는 우리나라 예산</span>
      </div>
      <FiscalDrawer year={year} data={data} />
      <div className="flex w-full flex-col justify-start space-y-6 px-8 mt-6">
        <YearFiscalSection year={year ?? "2025"} />
      </div>
      <Footer />
    </div>
  );
}
