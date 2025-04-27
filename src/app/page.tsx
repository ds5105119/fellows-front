import { Metadata } from "next";
import { auth } from "@/auth";
import MainSection1 from "@/components/section/main/mainsection1";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 flex flex-col gap-6 row-start-2 items-center px-6 pt-28">
        <MainSection1 />
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
        <div> ab </div>
      </div>
      <Footer />
    </div>
  );
}
