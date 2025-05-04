import { Metadata } from "next";
import { auth } from "@/auth";
import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";

export const metadata: Metadata = {
  title: "서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <div className="grid grid-cols-4 lg:grid-cols-12">
      <MainSection1 />
      <MainSection2 />
      <div className="h-[1000px]"></div>
    </div>
  );
}
