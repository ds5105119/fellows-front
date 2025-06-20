import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientLocaleInit from "@/lib/clientlocaleinit";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/lib/googleanalytics";
import FullHeader from "@/components/header/fullheader";
import Footer from "@/components/footer/footer";
import Toaster from "@/components/ui/toaster";
import "../globals.css";
import "lenis/dist/lenis.css";

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
  title: "블로그 - Fellows",
  description: "Fellow Blog에서 보도자료를 읽고, 업데이트를 받고, 영상을 보고, 이미지를 다운로드 받을 수 있습니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} ${satoshi.variable} h-screen overflow-y-auto`}>
        <ClientLocaleInit />
        <div className="relative overscroll-none">
          <FullHeader />
          <main className="scrollbar-hide break-keep">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
