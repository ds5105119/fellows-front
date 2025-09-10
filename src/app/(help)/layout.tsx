import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientLocaleInit from "@/lib/clientlocaleinit";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/lib/googleanalytics";
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
  title: "도움말 - Fellows",
  description: "Fellow 도움말에서 Fellows와 외주 개발 시 필요한 도움말을 빠르게 확인할 수 있습니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko_KR">
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics />
      <ClientLocaleInit />

      <body className={`${pretendard.variable} ${satoshi.variable} h-screen overflow-y-auto`}>
        <main className="scrollbar-hide break-keep h-full">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
