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
import FaultyTerminal from "@/components/resource/faultyterminal";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <div className="col-span-full h-svh min-h-svh max-h-svh relative">
        <MainSection1 />
        <div className="absolute inset-0 brightness-75 bg-foreground md:block hidden">
          {/* <Aurora colorStops={["#18ff6c", "#b19eef", "#5227ff"]} blend={0.5} amplitude={1.0} speed={0.5} /> */}
          <FaultyTerminal
            scale={2}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.04}
            tint="#A8EF9E"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={false}
            brightness={1}
          />
        </div>
        <div className="absolute inset-0 brightness-75 bg-foreground block md:hidden">
          <FaultyTerminal
            scale={2}
            gridMul={[1, 2]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.04}
            tint="#A8EF9E"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={false}
            brightness={1}
          />
        </div>
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
