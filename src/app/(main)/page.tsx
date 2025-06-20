import { BlurFade } from "@/components/magicui/blur-fade";
import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainQnaSection from "@/components/section/main/mainqnasection";
import MainStartButton from "@/components/section/main/mainstartbutton";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 px-3 lg:px-12 pt-24 md:pt-40 space-y-14 lg:space-y-36">
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
      <MainStartButton />
    </div>
  );
}
