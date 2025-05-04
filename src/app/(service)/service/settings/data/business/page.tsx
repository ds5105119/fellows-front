import { Metadata } from "next";
import { auth } from "@/auth";
import UserBusinessDataForm from "@/components/form/businessdataform";
import { UserBusinessDataNullableSchema } from "@/@types/accounts/userdata";
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
      <div className="w-full pt-22">
        <UserBusinessDataForm data={businessData} />
      </div>
    </div>
  );
}
