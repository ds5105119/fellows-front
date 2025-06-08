import { Metadata } from "next";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBusinessDataNullableSchema } from "@/@types/accounts/userdata";
import UserBusinessDataForm from "@/components/form/businessdataform";
export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BUSINESS_DATA_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  const businessData = UserBusinessDataNullableSchema.parse(data);

  return (
    <div className="flex flex-col w-full h-full items-center">
      <div className="w-full max-w-xl px-4 lg:px-8 py-6">
        <h2 className="text-xl font-semibold text-gray-900">비즈니스 정보 편집</h2>
        <p className="text-sm text-gray-500 mt-1">계정 및 앱 설정을 관리하세요</p>
      </div>
      <Tabs defaultValue="data" className="w-full max-w-xl">
        <div className="px-4 lg:px-8 pt-2 pb-6">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="data">
              사업자 정보
            </TabsTrigger>
            <TabsTrigger className="w-full" value="business">
              복지 정보
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="data">
          <UserBusinessDataForm data={businessData} />
        </TabsContent>
        <TabsContent value="business">
          <UserBusinessDataForm data={businessData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
