import type { Metadata } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/lib/lenisprovider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MainHeader from "@/components/header/mainheader";
import Footer from "@/components/footer/footer";
import "../globals.css";
import "lenis/dist/lenis.css";
import GoogleAnalytics from "@/lib/googleanalytics";

const pretendard = localFont({
  src: "../../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const satoshi = localFont({
  src: "../../fonts/Satoshi-Variable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Fellows",
  description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
  openGraph: {
    title: "Fellows",
    description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
    url: "https://www.fellows.my",
    siteName: "Fellows",
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
    title: "Fellows",
    description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
    images: {
      url: "https://www.fellows.my/fellows/og.jpg",
      alt: "Fellows: 글로벌 개발 파트너와 함께하는 협업 플랫폼",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fellows",
    url: "https://www.fellows.my",
    logo: "https://www.fellows.my/fellows/og.jpg",
    sameAs: ["https://fellows.my"],
    description: "Fellows를 통해 저렴한 가격으로 웹과 앱을 제작하세요.",
  };

  return (
    <html lang="en" className="scroll-smooth">
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <body className={`${pretendard.className} ${satoshi.className} h-screen overflow-y-auto selection:bg-blue-400 selection:text-white`}>
        <LenisProvider>
          <div className="relative overscroll-none">
            <MainHeader />
            <main className="scrollbar-hide break-keep">{children}</main>
            <Footer />
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
