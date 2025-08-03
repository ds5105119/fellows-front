import { auth } from "@/auth";
import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainSection7 from "@/components/section/main/mainsection7";
import MainCTASection from "@/components/section/main/mainctasection";
import MainQnaSection from "@/components/section/main/mainqnasection";
import { BlurFade } from "@/components/magicui/blur-fade";
import MobileCTASection from "@/components/section/main/mobilectasection";
import InViewBackground from "@/components/resource/inviewbackground";

export default async function Home() {
  const session = await auth();

  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <div className="col-span-full h-dvh min-h-dvh max-h-screen relative">
        <MainSection1 session={session} />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
        <MainSection2 />
      </BlurFade>

      <div className="col-span-full relative" id="primary">
        <BlurFade className="col-span-full py-0 pt-16 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
          <MainSection4 />
        </BlurFade>
        <InViewBackground className="bg-zinc-100" />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-24" id="secondary">
        <MainSection3 />
      </BlurFade>

      <div className="col-span-full">
        <MobileCTASection />
      </div>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="quaternary">
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
