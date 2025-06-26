import { BlurFade } from "@/components/magicui/blur-fade";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <BlurFade className="col-span-full pt-24 md:pt-38 pb-8 px-4 lg:px-16">
        <div>Fellows is a digital agency creating Brands, Websites and Apps</div>
      </BlurFade>
      <BlurFade className="col-span-full py-8 lg:py-16 px-4 lg:px-16 w-full max-w-[1400px] lg:mx-auto">
        <div></div>
      </BlurFade>
    </div>
  );
}
