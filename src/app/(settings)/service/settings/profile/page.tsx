import { Metadata } from "next";
import UserProfile from "@/components/section/setting/profile";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  return (
    <div className="flex flex-col w-full h-full items-center space-y-10 px-8 py-10">
      <UserProfile />
    </div>
  );
}
