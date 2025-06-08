import { Metadata } from "next";
import { auth } from "@/auth";
import { BlurFade } from "@/components/magicui/blur-fade";
import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainQnaSection from "@/components/section/main/mainqnasection";

export const metadata: Metadata = {
  title: "서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 px-3 lg:px-12 pt-28 md:pt-40 space-y-14 lg:space-y-36">
      <BlurFade className="col-span-full">
        <MainSection1 />
      </BlurFade>
      <BlurFade className="col-span-full">
        <MainSection2 />
      </BlurFade>
      <BlurFade className="col-span-full">
        <MainSection3 />
      </BlurFade>
      <BlurFade className="col-span-full">
        <MainQnaSection />
      </BlurFade>
      <BlurFade className="col-span-full">
        <MainSection4 />
      </BlurFade>
    </div>
  );
}
