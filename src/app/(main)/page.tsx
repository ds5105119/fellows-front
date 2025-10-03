import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { InView } from "@/components/ui/in-view";
import InViewBackground from "@/components/resource/inviewbackground";

import MainSection1 from "@/components/section/main/mainsection1";
import MainSection2 from "@/components/section/main/mainsection2";
import MainSection3 from "@/components/section/main/mainsection3";
import MainSection4 from "@/components/section/main/mainsection4";
import MainSection7 from "@/components/section/main/mainsection7";
import MainQnaSection from "@/components/section/main/mainqnasection";
import MainContactSection from "@/components/section/main/maincontactsection";
import MainInquerySection from "@/components/section/main/maininquerysection";
import MainSection5 from "@/components/section/main/mainsection5";

export const metadata: Metadata = {
  title: "Fellows | 펠로우즈",
  description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
  keywords: ["웹 제작", "앱 제작", "외주 개발", "shopify", "쇼피파이", "framer", "프레이머", "리액트", "아임웹", "개발 대행", "개발사"],
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
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 mb-4 md:mb-24">
      <SessionProvider>
        <div className="col-span-full py-10 lg:py-24 px-4 lg:px-16 w-full relative">
          <MainSection1 />
        </div>

        <div className="col-span-full py-10 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainSection2 />
          </InView>
        </div>

        <div className="col-span-full relative" id="price">
          <div className="col-span-full py-16 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto relative">
            <InView
              variants={{
                hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              viewOptions={{ margin: "0px 0px 100px 0px" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              once
            >
              <MainSection3 />
            </InView>
          </div>
          <InViewBackground className="bg-zinc-100" />
        </div>

        <div className="col-span-full py-10 lg:py-24 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="document">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainSection5 />
          </InView>
        </div>

        <div className="col-span-full py-10 lg:py-24" id="saas">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainSection4 />
          </InView>
        </div>

        <div className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="ai">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainSection7 />
          </InView>
        </div>

        <div className="col-span-full py-10 lg:py-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="qna">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainQnaSection />
          </InView>
        </div>

        <div className="col-span-full pt-10 lg:pt-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="contact">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainContactSection />
          </InView>
        </div>

        <div className="col-span-full pt-20 pb-10 lg:pt-26 lg:pb-16 px-4 lg:px-16 xl:px-36 w-full lg:mx-auto" id="inquery">
          <InView
            variants={{
              hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            viewOptions={{ margin: "0px 0px 100px 0px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            once
          >
            <MainInquerySection />
          </InView>
        </div>
      </SessionProvider>
    </div>
  );
}
