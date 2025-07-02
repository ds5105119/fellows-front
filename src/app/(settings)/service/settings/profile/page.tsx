import { Metadata } from "next";
import UserProfile from "@/components/section/setting/profile";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="w-full md:max-w-xl">
        <div className="w-full max-w-xl px-4 lg:px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900">계정 정보 변경</h2>
          <p className="text-sm text-gray-500 whitespace-pre-wrap mt-1">계정의 프로필 및 연락처 정보를 변경할 수 있습니다. 모든 정보는 견고하게 보호됩니다.</p>
        </div>

        <div className="w-full px-4 lg:px-8 pt-2 pb-6">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
