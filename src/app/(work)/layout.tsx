import type { Metadata } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/lib/lenisprovider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import "lenis/dist/lenis.css";
import GoogleAnalytics from "@/lib/googleanalytics";
import Navbar from "@/components/design/navbar";

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
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} ${satoshi.variable} h-screen overflow-y-auto`}>
        <LenisProvider>
          <Navbar />
          <div className="relative overscroll-none">
            <main className="scrollbar-hide break-keep">{children}</main>
          </div>
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
