import { Metadata } from "next";
import { auth } from "@/auth";
import ProjectMainSection from "@/components/section/service/project/main/projectmainsection";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  const session = await auth();

  return (
    <div className="w-full mb-8">
      <div className="w-full">
        <ProjectMainSection session={session} />
      </div>
    </div>
  );
}
