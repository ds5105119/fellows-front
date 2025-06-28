import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainQnaSection from "@/components/section/main/mainqnasection";
import { BlurFade } from "@/components/magicui/blur-fade";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <div className="col-span-full pt-24 md:pt-38 pb-8 px-4 lg:px-16">
        <MainSection1 />
      </div>
      <BlurFade className="col-span-full py-8 lg:py-16 px-4 lg:px-16 w-full max-w-[1400px] lg:mx-auto">
        <MainSection2 />
      </BlurFade>
      <BlurFade className="col-span-full py-8 lg:py-16 px-4 lg:px-16 w-full max-w-[1400px] lg:mx-auto">
        <MainSection3 />
      </BlurFade>
      <BlurFade className="col-span-full py-8 lg:py-16 px-4 lg:px-16 w-full max-w-[1400px] lg:mx-auto">
        <MainQnaSection />
      </BlurFade>
      <BlurFade className="col-span-full py-8 lg:py-16 px-4 lg:px-16 w-full max-w-[1400px] lg:mx-auto">
        <MainSection4 />
      </BlurFade>
    </div>
  );
}
