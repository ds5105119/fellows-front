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
      <div className="col-span-full px-4 lg:px-16 h-screen min-h-screen max-h-screen relative">
        <MainSection1 />
        <MeshGradientComponent colors={["rgb(207, 224, 255)", "rgb(66, 39, 188)", "rgb(184, 168, 255)", "rgb(108, 78, 243)"]} />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainSection2 />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-24" id="saas">
        <MainSection3 />
      </BlurFade>

      <div className="col-span-full relative">
        <BlurFade className="col-span-full py-10 pt-16 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
          <MainSection4 />
        </BlurFade>
        <MeshGradientComponent className="opacity-35" colors={["#bcffd6", "#caffe1", "#a8ffd6", "#e9fcee"]} />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainSection7 />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainCTASection />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainQnaSection />
      </BlurFade>
    </div>
  );
}
