import { Metadata } from "next";
import ProjectMainSection from "@/components/section/service/project/estimator/projectmainsection";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12 mt-10 gap-6">
      <div className="col-span-full p-8 md:col-span-10 md:col-start-2 gap-6 border rounded-3xl">
        <ProjectMainSection />
      </div>
    </div>
  );
}
