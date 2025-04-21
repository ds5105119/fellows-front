import { Metadata } from "next";
import MainCarousel from "@/components/section/maincarousel";
import DragScrollContainer from "@/components/section/dragscrollcontainer";
import SectionButton from "@/components/button/sectionbutton";
import Footer from "@/components/footer/footer";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1 min-h-screen flex flex-col gap-6 row-start-2 items-center pt-5 px-6">
        <MainCarousel />
        <SectionButton text="전체 서비스" />
        <DragScrollContainer>{}</DragScrollContainer>
      </main>
      <Footer />
    </div>
  );
}
