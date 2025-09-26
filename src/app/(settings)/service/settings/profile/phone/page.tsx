import { auth } from "@/auth";
import { Metadata } from "next";
import PhoneUpdateRequest from "@/components/section/setting/phoneupdaterequest";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col w-full md:max-w-xl h-dvh min-h-dvh">
        <div className="w-full max-w-xl px-4 lg:px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900">전화번호 변경</h2>
          <p className="text-sm text-gray-500 whitespace-pre-wrap mt-1">
            {session.user.phone_number ? `현재 전화번호는 ${session.user.phone_number} 입니다` : "현재 등록된 전화번호가 없습니다."} 업데이트하려는 새
            전화번호를 주소를 입력해 주세요.
          </p>
        </div>

        <div className="w-full grow px-4 lg:px-8 pb-6">
          <PhoneUpdateRequest />
        </div>
      </div>
    </div>
  );
}
