import { BlurFade } from "@/components/magicui/blur-fade";
import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainQnaSection from "@/components/section/main/mainqnasection";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 px-3 lg:px-24 pt-24 md:pt-40 mb-3 md:mb-24">
      <BlurFade className="col-span-full">
        <MainSection1 />
      </BlurFade>
      <BlurFade className="col-span-full mt-14 lg:mt-36">
        <MainSection2 />
      </BlurFade>
      <BlurFade className="col-span-full mt-14 lg:mt-36">
        <MainSection3 />
      </BlurFade>
      <BlurFade className="col-span-full mt-14 lg:mt-36">
        <MainQnaSection />
      </BlurFade>
      <BlurFade className="col-span-full mt-14 lg:mt-36">
        <MainSection4 />
      </BlurFade>
    </div>
  );
}
