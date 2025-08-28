import { Metadata } from "next";
import { auth } from "@/auth";

import { BlurFade } from "@/components/magicui/blur-fade";
import InViewBackground from "@/components/resource/inviewbackground";

import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainSection7 from "@/components/section/main/mainsection7";
import MainQnaSection from "@/components/section/main/mainqnasection";
import MobileCTASection from "@/components/section/main/mobilectasection";
import MainContactSection from "@/components/section/main/maincontactsection";
import MainInquerySection from "@/components/section/main/maininquerysection";

export const metadata: Metadata = {
  title: "Fellows | 펠로우즈",
  description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
  openGraph: {
    title: "Fellows | 펠로우즈",
    description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
    url: "https://www.fellows.my",
    siteName: "Fellows | 펠로우즈",
    images: [
      {
        url: "https://www.fellows.my/fellows/og.jpg",
        width: 1203,
        height: 630,
        alt: "Fellows: 글로벌 개발 파트너와 함께하는 협업 플랫폼",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fellows | 펠로우즈",
    description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
    images: {
      url: "https://www.fellows.my/fellows/og.jpg",
      alt: "글로벌 개발 파트너와 함께하는 협업 플랫폼",
    },
  },
};

export default async function Page() {
  const session = await auth();

  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <div className="col-span-full py-10 lg:py-24 px-4 lg:px-16 w-full relative">
        <MainSection1 />
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

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="qna">
        <MainQnaSection />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="contact">
        <MainContactSection />
      </BlurFade>

      <BlurFade className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="inquery">
        <MainInquerySection session={session} />
      </BlurFade>
    </div>
  );
}
