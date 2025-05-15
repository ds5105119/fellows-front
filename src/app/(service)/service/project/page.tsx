import { Metadata } from "next";
import ProjectMainSection from "@/components/section/service/project/main/projectmainsection";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12 gap-6 mb-8">
      <div className="col-span-full">
        <ProjectMainSection />
      </div>
    </div>
  );
}
