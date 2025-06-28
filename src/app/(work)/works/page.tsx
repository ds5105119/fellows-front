import { BlurFade } from "@/components/magicui/blur-fade";
import { TextReveal } from "@/components/design/text-reveal";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <BlurFade className="col-span-full pb-8 px-4">
        <div>
          <div className="text-8xl font-bold tracking-wide leading-16 hidden">
            Fellows는 브랜드,
            <br />웹 및 앱 사이트를 제작하는
            <br />
            디지털 에이전시입니다
          </div>
          <TextReveal className="text-8xl font-bold tracking-wide leading-16" />
        </div>
      </BlurFade>
      <BlurFade className="col-span-full py-8 lg:py-16 px-4 lg:px-16 w-full max-w-[1400px] lg:mx-auto">
        <div></div>
      </BlurFade>
    </div>
  );
}
