import { auth } from "@/auth";
import { Metadata } from "next";
import CompanySettings from "@/components/section/setting/company";

export const metadata: Metadata = {
  title: "회사 정보 설정 | 복지 정책 서비스",
  description: "계약 및 견적에 활용되는 회사 정보를 최신 상태로 관리하세요.",
};

export default async function Page() {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="h-full w-full md:max-w-xl">
        <div className="w-full max-w-2xl px-4 lg:px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900">회사 정보 관리</h2>
          <p className="text-sm text-gray-500 whitespace-pre-wrap mt-1">계약과 청구에 사용되는 회사 기본 정보를 확인하고 수정할 수 있습니다.</p>
        </div>

        <div className="h-full w-full px-4 lg:px-8 pt-2 pb-6">
          <CompanySettings />
        </div>
      </div>
    </div>
  );
}
