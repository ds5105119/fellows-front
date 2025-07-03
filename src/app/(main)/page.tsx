import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainSection7 from "@/components/section/main/mainsection7";

import MainCTASection from "@/components/section/main/mainctasection";
import MainQnaSection from "@/components/section/main/mainqnasection";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MeshGradientComponent } from "@/components/resource/meshgradient";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <div className="col-span-full pt-24 md:pt-38 pb-8 px-4 lg:px-16">
        <MainSection1 />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainSection2 />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-24" id="saas">
        <MainSection3 />
      </BlurFade>

      <div className="col-span-full relative">
        <BlurFade className="col-span-full py-10 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
          <MainSection4 />
        </BlurFade>
        <MeshGradientComponent className="opacity-35" colors={["#bcffd6", "#caffe1", "#a8ffd6", "#e9fcee"]} />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainSection7 />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-24 px-4 lg:px-16 w-full lg:mx-auto bg-amber-100">
        <div className="text-center text-3xl md:text-5xl font-extrabold leading-tight">
          <span className="text-amber-500">제대로 된 디자인이 필요하다면?</span>
          <br />
          Fellows에 문의하세요
        </div>
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainQnaSection />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainCTASection />
      </BlurFade>
    </div>
  );
}
